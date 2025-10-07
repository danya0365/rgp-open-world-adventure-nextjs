import { Character } from "@/src/domain/types/character.types";

/**
 * Mock Data: Playable Characters & Companions
 */

export const mockCharacters: Character[] = [
  {
    id: "char-001",
    name: "อาเธอร์",
    class: "warrior",
    level: 1,
    exp: 0,
    maxExp: 100,
    stats: {
      hp: 500,
      maxHp: 500,
      mp: 100,
      maxMp: 100,
      atk: 80,
      def: 60,
      int: 30,
      agi: 40,
      luk: 25,
    },
    elements: ["fire"],
    elementalAffinities: [
      { element: "fire", strength: 50 },
      { element: "water", strength: -30 },
    ],
    skills: ["skill-001", "skill-002", "skill-003"],
    equipment: {
      weapon: "weapon-001",
      armor: "armor-001",
    },
    rarity: "rare",
    portrait: "/images/characters/arthur.png",
    description: "นักรบผู้กล้าหาญจากอาณาจักรซิลเวอร์โฮลด์",
    backstory:
      "อาเธอร์เป็นนักรบหนุ่มที่ได้รับการฝึกฝนมาตั้งแต่เด็ก เขามีความฝันที่จะกลายเป็นอัศวินที่ยิ่งใหญ่ที่สุดในโลก",
    isPlayable: true,
    isRecruitable: false,
  },

  {
    id: "char-002",
    name: "ลูน่า",
    class: "mage",
    level: 1,
    exp: 0,
    maxExp: 100,
    stats: {
      hp: 300,
      maxHp: 300,
      mp: 250,
      maxMp: 250,
      atk: 30,
      def: 25,
      int: 95,
      agi: 50,
      luk: 40,
    },
    elements: ["water", "light"],
    elementalAffinities: [
      { element: "water", strength: 70 },
      { element: "light", strength: 60 },
      { element: "dark", strength: -50 },
    ],
    skills: ["skill-011", "skill-012", "skill-013"],
    equipment: {
      weapon: "weapon-011",
      armor: "armor-011",
    },
    rarity: "epic",
    portrait: "/images/characters/luna.png",
    description: "นักเวทย์สาวผู้เชี่ยวชาญเวทมนตร์น้ำและแสง",
    backstory:
      "ลูน่าเป็นศิษย์เอกของหอคอยเวทมนตร์ เธอมีพรสวรรค์ทางเวทมนตร์ที่โดดเด่นและมีความฝันที่จะค้นพบเวทมนตร์โบราณที่สูญหายไป",
    isPlayable: true,
    isRecruitable: false,
  },

  {
    id: "char-003",
    name: "เรเวน",
    class: "archer",
    level: 1,
    exp: 0,
    maxExp: 100,
    stats: {
      hp: 350,
      maxHp: 350,
      mp: 120,
      maxMp: 120,
      atk: 75,
      def: 35,
      int: 45,
      agi: 90,
      luk: 55,
    },
    elements: ["wind"],
    elementalAffinities: [
      { element: "wind", strength: 80 },
      { element: "earth", strength: -20 },
    ],
    skills: ["skill-021", "skill-022", "skill-023"],
    equipment: {
      weapon: "weapon-021",
      armor: "armor-021",
    },
    rarity: "rare",
    portrait: "/images/characters/raven.png",
    description: "นักธนูเอลฟ์ผู้มีความแม่นยำสูง",
    backstory:
      "เรเวนเป็นนักธนูชั้นยอดจากป่าเอลฟ์ เขาออกเดินทางเพื่อปกป้องป่าจากภัยคุกคาม",
    isPlayable: true,
    isRecruitable: false,
  },

  {
    id: "char-004",
    name: "ไคโร",
    class: "assassin",
    level: 1,
    exp: 0,
    maxExp: 100,
    stats: {
      hp: 320,
      maxHp: 320,
      mp: 110,
      maxMp: 110,
      atk: 85,
      def: 30,
      int: 40,
      agi: 95,
      luk: 65,
    },
    elements: ["dark"],
    elementalAffinities: [
      { element: "dark", strength: 75 },
      { element: "light", strength: -60 },
    ],
    skills: ["skill-031", "skill-032", "skill-033"],
    equipment: {
      weapon: "weapon-031",
      armor: "armor-031",
    },
    rarity: "epic",
    portrait: "/images/characters/kiro.png",
    description: "นักฆ่าในเงามือที่รวดเร็วและเงียบงัน",
    backstory:
      "ไคโรเคยเป็นนักฆ่ารับจ้าง แต่ตอนนี้เขาใช้ทักษะของตนเพื่อปกป้องคนบริสุทธิ์",
    isPlayable: true,
    isRecruitable: true,
    recruitQuestId: "quest-005",
  },

  {
    id: "char-005",
    name: "เซลีน่า",
    class: "paladin",
    level: 1,
    exp: 0,
    maxExp: 100,
    stats: {
      hp: 550,
      maxHp: 550,
      mp: 150,
      maxMp: 150,
      atk: 70,
      def: 80,
      int: 50,
      agi: 35,
      luk: 45,
    },
    elements: ["light"],
    elementalAffinities: [
      { element: "light", strength: 90 },
      { element: "dark", strength: -40 },
    ],
    skills: ["skill-041", "skill-042", "skill-043"],
    equipment: {
      weapon: "weapon-041",
      armor: "armor-041",
    },
    rarity: "legendary",
    portrait: "/images/characters/selena.png",
    description: "อัศวินศักดิ์สิทธิ์ผู้ปกป้องความยุติธรรม",
    backstory:
      "เซลีน่าเป็นอัศวินศักดิ์สิทธิ์ที่ได้รับพรจากเทพเจ้าแห่งแสง เธอมุ่งมั่นที่จะกำจัดความชั่วร้ายออกจากโลก",
    isPlayable: true,
    isRecruitable: true,
    recruitQuestId: "quest-010",
  },

  {
    id: "char-006",
    name: "เอเลน",
    class: "priest",
    level: 1,
    exp: 0,
    maxExp: 100,
    stats: {
      hp: 280,
      maxHp: 280,
      mp: 300,
      maxMp: 300,
      atk: 25,
      def: 40,
      int: 85,
      agi: 45,
      luk: 60,
    },
    elements: ["light"],
    elementalAffinities: [
      { element: "light", strength: 85 },
      { element: "dark", strength: -70 },
    ],
    skills: ["skill-051", "skill-052", "skill-053"],
    equipment: {
      weapon: "weapon-051",
      armor: "armor-051",
    },
    rarity: "rare",
    portrait: "/images/characters/elena.png",
    description: "นักบวชผู้เชี่ยวชาญการรักษา",
    backstory:
      "เอเลนเป็นนักบวชจากวิหารศักดิ์สิทธิ์ เธอมีพลังการรักษาที่แข็งแกร่งและหัวใจที่เมตตา",
    isPlayable: true,
    isRecruitable: true,
    recruitQuestId: "quest-003",
  },

  {
    id: "char-007",
    name: "ไคเดน",
    class: "monk",
    level: 1,
    exp: 0,
    maxExp: 100,
    stats: {
      hp: 450,
      maxHp: 450,
      mp: 130,
      maxMp: 130,
      atk: 75,
      def: 55,
      int: 60,
      agi: 80,
      luk: 50,
    },
    elements: ["earth"],
    elementalAffinities: [
      { element: "earth", strength: 70 },
      { element: "wind", strength: -25 },
    ],
    skills: ["skill-061", "skill-062", "skill-063"],
    equipment: {
      weapon: "weapon-061",
      armor: "armor-061",
    },
    rarity: "epic",
    portrait: "/images/characters/kaiden.png",
    description: "นักสู้มือเปล่าผู้เชี่ยวชาญศิลปะการต่อสู้",
    backstory:
      "ไคเดนเป็นนักสู้จากวัดบนภูเขา เขาฝึกฝนศิลปะการต่อสู้มาตลอดชีวิต",
    isPlayable: true,
    isRecruitable: true,
    recruitQuestId: "quest-007",
  },

  {
    id: "char-008",
    name: "มอร์แกน",
    class: "necromancer",
    level: 1,
    exp: 0,
    maxExp: 100,
    stats: {
      hp: 290,
      maxHp: 290,
      mp: 280,
      maxMp: 280,
      atk: 35,
      def: 30,
      int: 100,
      agi: 40,
      luk: 35,
    },
    elements: ["dark"],
    elementalAffinities: [
      { element: "dark", strength: 95 },
      { element: "light", strength: -80 },
    ],
    skills: ["skill-071", "skill-072", "skill-073"],
    equipment: {
      weapon: "weapon-071",
      armor: "armor-071",
    },
    rarity: "legendary",
    portrait: "/images/characters/morgan.png",
    description: "นักเวทย์มืดผู้ควบคุมพลังแห่งความมืด",
    backstory:
      "มอร์แกนเป็นนักเวทย์มืดที่ถูกขับไล่จากหอคอยเวทมนตร์ แต่เขาใช้พลังของตนเพื่อความดี",
    isPlayable: true,
    isRecruitable: true,
    recruitQuestId: "quest-015",
  },
];

// Helper functions
export function getCharacterById(id: string): Character | undefined {
  return mockCharacters.find((char) => char.id === id);
}

export function getPlayableCharacters(): Character[] {
  return mockCharacters.filter((char) => char.isPlayable);
}

export function getRecruitableCharacters(): Character[] {
  return mockCharacters.filter((char) => char.isRecruitable);
}

export function getCharactersByClass(className: string): Character[] {
  return mockCharacters.filter((char) => char.class === className);
}
