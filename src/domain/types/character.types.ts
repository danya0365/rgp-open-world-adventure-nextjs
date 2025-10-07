/**
 * Character & Enemy Types for RPG System
 */

export type ElementType = "fire" | "water" | "earth" | "wind" | "light" | "dark";

export type CharacterClass =
  | "warrior"
  | "mage"
  | "archer"
  | "assassin"
  | "paladin"
  | "priest"
  | "monk"
  | "necromancer";

export type RarityType = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";

export interface Stats {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  atk: number;
  def: number;
  int: number;
  agi: number;
  luk: number;
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
