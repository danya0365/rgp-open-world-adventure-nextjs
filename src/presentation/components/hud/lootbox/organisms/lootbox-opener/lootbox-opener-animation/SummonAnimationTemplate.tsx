"use client";

export interface LootBoxOpenResult {
  lootBox: LootBoxDefinition;
  rewards: LootBoxRewardResult[];
  consumedCost: LootBoxConsumedCost;
  pityCounters: Record<string, number>;
  openedCount: Record<string, number>;
  guaranteeHits: LootBoxGuaranteeHit[];
  rollId: string;
}

export interface LootBoxRewardResult {
  item: Record<string, unknown>;
  quantity: number;
  rarity?: string;
  featured?: boolean;
  guaranteeSource?: string;
}

export interface LootBoxConsumedCost {
  type: LootBoxDefinition["costOptions"][number]["type"];
  amount: number;
  ticketId?: string;
  itemId?: string;
}

export interface LootBoxGuaranteeHit {
  rule: LootBoxGuaranteedRule;
  step?: number;
}

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
  rarity?: string;
  featured?: boolean;
}

export interface LootBoxGuaranteedRule {
  guaranteeType: "rarity" | "item";
  triggerAtOpenCount: number;
  rarity?: string;
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

export interface LootBoxOpenResult {
  lootBox: LootBoxDefinition;
  rewards: LootBoxRewardResult[];
  consumedCost: LootBoxConsumedCost;
  pityCounters: Record<string, number>;
  openedCount: Record<string, number>;
  guaranteeHits: LootBoxGuaranteeHit[];
  rollId: string;
}

interface SummonAnimationTemplateProps {
  isOpen: boolean;
  result: LootBoxOpenResult | null;
  onClose: () => void;
  onAnimationStart?: () => void;
  onAnimationFinish?: () => void;
}

export function SummonAnimationTemplate({
  isOpen,
  result,
  onClose,
  onAnimationStart,
  onAnimationFinish,
}: SummonAnimationTemplateProps) {
  return <p>Summon Animation Template</p>;
}
