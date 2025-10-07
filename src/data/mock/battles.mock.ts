import { BattleMapConfig } from "@/src/domain/types/battle.types";

/**
 * Mock Data: Battle Maps & Scenarios
 * Dynamic Tactical Grid (Dragon Quest Tact Style)
 */

export const mockBattleMaps: BattleMapConfig[] = [
  // Small Maps (5x5)
  {
    id: "map-001",
    name: "ทุ่งหญ้าเล็ก",
    size: "small",
    width: 5,
    height: 5,
    shape: "rectangular",
    tiles: [
      // Generate 5x5 grass tiles
      ...Array.from({ length: 25 }, (_, i) => ({
        x: i % 5,
        y: Math.floor(i / 5),
        type: "grass" as const,
        isWalkable: true,
        height: 0,
      })),
    ],
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

  // Medium Maps (7x7)
  {
    id: "map-002",
    name: "ป่าน้ำแข็ง",
    size: "medium",
    width: 7,
    height: 7,
    shape: "rectangular",
    tiles: [
      // Mix of ice and grass tiles
      ...Array.from({ length: 49 }, (_, i) => {
        const x = i % 7;
        const y = Math.floor(i / 7);
        const isIce = (x + y) % 3 === 0;
        return {
          x,
          y,
          type: isIce ? ("ice" as const) : ("grass" as const),
          isWalkable: true,
          height: 0,
          effect: isIce
            ? {
                type: "damage" as const,
                element: "water" as const,
                value: 10,
              }
            : undefined,
        };
      }),
    ],
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
        { x: 6, y: 4 },
      ],
    },
  },

  // Large Maps (9x9)
  {
    id: "map-003",
    name: "ภูเขาน้ำแข็ง",
    size: "large",
    width: 9,
    height: 9,
    shape: "rectangular",
    tiles: [
      // Mountain terrain with height variations
      ...Array.from({ length: 81 }, (_, i) => {
        const x = i % 9;
        const y = Math.floor(i / 9);
        const isMountain = x >= 3 && x <= 5 && y >= 3 && y <= 5;
        const height = isMountain ? 2 : 0;
        return {
          x,
          y,
          type: isMountain ? ("mountain" as const) : ("ice" as const),
          isWalkable: !isMountain || (x === 4 && y === 4),
          height,
        };
      }),
    ],
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
        { x: 6, y: 4 },
      ],
    },
  },

  // Boss Maps (10x10+)
  {
    id: "map-boss-001",
    name: "ห้องบอสมังกรน้ำแข็ง",
    size: "boss",
    width: 10,
    height: 10,
    shape: "rectangular",
    tiles: [
      // Boss arena with lava edges
      ...Array.from({ length: 100 }, (_, i) => {
        const x = i % 10;
        const y = Math.floor(i / 10);
        const isEdge = x === 0 || x === 9 || y === 0 || y === 9;
        const isLava = isEdge && (x + y) % 2 === 0;
        return {
          x,
          y,
          type: isLava ? ("lava" as const) : ("ice" as const),
          isWalkable: !isLava,
          height: 0,
          effect: isLava
            ? {
                type: "damage" as const,
                element: "fire" as const,
                value: 50,
              }
            : undefined,
        };
      }),
    ],
    startPositions: {
      ally: [
        { x: 2, y: 5 },
        { x: 3, y: 4 },
        { x: 3, y: 6 },
        { x: 2, y: 4 },
      ],
      enemy: [
        { x: 7, y: 5 }, // Boss position
      ],
    },
  },

  // Irregular Shape Map
  {
    id: "map-004",
    name: "ถ้ำคริสตัล",
    size: "medium",
    width: 8,
    height: 8,
    shape: "irregular",
    tiles: [
      // Cave with irregular walkable areas
      ...Array.from({ length: 64 }, (_, i) => {
        const x = i % 8;
        const y = Math.floor(i / 8);
        // Create irregular cave shape
        const isWall =
          (x === 0 && y < 3) ||
          (x === 7 && y > 4) ||
          (y === 0 && x > 5) ||
          (y === 7 && x < 2);
        return {
          x,
          y,
          type: isWall ? ("mountain" as const) : ("grass" as const),
          isWalkable: !isWall,
          height: 0,
        };
      }),
    ],
    startPositions: {
      ally: [
        { x: 1, y: 4 },
        { x: 2, y: 3 },
        { x: 2, y: 5 },
        { x: 1, y: 3 },
      ],
      enemy: [
        { x: 6, y: 4 },
        { x: 5, y: 3 },
        { x: 5, y: 5 },
        { x: 6, y: 3 },
      ],
    },
  },

  // Multi-level Map
  {
    id: "map-005",
    name: "หอคอยหลายชั้น",
    size: "medium",
    width: 7,
    height: 7,
    shape: "multi-level",
    tiles: [
      // Tower with different height levels
      ...Array.from({ length: 49 }, (_, i) => {
        const x = i % 7;
        const y = Math.floor(i / 7);
        // Create height levels
        let height = 0;
        if (x >= 2 && x <= 4 && y >= 2 && y <= 4) height = 1;
        if (x === 3 && y === 3) height = 2;
        return {
          x,
          y,
          type: "grass" as const,
          isWalkable: true,
          height,
        };
      }),
    ],
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
        { x: 3, y: 3 }, // High ground enemy
      ],
    },
  },

  // Water Map
  {
    id: "map-006",
    name: "ทะเลสาบน้ำแข็ง",
    size: "large",
    width: 9,
    height: 9,
    shape: "rectangular",
    tiles: [
      // Lake with ice platforms
      ...Array.from({ length: 81 }, (_, i) => {
        const x = i % 9;
        const y = Math.floor(i / 9);
        const isWater =
          x >= 2 && x <= 6 && y >= 2 && y <= 6 && !((x + y) % 3 === 0);
        return {
          x,
          y,
          type: isWater ? ("water" as const) : ("ice" as const),
          isWalkable: !isWater,
          height: 0,
          effect: isWater
            ? {
                type: "damage" as const,
                element: "water" as const,
                value: 20,
              }
            : undefined,
        };
      }),
    ],
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
];

// Helper functions
export function getBattleMapById(id: string): BattleMapConfig | undefined {
  return mockBattleMaps.find((map) => map.id === id);
}

export function getBattleMapsBySize(size: BattleMapConfig["size"]): BattleMapConfig[] {
  return mockBattleMaps.filter((map) => map.size === size);
}

export function getRandomBattleMap(size?: BattleMapConfig["size"]): BattleMapConfig {
  const maps = size ? getBattleMapsBySize(size) : mockBattleMaps;
  return maps[Math.floor(Math.random() * maps.length)];
}
