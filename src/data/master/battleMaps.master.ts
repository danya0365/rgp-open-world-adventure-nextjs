import {
  BattleMapConfig,
  BattleMapTile,
} from "@/src/domain/types/battle.types";

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
    tiles: Array.from({ length: 8 * 16 }, (_, i) => {
      const x = i % 8;
      const y = Math.floor(i / 8);
      // Create water patches in some areas
      const isWater = (x === 0 || x === 7) && y >= 6 && y <= 10;
      return {
        x,
        y,
        type: (isWater ? "water" : "grass") as BattleMapTile["type"],
        isWalkable: !isWater,
        height: 0,
      };
    }),
    startPositions: {
      ally: [
        { x: 3, y: 15 },
        { x: 4, y: 15 },
        { x: 2, y: 14 },
        { x: 5, y: 14 },
        { x: 3, y: 14 },
        { x: 4, y: 14 },
        { x: 2, y: 15 },
        { x: 5, y: 15 },
      ],
      enemy: [
        { x: 3, y: 0 },
        { x: 4, y: 0 },
        { x: 2, y: 1 },
        { x: 5, y: 1 },
        { x: 3, y: 1 },
        { x: 4, y: 1 },
        { x: 1, y: 0 },
        { x: 6, y: 0 },
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
    tiles: Array.from({ length: 8 * 16 }, (_, i) => {
      const x = i % 8;
      const y = Math.floor(i / 8);
      // Mountain walls on edges, some elevated tiles
      const isMountain = x === 0 || x === 7 || y === 0 || y === 15;
      const height = isMountain ? 2 : x % 3 === 0 && y % 3 === 0 ? 1 : 0;
      return {
        x,
        y,
        type: "mountain" as const,
        isWalkable: true,
        height,
      };
    }),
    startPositions: {
      ally: [
        { x: 3, y: 15 },
        { x: 4, y: 15 },
        { x: 2, y: 14 },
        { x: 5, y: 14 },
        { x: 3, y: 14 },
        { x: 4, y: 14 },
        { x: 2, y: 15 },
        { x: 5, y: 15 },
      ],
      enemy: [
        { x: 3, y: 0 },
        { x: 4, y: 0 },
        { x: 2, y: 1 },
        { x: 5, y: 1 },
        { x: 3, y: 1 },
        { x: 4, y: 1 },
        { x: 1, y: 0 },
        { x: 6, y: 0 },
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
    tiles: Array.from({ length: 12 * 24 }, (_, i) => {
      const x = i % 12;
      const y = Math.floor(i / 12);
      // Mostly grass with occasional elevated hills
      const isHill = (x + y) % 7 === 0;
      return {
        x,
        y,
        type: "grass" as const,
        isWalkable: true,
        height: isHill ? 1 : 0,
      };
    }),
    startPositions: {
      ally: [
        { x: 5, y: 23 },
        { x: 6, y: 23 },
        { x: 4, y: 22 },
        { x: 7, y: 22 },
        { x: 5, y: 22 },
        { x: 6, y: 22 },
        { x: 3, y: 23 },
        { x: 8, y: 23 },
      ],
      enemy: [
        { x: 5, y: 0 },
        { x: 6, y: 0 },
        { x: 4, y: 1 },
        { x: 7, y: 1 },
        { x: 5, y: 1 },
        { x: 6, y: 1 },
        { x: 3, y: 0 },
        { x: 8, y: 0 },
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
    tiles: Array.from({ length: 12 * 24 }, (_, i) => {
      const x = i % 12;
      const y = Math.floor(i / 12);
      // Narrow corridor with mountain walls and poison traps
      const isWall = x <= 1 || x >= 10;
      const isPoison = !isWall && (x === 3 || x === 8) && y % 4 === 0;
      return {
        x,
        y,
        type: (isPoison ? "poison" : "mountain") as BattleMapTile["type"],
        isWalkable: true,
        height: isWall ? 3 : 0,
        ...(isPoison && {
          effect: {
            type: "damage" as const,
            element: "poison" as const,
            value: 5,
          },
        }),
      };
    }),
    startPositions: {
      ally: [
        { x: 5, y: 23 },
        { x: 6, y: 23 },
        { x: 4, y: 22 },
        { x: 7, y: 22 },
        { x: 5, y: 22 },
        { x: 6, y: 22 },
        { x: 3, y: 23 },
        { x: 8, y: 23 },
      ],
      enemy: [
        { x: 5, y: 0 },
        { x: 6, y: 0 },
        { x: 4, y: 1 },
        { x: 7, y: 1 },
        { x: 5, y: 1 },
        { x: 6, y: 1 },
        { x: 3, y: 0 },
        { x: 8, y: 0 },
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
    tiles: Array.from({ length: 15 * 20 }, (_, i) => {
      const x = i % 15;
      const y = Math.floor(i / 15);
      // Mix of grass and mountain ruins with varying heights
      const isMountain = (x % 4 === 0 || y % 4 === 0) && (x + y) % 3 === 0;
      const height = isMountain ? Math.floor(Math.random() * 2) + 1 : 0;
      return {
        x,
        y,
        type: (isMountain ? "mountain" : "grass") as BattleMapTile["type"],
        isWalkable: true,
        height,
      };
    }),
    startPositions: {
      ally: [
        { x: 6, y: 19 },
        { x: 7, y: 19 },
        { x: 8, y: 19 },
        { x: 5, y: 18 },
        { x: 6, y: 18 },
        { x: 7, y: 18 },
        { x: 8, y: 18 },
        { x: 9, y: 18 },
        { x: 4, y: 19 },
        { x: 5, y: 19 },
        { x: 9, y: 19 },
        { x: 10, y: 19 },
      ],
      enemy: [
        { x: 6, y: 0 },
        { x: 7, y: 0 },
        { x: 8, y: 0 },
        { x: 5, y: 1 },
        { x: 6, y: 1 },
        { x: 7, y: 1 },
        { x: 8, y: 1 },
        { x: 9, y: 1 },
        { x: 4, y: 0 },
        { x: 5, y: 0 },
        { x: 9, y: 0 },
        { x: 10, y: 0 },
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
    tiles: Array.from({ length: 15 * 20 }, (_, i) => {
      const x = i % 15;
      const y = Math.floor(i / 15);
      // Lava pools scattered throughout, mountain edges
      const isEdge = x === 0 || x === 14 || y === 0 || y === 19;
      const isLavaPool = !isEdge && ((x + y) % 5 === 0 || (x * y) % 11 === 0);
      return {
        x,
        y,
        type: (isLavaPool ? "lava" : "mountain") as BattleMapTile["type"],
        isWalkable: true,
        height: isEdge ? 2 : 0,
        ...(isLavaPool && {
          effect: {
            type: "damage" as const,
            element: "fire" as const,
            value: 15,
          },
        }),
      };
    }),
    startPositions: {
      ally: [
        { x: 6, y: 19 },
        { x: 7, y: 19 },
        { x: 8, y: 19 },
        { x: 5, y: 18 },
        { x: 6, y: 18 },
        { x: 7, y: 18 },
        { x: 8, y: 18 },
        { x: 9, y: 18 },
        { x: 4, y: 19 },
        { x: 5, y: 19 },
        { x: 9, y: 19 },
        { x: 10, y: 19 },
      ],
      enemy: [
        { x: 6, y: 0 },
        { x: 7, y: 0 },
        { x: 8, y: 0 },
        { x: 5, y: 1 },
        { x: 6, y: 1 },
        { x: 7, y: 1 },
        { x: 8, y: 1 },
        { x: 9, y: 1 },
        { x: 4, y: 0 },
        { x: 5, y: 0 },
        { x: 9, y: 0 },
        { x: 10, y: 0 },
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
    tiles: Array.from({ length: 10 * 20 }, (_, i) => {
      const x = i % 10;
      const y = Math.floor(i / 10);
      // Ice floor with frozen patterns
      const isFrozenPattern = (x + y) % 3 === 0;
      return {
        x,
        y,
        type: "ice" as const,
        isWalkable: true,
        height: isFrozenPattern ? 1 : 0,
      };
    }),
    startPositions: {
      ally: [
        { x: 4, y: 19 },
        { x: 5, y: 19 },
        { x: 3, y: 19 },
        { x: 6, y: 19 },
        { x: 4, y: 18 },
        { x: 5, y: 18 },
        { x: 3, y: 18 },
        { x: 6, y: 18 },
      ],
      enemy: [
        { x: 4, y: 0 },
        { x: 5, y: 0 },
        { x: 3, y: 0 },
        { x: 6, y: 0 },
        { x: 4, y: 1 },
        { x: 5, y: 1 },
        { x: 3, y: 1 },
        { x: 6, y: 1 },
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
    tiles: Array.from({ length: 10 * 20 }, (_, i) => {
      const x = i % 10;
      const y = Math.floor(i / 10);
      // Mix of ice, lava, and mountain for dramatic boss arena
      const isLava = (x === 0 || x === 9) && y >= 8 && y <= 12;
      const isMountain = !isLava && (x <= 1 || x >= 8 || y <= 2 || y >= 17);
      const type = isLava ? "lava" : isMountain ? "mountain" : "ice";
      return {
        x,
        y,
        type: type as BattleMapTile["type"],
        isWalkable: true,
        height: isMountain ? 3 : 0,
        ...(isLava && {
          effect: {
            type: "damage" as const,
            element: "fire" as const,
            value: 20,
          },
        }),
      };
    }),
    startPositions: {
      ally: [
        { x: 4, y: 19 },
        { x: 5, y: 19 },
        { x: 3, y: 19 },
        { x: 6, y: 19 },
        { x: 4, y: 18 },
        { x: 5, y: 18 },
        { x: 3, y: 18 },
        { x: 6, y: 18 },
      ],
      enemy: [
        { x: 4, y: 0 },
        { x: 5, y: 0 },
        { x: 3, y: 0 },
        { x: 6, y: 0 },
        { x: 4, y: 1 },
        { x: 5, y: 1 },
        { x: 3, y: 1 },
        { x: 6, y: 1 },
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
