import { mockCharacters } from "@/src/data/mock";
import { Character } from "@/src/domain/types/character.types";

/**
 * Characters View Model
 */
export interface CharactersViewModel {
  characters: Character[];
  totalCharacters: number;
  playableCount: number;
  recruitableCount: number;
  legendaryCount: number;
  classes: string[];
}

/**
 * Characters Presenter
 * Handles business logic for characters management using mock data
 */
export class CharactersPresenter {
  /**
   * Get view model for characters page
   */
  async getViewModel(): Promise<CharactersViewModel> {
    try {
      const playableChars = mockCharacters.filter((c) => c.isPlayable);
      const recruitableChars = mockCharacters.filter((c) => c.isRecruitable);
      const legendaryChars = mockCharacters.filter(
        (c) => c.rarity === "legendary" || c.rarity === "mythic"
      );
      const classes = Array.from(new Set(mockCharacters.map((c) => c.class)));

      return {
        characters: mockCharacters,
        totalCharacters: mockCharacters.length,
        playableCount: playableChars.length,
        recruitableCount: recruitableChars.length,
        legendaryCount: legendaryChars.length,
        classes,
      };
    } catch (error) {
      console.error("Error getting characters view model:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for characters page
   */
  async generateMetadata() {
    return {
      title: "ตัวละคร | RPG Open World Adventure",
      description: "เลือกและจัดการทีมนักผจญภัยของคุณ พร้อมระบบกรองและค้นหา",
      keywords: "characters, rpg, heroes, classes, team",
    };
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

  /**
   * Filter characters by class
   */
  async filterByClass(className: string): Promise<Character[]> {
    try {
      if (className === "all") {
        return mockCharacters;
      }
      return mockCharacters.filter((c) => c.class === className);
    } catch (error) {
      console.error("Error filtering characters by class:", error);
      throw error;
    }
  }

  /**
   * Get playable characters only
   */
  async getPlayableCharacters(): Promise<Character[]> {
    try {
      return mockCharacters.filter((c) => c.isPlayable);
    } catch (error) {
      console.error("Error getting playable characters:", error);
      throw error;
    }
  }
}

/**
 * Factory for creating CharactersPresenter instances
 */
export class CharactersPresenterFactory {
  /**
   * Create presenter for server-side rendering
   */
  static async createServer(): Promise<CharactersPresenter> {
    return new CharactersPresenter();
  }

  /**
   * Create presenter for client-side
   */
  static async createClient(): Promise<CharactersPresenter> {
    return new CharactersPresenter();
  }
}
