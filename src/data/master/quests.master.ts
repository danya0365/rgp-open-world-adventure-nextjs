import { Quest } from "@/src/domain/types/quest.types";

/**
 * Master Data: Quests (Main, Side, Events)
 * Core quest data for the game
 */

export const QUESTS_MASTER: Quest[] = [
  // Main Quests
  {
    id: "quest-001",
    name: "การเริ่มต้นของนักผจญภัย",
    type: "main",
    description: "เข้าร่วมสมาคมนักผจญภัยและเริ่มต้นการผจญภัย",
    story:
      "คุณได้มาถึงเมืองซิลเวอร์โฮลด์ เพื่อเริ่มต้นชีวิตใหม่ในฐานะนักผจญภัย ก้าวแรกคือการเข้าร่วมสมาคมนักผจญภัย",
    requiredLevel: 1,
    locationId: "city-silverhold",
    npcId: "npc-guild-master",
    objectives: [
      {
        id: "obj-001-1",
        description: "พบกับหัวหน้าสมาคม",
        type: "talk",
        targetId: "npc-guild-master",
        current: 0,
        required: 1,
        isCompleted: false,
      },
      {
        id: "obj-001-2",
        description: "ฆ่าสไลม์น้ำแข็ง 5 ตัว",
        type: "kill",
        targetId: "enemy-001",
        current: 0,
        required: 5,
        isCompleted: false,
      },
    ],
    rewards: {
      exp: 100,
      gold: 50,
      items: [
        { itemId: "item-001", quantity: 5 },
        { itemId: "weapon-001", quantity: 1 },
      ],
    },
    isRepeatable: false,
    status: "available",
  },

  {
    id: "quest-002",
    name: "ภัยคุกคามจากหมาป่า",
    type: "main",
    description: "กำจัดหมาป่าน้ำแข็งที่คุกคามหมู่บ้าน",
    story:
      "หมาป่าน้ำแข็งได้โจมตีหมู่บ้านใกล้เคียง ชาวบ้านต้องการความช่วยเหลือจากนักผจญภัย",
    requiredLevel: 5,
    requiredQuestId: "quest-001",
    locationId: "area-crystal-valley",
    npcId: "npc-village-chief",
    objectives: [
      {
        id: "obj-002-1",
        description: "ฆ่าหมาป่าน้ำแข็ง 10 ตัว",
        type: "kill",
        targetId: "enemy-002",
        current: 0,
        required: 10,
        isCompleted: false,
      },
      {
        id: "obj-002-2",
        description: "รายงานผลกับหัวหน้าหมู่บ้าน",
        type: "talk",
        targetId: "npc-village-chief",
        current: 0,
        required: 1,
        isCompleted: false,
      },
    ],
    rewards: {
      exp: 300,
      gold: 150,
      items: [
        { itemId: "item-010", quantity: 3 },
        { itemId: "armor-001", quantity: 1 },
      ],
    },
    isRepeatable: false,
    status: "locked",
  },

  {
    id: "quest-003",
    name: "ค้นหานักบวชที่หายไป",
    type: "main",
    description: "ค้นหาเอเลนนักบวชที่หายไปในป่า",
    story:
      "เอเลนนักบวชจากวิหารได้หายตัวไปในป่าเอลฟ์ ต้องไปค้นหาและช่วยเหลือเธอ",
    requiredLevel: 8,
    requiredQuestId: "quest-002",
    locationId: "region-elven-forest",
    npcId: "npc-priest",
    objectives: [
      {
        id: "obj-003-1",
        description: "สำรวจป่าเอลฟ์",
        type: "explore",
        targetId: "region-elven-forest",
        current: 0,
        required: 1,
        isCompleted: false,
      },
      {
        id: "obj-003-2",
        description: "ช่วยเหลือเอเลน",
        type: "escort",
        targetId: "char-006",
        current: 0,
        required: 1,
        isCompleted: false,
      },
    ],
    rewards: {
      exp: 500,
      gold: 200,
      unlockCharacterId: "char-006",
    },
    isRepeatable: false,
    status: "locked",
  },

  {
    id: "quest-010",
    name: "ดาบศักดิ์สิทธิ์",
    type: "main",
    description: "ค้นหาดาบศักดิ์สิทธิ์ในวิหารโบราณ",
    story:
      "ตำนานกล่าวถึงดาบศักดิ์สิทธิ์ที่ถูกซ่อนไว้ในวิหารโบราณ เซลีน่าอัศวินศักดิ์สิทธิ์ต้องการความช่วยเหลือในการค้นหา",
    requiredLevel: 20,
    requiredQuestId: "quest-003",
    locationId: "building-ancient-temple",
    npcId: "npc-elder",
    objectives: [
      {
        id: "obj-010-1",
        description: "เข้าสู่วิหารโบราณ",
        type: "explore",
        targetId: "building-ancient-temple",
        current: 0,
        required: 1,
        isCompleted: false,
      },
      {
        id: "obj-010-2",
        description: "เอาชนะผู้พิทักษ์วิหาร",
        type: "kill",
        targetId: "enemy-boss-temple",
        current: 0,
        required: 1,
        isCompleted: false,
      },
      {
        id: "obj-010-3",
        description: "รับดาบศักดิ์สิทธิ์",
        type: "collect",
        targetId: "weapon-200",
        current: 0,
        required: 1,
        isCompleted: false,
      },
    ],
    rewards: {
      exp: 2000,
      gold: 1000,
      items: [{ itemId: "weapon-200", quantity: 1 }],
      unlockCharacterId: "char-005",
    },
    isRepeatable: false,
    status: "locked",
  },

  // Side Quests
  {
    id: "quest-005",
    name: "นักฆ่าในเงามือ",
    type: "side",
    description: "พบกับไคโรนักฆ่าและช่วยเหลือเขา",
    story:
      "ไคโรนักฆ่าในเงามือกำลังถูกไล่ล่า คุณต้องช่วยเหลือเขาและเขาจะเข้าร่วมทีม",
    requiredLevel: 12,
    locationId: "city-silverhold",
    npcId: "npc-informant",
    objectives: [
      {
        id: "obj-005-1",
        description: "พบกับไคโร",
        type: "talk",
        targetId: "char-004",
        current: 0,
        required: 1,
        isCompleted: false,
      },
      {
        id: "obj-005-2",
        description: "ปกป้องไคโรจากนักฆ่า",
        type: "defend",
        targetId: "char-004",
        current: 0,
        required: 1,
        isCompleted: false,
      },
    ],
    rewards: {
      exp: 800,
      gold: 400,
      unlockCharacterId: "char-004",
    },
    isRepeatable: false,
    status: "available",
  },

  {
    id: "quest-007",
    name: "ศิษย์วัดบนภูเขา",
    type: "side",
    description: "ไปพบไคเดนนักสู้ที่วัดบนภูเขา",
    story: "ไคเดนนักสู้มือเปล่ากำลังฝึกฝนที่วัดบนภูเขา ไปพบเขาและท้าทายเขา",
    requiredLevel: 15,
    locationId: "location-mountain-temple",
    npcId: "npc-monk-master",
    objectives: [
      {
        id: "obj-007-1",
        description: "ไปถึงวัดบนภูเขา",
        type: "explore",
        targetId: "location-mountain-temple",
        current: 0,
        required: 1,
        isCompleted: false,
      },
      {
        id: "obj-007-2",
        description: "ท้าทายไคเดน",
        type: "kill",
        targetId: "char-007",
        current: 0,
        required: 1,
        isCompleted: false,
      },
    ],
    rewards: {
      exp: 1200,
      gold: 600,
      unlockCharacterId: "char-007",
    },
    isRepeatable: false,
    status: "available",
  },

  {
    id: "quest-015",
    name: "นักเวทย์มืดผู้ถูกขับไล่",
    type: "side",
    description: "ค้นหามอร์แกนนักเวทย์มืดและช่วยเหลือเขา",
    story:
      "มอร์แกนนักเวทย์มืดถูกขับไล่จากหอคอยเวทมนตร์ เขาต้องการความช่วยเหลือเพื่อพิสูจน์ตัวเอง",
    requiredLevel: 25,
    locationId: "location-dark-forest",
    npcId: "npc-dark-mage",
    objectives: [
      {
        id: "obj-015-1",
        description: "พบกับมอร์แกน",
        type: "talk",
        targetId: "char-008",
        current: 0,
        required: 1,
        isCompleted: false,
      },
      {
        id: "obj-015-2",
        description: "เก็บหนังสือเวทมนตร์โบราณ 3 เล่ม",
        type: "collect",
        targetId: "item-ancient-tome",
        current: 0,
        required: 3,
        isCompleted: false,
      },
    ],
    rewards: {
      exp: 2500,
      gold: 1200,
      unlockCharacterId: "char-008",
    },
    isRepeatable: false,
    status: "available",
  },

  // Event Quests
  {
    id: "quest-event-001",
    name: "เทศกาลคริสตัลน้ำแข็ง",
    type: "event",
    description: "เข้าร่วมเทศกาลคริสตัลน้ำแข็งประจำปี",
    story: "เทศกาลคริสตัลน้ำแข็งกำลังจะเริ่มขึ้น มีกิจกรรมและรางวัลมากมาย",
    requiredLevel: 10,
    locationId: "city-silverhold",
    npcId: "npc-event-coordinator",
    objectives: [
      {
        id: "obj-event-001-1",
        description: "เก็บคริสตัลน้ำแข็ง 20 ชิ้น",
        type: "collect",
        targetId: "mat-001",
        current: 0,
        required: 20,
        isCompleted: false,
      },
    ],
    rewards: {
      exp: 500,
      gold: 300,
      items: [
        { itemId: "item-event-001", quantity: 1 },
        { itemId: "item-100", quantity: 2 },
      ],
    },
    timeLimit: 1440,
    isRepeatable: true,
    status: "available",
  },

  // Daily Quests
  {
    id: "quest-daily-001",
    name: "ล่ามอนสเตอร์ประจำวัน",
    type: "daily",
    description: "ฆ่ามอนสเตอร์ 10 ตัว",
    requiredLevel: 5,
    locationId: "city-silverhold",
    npcId: "npc-quest-board",
    objectives: [
      {
        id: "obj-daily-001-1",
        description: "ฆ่ามอนสเตอร์ 10 ตัว",
        type: "kill",
        current: 0,
        required: 10,
        isCompleted: false,
      },
    ],
    rewards: {
      exp: 200,
      gold: 100,
      items: [{ itemId: "item-001", quantity: 3 }],
    },
    isRepeatable: true,
    status: "available",
  },

  // Bounty Quests
  {
    id: "quest-bounty-001",
    name: "ล่ายักษ์น้ำแข็ง",
    type: "bounty",
    description: "ฆ่ายักษ์น้ำแข็งที่คุกคามเมือง",
    requiredLevel: 15,
    locationId: "area-crystal-valley",
    npcId: "npc-bounty-board",
    objectives: [
      {
        id: "obj-bounty-001-1",
        description: "ฆ่ายักษ์น้ำแข็ง",
        type: "kill",
        targetId: "enemy-011",
        current: 0,
        required: 1,
        isCompleted: false,
      },
    ],
    rewards: {
      exp: 1000,
      gold: 800,
      items: [
        { itemId: "item-100", quantity: 1 },
        { itemId: "item-101", quantity: 2 },
      ],
    },
    isRepeatable: true,
    status: "available",
  },
];

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get quest by ID
 */
export function getQuestById(id: string): Quest | undefined {
  return QUESTS_MASTER.find((quest) => quest.id === id);
}

/**
 * Get quests by type
 */
export function getQuestsByType(type: Quest["type"]): Quest[] {
  return QUESTS_MASTER.filter((quest) => quest.type === type);
}

/**
 * Get quests by status
 */
export function getQuestsByStatus(status: Quest["status"]): Quest[] {
  return QUESTS_MASTER.filter((quest) => quest.status === status);
}

/**
 * Get available quests for player level
 */
export function getAvailableQuests(playerLevel: number): Quest[] {
  return QUESTS_MASTER.filter(
    (quest) =>
      quest.requiredLevel <= playerLevel &&
      (quest.status === "available" || quest.status === "locked")
  );
}

/**
 * Get main quests
 */
export function getMainQuests(): Quest[] {
  return QUESTS_MASTER.filter((quest) => quest.type === "main");
}

/**
 * Get side quests
 */
export function getSideQuests(): Quest[] {
  return QUESTS_MASTER.filter((quest) => quest.type === "side");
}
