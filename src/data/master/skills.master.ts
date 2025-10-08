import { Skill, ComboSkill } from "@/src/domain/types/skill.types";

/**
 * Master Data: Skills & Abilities
 * Core skill data for the game
 */

export const SKILLS_MASTER: Skill[] = [
  // Warrior Skills
  {
    id: "skill-001",
    name: "ฟันแนวนอน",
    type: "attack",
    element: "fire",
    description: "โจมตีศัตรูด้วยการฟันแนวนอน สร้างความเสียหาย 150% ATK",
    icon: "/images/skills/slash.png",
    mpCost: 10,
    cooldown: 0,
    targetType: "single-enemy",
    range: { min: 1, max: 1 },
    effects: [
      {
        type: "damage",
        value: 150,
        scaling: "atk",
      },
    ],
    animation: "slash-horizontal",
    requiredLevel: 1,
  },

  {
    id: "skill-002",
    name: "โล่ป้องกัน",
    type: "support",
    description: "เพิ่ม DEF 50% เป็นเวลา 3 เทิร์น",
    icon: "/images/skills/shield-guard.png",
    mpCost: 15,
    cooldown: 3,
    targetType: "self",
    range: { min: 0, max: 0 },
    effects: [
      {
        type: "buff",
        value: 50,
        duration: 3,
      },
    ],
    requiredLevel: 3,
  },

  {
    id: "skill-003",
    name: "พายุดาบ",
    type: "ultimate",
    element: "fire",
    description: "โจมตีศัตรูทุกตัวในพื้นที่ สร้างความเสียหาย 300% ATK",
    icon: "/images/skills/sword-storm.png",
    mpCost: 50,
    cooldown: 5,
    targetType: "area",
    range: { min: 1, max: 2, shape: "circle", size: 2 },
    effects: [
      {
        type: "damage",
        value: 300,
        scaling: "atk",
      },
    ],
    animation: "sword-storm",
    requiredLevel: 10,
    learnCost: 5,
  },

  // Mage Skills
  {
    id: "skill-011",
    name: "ลูกบอลน้ำ",
    type: "magic",
    element: "water",
    description: "ยิงลูกบอลน้ำใส่ศัตรู สร้างความเสียหาย 180% INT",
    icon: "/images/skills/water-ball.png",
    mpCost: 20,
    cooldown: 0,
    targetType: "single-enemy",
    range: { min: 2, max: 4 },
    effects: [
      {
        type: "damage",
        value: 180,
        scaling: "int",
      },
    ],
    animation: "water-ball",
    requiredLevel: 1,
  },

  {
    id: "skill-012",
    name: "แสงรักษา",
    type: "magic",
    element: "light",
    description: "รักษา HP ของพันธมิตร 200% INT",
    icon: "/images/skills/healing-light.png",
    mpCost: 25,
    cooldown: 1,
    targetType: "single-ally",
    range: { min: 1, max: 3 },
    effects: [
      {
        type: "heal",
        value: 200,
        scaling: "int",
      },
    ],
    animation: "healing-light",
    requiredLevel: 3,
  },

  {
    id: "skill-013",
    name: "พายุน้ำแข็ง",
    type: "ultimate",
    element: "water",
    description: "เรียกพายุน้ำแข็งโจมตีศัตรูทั้งหมด สร้างความเสียหาย 400% INT",
    icon: "/images/skills/blizzard.png",
    mpCost: 80,
    cooldown: 6,
    targetType: "all-enemies",
    range: { min: 1, max: 5 },
    effects: [
      {
        type: "damage",
        value: 400,
        scaling: "int",
      },
      {
        type: "status",
        value: 0,
        duration: 2,
        statusEffect: {
          id: "freeze",
          name: "แช่แข็ง",
          type: "freeze",
          duration: 2,
        },
      },
    ],
    animation: "blizzard",
    requiredLevel: 15,
    learnCost: 8,
  },

  // Archer Skills
  {
    id: "skill-021",
    name: "ยิงธนูแม่นยำ",
    type: "attack",
    element: "wind",
    description: "ยิงธนูแม่นยำ สร้างความเสียหาย 160% ATK + โอกาส Critical 30%",
    icon: "/images/skills/precise-shot.png",
    mpCost: 12,
    cooldown: 0,
    targetType: "single-enemy",
    range: { min: 3, max: 6 },
    effects: [
      {
        type: "damage",
        value: 160,
        scaling: "atk",
      },
    ],
    animation: "precise-shot",
    requiredLevel: 1,
  },

  {
    id: "skill-022",
    name: "ฝนลูกศร",
    type: "attack",
    element: "wind",
    description: "ยิงลูกศรหลายดอกในพื้นที่ สร้างความเสียหาย 200% ATK",
    icon: "/images/skills/arrow-rain.png",
    mpCost: 30,
    cooldown: 2,
    targetType: "area",
    range: { min: 3, max: 5, shape: "circle", size: 2 },
    effects: [
      {
        type: "damage",
        value: 200,
        scaling: "atk",
      },
    ],
    animation: "arrow-rain",
    requiredLevel: 5,
  },

  {
    id: "skill-023",
    name: "ลูกศรทะลุ",
    type: "ultimate",
    element: "wind",
    description: "ยิงลูกศรทะลุเป็นแนวตรง สร้างความเสียหาย 350% ATK",
    icon: "/images/skills/piercing-arrow.png",
    mpCost: 45,
    cooldown: 4,
    targetType: "area",
    range: { min: 1, max: 6, shape: "line", size: 6 },
    effects: [
      {
        type: "damage",
        value: 350,
        scaling: "atk",
      },
    ],
    animation: "piercing-arrow",
    requiredLevel: 12,
    learnCost: 6,
  },

  // Assassin Skills
  {
    id: "skill-031",
    name: "แทงลับหลัง",
    type: "attack",
    element: "dark",
    description: "แทงศัตรูจากด้านหลัง สร้างความเสียหาย 200% ATK (300% ถ้าอยู่ด้านหลัง)",
    icon: "/images/skills/backstab.png",
    mpCost: 15,
    cooldown: 1,
    targetType: "single-enemy",
    range: { min: 1, max: 1 },
    effects: [
      {
        type: "damage",
        value: 200,
        scaling: "atk",
      },
    ],
    animation: "backstab",
    requiredLevel: 1,
  },

  {
    id: "skill-032",
    name: "หายตัว",
    type: "support",
    element: "dark",
    description: "หายตัวเป็นเวลา 2 เทิร์น เพิ่ม AGI 100%",
    icon: "/images/skills/vanish.png",
    mpCost: 20,
    cooldown: 4,
    targetType: "self",
    range: { min: 0, max: 0 },
    effects: [
      {
        type: "buff",
        value: 100,
        duration: 2,
      },
    ],
    animation: "vanish",
    requiredLevel: 5,
  },

  {
    id: "skill-033",
    name: "ฆาตกรรมเงียบงัน",
    type: "ultimate",
    element: "dark",
    description: "โจมตีศัตรูด้วยความเร็วสูง สร้างความเสียหาย 500% ATK",
    icon: "/images/skills/silent-kill.png",
    mpCost: 60,
    cooldown: 5,
    targetType: "single-enemy",
    range: { min: 1, max: 2 },
    effects: [
      {
        type: "damage",
        value: 500,
        scaling: "atk",
      },
    ],
    animation: "silent-kill",
    requiredLevel: 18,
    learnCost: 10,
  },

  // Paladin Skills
  {
    id: "skill-041",
    name: "ค้อนศักดิ์สิทธิ์",
    type: "attack",
    element: "light",
    description: "โจมตีด้วยค้อนศักดิ์สิทธิ์ สร้างความเสียหาย 170% ATK",
    icon: "/images/skills/holy-hammer.png",
    mpCost: 18,
    cooldown: 0,
    targetType: "single-enemy",
    range: { min: 1, max: 1 },
    effects: [
      {
        type: "damage",
        value: 170,
        scaling: "atk",
      },
    ],
    animation: "holy-hammer",
    requiredLevel: 1,
  },

  {
    id: "skill-042",
    name: "โล่แห่งแสง",
    type: "support",
    element: "light",
    description: "สร้างโล่ป้องกันให้พันธมิตรทั้งหมด ลด damage 30% เป็นเวลา 3 เทิร์น",
    icon: "/images/skills/light-shield.png",
    mpCost: 35,
    cooldown: 4,
    targetType: "all-allies",
    range: { min: 0, max: 3 },
    effects: [
      {
        type: "buff",
        value: 30,
        duration: 3,
      },
    ],
    animation: "light-shield",
    requiredLevel: 8,
  },

  {
    id: "skill-043",
    name: "พิพากษาศักดิ์สิทธิ์",
    type: "ultimate",
    element: "light",
    description: "เรียกแสงศักดิ์สิทธิ์ลงมาพิพากษาศัตรู สร้างความเสียหาย 450% ATK",
    icon: "/images/skills/divine-judgment.png",
    mpCost: 70,
    cooldown: 6,
    targetType: "area",
    range: { min: 1, max: 3, shape: "circle", size: 2 },
    effects: [
      {
        type: "damage",
        value: 450,
        scaling: "atk",
      },
    ],
    animation: "divine-judgment",
    requiredLevel: 20,
    learnCost: 12,
  },

  // Priest Skills
  {
    id: "skill-051",
    name: "รักษาพื้นฐาน",
    type: "magic",
    element: "light",
    description: "รักษา HP ของพันธมิตร 150% INT",
    icon: "/images/skills/basic-heal.png",
    mpCost: 15,
    cooldown: 0,
    targetType: "single-ally",
    range: { min: 1, max: 4 },
    effects: [
      {
        type: "heal",
        value: 150,
        scaling: "int",
      },
    ],
    animation: "basic-heal",
    requiredLevel: 1,
  },

  {
    id: "skill-052",
    name: "รักษาหมู่",
    type: "magic",
    element: "light",
    description: "รักษา HP ของพันธมิตรทั้งหมด 120% INT",
    icon: "/images/skills/group-heal.png",
    mpCost: 40,
    cooldown: 2,
    targetType: "all-allies",
    range: { min: 0, max: 5 },
    effects: [
      {
        type: "heal",
        value: 120,
        scaling: "int",
      },
    ],
    animation: "group-heal",
    requiredLevel: 6,
  },

  {
    id: "skill-053",
    name: "ฟื้นคืนชีพ",
    type: "ultimate",
    element: "light",
    description: "ฟื้นคืนชีพพันธมิตรที่ล้มลง HP 50%",
    icon: "/images/skills/resurrection.png",
    mpCost: 100,
    cooldown: 8,
    targetType: "single-ally",
    range: { min: 1, max: 3 },
    effects: [
      {
        type: "heal",
        value: 50,
        scaling: "hp",
      },
    ],
    animation: "resurrection",
    requiredLevel: 25,
    learnCost: 15,
  },
];

// Combo Skills
export const COMBO_SKILLS_MASTER: ComboSkill[] = [
  {
    id: "combo-001",
    name: "คอมโบนักรบ-นักเวทย์",
    requiredSkills: ["skill-001", "skill-011"],
    bonusEffect: {
      type: "damage",
      value: 50,
      scaling: "atk",
    },
  },

  {
    id: "combo-002",
    name: "คอมโบนักธนู-นักฆ่า",
    requiredSkills: ["skill-021", "skill-031"],
    bonusEffect: {
      type: "damage",
      value: 100,
      scaling: "atk",
    },
  },
];
