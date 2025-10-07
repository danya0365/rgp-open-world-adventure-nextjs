/**
 * Item & Equipment Types
 */

import { ElementType, RarityType } from "./character.types";

export type ItemType =
  | "weapon"
  | "armor"
  | "accessory"
  | "consumable"
  | "material"
  | "key"
  | "quest";

export type WeaponType = "sword" | "bow" | "staff" | "dagger" | "axe" | "spear" | "wand";

export type ArmorType = "heavy" | "light" | "robe" | "shield";

export interface ItemEffect {
  type: "heal" | "damage" | "buff" | "debuff" | "restore";
  value: number;
  target: "self" | "ally" | "enemy" | "all-allies" | "all-enemies";
  duration?: number; // turns
}

/**
 * Stat Bonus based on Dragon Quest Tact system
 */
export interface StatBonus {
  hp?: number;
  mp?: number;
  atk?: number;
  def?: number;
  wis?: number;  // Wisdom (magical damage & healing)
  agi?: number;
  mov?: number;  // Movement range
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: RarityType;
  description: string;
  icon: string;
  stackable: boolean;
  maxStack?: number;
  buyPrice: number;
  sellPrice: number;
  effects?: ItemEffect[];
  statBonus?: StatBonus;
  element?: ElementType;
  requiredLevel?: number;
  requiredClass?: string[];
}

export interface Weapon extends Item {
  type: "weapon";
  weaponType: WeaponType;
  atk: number;
  critRate?: number;
  critDamage?: number;
  range?: number;
}

export interface Armor extends Item {
  type: "armor";
  armorType: ArmorType;
  def: number;
  elementalResistance?: {
    element: ElementType;
    value: number;
  }[];
}

export interface Consumable extends Item {
  type: "consumable";
  effects: ItemEffect[];
  cooldown?: number;
}
