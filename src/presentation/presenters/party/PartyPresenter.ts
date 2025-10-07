import { mockCharacters, getPlayableCharacters } from "@/src/data/mock";
import { Character } from "@/src/domain/types/character.types";

/**
 * Party View Model
 */
export interface PartyViewModel {
  availableCharacters: Character[];
  playableCharacters: Character[];
  totalCharacters: number;
  playableCount: number;
  recruitableCount: number;
  legendaryCount: number;
}

/**
 * Party Presenter
 * Handles business logic for party management using mock data
 */
export class PartyPresenter {
  /**
   * Get view model for party page
   */
  async getViewModel(): Promise<PartyViewModel> {
    try {
      const playableChars = getPlayableCharacters();
      const recruitableChars = mockCharacters.filter((c) => c.isRecruitable);
      const legendaryChars = mockCharacters.filter(
        (c) => c.rarity === "legendary" || c.rarity === "mythic"
      );

      return {
        availableCharacters: mockCharacters,
        playableCharacters: playableChars,
        totalCharacters: mockCharacters.length,
        playableCount: playableChars.length,
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
      return mockCharacters.find((c) => c.id === id);
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
