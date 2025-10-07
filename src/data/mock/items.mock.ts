import { Item, Weapon, Armor, Consumable } from "@/src/domain/types/item.types";

/**
 * Mock Data: Items, Weapons, Armor, Consumables
 */

// Weapons
export const mockWeapons: Weapon[] = [
  {
    id: "weapon-001",
    name: "ดาบเหล็กกล้า",
    type: "weapon",
    weaponType: "sword",
    rarity: "common",
    description: "ดาบเหล็กกล้าที่ใช้งานได้ดี",
    icon: "/images/items/iron-sword.png",
    stackable: false,
    buyPrice: 100,
    sellPrice: 25,
    atk: 25,
    requiredLevel: 1,
  },

  {
    id: "weapon-011",
    name: "ไม้เท้าคริสตัล",
    type: "weapon",
    weaponType: "staff",
    rarity: "rare",
    description: "ไม้เท้าที่ฝังด้วยคริสตัลเวทมนตร์",
    icon: "/images/items/crystal-staff.png",
    stackable: false,
    buyPrice: 500,
    sellPrice: 125,
    atk: 15,
    element: "water",
    statBonus: {
      int: 30,
      mp: 50,
    },
    requiredLevel: 5,
    requiredClass: ["mage"],
  },

  {
    id: "weapon-021",
    name: "ธนูเอลฟ์",
    type: "weapon",
    weaponType: "bow",
    rarity: "rare",
    description: "ธนูที่ทำจากไม้ศักดิ์สิทธิ์ของเอลฟ์",
    icon: "/images/items/elven-bow.png",
    stackable: false,
    buyPrice: 450,
    sellPrice: 110,
    atk: 35,
    critRate: 15,
    range: 5,
    element: "wind",
    requiredLevel: 5,
    requiredClass: ["archer"],
  },

  {
    id: "weapon-200",
    name: "เอ็กซ์คาลิเบอร์",
    type: "weapon",
    weaponType: "sword",
    rarity: "legendary",
    description: "ดาบในตำนานที่มีพลังอันยิ่งใหญ่",
    icon: "/images/items/excalibur.png",
    stackable: false,
    buyPrice: 50000,
    sellPrice: 12500,
    atk: 200,
    critRate: 25,
    critDamage: 50,
    element: "light",
    statBonus: {
      atk: 50,
      def: 30,
      hp: 200,
    },
    requiredLevel: 40,
  },
];

// Armor
export const mockArmor: Armor[] = [
  {
    id: "armor-001",
    name: "เกราะหนัง",
    type: "armor",
    armorType: "light",
    rarity: "common",
    description: "เกราะหนังที่ให้การป้องกันพื้นฐาน",
    icon: "/images/items/leather-armor.png",
    stackable: false,
    buyPrice: 80,
    sellPrice: 20,
    def: 15,
    requiredLevel: 1,
  },

  {
    id: "armor-011",
    name: "เสื้อคลุมเวทมนตร์",
    type: "armor",
    armorType: "robe",
    rarity: "rare",
    description: "เสื้อคลุมที่เพิ่มพลังเวทมนตร์",
    icon: "/images/items/magic-robe.png",
    stackable: false,
    buyPrice: 400,
    sellPrice: 100,
    def: 20,
    statBonus: {
      int: 25,
      mp: 80,
    },
    elementalResistance: [
      { element: "fire", value: 20 },
      { element: "water", value: 20 },
    ],
    requiredLevel: 5,
    requiredClass: ["mage", "priest"],
  },

  {
    id: "armor-100",
    name: "เกราะมังกร",
    type: "armor",
    armorType: "heavy",
    rarity: "legendary",
    description: "เกราะที่ทำจากเกล็ดมังกร",
    icon: "/images/items/dragon-armor.png",
    stackable: false,
    buyPrice: 45000,
    sellPrice: 11250,
    def: 150,
    statBonus: {
      hp: 300,
      def: 50,
    },
    elementalResistance: [
      { element: "fire", value: 50 },
      { element: "water", value: 30 },
      { element: "wind", value: 30 },
    ],
    requiredLevel: 35,
  },
];

