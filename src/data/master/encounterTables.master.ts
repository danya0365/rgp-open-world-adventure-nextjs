import { EncounterTable } from "@/src/domain/types/encounter.types";

/**
 * Master Data: Encounter Tables
 * Defines random encounters for each location
 */

export const ENCOUNTER_TABLES_MASTER: EncounterTable[] = [
  // ========================================
  // FROSTPEAK MOUNTAINS (Northern Continent)
  // ========================================
  {
    id: "encounter-frostpeak",
    locationId: "region-frostpeak",
    name: "Frostpeak Mountains Encounters",
    baseRate: 15, // Average 15 steps between encounters
    rateVariance: 5, // ±5 steps variance (10-20 steps)
    isActive: true,
    battleMaps: [
      {
        battleMapId: "map-cave-entrance",
        weight: 60, // 60% - Common cave battles
        minEnemyCount: 1,
        maxEnemyCount: 3,
        weather: ["snow", "storm", "clear"],
        rarity: "common",
      },
      {
        battleMapId: "map-throne-room",
        weight: 40, // 40% - Epic ice throne battles
        minEnemyCount: 2,
        maxEnemyCount: 6,
        weather: ["snow", "clear"],
        timeOfDay: ["night", "dusk"], // More dramatic at night
        rarity: "uncommon",
      },
    ],
    entries: [
      {
        enemyId: "enemy-001", // Ice Slime
        weight: 40, // 40% chance
        minLevel: 1,
        maxLevel: 5,
        minCount: 1,
        maxCount: 3,
      },
      {
        enemyId: "enemy-002", // Ice Wolf
        weight: 30, // 30% chance
        minLevel: 3,
        maxLevel: 8,
        minCount: 1,
        maxCount: 2,
      },
      {
        enemyId: "enemy-003", // Frost Giant
        weight: 20, // 20% chance
        minLevel: 5,
        maxLevel: 12,
        minCount: 1,
        maxCount: 1,
      },
      {
        enemyId: "enemy-004", // Ice Dragon (Rare)
        weight: 10, // 10% chance
        minLevel: 8,
        maxLevel: 15,
        minCount: 1,
        maxCount: 1,
      },
    ],
  },

  // ========================================
  // ELVEN FOREST (Eastern Continent)
  // ========================================
  {
    id: "encounter-elven-forest",
    locationId: "region-elven-forest",
    name: "Elven Forest Encounters",
    baseRate: 12, // More frequent encounters
    rateVariance: 4,
    isActive: true,
    battleMaps: [
      {
        battleMapId: "map-forest-clearing",
        weight: 70, // 70% - Common forest clearing
        minEnemyCount: 1,
        maxEnemyCount: 4,
        timeOfDay: ["day", "dawn"], // Peaceful daytime battles
        weather: ["sunny", "clear", "rain"],
        rarity: "common",
      },
      {
        battleMapId: "map-plains-battlefield",
        weight: 30, // 30% - Open plains battles
        minEnemyCount: 3,
        maxEnemyCount: 6,
        timeOfDay: ["day", "dusk"], // Open field battles
        weather: ["sunny", "clear"],
        rarity: "uncommon",
      },
    ],
    entries: [
      {
        enemyId: "enemy-005", // Forest Sprite
        weight: 35,
        minLevel: 1,
        maxLevel: 6,
        minCount: 2,
        maxCount: 4,
      },
      {
        enemyId: "enemy-006", // Wild Boar
        weight: 30,
        minLevel: 2,
        maxLevel: 7,
        minCount: 1,
        maxCount: 2,
      },
      {
        enemyId: "enemy-007", // Treant
        weight: 25,
        minLevel: 4,
        maxLevel: 10,
        minCount: 1,
        maxCount: 1,
      },
      {
        enemyId: "enemy-008", // Forest Guardian (Rare)
        weight: 10,
        minLevel: 6,
        maxLevel: 12,
        minCount: 1,
        maxCount: 1,
      },
    ],
  },

  // ========================================
  // CRYSTAL CITY (Safe Zone - No Encounters)
  // ========================================
  {
    id: "encounter-crystal-city",
    locationId: "city-crystal",
    name: "Crystal City (Safe Zone)",
    baseRate: 999, // Effectively no encounters
    rateVariance: 0,
    isActive: false, // Encounters disabled in cities
    entries: [],
    battleMaps: [],
  },

  // ========================================
  // SHADOW DUNGEON (High Encounter Rate)
  // ========================================
  {
    id: "encounter-shadow-dungeon",
    locationId: "dungeon-shadow",
    name: "Shadow Dungeon Encounters",
    baseRate: 8, // Very frequent encounters
    rateVariance: 3,
    isActive: true,
    battleMaps: [
      {
        battleMapId: "map-dungeon-corridor",
        weight: 70,
        minEnemyCount: 1,
        maxEnemyCount: 4,
        weather: ["clear"],
        rarity: "common",
      },
      {
        battleMapId: "map-ancient-ruins",
        weight: 30,
        minEnemyCount: 2,
        maxEnemyCount: 6,
        timeOfDay: ["night", "dusk"],
        rarity: "uncommon",
      },
    ],
    entries: [
      {
        enemyId: "enemy-010", // Shadow Bat
        weight: 30,
        minLevel: 5,
        maxLevel: 10,
        minCount: 2,
        maxCount: 4,
      },
      {
        enemyId: "enemy-011", // Dark Knight
        weight: 25,
        minLevel: 8,
        maxLevel: 15,
        minCount: 1,
        maxCount: 2,
      },
      {
        enemyId: "enemy-012", // Shadow Beast
        weight: 25,
        minLevel: 7,
        maxLevel: 12,
        minCount: 1,
        maxCount: 2,
      },
      {
        enemyId: "enemy-013", // Demon Lord (Boss - Rare)
        weight: 20,
        minLevel: 10,
        maxLevel: 20,
        minCount: 1,
        maxCount: 1,
      },
    ],
  },

  // ========================================
  // MYSTIC TOWER (Medium Encounter Rate)
  // ========================================
  {
    id: "encounter-mystic-tower",
    locationId: "tower-mystic",
    name: "Mystic Tower Encounters",
    baseRate: 10,
    rateVariance: 3,
    isActive: true,
    battleMaps: [
      {
        battleMapId: "map-dungeon-corridor",
        weight: 50,
        minEnemyCount: 1,
        maxEnemyCount: 3,
        weather: ["clear"],
        rarity: "common",
      },
      {
        battleMapId: "map-ancient-ruins",
        weight: 50,
        minEnemyCount: 2,
        maxEnemyCount: 5,
        timeOfDay: ["night", "dusk"],
        rarity: "uncommon",
      },
    ],
    entries: [
      {
        enemyId: "enemy-014", // Magic Golem
        weight: 35,
        minLevel: 6,
        maxLevel: 12,
        minCount: 1,
        maxCount: 2,
      },
      {
        enemyId: "enemy-015", // Arcane Elemental
        weight: 30,
        minLevel: 7,
        maxLevel: 13,
        minCount: 1,
        maxCount: 3,
      },
      {
        enemyId: "enemy-016", // Tower Guardian
        weight: 25,
        minLevel: 8,
        maxLevel: 15,
        minCount: 1,
        maxCount: 1,
      },
      {
        enemyId: "enemy-017", // Ancient Wizard (Rare)
        weight: 10,
        minLevel: 10,
        maxLevel: 18,
        minCount: 1,
        maxCount: 1,
      },
    ],
  },

  // ========================================
  // DESERT WASTELAND (Low Encounter Rate)
  // ========================================
  {
    id: "encounter-desert",
    locationId: "area-desert",
    name: "Desert Wasteland Encounters",
    baseRate: 20, // Less frequent
    rateVariance: 6,
    isActive: true,
    battleMaps: [
      {
        battleMapId: "map-plains-battlefield",
        weight: 70,
        minEnemyCount: 1,
        maxEnemyCount: 4,
        weather: ["sunny", "clear"],
        timeOfDay: ["day", "dusk"],
        rarity: "common",
      },
      {
        battleMapId: "map-ancient-ruins",
        weight: 30,
        minEnemyCount: 2,
        maxEnemyCount: 5,
        timeOfDay: ["day", "night"],
        rarity: "uncommon",
      },
    ],
    entries: [
      {
        enemyId: "enemy-018", // Sand Scorpion
        weight: 40,
        minLevel: 3,
        maxLevel: 8,
        minCount: 1,
        maxCount: 3,
      },
      {
        enemyId: "enemy-019", // Desert Bandit
        weight: 30,
        minLevel: 4,
        maxLevel: 9,
        minCount: 2,
        maxCount: 4,
      },
      {
        enemyId: "enemy-020", // Sand Worm
        weight: 20,
        minLevel: 6,
        maxLevel: 12,
        minCount: 1,
        maxCount: 1,
      },
      {
        enemyId: "enemy-021", // Desert Dragon (Rare)
        weight: 10,
        minLevel: 10,
        maxLevel: 16,
        minCount: 1,
        maxCount: 1,
      },
    ],
  },

  // ========================================
  // UNDERWATER CAVE (High Encounter Rate)
  // ========================================
  {
    id: "encounter-underwater-cave",
    locationId: "cave-underwater",
    name: "Underwater Cave Encounters",
    baseRate: 9,
    rateVariance: 3,
    isActive: true,
    battleMaps: [
      {
        battleMapId: "map-dungeon-corridor",
        weight: 60,
        minEnemyCount: 1,
        maxEnemyCount: 3,
        weather: ["clear"],
        rarity: "common",
      },
      {
        battleMapId: "map-cave-entrance",
        weight: 40,
        minEnemyCount: 2,
        maxEnemyCount: 4,
        weather: ["clear"],
        rarity: "uncommon",
      },
    ],
    entries: [
      {
        enemyId: "enemy-022", // Sea Serpent
        weight: 35,
        minLevel: 7,
        maxLevel: 13,
        minCount: 1,
        maxCount: 2,
      },
      {
        enemyId: "enemy-023", // Kraken Spawn
        weight: 30,
        minLevel: 8,
        maxLevel: 14,
        minCount: 2,
        maxCount: 3,
      },
      {
        enemyId: "enemy-024", // Water Elemental
        weight: 25,
        minLevel: 9,
        maxLevel: 15,
        minCount: 1,
        maxCount: 2,
      },
      {
        enemyId: "enemy-025", // Leviathan (Rare)
        weight: 10,
        minLevel: 12,
        maxLevel: 20,
        minCount: 1,
        maxCount: 1,
      },
    ],
  },

  // ========================================
  // VOLCANIC REGION (Medium-High Encounter Rate)
  // ========================================
  {
    id: "encounter-volcano",
    locationId: "area-volcano",
    name: "Volcanic Region Encounters",
    baseRate: 11,
    rateVariance: 4,
    isActive: true,
    battleMaps: [
      {
        battleMapId: "map-plains-battlefield",
        weight: 60,
        minEnemyCount: 2,
        maxEnemyCount: 6,
        weather: ["sunny", "clear"],
        timeOfDay: ["day", "dusk"],
        rarity: "common",
      },
      {
        battleMapId: "map-ancient-ruins",
        weight: 40,
        minEnemyCount: 2,
        maxEnemyCount: 5,
        timeOfDay: ["night", "dusk"],
        rarity: "uncommon",
      },
    ],
    entries: [
      {
        enemyId: "enemy-026", // Fire Imp
        weight: 35,
        minLevel: 8,
        maxLevel: 14,
        minCount: 2,
        maxCount: 4,
      },
      {
        enemyId: "enemy-027", // Lava Golem
        weight: 30,
        minLevel: 9,
        maxLevel: 15,
        minCount: 1,
        maxCount: 2,
      },
      {
        enemyId: "enemy-028", // Fire Drake
        weight: 25,
        minLevel: 10,
        maxLevel: 16,
        minCount: 1,
        maxCount: 1,
      },
      {
        enemyId: "enemy-029", // Ifrit (Rare)
        weight: 10,
        minLevel: 12,
        maxLevel: 20,
        minCount: 1,
        maxCount: 1,
      },
    ],
  },
];

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get encounter table by location ID
 */
export function getEncounterTableByLocation(
  locationId: string
): EncounterTable | null {
  return (
    ENCOUNTER_TABLES_MASTER.find((table) => table.locationId === locationId) ||
    null
  );
}

/**
 * Get all active encounter tables
 */
export function getActiveEncounterTables(): EncounterTable[] {
  return ENCOUNTER_TABLES_MASTER.filter((table) => table.isActive);
}

/**
 * Get encounter table by ID
 */
export function getEncounterTableById(id: string): EncounterTable | null {
  return ENCOUNTER_TABLES_MASTER.find((table) => table.id === id) || null;
}

/**
 * Check if location has encounters enabled
 */
export function hasEncountersEnabled(locationId: string): boolean {
  const table = getEncounterTableByLocation(locationId);
  return table ? table.isActive : false;
}
