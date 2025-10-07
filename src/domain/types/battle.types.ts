/**
 * Battle & Combat Types
 * Dynamic Tactical Grid System (Dragon Quest Tact Style)
 */

import { ElementType } from "./character.types";

export type BattleMapSize = "small" | "medium" | "large" | "boss";

export interface GridPosition {
  x: number;
  y: number;
}

export interface BattleMapConfig {
  id: string;
  name: string;
  description?: string;
  size: BattleMapSize;
  width: number; // Grid width (5-10+)
  height: number; // Grid height (5-10+)
  shape: "rectangular" | "irregular" | "multi-level";
  tiles: BattleTile[];
  startPositions: {
    ally: GridPosition[];
    enemy: GridPosition[];
  };
}

export interface BattleTile {
  x: number;
  y: number;
  type: "grass" | "water" | "mountain" | "lava" | "ice" | "poison";
  isWalkable: boolean;
  height: number; // For height advantage
  effect?: TileEffect;
}

export interface TileEffect {
  type: "damage" | "heal" | "buff" | "debuff";
  element?: ElementType;
  value: number;
}

export interface BattleUnit {
  id: string;
  characterId?: string;
  enemyId?: string;
  position: GridPosition;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  turnOrder: number;
  buffs: StatusEffect[];
  debuffs: StatusEffect[];
}

export interface StatusEffect {
  id: string;
  name: string;
  type: "buff" | "debuff";
  duration: number;
  value: number;
}

export interface BattleAction {
  unitId: string;
  actionType: "move" | "attack" | "skill" | "item" | "defend" | "wait";
  targetPosition?: GridPosition;
  targetUnitId?: string;
  skillId?: string;
  itemId?: string;
}

export interface Battle {
  id: string;
  mapConfigId: string;
  locationId: string;
  allies: BattleUnit[];
  enemies: BattleUnit[];
  currentTurn: number;
  turnOrder: string[]; // Unit IDs in turn order
  status: "preparing" | "active" | "victory" | "defeat";
  rewards?: {
    exp: number;
    gold: number;
    items: { itemId: string; quantity: number }[];
  };
}
