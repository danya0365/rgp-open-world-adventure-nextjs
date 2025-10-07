import { mockBattleMaps } from "@/src/data/mock/battleMaps.mock";
import { mockCharacters } from "@/src/data/mock/characters.mock";
import { BattleMapConfig } from "@/src/domain/types/battle.types";
import { Character } from "@/src/domain/types/character.types";

/**
 * Battle Unit - Character with position on grid
 */
export interface BattleUnit {
  id: string;
  character: Character;
  position: { x: number; y: number };
  currentHp: number;
  currentMp: number;
  isAlly: boolean;
  hasActed: boolean;
}

/**
 * Battle State
 */
export interface BattleState {
  turn: number;
  phase: "placement" | "battle" | "victory" | "defeat";
  currentUnitId: string | null;
  selectedAction: "move" | "attack" | "skill" | null;
}

/**
 * Battle View Model
 */
export interface BattleViewModel {
  battleMap: BattleMapConfig;
  allyUnits: BattleUnit[];
  enemyUnits: BattleUnit[];
  state: BattleState;
  turnOrder: BattleUnit[];
}

/**
 * Battle Presenter
 * Handles business logic for battle system
 */
export class BattlePresenter {
  /**
   * Get view model for battle page
   */
  async getViewModel(mapId: string): Promise<BattleViewModel> {
    try {
      // Get battle map
      const battleMap = mockBattleMaps.find((map) => map.id === mapId);
      if (!battleMap) {
        throw new Error(`Battle map not found: ${mapId}`);
      }

      // Get ally units (from active party - mock for now)
      const allyCharacters = mockCharacters.filter((c) => c.isPlayable).slice(0, 4);
      const allyUnits: BattleUnit[] = battleMap.startPositions.ally.map((pos, index) => {
        const character = allyCharacters[index];
        if (!character) return null;
        
        return {
          id: `ally-${character.id}`,
          character,
          position: pos,
          currentHp: character.stats.maxHp,
          currentMp: character.stats.maxMp,
          isAlly: true,
          hasActed: false,
        };
      }).filter(Boolean) as BattleUnit[];

      // Get enemy units (mock)
      const enemyCharacters = mockCharacters.filter((c) => !c.isPlayable).slice(0, 4);
      const enemyUnits: BattleUnit[] = battleMap.startPositions.enemy.map((pos, index) => {
        const character = enemyCharacters[index];
        if (!character) return null;
        
        return {
          id: `enemy-${character.id}`,
          character,
          position: pos,
          currentHp: character.stats.maxHp,
          currentMp: character.stats.maxMp,
          isAlly: false,
          hasActed: false,
        };
      }).filter(Boolean) as BattleUnit[];

      // Calculate turn order (based on agility - Dragon Quest Tact style)
      const allUnits = [...allyUnits, ...enemyUnits];
      const turnOrder = allUnits.sort((a, b) => b.character.stats.agi - a.character.stats.agi);

      // Initial battle state
      const state: BattleState = {
        turn: 1,
        phase: "battle",
        currentUnitId: turnOrder[0]?.id || null,
        selectedAction: null,
      };

      return {
        battleMap,
        allyUnits,
        enemyUnits,
        state,
        turnOrder,
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
      const battleMap = mockBattleMaps.find((map) => map.id === mapId);
      
      return {
        title: battleMap 
          ? `${battleMap.name} - Battle | RPG Open World Adventure`
          : "Battle | RPG Open World Adventure",
        description: battleMap?.description || "Tactical grid-based battle system",
      };
    } catch (error) {
      console.error("Error generating metadata:", error);
      throw error;
    }
  }

  /**
   * Calculate movement range for a unit (Dragon Quest Tact style)
   * Uses Manhattan distance (grid-based movement)
   */
  calculateMovementRange(unit: BattleUnit, gridWidth: number, gridHeight: number): { x: number; y: number }[] {
    const range = unit.character.stats.mov; // Movement range from unit stats (typically 2-4)
    const positions: { x: number; y: number }[] = [];
    
    for (let x = 0; x < gridWidth; x++) {
      for (let y = 0; y < gridHeight; y++) {
        const distance = Math.abs(x - unit.position.x) + Math.abs(y - unit.position.y);
        if (distance <= range && distance > 0) {
          positions.push({ x, y });
        }
      }
    }
    
    return positions;
  }

  /**
   * Calculate attack range for a unit
   */
  calculateAttackRange(unit: BattleUnit, gridWidth: number, gridHeight: number): { x: number; y: number }[] {
    const range = 2; // Attack range (can be based on weapon/skill)
    const positions: { x: number; y: number }[] = [];
    
    for (let x = 0; x < gridWidth; x++) {
      for (let y = 0; y < gridHeight; y++) {
        const distance = Math.abs(x - unit.position.x) + Math.abs(y - unit.position.y);
        if (distance <= range && distance > 0) {
          positions.push({ x, y });
        }
      }
    }
    
    return positions;
  }

  /**
   * Calculate damage
   */
  calculateDamage(attacker: BattleUnit, defender: BattleUnit): number {
    const baseDamage = attacker.character.stats.atk - defender.character.stats.def;
    const damage = Math.max(1, baseDamage); // Minimum 1 damage
    return damage;
  }
}

/**
 * Battle Presenter Factory
 */
export class BattlePresenterFactory {
  static async createServer(): Promise<BattlePresenter> {
    return new BattlePresenter();
  }

  static async createClient(): Promise<BattlePresenter> {
    return new BattlePresenter();
  }
}
