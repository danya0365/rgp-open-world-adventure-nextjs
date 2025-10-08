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
  tiles: BattleMapTile[];
  obstacles?: GridPosition[]; // Optional obstacles on the map
  enemies: string[]; // Enemy IDs that appear in this battle map
  startPositions: {
    ally: GridPosition[];
    enemy: GridPosition[];
  };
}

export interface BattleMapTile {
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
