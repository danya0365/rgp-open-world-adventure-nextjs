import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BattleMapConfig, GridPosition } from "../domain/types/battle.types";
import { Character, Enemy } from "../domain/types/character.types";
import { PartyMemberV2 } from "./gameStore";

// Custom storage for browser-only (client-side)
// Using localStorage for better Next.js SSR compatibility
// Storage limit: ~5-10 MB
const createBrowserStorage = () => {
  // Check if we're in browser environment
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }

  return {
    getItem: (name: string) => {
      const str = localStorage.getItem(name);
      if (!str) return null;
      try {
        return JSON.parse(str);
      } catch {
        return null;
      }
    },
    setItem: (name: string, value: unknown) => {
      try {
        localStorage.setItem(name, JSON.stringify(value));
      } catch (error) {
        console.warn("localStorage quota exceeded, clearing cache", error);
        localStorage.removeItem(name);
      }
    },
    removeItem: (name: string) => {
      localStorage.removeItem(name);
    },
  };
};

/**
 * Battle Log Entry
 */
export interface BattleLogEntry {
  id: string;
  timestamp: number;
  turn: number;
  type: "init" | "move" | "attack" | "skill" | "damage" | "heal" | "buff" | "debuff" | "death" | "turn_start" | "turn_end" | "victory" | "defeat" | "info";
  message: string;
  unitId?: string;
  unitName?: string;
  targetId?: string;
  targetName?: string;
  value?: number;
  isAlly?: boolean;
}

/**
 * Status Effect
 */
export interface StatusEffect {
  id: string;
  name: string;
  type: "buff" | "debuff";
  duration: number;
  value: number;
}

/**
 * Battle Phase
 */
export type BattlePhase = "placement" | "battle" | "victory" | "defeat";

/**
 * Battle Action Type
 */
export type BattleActionType =
  | "move"
  | "attack"
  | "skill"
  | "item"
  | "defend"
  | "wait";

/**
 * Battle Action
 */
export interface BattleAction {
  unitId: string;
  actionType: BattleActionType;
  targetPosition?: GridPosition;
  targetUnitId?: string;
  skillId?: string;
  itemId?: string;
}

/**
 * Battle Unit - Character with position on grid
 */
export interface BattleUnitState {
  id: string;
  character: Character | Enemy;
  position: GridPosition;
  currentHp: number;
  maxHp: number;
  currentMp: number;
  maxMp: number;
  isAlly: boolean;
  hasActed: boolean;
  buffs: StatusEffect[];
  debuffs: StatusEffect[];
}

/**
 * Battle State
 */
interface BattleState {
  battleStateId: string;
  // Battle Info
  battleMap: BattleMapConfig | null;

  // Characters
  characters: Character[];
  enemies: Enemy[];

  // Units
  allyUnits: BattleUnitState[];
  enemyUnits: BattleUnitState[];

  // Turn Management
  turn: number;
  phase: BattlePhase;
  currentUnitId: string | null;
  turnOrder: BattleUnitState[];

  // Action State
  selectedAction: BattleAction | null;
  selectedUnitId: string | null;
  selectedSkillId: string | null;

  // Range State (calculated by presenter, stored here)
  movementRange: { x: number; y: number }[];
  attackRange: { x: number; y: number }[];
  originalPosition: { x: number; y: number } | null;

  // Battle Results
  rewards: {
    exp: number;
    gold: number;
    items: { itemId: string; quantity: number }[];
  } | null;

  // Battle Logs
  battleLogs: BattleLogEntry[];
  maxLogs: number;
}

/**
 * Battle Actions
 */
