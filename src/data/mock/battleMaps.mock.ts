import { BattleMapConfig } from "@/src/domain/types/battle.types";

/**
 * Mock Battle Maps
 * Dynamic Tactical Grid configurations (Dragon Quest Tact Style)
 */
export const mockBattleMaps: BattleMapConfig[] = [
  // Small Maps (5x5)
  {
    id: "map-forest-clearing",
    name: "Forest Clearing",
    description: "A small clearing in the forest, perfect for quick battles",
    size: "small",
    width: 5,
    height: 5,
    shape: "rectangular",
    tiles: [],
    startPositions: {
      ally: [
        { x: 0, y: 2 },
        { x: 1, y: 1 },
        { x: 1, y: 3 },
        { x: 0, y: 1 },
      ],
      enemy: [
        { x: 4, y: 2 },
        { x: 3, y: 1 },
        { x: 3, y: 3 },
      ],
    },
  },
  {
    id: "map-cave-entrance",
    name: "Cave Entrance",
    description: "Dark cave entrance with limited visibility",
    size: "small",
    width: 5,
    height: 5,
    shape: "rectangular",
    tiles: [],
    startPositions: {
      ally: [
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 0, y: 1 },
        { x: 0, y: 3 },
      ],
      enemy: [
        { x: 4, y: 2 },
        { x: 4, y: 1 },
        { x: 4, y: 3 },
      ],
    },
  },

  // Medium Maps (7x7)
  {
    id: "map-plains-battlefield",
    name: "Plains Battlefield",
    description: "Open plains battlefield with tactical positioning",
    size: "medium",
    width: 7,
    height: 7,
    shape: "rectangular",
    tiles: [],
    startPositions: {
      ally: [
        { x: 0, y: 3 },
        { x: 1, y: 2 },
        { x: 1, y: 4 },
        { x: 0, y: 2 },
      ],
      enemy: [
        { x: 6, y: 3 },
        { x: 5, y: 2 },
        { x: 5, y: 4 },
        { x: 6, y: 2 },
      ],
    },
  },
  {
    id: "map-dungeon-corridor",
    name: "Dungeon Corridor",
    description: "Narrow dungeon corridor for strategic combat",
    size: "medium",
    width: 7,
    height: 7,
    shape: "rectangular",
    tiles: [],
    startPositions: {
      ally: [
        { x: 0, y: 3 },
        { x: 1, y: 3 },
        { x: 0, y: 2 },
        { x: 0, y: 4 },
      ],
      enemy: [
        { x: 6, y: 3 },
        { x: 5, y: 3 },
        { x: 6, y: 2 },
        { x: 6, y: 4 },
      ],
    },
  },

  // Large Maps (9x9)
  {
    id: "map-ancient-ruins",
    name: "Ancient Ruins",
    description: "Vast ancient ruins with multiple tactical options",
    size: "large",
    width: 9,
    height: 9,
    shape: "rectangular",
    tiles: [],
    startPositions: {
      ally: [
        { x: 0, y: 4 },
        { x: 1, y: 3 },
        { x: 1, y: 5 },
        { x: 0, y: 3 },
      ],
      enemy: [
        { x: 8, y: 4 },
        { x: 7, y: 3 },
        { x: 7, y: 5 },
        { x: 8, y: 3 },
        { x: 8, y: 5 },
      ],
    },
  },
  {
    id: "map-volcano-chamber",
    name: "Volcano Chamber",
    description: "Dangerous volcano chamber with lava hazards",
    size: "large",
    width: 9,
    height: 9,
    shape: "irregular",
    tiles: [],
    startPositions: {
      ally: [
        { x: 1, y: 4 },
        { x: 2, y: 3 },
        { x: 2, y: 5 },
        { x: 1, y: 3 },
      ],
      enemy: [
        { x: 7, y: 4 },
        { x: 6, y: 3 },
        { x: 6, y: 5 },
        { x: 7, y: 3 },
      ],
    },
  },

  // Boss Maps (10x10+)
  {
    id: "map-throne-room",
    name: "Throne Room",
    description: "Grand throne room for epic boss battles",
    size: "boss",
    width: 10,
    height: 10,
    shape: "rectangular",
    tiles: [],
    startPositions: {
      ally: [
        { x: 1, y: 5 },
        { x: 2, y: 4 },
        { x: 2, y: 6 },
        { x: 1, y: 4 },
      ],
      enemy: [
        { x: 8, y: 5 }, // Boss position
        { x: 7, y: 4 },
        { x: 7, y: 6 },
      ],
    },
  },
  {
    id: "map-dragon-lair",
    name: "Dragon's Lair",
    description: "Massive dragon's lair for legendary encounters",
    size: "boss",
    width: 12,
    height: 10,
    shape: "irregular",
    tiles: [],
    startPositions: {
      ally: [
        { x: 1, y: 5 },
        { x: 2, y: 4 },
        { x: 2, y: 6 },
        { x: 1, y: 4 },
      ],
      enemy: [
        { x: 10, y: 5 }, // Dragon position
        { x: 9, y: 4 },
        { x: 9, y: 6 },
      ],
    },
  },
];

/**
 * Get battle map by ID
 */
export function getBattleMapById(id: string): BattleMapConfig | undefined {
  return mockBattleMaps.find((map) => map.id === id);
}

/**
 * Get battle maps by size
 */
export function getBattleMapsBySize(size: string): BattleMapConfig[] {
  return mockBattleMaps.filter((map) => map.size === size);
}

/**
 * Get random battle map
 */
export function getRandomBattleMap(): BattleMapConfig {
  return mockBattleMaps[Math.floor(Math.random() * mockBattleMaps.length)];
}
