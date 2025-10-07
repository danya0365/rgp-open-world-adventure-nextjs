/**
 * Skill & Ability Types
 */

import { ElementType } from "./character.types";

export type SkillType = "attack" | "magic" | "support" | "ultimate" | "passive";

export type TargetType =
  | "single-enemy"
  | "single-ally"
  | "self"
  | "all-enemies"
  | "all-allies"
  | "area";

export type AOEShape = "line" | "cone" | "circle" | "cross";

export interface SkillEffect {
  type: "damage" | "heal" | "buff" | "debuff" | "status";
  value: number;
  scaling?: "atk" | "int" | "def" | "hp";
  duration?: number; // turns
  statusEffect?: StatusEffect;
}

export interface StatusEffect {
  id: string;
  name: string;
  type: "poison" | "burn" | "freeze" | "stun" | "sleep" | "blind" | "silence";
  duration: number;
  damagePerTurn?: number;
}

export interface SkillRange {
  min: number;
  max: number;
  shape?: AOEShape;
  size?: number; // for AOE
}

export interface Skill {
  id: string;
  name: string;
  type: SkillType;
  element?: ElementType;
  description: string;
  icon: string;
  mpCost: number;
  cooldown: number;
  targetType: TargetType;
  range: SkillRange;
  effects: SkillEffect[];
  animation?: string;
  requiredLevel?: number;
  learnCost?: number; // skill points
}

export interface ComboSkill {
  id: string;
  name: string;
  requiredSkills: string[]; // Skill IDs that must be used in sequence
  bonusEffect: SkillEffect;
}
