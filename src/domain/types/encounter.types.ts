/**
 * Encounter Types for Random Encounters System
 * Handles random enemy encounters during exploration
 */

export interface EncounterEntry {
  enemyId: string; // Reference to enemy in ENEMIES_MASTER
  weight: number; // Spawn weight (higher = more common)
  minLevel?: number; // Minimum level to spawn (optional)
  maxLevel?: number; // Maximum level to spawn (optional)
  minCount?: number; // Minimum number of enemies (default: 1)
  maxCount?: number; // Maximum number of enemies (default: 1)
}

export interface BattleMapEntry {
  battleMapId: string; // Reference to battle map in BATTLE_MAPS_MASTER
  weight: number; // Spawn weight (higher = more common)
  minEnemyCount?: number; // Minimum enemies to use this map (optional)
  maxEnemyCount?: number; // Maximum enemies to use this map (optional)
  timeOfDay?: ("day" | "night" | "dawn" | "dusk")[]; // Time restrictions (optional)
  weather?: string[]; // Weather restrictions (optional, e.g., ["snow", "clear"])
  rarity?: "common" | "uncommon" | "rare" | "legendary"; // Visual indicator
}

export interface EncounterTable {
  id: string; // Unique identifier
  locationId: string; // Reference to location
  name: string; // Display name
  baseRate: number; // Base encounter rate (steps needed)
  rateVariance: number; // Variance in steps (±variance)
  entries: EncounterEntry[]; // List of possible encounters
  isActive: boolean; // Can encounters happen here?
  battleMaps: BattleMapEntry[]; // Optional: Specific battle maps with weights and conditions
}

export interface EncounterModifier {
  id: string;
  name: string;
  type: "item" | "skill" | "buff";
  rateMultiplier: number; // Multiplier for encounter rate (0.5 = half encounters, 0 = disable encounters)
  duration?: number; // Duration in steps (null = permanent)
  icon?: string;
  // TODO: Add 'disableEncounters' flag for items that completely prevent encounters
  // disableEncounters?: boolean; // If true, completely disable encounters (ignores rateMultiplier)
}

export interface ActiveEncounter {
  enemies: string[]; // Array of enemy IDs
  battleMapId: string; // Which battle map to use
  canFlee: boolean; // Can player flee?
  fleeChance: number; // Success rate for fleeing (0-100)
  triggeredAt: number; // Timestamp when triggered
}
