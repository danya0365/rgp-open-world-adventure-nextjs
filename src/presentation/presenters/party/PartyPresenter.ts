import { CHARACTERS_MASTER, getPlayableCharacters } from "@/src/data/master/characters.master";
import { Character } from "@/src/domain/types/character.types";

/**
 * Party View Model
 */
export interface PartyViewModel {
  availableCharacters: Character[]; // All characters from master data
  playableCharacters: Character[]; // Only playable characters (filtered by game state)
  totalCharacters: number;
  playableCount: number;
  recruitableCount: number;
  legendaryCount: number;
}

/**
 * Party Presenter
 * Handles business logic for party management
 * Separates master data from game state
 */
export class PartyPresenter {
  /**
   * Get view model for party page
   * @param selectedCharacterIds - Character IDs that user has selected (from game state)
   * @param recruitedCharacterIds - Character IDs that user has recruited (from game state)
   */
  async getViewModel(
    selectedCharacterIds: string[] = [],
    recruitedCharacterIds: string[] = []
  ): Promise<PartyViewModel> {
    try {
      // Get playable characters from master data
      const playableChars = getPlayableCharacters();
      
      // Filter by game state: only show characters that user has recruited
      // This ensures we don't show all 8 characters by default
      let availablePlayableChars: Character[];
      
      if (recruitedCharacterIds.length === 0) {
        // If no characters recruited yet, show none (user must go to /characters first)
        availablePlayableChars = [];
      } else {
        // Show only characters that user has recruited
        availablePlayableChars = playableChars.filter(
          (c) => recruitedCharacterIds.includes(c.id)
        );
      }
      
      const recruitableChars = CHARACTERS_MASTER.filter((c) => c.isRecruitable);
      const legendaryChars = CHARACTERS_MASTER.filter(
        (c) => c.rarity === "legendary" || c.rarity === "mythic"
      );

      return {
        availableCharacters: CHARACTERS_MASTER, // Master data (for reference)
        playableCharacters: availablePlayableChars, // Filtered by game state
        totalCharacters: CHARACTERS_MASTER.length,
        playableCount: availablePlayableChars.length,
        recruitableCount: recruitableChars.length,
        legendaryCount: legendaryChars.length,
      };
    } catch (error) {
      console.error("Error getting party view model:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for party page
   */
  async generateMetadata() {
    return {
      title: "จัดการทีม | RPG Open World Adventure",
      description: "เลือกตัวละครสูงสุด 4 ตัวเข้าทีม พร้อมระบบ Team Synergy",
      keywords: "party, team, characters, rpg, synergy",
    };
  }

  /**
   * Get playable characters
   */
  async getPlayableCharacters(): Promise<Character[]> {
    try {
      return getPlayableCharacters();
    } catch (error) {
      console.error("Error getting playable characters:", error);
      throw error;
    }
  }

  /**
   * Get character by ID
   */
  async getCharacterById(id: string): Promise<Character | undefined> {
    try {
      return CHARACTERS_MASTER.find((c) => c.id === id);
    } catch (error) {
      console.error("Error getting character by ID:", error);
      throw error;
    }
  }
}

/**
 * Factory for creating PartyPresenter instances
 */
export class PartyPresenterFactory {
  /**
   * Create presenter for server-side rendering
   */
  static async createServer(): Promise<PartyPresenter> {
    return new PartyPresenter();
  }

  /**
   * Create presenter for client-side
   */
  static async createClient(): Promise<PartyPresenter> {
    return new PartyPresenter();
  }
}
