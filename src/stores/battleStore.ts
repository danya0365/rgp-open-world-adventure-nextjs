import { create } from "zustand";
import { BattleUnit } from "@/src/presentation/presenters/battle/BattlePresenter";

/**
 * Battle Phase
 */
export type BattlePhase = "placement" | "battle" | "victory" | "defeat";

/**
 * Battle Action Type
 */
export type BattleActionType = "move" | "attack" | "skill" | "wait" | null;

/**
 * Battle State
 */
interface BattleState {
  // Battle Info
  battleId: string | null;
  mapId: string | null;
  
  // Units
  allyUnits: BattleUnit[];
  enemyUnits: BattleUnit[];
  
  // Turn Management
  turn: number;
  phase: BattlePhase;
  currentUnitId: string | null;
  turnOrder: BattleUnit[];
  
  // Action State
  selectedAction: BattleActionType;
  selectedUnitId: string | null;
  selectedSkillId: string | null;
  
  // Battle Results
  rewards: {
    exp: number;
    gold: number;
    items: { itemId: string; quantity: number }[];
  } | null;
}

/**
 * Battle Actions
 */
interface BattleActions {
  // Initialize Battle
  initBattle: (
    mapId: string,
    allyUnits: BattleUnit[],
    enemyUnits: BattleUnit[]
  ) => void;
  
  // Unit Actions
  moveUnit: (unitId: string, x: number, y: number) => void;
  attackUnit: (attackerId: string, targetId: string, damage: number) => void;
  useSkill: (casterId: string, targetId: string, skillId: string) => void;
  
  // Turn Management
  endTurn: () => void;
  nextUnit: () => void;
  
  // Selection
  selectUnit: (unitId: string | null) => void;
  selectAction: (action: BattleActionType) => void;
  selectSkill: (skillId: string | null) => void;
  
  // Battle Flow
  checkVictory: () => boolean;
  checkDefeat: () => boolean;
  endBattle: (victory: boolean, rewards?: BattleState["rewards"]) => void;
  
  // Reset
  resetBattle: () => void;
}

/**
 * Battle Store
 */
type BattleStore = BattleState & BattleActions;

const initialState: BattleState = {
  battleId: null,
  mapId: null,
  allyUnits: [],
  enemyUnits: [],
  turn: 1,
  phase: "battle",
  currentUnitId: null,
  turnOrder: [],
  selectedAction: null,
  selectedUnitId: null,
  selectedSkillId: null,
  rewards: null,
};

