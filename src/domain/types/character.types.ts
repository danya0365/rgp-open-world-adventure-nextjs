/**
 * Character & Enemy Types for RPG System
 */

export type ElementType =
  | "fire"
  | "water"
  | "earth"
  | "wind"
  | "light"
  | "dark"
  | "ice"
  | "poison";

export type CharacterClass =
  | "warrior"
  | "mage"
  | "archer"
  | "assassin"
  | "paladin"
  | "priest"
  | "monk"
  | "necromancer";

export type RarityType =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic";

/**
 * Stats based on Dragon Quest Tact system
 */
export interface Stats {
  // Core Stats
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;

  // Combat Stats
  atk: number; // Attack (physical damage)
  def: number; // Defence (physical resistance)

  // Magic Stats
  wis: number; // Wisdom (magical damage & healing power)

  // Speed & Movement
  agi: number; // Agility (determines turn order & evasion)
  mov: number; // Movement range on grid (typically 2-4)
}

export interface ElementalAffinity {
  element: ElementType;
  strength: number; // -100 to 100 (negative = weakness, positive = resistance)
}

export interface Character {
  id: string;
  name: string;
  class: CharacterClass;
  level: number;
  exp: number;
  maxExp: number;
  stats: Stats;
  elements: ElementType[];
  elementalAffinities: ElementalAffinity[];
  skills: string[]; // Skill IDs
  equipment: {
    weapon?: string;
    armor?: string;
    accessory1?: string;
    accessory2?: string;
  };
  rarity: RarityType;
  portrait: string;
  description: string;
  backstory?: string;
  isPlayable: boolean;
  isRecruitable: boolean;
  recruitQuestId?: string;
}

export interface Enemy {
  id: string;
  name: string;
  type: "normal" | "elite" | "boss" | "legendary";
  level: number;
  stats: Stats;
  elements: ElementType[];
  elementalAffinities: ElementalAffinity[];
  skills: string[]; // Skill IDs
  drops: ItemDrop[];
  exp: number;
  gold: number;
  sprite: string;
  description: string;
  weaknesses?: ElementType[];
  resistances?: ElementType[];
}

export interface ItemDrop {
  itemId: string;
  chance: number; // 0-100
  quantity: {
    min: number;
    max: number;
  };
}
