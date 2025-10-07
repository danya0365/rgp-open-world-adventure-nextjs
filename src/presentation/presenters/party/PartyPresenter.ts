import { mockCharacters, getPlayableCharacters } from "@/src/data/mock";
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
 * Separates master data (mock) from game state
 */
export class PartyPresenter {
  /**
   * Get view model for party page
   * @param selectedCharacterIds - Character IDs that user has selected (from game state)
   * @param unlockedCharacterIds - Character IDs that user has unlocked (from game state)
   */
  async getViewModel(
    selectedCharacterIds: string[] = [],
    unlockedCharacterIds: string[] = []
  ): Promise<PartyViewModel> {
    try {
      // Get playable characters from master data
      const playableChars = getPlayableCharacters();
      
      // Filter by game state: only show characters that user has selected
      // This ensures we don't show all 8 characters by default
      let availablePlayableChars: Character[];
      
      if (selectedCharacterIds.length === 0) {
        // If no characters selected yet, show none (user must go to /characters first)
        availablePlayableChars = [];
      } else {
        // Show only characters that user has selected or unlocked
        availablePlayableChars = playableChars.filter(
          (c) => selectedCharacterIds.includes(c.id) || unlockedCharacterIds.includes(c.id)
        );
      }
      
      const recruitableChars = mockCharacters.filter((c) => c.isRecruitable);
      const legendaryChars = mockCharacters.filter(
        (c) => c.rarity === "legendary" || c.rarity === "mythic"
      );

      return {
        availableCharacters: mockCharacters, // Master data (for reference)
        playableCharacters: availablePlayableChars, // Filtered by game state
        totalCharacters: mockCharacters.length,
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