export const useBattleStore = create<BattleStore>((set, get) => ({
  ...initialState,

  /**
   * Initialize Battle
   */
  initBattle: (mapId, allyUnits, enemyUnits) => {
    // Calculate turn order (based on AGI)
    const allUnits = [...allyUnits, ...enemyUnits];
    const turnOrder = allUnits.sort((a, b) => b.character.stats.agi - a.character.stats.agi);

    set({
      battleId: `battle-${Date.now()}`,
      mapId,
      allyUnits,
      enemyUnits,
      turn: 1,
      phase: "battle",
      currentUnitId: turnOrder[0]?.id || null,
      turnOrder,
      selectedAction: null,
      selectedUnitId: null,
      selectedSkillId: null,
      rewards: null,
    });
  },

  /**
   * Move Unit
   */
  moveUnit: (unitId, x, y) => {
    set((state) => {
      const newAllyUnits = state.allyUnits.map((unit) =>
        unit.id === unitId ? { ...unit, position: { x, y }, hasActed: true } : unit
      );
      const newEnemyUnits = state.enemyUnits.map((unit) =>
        unit.id === unitId ? { ...unit, position: { x, y }, hasActed: true } : unit
      );

      return {
        allyUnits: newAllyUnits,
        enemyUnits: newEnemyUnits,
        selectedAction: null,
        selectedUnitId: null,
      };
    });
  },

  /**
   * Attack Unit
   */
  attackUnit: (attackerId, targetId, damage) => {
    set((state) => {
      const newAllyUnits = state.allyUnits.map((unit) => {
        if (unit.id === targetId) {
          return { ...unit, currentHp: Math.max(0, unit.currentHp - damage) };
        }
        if (unit.id === attackerId) {
          return { ...unit, hasActed: true };
        }
        return unit;
      });

      const newEnemyUnits = state.enemyUnits.map((unit) => {
        if (unit.id === targetId) {
          return { ...unit, currentHp: Math.max(0, unit.currentHp - damage) };
        }
        if (unit.id === attackerId) {
          return { ...unit, hasActed: true };
        }
        return unit;
      });

      // Remove dead units
      const filteredAllyUnits = newAllyUnits.filter((unit) => unit.currentHp > 0);
      const filteredEnemyUnits = newEnemyUnits.filter((unit) => unit.currentHp > 0);

      return {
        allyUnits: filteredAllyUnits,
        enemyUnits: filteredEnemyUnits,
        selectedAction: null,
        selectedUnitId: null,
      };
    });

    // Check victory/defeat after attack
    setTimeout(() => {
      const { checkVictory, checkDefeat } = get();
      if (checkVictory()) {
        get().endBattle(true, {
          exp: 100,
          gold: 50,
          items: [],
        });
      } else if (checkDefeat()) {
        get().endBattle(false);
      }
    }, 500);
  },

  /**
   * Use Skill
   */
  useSkill: (casterId, targetId, skillId) => {
    // TODO: Implement skill effects
    set((state) => ({
      allyUnits: state.allyUnits.map((unit) =>
        unit.id === casterId ? { ...unit, hasActed: true } : unit
      ),
      enemyUnits: state.enemyUnits.map((unit) =>
        unit.id === casterId ? { ...unit, hasActed: true } : unit
      ),
      selectedAction: null,
      selectedUnitId: null,
      selectedSkillId: null,
    }));
  },

  /**
   * End Turn
   */
  endTurn: () => {
    set((state) => {
      // Reset hasActed for all units
      const newAllyUnits = state.allyUnits.map((unit) => ({ ...unit, hasActed: false }));
      const newEnemyUnits = state.enemyUnits.map((unit) => ({ ...unit, hasActed: false }));

      // Get next unit in turn order
      const currentIndex = state.turnOrder.findIndex((u) => u.id === state.currentUnitId);
      const nextIndex = (currentIndex + 1) % state.turnOrder.length;
      const nextUnit = state.turnOrder[nextIndex];

      return {
        allyUnits: newAllyUnits,
        enemyUnits: newEnemyUnits,
        turn: nextIndex === 0 ? state.turn + 1 : state.turn,
        currentUnitId: nextUnit?.id || null,
        selectedAction: null,
        selectedUnitId: null,
      };
    });
  },

  /**
   * Next Unit
   */
  nextUnit: () => {
    get().endTurn();
  },

  /**
   * Select Unit
   */
  selectUnit: (unitId) => {
    set({ selectedUnitId: unitId });
  },

  /**
   * Select Action
   */
  selectAction: (action) => {
    set({ selectedAction: action });
  },

  /**
   * Select Skill
   */
  selectSkill: (skillId) => {
    set({ selectedSkillId: skillId });
  },

  /**
   * Check Victory
   */
  checkVictory: () => {
    const { enemyUnits } = get();
    return enemyUnits.length === 0 || enemyUnits.every((unit) => unit.currentHp <= 0);
  },

  /**
   * Check Defeat
   */
  checkDefeat: () => {
    const { allyUnits } = get();
    return allyUnits.length === 0 || allyUnits.every((unit) => unit.currentHp <= 0);
  },

  /**
   * End Battle
   */
  endBattle: (victory, rewards) => {
    set({
      phase: victory ? "victory" : "defeat",
      rewards: rewards || null,
    });
  },

  /**
   * Reset Battle
   */
  resetBattle: () => {
    set(initialState);
  },
}));
