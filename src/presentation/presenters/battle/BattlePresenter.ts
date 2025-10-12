import { BATTLE_MAPS_MASTER } from "@/src/data/master/battleMaps.master";
import { CHARACTERS_MASTER } from "@/src/data/master/characters.master";
import { ENEMIES_MASTER } from "@/src/data/master/enemies.master";
import { BattleMapConfig } from "@/src/domain/types/battle.types";
import { Character, Enemy } from "@/src/domain/types/character.types";

/**
 * Battle View Model
 */
export interface BattleViewModel {
  battleMap: BattleMapConfig;
  characters: Character[];
  enemies: Enemy[];
}

/**
 * Battle Presenter
 * Handles business logic for battle system
 */
export class BattlePresenter {
  /**
   * Get view model for battle page
   * @param mapId - Battle map ID
   */
  async getViewModel(mapId: string): Promise<BattleViewModel> {
    try {
      // Get battle map
      const battleMap = BATTLE_MAPS_MASTER.find((map) => map.id === mapId);
      if (!battleMap) {
        throw new Error(`Battle map not found: ${mapId}`);
      }

      return {
        battleMap,
        characters: CHARACTERS_MASTER,
        enemies: ENEMIES_MASTER,
      };
    } catch (error) {
      console.error("Error getting battle view model:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for battle page
   */
  async generateMetadata(mapId: string) {
    try {
      const battleMap = BATTLE_MAPS_MASTER.find((map) => map.id === mapId);

      return {
        title: battleMap
          ? `${battleMap.name} - Battle | RPG Open World Adventure`
          : "Battle | RPG Open World Adventure",
        description:
          battleMap?.description || "Tactical grid-based battle system",
      };
    } catch (error) {
      console.error("Error generating metadata:", error);
      throw error;
    }
  }
}

/**
 * Battle Presenter Factory
 */
export class BattlePresenterFactory {
  static async createServer(): Promise<BattlePresenter> {
    return new BattlePresenter();
  }

  static createClient(): BattlePresenter {
    return new BattlePresenter();
  }
}
