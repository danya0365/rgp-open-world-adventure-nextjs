import { Enemy } from "@/src/domain/types/character.types";

/**
 * Master Data: Enemies & Monsters
 * Core enemy data for the game
 */

export const ENEMIES_MASTER: Enemy[] = [
  // Normal Enemies
  {
    id: "enemy-001",
    name: "สไลม์น้ำแข็ง",
    type: "normal",
    level: 1,
    stats: {
      hp: 100,
      maxHp: 100,
      mp: 20,
      maxMp: 20,
      atk: 15,
      def: 10,
      wis: 5,
      agi: 8,
      mov: 5,
    },
    elements: ["water"],
    elementalAffinities: [
      { element: "water", strength: 50 },
      { element: "fire", strength: -80 },
    ],
    skills: ["skill-enemy-001"],
    drops: [
      { itemId: "item-001", chance: 80, quantity: { min: 1, max: 3 } },
      { itemId: "item-002", chance: 30, quantity: { min: 1, max: 1 } },
    ],
    exp: 25,
    gold: 10,
    sprite: "/images/enemies/ice-slime.png",
    description: "สไลม์น้ำแข็งที่พบได้ทั่วไปในพื้นที่หนาว",
    weaknesses: ["fire"],
    resistances: ["water"],
  },

  {
    id: "enemy-002",
    name: "หมาป่าน้ำแข็ง",
    type: "normal",
    level: 5,
    stats: {
      hp: 250,
      maxHp: 250,
      mp: 30,
      maxMp: 30,
      atk: 35,
      def: 20,
      wis: 10,
      agi: 40,
      mov: 15,
    },
    elements: ["water"],
    elementalAffinities: [
      { element: "water", strength: 60 },
      { element: "fire", strength: -70 },
    ],
    skills: ["skill-enemy-002", "skill-enemy-003"],
    drops: [
      { itemId: "item-010", chance: 70, quantity: { min: 1, max: 2 } },
      { itemId: "item-011", chance: 40, quantity: { min: 1, max: 1 } },
    ],
    exp: 80,
    gold: 35,
    sprite: "/images/enemies/ice-wolf.png",
    description: "หมาป่าที่อาศัยอยู่ในภูเขาน้ำแข็ง",
    weaknesses: ["fire"],
    resistances: ["water", "wind"],
  },

  {
    id: "enemy-003",
    name: "โกเบลินป่า",
    type: "normal",
    level: 3,
    stats: {
      hp: 150,
      maxHp: 150,
      mp: 25,
      maxMp: 25,
      atk: 25,
      def: 15,
      wis: 8,
      agi: 30,
      mov: 10,
    },
    elements: ["earth"],
    elementalAffinities: [
      { element: "earth", strength: 40 },
      { element: "wind", strength: -50 },
    ],
    skills: ["skill-enemy-010"],
    drops: [
      { itemId: "item-020", chance: 75, quantity: { min: 1, max: 2 } },
      { itemId: "item-021", chance: 25, quantity: { min: 1, max: 1 } },
    ],
    exp: 45,
    gold: 20,
    sprite: "/images/enemies/forest-goblin.png",
    description: "โกเบลินที่อาศัยอยู่ในป่าลึก",
    weaknesses: ["wind"],
    resistances: ["earth"],
  },

  // Elite Enemies
  {
    id: "enemy-011",
    name: "ยักษ์น้ำแข็ง",
    type: "elite",
    level: 15,
    stats: {
      hp: 800,
      maxHp: 800,
      mp: 100,
      maxMp: 100,
      atk: 80,
      def: 60,
      wis: 30,
      agi: 20,
      mov: 25,
    },
    elements: ["water"],
    elementalAffinities: [
      { element: "water", strength: 80 },
      { element: "fire", strength: -90 },
    ],
    skills: ["skill-enemy-020", "skill-enemy-021", "skill-enemy-022"],
    drops: [
      { itemId: "item-100", chance: 90, quantity: { min: 2, max: 4 } },
      { itemId: "item-101", chance: 60, quantity: { min: 1, max: 2 } },
      { itemId: "item-102", chance: 30, quantity: { min: 1, max: 1 } },
    ],
    exp: 350,
    gold: 150,
    sprite: "/images/enemies/frost-giant.png",
    description: "ยักษ์น้ำแข็งที่มีพลังมหาศาล",
    weaknesses: ["fire"],
    resistances: ["water", "wind"],
  },

  {
    id: "enemy-012",
    name: "โกเล็มน้ำแข็ง",
    type: "elite",
    level: 20,
    stats: {
      hp: 1200,
      maxHp: 1200,
      mp: 80,
      maxMp: 80,
      atk: 90,
      def: 100,
      wis: 20,
      agi: 15,
      mov: 10,
    },
    elements: ["water", "earth"],
    elementalAffinities: [
      { element: "water", strength: 70 },
      { element: "earth", strength: 60 },
      { element: "fire", strength: -100 },
    ],
    skills: ["skill-enemy-030", "skill-enemy-031"],
    drops: [
      { itemId: "item-110", chance: 85, quantity: { min: 1, max: 3 } },
      { itemId: "item-111", chance: 50, quantity: { min: 1, max: 2 } },
      { itemId: "item-112", chance: 20, quantity: { min: 1, max: 1 } },
    ],
    exp: 550,
    gold: 250,
    sprite: "/images/enemies/ice-golem.png",
    description: "โกเล็มที่สร้างจากน้ำแข็งและหิน",
    weaknesses: ["fire"],
    resistances: ["water", "earth", "wind"],
  },

  // Boss Enemies
  {
    id: "enemy-101",
    name: "มังกรน้ำแข็ง",
    type: "boss",
    level: 30,
    stats: {
      hp: 5000,
      maxHp: 5000,
      mp: 500,
      maxMp: 500,
      atk: 150,
      def: 120,
      wis: 100,
      agi: 60,
      mov: 50,
    },
    elements: ["water", "wind"],
    elementalAffinities: [
      { element: "water", strength: 90 },
      { element: "wind", strength: 80 },
      { element: "fire", strength: -120 },
    ],
    skills: [
      "skill-enemy-100",
      "skill-enemy-101",
      "skill-enemy-102",
      "skill-enemy-103",
    ],
    drops: [
      { itemId: "item-200", chance: 100, quantity: { min: 1, max: 1 } },
      { itemId: "item-201", chance: 80, quantity: { min: 2, max: 5 } },
      { itemId: "item-202", chance: 50, quantity: { min: 1, max: 3 } },
      { itemId: "item-203", chance: 25, quantity: { min: 1, max: 1 } },
    ],
    exp: 2500,
    gold: 1000,
    sprite: "/images/enemies/frost-dragon.png",
    description: "มังกรน้ำแข็งโบราณผู้ปกครองดินแดนหนาว",
    weaknesses: ["fire"],
    resistances: ["water", "wind", "earth"],
  },

  {
    id: "enemy-102",
    name: "ราชาอันเดดน้ำแข็ง",
    type: "boss",
    level: 35,
    stats: {
      hp: 6500,
      maxHp: 6500,
      mp: 600,
      maxMp: 600,
      atk: 130,
      def: 100,
      wis: 140,
      agi: 50,
      mov: 40,
    },
    elements: ["dark", "water"],
    elementalAffinities: [
      { element: "dark", strength: 100 },
      { element: "water", strength: 70 },
      { element: "light", strength: -150 },
      { element: "fire", strength: -80 },
    ],
    skills: [
      "skill-enemy-110",
      "skill-enemy-111",
      "skill-enemy-112",
      "skill-enemy-113",
      "skill-enemy-114",
    ],
    drops: [
      { itemId: "item-210", chance: 100, quantity: { min: 1, max: 1 } },
      { itemId: "item-211", chance: 90, quantity: { min: 3, max: 6 } },
      { itemId: "item-212", chance: 60, quantity: { min: 1, max: 2 } },
      { itemId: "item-213", chance: 30, quantity: { min: 1, max: 1 } },
    ],
    exp: 3500,
    gold: 1500,
    sprite: "/images/enemies/frozen-lich-king.png",
    description: "ราชาอันเดดผู้ครองดันเจี้ยนน้ำแข็งลึก",
    weaknesses: ["light", "fire"],
    resistances: ["dark", "water"],
  },

  // Legendary Boss
  {
    id: "enemy-201",
    name: "เทพน้ำแข็งโบราณ",
    type: "legendary",
    level: 50,
    stats: {
      hp: 15000,
      maxHp: 15000,
      mp: 1000,
      maxMp: 1000,
      atk: 200,
      def: 180,
      wis: 200,
      agi: 100,
      mov: 80,
    },
    elements: ["water", "wind", "dark"],
    elementalAffinities: [
      { element: "water", strength: 100 },
      { element: "wind", strength: 90 },
      { element: "dark", strength: 80 },
      { element: "fire", strength: -150 },
      { element: "light", strength: -100 },
    ],
    skills: [
      "skill-enemy-200",
      "skill-enemy-201",
      "skill-enemy-202",
      "skill-enemy-203",
      "skill-enemy-204",
      "skill-enemy-205",
    ],
    drops: [
      { itemId: "item-300", chance: 100, quantity: { min: 1, max: 1 } },
      { itemId: "item-301", chance: 100, quantity: { min: 5, max: 10 } },
      { itemId: "item-302", chance: 80, quantity: { min: 2, max: 4 } },
      { itemId: "item-303", chance: 50, quantity: { min: 1, max: 2 } },
      { itemId: "item-304", chance: 25, quantity: { min: 1, max: 1 } },
    ],
    exp: 10000,
    gold: 5000,
    sprite: "/images/enemies/ancient-ice-god.png",
    description: "เทพโบราณแห่งน้ำแข็งที่ถูกปิดผนึกมานานหลายพันปี",
    weaknesses: ["fire", "light"],
    resistances: ["water", "wind", "dark", "earth"],
  },
];

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get enemy by ID
 */
export function getEnemyById(id: string): Enemy | undefined {
  return ENEMIES_MASTER.find((enemy) => enemy.id === id);
}

/**
 * Get enemies by type
 */
export function getEnemiesByType(type: Enemy["type"]): Enemy[] {
  return ENEMIES_MASTER.filter((enemy) => enemy.type === type);
}

/**
 * Get enemies by level range
 */
export function getEnemiesByLevel(minLevel: number, maxLevel: number): Enemy[] {
  return ENEMIES_MASTER.filter(
    (enemy) => enemy.level >= minLevel && enemy.level <= maxLevel
  );
}

/**
 * Get boss enemies
 */
export function getBossEnemies(): Enemy[] {
  return ENEMIES_MASTER.filter(
    (enemy) => enemy.type === "boss" || enemy.type === "legendary"
  );
}
