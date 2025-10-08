import { BattleMapConfig } from "@/src/domain/types/battle.types";

/**
 * Master Data: Battle Maps
 * Dynamic Tactical Grid configurations (Dragon Quest Tact Style)
 */

export const BATTLE_MAPS_MASTER: BattleMapConfig[] = [
  // Small Maps (8x16)
  {
    id: "map-forest-clearing",
    name: "Forest Clearing",
    description: "A small clearing in the forest, perfect for quick battles",
    size: "small",
    width: 8,
    height: 16,
    shape: "rectangular",
    tiles: Array.from({ length: 8 * 16 }, (_, i) => ({
      x: i % 8,
      y: Math.floor(i / 8),
      type: "grass" as const,
      isWalkable: true,
      height: 0,
    })),
    enemies: ["enemy-001", "enemy-003"],
    startPositions: {
      ally: [
        { x: 3, y: 15 }, { x: 4, y: 15 },
        { x: 2, y: 14 }, { x: 5, y: 14 },
        { x: 3, y: 14 }, { x: 4, y: 14 },
        { x: 2, y: 15 }, { x: 5, y: 15 }
      ],
      enemy: [
        { x: 3, y: 0 }, { x: 4, y: 0 },
        { x: 2, y: 1 }, { x: 5, y: 1 },
        { x: 3, y: 1 }, { x: 4, y: 1 },
        { x: 1, y: 0 }, { x: 6, y: 0 }
      ],
    },
  },

  {
    id: "map-cave-entrance",
    name: "Cave Entrance",
    description: "Dark cave entrance with limited visibility",
    size: "small",
    width: 8,
    height: 16,
    shape: "rectangular",
    tiles: Array.from({ length: 8 * 16 }, (_, i) => ({
      x: i % 8,
      y: Math.floor(i / 8),
      type: "mountain" as const,
      isWalkable: true,
      height: 0,
    })),
    enemies: ["enemy-001", "enemy-002"],
    startPositions: {
      ally: [
        { x: 3, y: 15 }, { x: 4, y: 15 },
        { x: 2, y: 14 }, { x: 5, y: 14 },
        { x: 3, y: 14 }, { x: 4, y: 14 },
        { x: 2, y: 15 }, { x: 5, y: 15 }
      ],
      enemy: [
        { x: 3, y: 0 }, { x: 4, y: 0 },
        { x: 2, y: 1 }, { x: 5, y: 1 },
        { x: 3, y: 1 }, { x: 4, y: 1 },
        { x: 1, y: 0 }, { x: 6, y: 0 }
      ],
    },
  },

  // Medium Maps (12x24)
  {
    id: "map-plains-battlefield",
    name: "Plains Battlefield",
    description: "Open plains battlefield with tactical positioning",
    size: "medium",
    width: 12,
    height: 24,
    shape: "rectangular",
    tiles: Array.from({ length: 12 * 24 }, (_, i) => ({
      x: i % 12,
      y: Math.floor(i / 12),
      type: "grass" as const,
      isWalkable: true,
      height: 0,
    })),
    enemies: ["enemy-002", "enemy-003", "enemy-011"],
    startPositions: {
      ally: [
        { x: 5, y: 23 }, { x: 6, y: 23 },
        { x: 4, y: 22 }, { x: 7, y: 22 },
        { x: 5, y: 22 }, { x: 6, y: 22 },
        { x: 3, y: 23 }, { x: 8, y: 23 }
      ],
      enemy: [
        { x: 5, y: 0 }, { x: 6, y: 0 },
        { x: 4, y: 1 }, { x: 7, y: 1 },
        { x: 5, y: 1 }, { x: 6, y: 1 },
        { x: 3, y: 0 }, { x: 8, y: 0 }
      ],
    },
  },

  {
    id: "map-dungeon-corridor",
    name: "Dungeon Corridor",
    description: "Narrow dungeon corridor for strategic combat",
    size: "medium",
    width: 12,
    height: 24,
    shape: "rectangular",
    tiles: Array.from({ length: 12 * 24 }, (_, i) => ({
      x: i % 12,
      y: Math.floor(i / 12),
      type: "mountain" as const,
      isWalkable: true,
      height: 0,
    })),
    enemies: ["enemy-003", "enemy-011"],
    startPositions: {
      ally: [
        { x: 5, y: 23 }, { x: 6, y: 23 },
        { x: 4, y: 22 }, { x: 7, y: 22 },
        { x: 5, y: 22 }, { x: 6, y: 22 },
        { x: 3, y: 23 }, { x: 8, y: 23 }
      ],
      enemy: [
        { x: 5, y: 0 }, { x: 6, y: 0 },
        { x: 4, y: 1 }, { x: 7, y: 1 },
        { x: 5, y: 1 }, { x: 6, y: 1 },
        { x: 3, y: 0 }, { x: 8, y: 0 }
      ],
    },
  },

  // Large Maps (15x20)
  {
    id: "map-ancient-ruins",
    name: "Ancient Ruins",
    description: "Vast ancient ruins with multiple tactical options",
    size: "large",
    width: 15,
    height: 20,
    shape: "rectangular",
    tiles: Array.from({ length: 15 * 20 }, (_, i) => ({
      x: i % 15,
      y: Math.floor(i / 15),
      type: "grass" as const,
      isWalkable: true,
      height: 0,
    })),
    enemies: ["enemy-011", "enemy-012"],
    startPositions: {
      ally: [
        { x: 6, y: 19 }, { x: 7, y: 19 }, { x: 8, y: 19 },
        { x: 5, y: 18 }, { x: 6, y: 18 }, { x: 7, y: 18 }, { x: 8, y: 18 }, { x: 9, y: 18 },
        { x: 4, y: 19 }, { x: 5, y: 19 }, { x: 9, y: 19 }, { x: 10, y: 19 }
      ],
      enemy: [
        { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 },
        { x: 5, y: 1 }, { x: 6, y: 1 }, { x: 7, y: 1 }, { x: 8, y: 1 }, { x: 9, y: 1 },
        { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 9, y: 0 }, { x: 10, y: 0 }
      ],
    },
  },

  {
    id: "map-volcano-chamber",
    name: "Volcano Chamber",
    description: "Dangerous volcano chamber with lava hazards",
    size: "large",
    width: 15,
    height: 20,
    shape: "irregular",
    tiles: Array.from({ length: 15 * 20 }, (_, i) => ({
      x: i % 15,
      y: Math.floor(i / 15),
      type: "lava" as const,
      isWalkable: true,
      height: 0,
      effect: { type: "damage" as const, element: "fire" as const, value: 10 },
    })),
    enemies: ["enemy-012"],
    startPositions: {
      ally: [
        { x: 6, y: 19 }, { x: 7, y: 19 }, { x: 8, y: 19 },
        { x: 5, y: 18 }, { x: 6, y: 18 }, { x: 7, y: 18 }, { x: 8, y: 18 }, { x: 9, y: 18 },
        { x: 4, y: 19 }, { x: 5, y: 19 }, { x: 9, y: 19 }, { x: 10, y: 19 }
      ],
      enemy: [
        { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 },
        { x: 5, y: 1 }, { x: 6, y: 1 }, { x: 7, y: 1 }, { x: 8, y: 1 }, { x: 9, y: 1 },
        { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 9, y: 0 }, { x: 10, y: 0 }
      ],
    },
  },

  // Boss Maps (10x20)
  {
    id: "map-throne-room",
    name: "Throne Room",
    description: "Grand throne room for epic boss battles",
    size: "boss",
    width: 10,
    height: 20,
    shape: "rectangular",
    tiles: Array.from({ length: 15 * 20 }, (_, i) => ({
      x: i % 15,
      y: Math.floor(i / 15),
      type: "ice" as const,
      isWalkable: true,
      height: 0,
    })),
    enemies: ["enemy-101", "enemy-011"],
    startPositions: {
      ally: [
        { x: 4, y: 19 }, { x: 5, y: 19 },
        { x: 3, y: 19 }, { x: 6, y: 19 },
        { x: 4, y: 18 }, { x: 5, y: 18 },
        { x: 3, y: 18 }, { x: 6, y: 18 }
      ],
      enemy: [
        { x: 4, y: 0 }, { x: 5, y: 0 },
        { x: 3, y: 0 }, { x: 6, y: 0 },
        { x: 4, y: 1 }, { x: 5, y: 1 },
        { x: 3, y: 1 }, { x: 6, y: 1 }
      ],
    },
  },

  {
    id: "map-dragon-lair",
    name: "Dragon's Lair",
    description: "Massive dragon's lair for legendary encounters",
    size: "boss",
    width: 10,
    height: 20,
    shape: "irregular",
    tiles: Array.from({ length: 15 * 20 }, (_, i) => ({
      x: i % 15,
      y: Math.floor(i / 15),
      type: "ice" as const,
      isWalkable: true,
      height: 0,
    })),
    enemies: ["enemy-201"],
    startPositions: {
      ally: [
        { x: 4, y: 19 }, { x: 5, y: 19 },
        { x: 3, y: 19 }, { x: 6, y: 19 },
        { x: 4, y: 18 }, { x: 5, y: 18 },
        { x: 3, y: 18 }, { x: 6, y: 18 }
      ],
      enemy: [
        { x: 4, y: 0 }, { x: 5, y: 0 },
        { x: 3, y: 0 }, { x: 6, y: 0 },
        { x: 4, y: 1 }, { x: 5, y: 1 },
        { x: 3, y: 1 }, { x: 6, y: 1 }
      ],
    },
  },
];

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get battle map by ID
 */
export function getBattleMapById(id: string): BattleMapConfig | undefined {
  return BATTLE_MAPS_MASTER.find((map) => map.id === id);
}

/**
 * Get battle maps by size
 */
export function getBattleMapsBySize(size: string): BattleMapConfig[] {
  return BATTLE_MAPS_MASTER.filter((map) => map.size === size);
}

/**
 * Get random battle map
 */
export function getRandomBattleMap(): BattleMapConfig {
  return BATTLE_MAPS_MASTER[
    Math.floor(Math.random() * BATTLE_MAPS_MASTER.length)
  ];
}