interface BattleActions {
  // Initialize Battle
  initBattle: (
    battleMap: BattleMapConfig,
    characters: Character[],
    enemies: Enemy[],
    activePartyMembers: PartyMemberV2[]
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
  selectAction: (action: BattleAction) => void;
  selectSkill: (skillId: string | null) => void;

  // Range Management
  setMovementRange: (range: { x: number; y: number }[]) => void;
  setAttackRange: (range: { x: number; y: number }[]) => void;
  setOriginalPosition: (position: { x: number; y: number } | null) => void;

  // Computed Getters (Pure functions - no side effects)
  getCurrentUnit: () => BattleUnitState | null;
  getAliveTurnOrder: () => BattleUnitState[];
  getUnitAtPosition: (x: number, y: number) => BattleUnitState | undefined;
  isTileInMovementRange: (x: number, y: number) => boolean;
  isTileInAttackRange: (x: number, y: number) => boolean;

  // Game Actions
  handleTileClick: (x: number, y: number) => void;

  // Battle Flow
  checkVictory: () => boolean;
  checkDefeat: () => boolean;
  endBattle: (victory: boolean, rewards?: BattleState["rewards"]) => void;
  // Reset
  resetBattle: () => void;
  playEnemyTurn: () => Promise<void>;

  // Battle Logs
  addBattleLog: (log: Omit<BattleLogEntry, "id" | "timestamp" | "turn">) => void;
  clearBattleLogs: () => void;
}

/**
 * Battle Store
 */
type BattleStore = BattleState & BattleActions;

const initialState: BattleState = {
  battleStateId: "",
  battleMap: null,
  characters: [],
  enemies: [],
  allyUnits: [],
  enemyUnits: [],
  turn: 1,
  phase: "battle",
  currentUnitId: null,
  turnOrder: [],
  selectedAction: null,
  selectedUnitId: null,
  selectedSkillId: null,
  movementRange: [],
  attackRange: [],
  originalPosition: null,
  rewards: null,
  battleLogs: [],
  maxLogs: 100,
};

export const useBattleStore = create<BattleStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * Add Battle Log
       */
      addBattleLog: (log) => {
        set((state) => {
          const newLog: BattleLogEntry = {
            ...log,
            id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            turn: state.turn,
          };

          const newLogs = [...state.battleLogs, newLog];
          
          // Keep only the last maxLogs entries
          if (newLogs.length > state.maxLogs) {
            newLogs.splice(0, newLogs.length - state.maxLogs);
          }

          return { battleLogs: newLogs };
        });
      },

      /**
       * Clear Battle Logs
       */
      clearBattleLogs: () => {
        set({ battleLogs: [] });
      },

