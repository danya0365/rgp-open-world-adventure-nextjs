import { mockLocations } from "@/src/data/mock/locations.mock";
import { mockCharacters } from "@/src/data/mock/characters.mock";
import { mockQuests } from "@/src/data/mock/quests.mock";
import { mockBattleMaps } from "@/src/data/mock/battleMaps.mock";
import { Location } from "@/src/domain/types/location.types";
import { Character } from "@/src/domain/types/character.types";
import { Quest } from "@/src/domain/types/quest.types";
import { BattleMapConfig } from "@/src/domain/types/battle.types";

/**
 * Location Detail View Model
 * Represents the data structure for Location Detail UI
 */
export interface LocationDetailViewModel {
  location: Location | null;
  npcs: Character[]; // NPCs in this location
  availableQuests: Quest[]; // Quests available in this location
  enemies: Character[]; // Enemies that can be encountered
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

    // Get NPCs in this location (mock: filter by location metadata)
    const npcs = this.characters.filter(
      (char) => !char.isPlayable && char.class === "priest" // Mock filter for NPCs
    );

    // Get available quests for this location
    const availableQuests = this.quests.filter(
      (quest) => quest.status === "available" || quest.status === "active"
    );

    // Get enemies for this location
    const enemies = this.characters.filter(
      (char) => !char.isPlayable && char.class !== "priest" // Mock filter for enemies
    );

    // Get battle maps for this location (mock: use size based on level)
    const battleMaps = this.battleMaps.filter(
      (map) => {
        const level = location.requiredLevel || 1;
        if (level <= 5) return map.size === "small";
        if (level <= 15) return map.size === "medium";
        if (level <= 30) return map.size === "large";
        return map.size === "boss";
      }
    );

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
   * Create presenter for client-side (uses mock data)
   */
  static async createClient(): Promise<LocationDetailPresenter> {
    return new LocationDetailPresenter(
      mockLocations,
      mockCharacters,
      mockQuests,
      mockBattleMaps
    );
  }

  /**
   * Create presenter for server-side (uses mock data for now)
   */
  static async createServer(): Promise<LocationDetailPresenter> {
    return new LocationDetailPresenter(
      mockLocations,
      mockCharacters,
      mockQuests,
      mockBattleMaps
    );
  }
}