// Consumables
export const mockConsumables: Consumable[] = [
  {
    id: "item-001",
    name: "ยาฟื้นฟู HP เล็ก",
    type: "consumable",
    rarity: "common",
    description: "ฟื้นฟู HP 100 หน่วย",
    icon: "/images/items/hp-potion-small.png",
    stackable: true,
    maxStack: 99,
    buyPrice: 50,
    sellPrice: 10,
    effects: [
      {
        type: "heal",
        value: 100,
        target: "self",
      },
    ],
  },

  {
    id: "item-002",
    name: "ยาฟื้นฟู MP เล็ก",
    type: "consumable",
    rarity: "common",
    description: "ฟื้นฟู MP 50 หน่วย",
    icon: "/images/items/mp-potion-small.png",
    stackable: true,
    maxStack: 99,
    buyPrice: 40,
    sellPrice: 8,
    effects: [
      {
        type: "restore",
        value: 50,
        target: "self",
      },
    ],
  },

  {
    id: "item-010",
    name: "ยาฟื้นฟู HP กลาง",
    type: "consumable",
    rarity: "uncommon",
    description: "ฟื้นฟู HP 300 หน่วย",
    icon: "/images/items/hp-potion-medium.png",
    stackable: true,
    maxStack: 99,
    buyPrice: 150,
    sellPrice: 30,
    effects: [
      {
        type: "heal",
        value: 300,
        target: "self",
      },
    ],
  },

  {
    id: "item-020",
    name: "ยาเพิ่มพลังโจมตี",
    type: "consumable",
    rarity: "rare",
    description: "เพิ่ม ATK 30% เป็นเวลา 3 เทิร์น",
    icon: "/images/items/atk-buff.png",
    stackable: true,
    maxStack: 50,
    buyPrice: 300,
    sellPrice: 60,
    effects: [
      {
        type: "buff",
        value: 30,
        target: "self",
        duration: 3,
      },
    ],
  },

  {
    id: "item-100",
    name: "อีลิกเซอร์",
    type: "consumable",
    rarity: "legendary",
    description: "ฟื้นฟู HP และ MP เต็ม",
    icon: "/images/items/elixir.png",
    stackable: true,
    maxStack: 10,
    buyPrice: 5000,
    sellPrice: 1000,
    effects: [
      {
        type: "heal",
        value: 9999,
        target: "self",
      },
      {
        type: "restore",
        value: 9999,
        target: "self",
      },
    ],
  },
];

// Materials
export const mockMaterials: Item[] = [
  {
    id: "mat-001",
    name: "เศษคริสตัลน้ำแข็ง",
    type: "material",
    rarity: "common",
    description: "เศษคริสตัลที่ได้จากมอนสเตอร์น้ำแข็ง",
    icon: "/images/items/ice-crystal-shard.png",
    stackable: true,
    maxStack: 999,
    buyPrice: 20,
    sellPrice: 5,
  },

  {
    id: "mat-010",
    name: "เกล็ดมังกร",
    type: "material",
    rarity: "legendary",
    description: "เกล็ดที่ได้จากมังกร ใช้สำหรับคราฟอุปกรณ์ระดับสูง",
    icon: "/images/items/dragon-scale.png",
    stackable: true,
    maxStack: 99,
    buyPrice: 10000,
    sellPrice: 2500,
  },
];

// Key Items
export const mockKeyItems: Item[] = [
  {
    id: "key-001",
    name: "กุญแจคริสตัล",
    type: "key",
    rarity: "rare",
    description: "กุญแจที่ใช้เปิดดันเจี้ยนน้ำแข็งลึก",
    icon: "/images/items/crystal-key.png",
    stackable: false,
    buyPrice: 0,
    sellPrice: 0,
  },
];

// Combine all items
export const mockItems: Item[] = [
  ...mockWeapons,
  ...mockArmor,
  ...mockConsumables,
  ...mockMaterials,
  ...mockKeyItems,
];

// Helper functions
export function getItemById(id: string): Item | undefined {
  return mockItems.find((item) => item.id === id);
}

export function getItemsByType(type: Item["type"]): Item[] {
  return mockItems.filter((item) => item.type === type);
}

export function getItemsByRarity(rarity: Item["rarity"]): Item[] {
  return mockItems.filter((item) => item.rarity === rarity);
}

export function getWeapons(): Weapon[] {
  return mockWeapons;
}

export function getArmor(): Armor[] {
  return mockArmor;
}

export function getConsumables(): Consumable[] {
  return mockConsumables;
}