      /**
       * Initialize Battle
       */
      initBattle: (battleMap, characters, enemies, activePartyMembers) => {
        const allyUnits: BattleUnitState[] = battleMap.startPositions.ally
          .map((pos, index) => {
            const character = characters.find(
              (c) => c.id === activePartyMembers[index]?.characterId
            );
            if (!character) return null;

            return {
              id: `ally-${character.id}`,
              character,
              position: pos,
              currentHp: character.stats.maxHp,
              maxHp: character.stats.maxHp,
              currentMp: character.stats.maxMp,
              maxMp: character.stats.maxMp,
              isAlly: true,
              hasActed: false,
              buffs: [],
              debuffs: [],
            };
          })
          .filter(Boolean) as BattleUnitState[];

        const enemyUnits: BattleUnitState[] = battleMap.startPositions.enemy
          .map((pos, index) => {
            const enemy = enemies[index];
            if (!enemy) return null;

            return {
              id: `enemy-${enemy.id}`,
              character: enemy,
              position: pos,
              currentHp: enemy.stats.maxHp,
              maxHp: enemy.stats.maxHp,
              currentMp: enemy.stats.maxMp,
              maxMp: enemy.stats.maxMp,
              isAlly: false,
              hasActed: false,
              buffs: [],
              debuffs: [],
            };
          })
          .filter(Boolean) as BattleUnitState[];

        // Calculate turn order (based on AGI)
        const allUnits = [...allyUnits, ...enemyUnits];
        const turnOrder = allUnits.sort(
          (a, b) => b.character.stats.agi - a.character.stats.agi
        );

        /**
         * Generate a UUID
         */
        const generateId = () =>
          `battle_state_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;

        const battleStateId = generateId();

        set({
          battleStateId,
          battleMap,
          allyUnits,
          enemyUnits,
          characters,
          enemies,
          turn: 1,
          phase: "battle",
          currentUnitId: turnOrder[0]?.id || null,
          turnOrder,
          selectedAction: null,
          selectedUnitId: null,
          selectedSkillId: null,
          rewards: null,
          battleLogs: [],
        });

        // Add init log
        get().addBattleLog({
          type: "init",
          message: `⚔️ การต่อสู้เริ่มต้น! ${battleMap.name}`,
        });

        // Add first turn log
        const firstUnit = turnOrder[0];
        if (firstUnit) {
          get().addBattleLog({
            type: "turn_start",
            message: `🎯 เทิร์นของ ${firstUnit.character.name} (${firstUnit.isAlly ? "พันธมิตร" : "ศัตรู"})`,
            unitId: firstUnit.id,
            unitName: firstUnit.character.name,
            isAlly: firstUnit.isAlly,
          });
        }
      },

      /**
       * Move Unit
       * Note: Does NOT set hasActed to allow multiple moves within range
       */
      moveUnit: (unitId, x, y) => {
        const state = get();
        const unit = [...state.allyUnits, ...state.enemyUnits].find(u => u.id === unitId);
        
        set((state) => {
          const newAllyUnits = state.allyUnits.map((unit) =>
            unit.id === unitId ? { ...unit, position: { x, y } } : unit
          );
          const newEnemyUnits = state.enemyUnits.map((unit) =>
            unit.id === unitId ? { ...unit, position: { x, y } } : unit
          );

          return {
            allyUnits: newAllyUnits,
            enemyUnits: newEnemyUnits,
            selectedAction: null,
            selectedUnitId: null,
          };
        });

        // Add move log
        if (unit) {
          get().addBattleLog({
            type: "move",
            message: `🚶 ${unit.character.name} เคลื่อนที่ไปยัง (${x}, ${y})`,
            unitId: unit.id,
            unitName: unit.character.name,
            isAlly: unit.isAlly,
          });
        }
      },

      /**
       * Attack Unit
       */
      attackUnit: (attackerId, targetId, damage) => {
        const state = get();
        const attacker = [...state.allyUnits, ...state.enemyUnits].find(u => u.id === attackerId);
        const target = [...state.allyUnits, ...state.enemyUnits].find(u => u.id === targetId);
        
        set((state) => {
          const newAllyUnits = state.allyUnits.map((unit) => {
            if (unit.id === targetId) {
              return {
                ...unit,
                currentHp: Math.max(0, unit.currentHp - damage),
              };
            }
            if (unit.id === attackerId) {
              return { ...unit, hasActed: true };
            }
            return unit;
          });

          const newEnemyUnits = state.enemyUnits.map((unit) => {
            if (unit.id === targetId) {
              return {
                ...unit,
                currentHp: Math.max(0, unit.currentHp - damage),
              };
            }
            if (unit.id === attackerId) {
              return { ...unit, hasActed: true };
            }
            return unit;
          });

          // Remove dead units
          const filteredAllyUnits = newAllyUnits.filter(
            (unit) => unit.currentHp > 0
          );
          const filteredEnemyUnits = newEnemyUnits.filter(
            (unit) => unit.currentHp > 0
          );

          return {
            allyUnits: filteredAllyUnits,
            enemyUnits: filteredEnemyUnits,
            selectedAction: null,
            selectedUnitId: null,
          };
        });

        // Add attack log
        if (attacker && target) {
          get().addBattleLog({
            type: "attack",
            message: `⚔️ ${attacker.character.name} โจมตี ${target.character.name}`,
            unitId: attacker.id,
            unitName: attacker.character.name,
            targetId: target.id,
            targetName: target.character.name,
            isAlly: attacker.isAlly,
          });

          get().addBattleLog({
            type: "damage",
            message: `💥 ${target.character.name} ได้รับความเสียหาย ${damage} HP`,
            unitId: target.id,
            unitName: target.character.name,
            value: damage,
            isAlly: target.isAlly,
          });

          // Check if target died
          const newTarget = [...get().allyUnits, ...get().enemyUnits].find(u => u.id === targetId);
          if (!newTarget || newTarget.currentHp <= 0) {
            get().addBattleLog({
              type: "death",
              message: `💀 ${target.character.name} ถูกปราบแล้ว!`,
              unitId: target.id,
              unitName: target.character.name,
              isAlly: target.isAlly,
            });
          }
        }

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
        const state = get();
        const caster = [...state.allyUnits, ...state.enemyUnits].find(u => u.id === casterId);
        const target = [...state.allyUnits, ...state.enemyUnits].find(u => u.id === targetId);
        
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

        // Add skill log
        if (caster && target) {
          get().addBattleLog({
            type: "skill",
            message: `✨ ${caster.character.name} ใช้สกิล ${skillId} กับ ${target.character.name}`,
            unitId: caster.id,
            unitName: caster.character.name,
            targetId: target.id,
            targetName: target.character.name,
            isAlly: caster.isAlly,
          });
        }
      },

      /**
       * End Turn
       */
      endTurn: () => {
        set((state) => {
          const currentUnitId = state.currentUnitId;
          const newAllyUnits = state.allyUnits.map((unit) => {
            return {
              ...unit,
              hasActed: unit.id === currentUnitId ? true : unit.hasActed,
            };
          });
          const newEnemyUnits = state.enemyUnits.map((unit) => {
            return {
              ...unit,
              hasActed: unit.id === currentUnitId ? true : unit.hasActed,
            };
          });

          // Get all alive units
          const aliveUnitIds = new Set([
            ...newAllyUnits
              .filter((unit) => unit.currentHp > 0)
              .map((unit) => unit.id),
            ...newEnemyUnits
              .filter((unit) => unit.currentHp > 0)
              .map((unit) => unit.id),
          ]);

          // Filter turn order to only include alive units
          const aliveTurnOrder = state.turnOrder.filter((unit) =>
            aliveUnitIds.has(unit.id)
          );

          // If no alive units left, return current state (shouldn't happen as battle should end first)
          if (aliveTurnOrder.length === 0) {
            return {
              allyUnits: newAllyUnits,
              enemyUnits: newEnemyUnits,
              selectedAction: null,
              selectedUnitId: null,
            };
          }

          // Find the next alive unit in the turn order
          const currentIndex = state.currentUnitId
            ? aliveTurnOrder.findIndex((u) => u.id === state.currentUnitId)
            : -1;

          // Get next unit index, wrapping around if needed
          const nextIndex = (currentIndex + 1) % aliveTurnOrder.length;

          // If we were at the end of the turn order, increment the turn counter
          const isNewTurn = currentIndex >= aliveTurnOrder.length - 1;

          // Get the next alive unit
          const nextUnit = aliveTurnOrder[nextIndex];

          if (isNewTurn) {
            console.log("isNewTurn", state.turn + 1);
            // Reset hasActed for all units
            newAllyUnits.forEach((unit) => {
              unit.hasActed = false;
            });
            newEnemyUnits.forEach((unit) => {
              unit.hasActed = false;
            });
          }

          return {
            allyUnits: newAllyUnits,
            enemyUnits: newEnemyUnits,
            turn: isNewTurn ? state.turn + 1 : state.turn,
            currentUnitId: nextUnit?.id || null,
            selectedAction: null,
            selectedUnitId: null,
          };
        });

        // Add turn logs
        const state = get();
        const currentUnit = [...state.allyUnits, ...state.enemyUnits].find(u => u.id === state.currentUnitId);
        
        if (currentUnit) {
          get().addBattleLog({
            type: "turn_end",
            message: `⏹️ ${currentUnit.character.name} จบเทิร์น`,
            unitId: currentUnit.id,
            unitName: currentUnit.character.name,
            isAlly: currentUnit.isAlly,
          });
        }

        const nextUnitState = get();
        const nextUnitData = [...nextUnitState.allyUnits, ...nextUnitState.enemyUnits].find(u => u.id === nextUnitState.currentUnitId);
        
        if (nextUnitData) {
          get().addBattleLog({
            type: "turn_start",
            message: `🎯 เทิร์นของ ${nextUnitData.character.name} (${nextUnitData.isAlly ? "พันธมิตร" : "ศัตรู"})`,
            unitId: nextUnitData.id,
            unitName: nextUnitData.character.name,
            isAlly: nextUnitData.isAlly,
          });
        }
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
       * Set Movement Range
       */
      setMovementRange: (range) => {
        set({ movementRange: range });
      },

      /**
       * Set Attack Range
       */
      setAttackRange: (range) => {
        set({ attackRange: range });
      },

      /**
       * Set Original Position
       */
      setOriginalPosition: (position) => {
        set({ originalPosition: position });
      },

      /**
       * Get Current Unit (Computed)
       */
      getCurrentUnit: () => {
        const { currentUnitId, allyUnits, enemyUnits } = get();
        return (
          [...allyUnits, ...enemyUnits].find((u) => u.id === currentUnitId) ||
          null
        );
      },

      /**
       * Get Alive Turn Order (Computed)
       */
      getAliveTurnOrder: () => {
        const { turnOrder, allyUnits, enemyUnits } = get();
        return turnOrder.filter((unit) => {
          const actualUnit = [...allyUnits, ...enemyUnits].find(
            (u) => u.id === unit.id
          );
          return actualUnit && actualUnit.currentHp > 0 && !actualUnit.hasActed;
        });
      },

      /**
       * Get Unit at Position (Computed)
       */
      getUnitAtPosition: (x, y) => {
        const { allyUnits, enemyUnits } = get();
        return [...allyUnits, ...enemyUnits].find(
          (u) => u.position.x === x && u.position.y === y
        );
      },

      /**
       * Check if tile is in movement range (Computed)
       */
      isTileInMovementRange: (x, y) => {
        const { movementRange } = get();
        return movementRange.some((pos) => pos.x === x && pos.y === y);
      },

      /**
       * Check if tile is in attack range (Computed)
       */
      isTileInAttackRange: (x, y) => {
        const { attackRange } = get();
        return attackRange.some((pos) => pos.x === x && pos.y === y);
      },

      /**
       * Handle Tile Click (Action)
       */
      handleTileClick: (x, y) => {
        const store = get();
        const currentUnit = store.getCurrentUnit();

        // Only allow actions for current unit if it's ally's turn
        if (!currentUnit || !currentUnit.isAlly || currentUnit.hasActed) return;

        const unit = store.getUnitAtPosition(x, y);

        if (unit && unit.id !== currentUnit.id) {
          // Click on another unit - try to attack if in range
          if (store.isTileInAttackRange(x, y) && !unit.isAlly) {
            const damage = Math.max(
              1,
              currentUnit.character.stats.atk - unit.character.stats.def
            );
            store.attackUnit(currentUnit.id, unit.id, damage);

            setTimeout(() => {
              get().endTurn();
            }, 500);
          }
        } else if (!unit && store.isTileInMovementRange(x, y)) {
          // Click on empty tile in movement range - move there
          store.moveUnit(currentUnit.id, x, y);
        }
      },

      /**
       * Check Victory
       */
      checkVictory: () => {
        const { enemyUnits } = get();
        return (
          enemyUnits.length === 0 ||
          enemyUnits.every((unit) => unit.currentHp <= 0)
        );
      },

      /**
       * Check Defeat
       */
      checkDefeat: () => {
        const { allyUnits } = get();
        return (
          allyUnits.length === 0 ||
          allyUnits.every((unit) => unit.currentHp <= 0)
        );
      },

      /**
       * End Battle
       */
      endBattle: (victory, rewards) => {
        set({
          phase: victory ? "victory" : "defeat",
          rewards: rewards || null,
        });

        // Add end battle log
        get().addBattleLog({
          type: victory ? "victory" : "defeat",
          message: victory ? "🎉 ชัยชนะ! คุณชนะการต่อสู้!" : "💀 พ่ายแพ้... คุณแพ้การต่อสู้",
        });
      },
      /**
       * Reset Battle
       */
      resetBattle: () => {
        get().addBattleLog({
          type: "info",
          message: "🔄 รีเซ็ตการต่อสู้",
        });
        set(initialState);
      },
      /**
       * Play enemy turn - AI logic for enemy turns
       */
      playEnemyTurn: async () => {
        const state = get();
        const currentUnit = state.getCurrentUnit();
        const { allyUnits, enemyUnits, battleMap } = state;

        if (!currentUnit || currentUnit.isAlly || !battleMap) {
          return;
        }

        // Wait for a short delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Find nearest ally
        let nearestAlly = null;
        let minDistance = Infinity;

        for (const ally of allyUnits) {
          const distance =
            Math.abs(ally.position.x - currentUnit.position.x) +
            Math.abs(ally.position.y - currentUnit.position.y);
          if (distance < minDistance) {
            minDistance = distance;
            nearestAlly = ally;
          }
        }

        if (!nearestAlly) {
          state.endTurn();
          return;
        }

        // Check if in attack range
        const attackRangeValue = 2; // Should match the attack range in useBattlePresenter
        if (minDistance <= attackRangeValue) {
          // Calculate damage (can be enhanced with attack formulas)
          const damage = Math.max(
            1,
            currentUnit.character.stats.atk - nearestAlly.character.stats.def
          );

          // Execute attack
          state.attackUnit(currentUnit.id, nearestAlly.id, damage);

          // Wait a bit before ending turn
          await new Promise((resolve) => setTimeout(resolve, 500));
          state.endTurn();
        } else {
          // Move toward nearest ally
          const dx = nearestAlly.position.x - currentUnit.position.x;
          const dy = nearestAlly.position.y - currentUnit.position.y;

          let newX = currentUnit.position.x;
          let newY = currentUnit.position.y;

          // Move in the direction with the larger difference
          if (Math.abs(dx) > Math.abs(dy)) {
            newX += dx > 0 ? 1 : -1;
          } else {
            newY += dy > 0 ? 1 : -1;
          }

          // Check if tile is occupied
          const occupied = [...allyUnits, ...enemyUnits].some(
            (u) =>
              u.position.x === newX &&
              u.position.y === newY &&
              u.id !== currentUnit.id
          );

          if (!occupied) {
            state.moveUnit(currentUnit.id, newX, newY);
          }

          // Wait a bit before ending turn
          await new Promise((resolve) => setTimeout(resolve, 500));
          state.endTurn();
        }
      },
    }),
    {
      name: "battle-store",
      storage: createBrowserStorage(),
    }
  )
);
