import type { RarityType } from "@/src/domain/types/character.types";

export type LootBoxType = "standard" | "guaranteed" | "stepup";

export type LootBoxCostType = "gold" | "ticket" | "premium" | "item";

type QuantityRange = {
  min: number;
  max: number;
};

export interface LootBoxCost {
  type: LootBoxCostType;
  amount: number;
  ticketId?: string;
  itemId?: string;
}

export interface LootBoxRewardEntry {
  itemId: string;
  weight: number;
  quantity?: QuantityRange;
  rarity?: RarityType;
  featured?: boolean;
}

export interface LootBoxGuaranteedRule {
  guaranteeType: "rarity" | "item";
  triggerAtOpenCount: number;
  rarity?: RarityType;
  itemIds?: string[];
}

export interface LootBoxStepConfig {
  step: number;
  cost: LootBoxCost;
  guaranteedRules?: LootBoxGuaranteedRule[];
  bonusRewards?: LootBoxRewardEntry[];
  pityIncrement?: number;
}

export interface LootBoxPityConfig {
  counterId: string;
  guaranteeAt: number;
  resetOnHit?: boolean;
}

export interface LootBoxDefinition {
  id: string;
  name: string;
  description: string;
  type: LootBoxType;
  costOptions: LootBoxCost[];
  rewardTable: LootBoxRewardEntry[];
  guaranteedRules?: LootBoxGuaranteedRule[];
  stepConfigs?: LootBoxStepConfig[];
  pityConfig?: LootBoxPityConfig;
  tags?: string[];
  isLimitedTime?: boolean;
  startsAt?: string;
  endsAt?: string;
  dailyLimit?: number;
}
