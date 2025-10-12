import {
  EncounterTable,
  EncounterEntry,
  ActiveEncounter,
  EncounterModifier,
  BattleMapEntry,
} from "@/src/domain/types/encounter.types";
import { getEnemyById } from "@/src/data/master/enemies.master";
import { BATTLE_MAPS_MASTER } from "@/src/data/master/battleMaps.master";

/**
 * Encounter Utilities
 * Helper functions for random encounter system
 */

/**
 * Calculate steps until next encounter
 */
export function calculateStepsUntilEncounter(
  baseRate: number,
  variance: number,
  modifiers: EncounterModifier[]
): number {
  // Calculate base steps with variance
  const randomVariance =
    Math.floor(Math.random() * (variance * 2 + 1)) - variance;
  let steps = baseRate + randomVariance;

  // Apply modifiers
  modifiers.forEach((modifier) => {
    steps = Math.floor(steps * modifier.rateMultiplier);
  });

  return Math.max(1, steps); // Minimum 1 step
}

/**
 * Select random enemy from encounter table using weighted random
 */
export function selectRandomEnemy(
  entries: EncounterEntry[],
  playerLevel: number
): EncounterEntry | null {
  // Filter entries by level requirements
  const validEntries = entries.filter((entry) => {
    if (entry.minLevel && playerLevel < entry.minLevel) return false;
    if (entry.maxLevel && playerLevel > entry.maxLevel) return false;
    return true;
  });

  if (validEntries.length === 0) return null;

  // Calculate total weight
  const totalWeight = validEntries.reduce(
    (sum, entry) => sum + entry.weight,
    0
  );

  // Random selection based on weight
  let random = Math.random() * totalWeight;
  for (const entry of validEntries) {
    random -= entry.weight;
    if (random <= 0) {
      return entry;
    }
  }

  return validEntries[0]; // Fallback
}

/**
 * Generate encounter with multiple enemies
 */
export function generateEncounter(
  encounterTable: EncounterTable,
  playerLevel: number
): ActiveEncounter | null {
  const entry = selectRandomEnemy(encounterTable.entries, playerLevel);
  if (!entry) return null;

  // Determine number of enemies
  const minCount = entry.minCount || 1;
  const maxCount = entry.maxCount || 1;
  const enemyCount =
    Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;

  // Generate enemy IDs (can be same enemy multiple times)
  const enemies: string[] = [];
  for (let i = 0; i < enemyCount; i++) {
    enemies.push(entry.enemyId);
  }

  // Select appropriate battle map based on enemy count and location
  const battleMapId = selectBattleMap(enemyCount, encounterTable.battleMaps);

  return {
    enemies,
    battleMapId,
    canFlee: true,
    fleeChance: 75, // Default flee chance (can be overridden by encounter table config)
    triggeredAt: Date.now(),
  };
}

/**
 * Select battle map based on enemy count and location-specific maps with weights
 * Dynamically determines size from available battle maps
 * 
 * @param enemyCount - Number of enemies in encounter
 * @param battleMapEntries - Optional array of battle map entries with weights and conditions
 */
