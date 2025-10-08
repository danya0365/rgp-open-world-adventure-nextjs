import { BATTLE_MAPS_MASTER } from "@/src/data/master/battleMaps.master";
import { CHARACTERS_MASTER } from "@/src/data/master/characters.master";
import { ENEMIES_MASTER } from "@/src/data/master/enemies.master";
import { LOCATIONS_MASTER } from "@/src/data/master/locations.master";
import { QUESTS_MASTER } from "@/src/data/master/quests.master";
import { BattleMapConfig } from "@/src/domain/types/battle.types";
import { Character, Enemy } from "@/src/domain/types/character.types";
import { Location } from "@/src/domain/types/location.types";
import { Quest } from "@/src/domain/types/quest.types";

/**
 * Location Detail View Model
 * Represents the data structure for Location Detail UI
 */
export interface LocationDetailViewModel {
  location: Location | null;
  npcs: Character[]; // NPCs in this location
  availableQuests: Quest[]; // Quests available in this location
  enemies: Enemy[]; // Enemies that can be encountered
  battleMaps: BattleMapConfig[]; // Battle maps for this location
  services: {
    hasShop: boolean;
    hasInn: boolean;
    hasGuild: boolean;
    hasBlacksmith: boolean;
  };
  stats: {
    dangerLevel: number; // 1-5
    recommendedLevel: number;
    enemyCount: number;
    questCount: number;
  };
}

/**
 * Location Detail Presenter
 * Handles business logic for Location Detail page
 */
export class LocationDetailPresenter {
  private locations: Location[];
  private characters: Character[];
  private quests: Quest[];
  private battleMaps: BattleMapConfig[];

  constructor(
    locations: Location[],
    characters: Character[],
    quests: Quest[],
    battleMaps: BattleMapConfig[]
  ) {
    this.locations = locations;
    this.characters = characters;
    this.quests = quests;
    this.battleMaps = battleMaps;
  }

  /**
   * Get view model for Location Detail UI
   */
  async getViewModel(locationId: string): Promise<LocationDetailViewModel> {
    const location = this.locations.find((loc) => loc.id === locationId);

    if (!location) {
      return {
        location: null,
        npcs: [],
        availableQuests: [],
        enemies: [],
        battleMaps: [],
        services: {
          hasShop: false,
          hasInn: false,
          hasGuild: false,
          hasBlacksmith: false,
        },
        stats: {
          dangerLevel: 0,
          recommendedLevel: 0,
          enemyCount: 0,
          questCount: 0,
        },
      };
    }

    // Get NPCs from location metadata
    const npcIds = location.metadata?.npcs || [];
    const npcs = this.characters.filter((char) => npcIds.includes(char.id));

    // Get available quests for this location
    const availableQuests = this.quests.filter(
      (quest) => quest.status === "available" || quest.status === "active"
    );

    // Get battle maps from location metadata (Master Data)
    const battleMapIds = location.metadata?.battleMaps || [];
    const battleMaps = this.battleMaps.filter((map) =>
      battleMapIds.includes(map.id)
    );

    // Get enemies from battle maps (each map has its own enemies)
    const enemyIds = new Set<string>();
    battleMaps.forEach((map) => {
      map.enemies.forEach((enemyId) => enemyIds.add(enemyId));
    });
    const enemies = ENEMIES_MASTER.filter((enemy) => enemyIds.has(enemy.id));

    // Determine services (mock: based on location type)
    const services = {
      hasShop: location.type === "city" || location.type === "area",
      hasInn: location.type === "city",
      hasGuild: location.type === "city",
      hasBlacksmith: location.type === "city" || location.type === "area",
    };

    // Calculate stats
    const stats = {
      dangerLevel: this.calculateDangerLevel(location),
      recommendedLevel: location.requiredLevel || 1,
      enemyCount: enemies.length,
      questCount: availableQuests.length,
    };

    return {
      location,
      npcs: npcs.slice(0, 5), // Limit to 5 NPCs
      availableQuests: availableQuests.slice(0, 3), // Limit to 3 quests
      enemies: enemies.slice(0, 6), // Limit to 6 enemies
      battleMaps: battleMaps.slice(0, 3), // Limit to 3 battle maps
      services,
      stats,
    };
  }

  /**
   * Calculate danger level based on location
   */
  private calculateDangerLevel(location: Location): number {
    const level = location.requiredLevel || 1;

    if (level <= 5) return 1; // Low
    if (level <= 15) return 2; // Medium
    if (level <= 30) return 3; // High
    if (level <= 50) return 4; // Very High
    return 5; // Extreme
  }

  /**
   * Get location by ID
   */
  getLocationById(locationId: string): Location | undefined {
    return this.locations.find((loc) => loc.id === locationId);
  }

  /**
   * Get battle map for location
   */
  getBattleMapForLocation(locationId: string): BattleMapConfig | undefined {
    const location = this.getLocationById(locationId);
    if (!location) return undefined;

    // Get appropriate battle map based on location level
    const level = location.requiredLevel || 1;
    return this.battleMaps.find((map) => {
      if (level <= 5) return map.size === "small";
      if (level <= 15) return map.size === "medium";
      if (level <= 30) return map.size === "large";
      return map.size === "boss";
    });
  }
}

/**
 * Location Detail Presenter Factory
 * Creates presenter instances for different environments
 */
export class LocationDetailPresenterFactory {
  /**
   * Create presenter for client-side (uses master data)
   */
  static async createClient(): Promise<LocationDetailPresenter> {
    return new LocationDetailPresenter(
      LOCATIONS_MASTER,
      CHARACTERS_MASTER,
      QUESTS_MASTER,
      BATTLE_MAPS_MASTER
    );
  }

  /**
   * Create presenter for server-side (uses master data)
   */
  static async createServer(): Promise<LocationDetailPresenter> {
    return new LocationDetailPresenter(
      LOCATIONS_MASTER,
      CHARACTERS_MASTER,
      QUESTS_MASTER,
      BATTLE_MAPS_MASTER
    );
  }
}