function selectBattleMap(enemyCount: number, battleMapEntries?: BattleMapEntry[]): string {
  // If location has specific battle maps, use weighted selection
  if (battleMapEntries && battleMapEntries.length > 0) {
    // Filter by enemy count requirements
    const validEntries = battleMapEntries.filter((entry) => {
      if (entry.minEnemyCount && enemyCount < entry.minEnemyCount) return false;
      if (entry.maxEnemyCount && enemyCount > entry.maxEnemyCount) return false;
      // TODO: Add time of day and weather filtering when those systems are implemented
      return true;
    });

    if (validEntries.length === 0) {
      // No valid entries, fall back to all maps
      console.warn(`No valid battle map entries for ${enemyCount} enemies, using all available maps`);
    } else {
      // Weighted random selection from valid entries
      const totalWeight = validEntries.reduce((sum, entry) => sum + entry.weight, 0);
      let random = Math.random() * totalWeight;
      
      for (const entry of validEntries) {
        random -= entry.weight;
        if (random <= 0) {
          // Verify the map exists
          const map = BATTLE_MAPS_MASTER.find((m) => m.id === entry.battleMapId);
          if (map) {
            return map.id;
          }
        }
      }
    }
  }

  // Fallback: Use all available maps with size-based selection
  const candidateMaps = BATTLE_MAPS_MASTER;

  // Get all unique sizes from candidate maps
  const availableSizes = Array.from(
    new Set(candidateMaps.map((map) => map.size))
  );

  // Build dynamic size mapping based on available battle maps
  // Sort sizes: small -> medium -> large -> boss
  const sizeOrder = ["small", "medium", "large", "boss"];
  const sortedSizes = availableSizes.sort(
    (a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b)
  );

  // Dynamically assign enemy count ranges based on available sizes
  let requiredSize = "small"; // Default
  
  if (sortedSizes.length === 0) {
    const errorMsg = `[CRITICAL ERROR] No battle maps found. Please add battle maps to battleMaps.master.ts`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Simple logic: use size based on enemy count
  // 1-2 enemies -> smallest available size
  // 3-4 enemies -> second smallest (if available)
  // 5-6 enemies -> third smallest (if available)
  // 7+ enemies -> largest available size
  if (enemyCount <= 2) {
    requiredSize = sortedSizes[0]; // Smallest
  } else if (enemyCount <= 4) {
    requiredSize = sortedSizes[Math.min(1, sortedSizes.length - 1)];
  } else if (enemyCount <= 6) {
    requiredSize = sortedSizes[Math.min(2, sortedSizes.length - 1)];
  } else {
    requiredSize = sortedSizes[sortedSizes.length - 1]; // Largest
  }

  // Query available maps from candidate maps by size
  const availableMaps = candidateMaps.filter((map) => map.size === requiredSize);

  if (availableMaps.length === 0) {
    // This should never happen since we got requiredSize from available sizes
    const errorMsg = `[CRITICAL ERROR] No battle maps found for size "${requiredSize}". This should not happen!`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Random selection from available maps
  const randomIndex = Math.floor(Math.random() * availableMaps.length);
  return availableMaps[randomIndex].id;
}

/**
 * Calculate flee success chance
 */
export function calculateFleeChance(
  baseChance: number,
  playerAGI: number,
  enemyAGI: number
): number {
  // Higher player AGI = higher flee chance
  const agiDiff = playerAGI - enemyAGI;
  const agiBonus = Math.floor(agiDiff / 10) * 5; // +5% per 10 AGI difference

  return Math.max(10, Math.min(95, baseChance + agiBonus));
}

/**
 * Check if encounter should trigger
 */
export function shouldTriggerEncounter(
  currentSteps: number,
  stepsUntilEncounter: number
): boolean {
  return currentSteps >= stepsUntilEncounter;
}

/**
 * Get average enemy level from encounter
 */
export function getAverageEnemyLevel(enemyIds: string[]): number {
  const enemies = enemyIds
    .map((id) => getEnemyById(id))
    .filter((e): e is NonNullable<typeof e> => e !== null);

  if (enemies.length === 0) return 1;

  const totalLevel = enemies.reduce((sum, enemy) => sum + enemy.level, 0);
  return Math.floor(totalLevel / enemies.length);
}

/**
 * Get total enemy HP from encounter
 */
export function getTotalEnemyHP(enemyIds: string[]): number {
  const enemies = enemyIds
    .map((id) => getEnemyById(id))
    .filter((e): e is NonNullable<typeof e> => e !== null);

  return enemies.reduce((sum, enemy) => sum + enemy.stats.hp, 0);
}

/**
 * Format encounter description
 */
export function formatEncounterDescription(
  enemyIds: string[]
): string {
  const enemies = enemyIds
    .map((id) => getEnemyById(id))
    .filter((e): e is NonNullable<typeof e> => e !== null);

  if (enemies.length === 0) return "Unknown enemies";
  if (enemies.length === 1 && enemies[0]) return enemies[0].name;

  // Count unique enemies
  const enemyCounts = new Map<string, number>();
  enemies.forEach((enemy) => {
    const count = enemyCounts.get(enemy.name) || 0;
    enemyCounts.set(enemy.name, count + 1);
  });

  // Format: "2 Ice Slimes and 1 Ice Wolf"
  const parts: string[] = [];
  enemyCounts.forEach((count, name) => {
    if (count > 1) {
      parts.push(`${count} ${name}s`);
    } else {
      parts.push(`${count} ${name}`);
    }
  });

  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;

  const lastPart = parts.pop();
  return `${parts.join(", ")}, and ${lastPart}`;
}

/**
 * Update encounter modifier durations
 */
export function updateModifierDurations(
  modifiers: EncounterModifier[],
  stepsTaken: number
): EncounterModifier[] {
  return modifiers
    .map((modifier) => {
      if (modifier.duration === undefined) return modifier; // Permanent modifier

      const newDuration = modifier.duration - stepsTaken;
      if (newDuration <= 0) return null; // Expired

      return {
        ...modifier,
        duration: newDuration,
      };
    })
    .filter((m) => m !== null) as EncounterModifier[];
}

/**
 * Calculate effective encounter rate with all modifiers
 */
export function calculateEffectiveRate(
  baseRate: number,
  modifiers: EncounterModifier[]
): number {
  let effectiveRate = baseRate;

  modifiers.forEach((modifier) => {
    effectiveRate *= modifier.rateMultiplier;
  });

  return Math.max(1, Math.floor(effectiveRate));
}
