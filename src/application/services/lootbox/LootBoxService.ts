import { randomUUID } from "crypto";
import { ITEMS_MASTER_MAP } from "@/src/data/master/items.master";
import { LOOT_BOX_MASTER } from "@/src/data/master/lootboxes.master";
import type {
  LootBoxDefinition,
  LootBoxGuaranteedRule,
  LootBoxRewardEntry,
} from "@/src/domain/types/lootbox.types";
import type { Item } from "@/src/domain/types/item.types";

export interface LootBoxOpenContext {
  lootBoxId: string;
  step?: number;
  pityCounters?: Record<string, number>;
  openedCount?: Record<string, number>;
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

export interface LootBoxRewardResult {
  item: Item;
  quantity: number;
  rarity?: Item["rarity"];
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

export class LootBoxService {
  private lootboxes: Map<string, LootBoxDefinition>;

  constructor(lootboxes: LootBoxDefinition[] = LOOT_BOX_MASTER) {
    this.lootboxes = new Map(lootboxes.map((lootbox) => [lootbox.id, lootbox]));
  }

  public getLootBoxById(id: string): LootBoxDefinition | undefined {
    return this.lootboxes.get(id);
  }

  public listLootBoxes(): LootBoxDefinition[] {
    return Array.from(this.lootboxes.values());
  }

  public openLootBox(
    costSelection: LootBoxDefinition["costOptions"][number],
    context: LootBoxOpenContext
  ): LootBoxOpenResult {
    const lootBox = this.getLootBoxOrThrow(context.lootBoxId);

    const pityCounters = { ...(context.pityCounters ?? {}) };
    const openedCount = { ...(context.openedCount ?? {}) };
    const guaranteeHits: LootBoxGuaranteeHit[] = [];

    openedCount[lootBox.id] = (openedCount[lootBox.id] ?? 0) + 1;

    const rewards = this.generateRewards({
      lootBox,
      step: context.step,
      pityCounters,
      guaranteeHits,
      openedCount,
    });

    const consumedCost = {
      type: costSelection.type,
      amount: costSelection.amount,
      ticketId: costSelection.ticketId,
      itemId: costSelection.itemId,
    };

    const rollId = randomUUID();

    return {
      lootBox,
      rewards,
      consumedCost,
      pityCounters,
      openedCount,
      guaranteeHits,
      rollId,
    };
  }

  private generateRewards(params: {
    lootBox: LootBoxDefinition;
    step?: number;
    pityCounters: Record<string, number>;
    guaranteeHits: LootBoxGuaranteeHit[];
    openedCount: Record<string, number>;
  }): LootBoxRewardResult[] {
    const { lootBox, step, pityCounters, guaranteeHits, openedCount } = params;

    const rewardCandidates = lootBox.rewardTable;

    const guaranteeRules = this.resolveGuaranteeRules(lootBox, step);
    const rewards: LootBoxRewardResult[] = [];

    const guaranteedRewards = this.applyGuarantees({
      rewardCandidates,
      guaranteeRules,
      guaranteeHits,
      lootBox,
    });

    rewards.push(...guaranteedRewards);

    const pityReward = this.resolvePityReward(lootBox, pityCounters);
    if (pityReward) {
      rewards.push(pityReward);
      guaranteeHits.push({
        rule: {
          guaranteeType: "rarity",
          triggerAtOpenCount: lootBox.pityConfig?.guaranteeAt ?? 0,
          rarity: pityReward.rarity,
        },
      });
    }

    const baseRewardCount = Math.max(1, 1 - rewards.length);
    for (let i = 0; i < baseRewardCount; i += 1) {
      rewards.push(this.rollReward(rewardCandidates));
    }

    this.updatePityCounters(lootBox, pityCounters, rewards);
    this.applyStepBonusRewards(lootBox, step, rewards);

    openedCount[lootBox.id] = openedCount[lootBox.id] ?? 0;

    return rewards;
  }

  private resolveGuaranteeRules(
    lootBox: LootBoxDefinition,
    step?: number
  ): LootBoxGuaranteedRule[] {
    const rules: LootBoxGuaranteedRule[] = [];

    if (lootBox.guaranteedRules) {
      rules.push(...lootBox.guaranteedRules);
    }

    if (lootBox.stepConfigs && step) {
      const stepConfig = lootBox.stepConfigs.find((config) => config.step === step);
      if (stepConfig?.guaranteedRules) {
        rules.push(...stepConfig.guaranteedRules);
      }
    }

    return rules;
  }

  private applyGuarantees(params: {
    rewardCandidates: LootBoxRewardEntry[];
    guaranteeRules: LootBoxGuaranteedRule[];
    guaranteeHits: LootBoxGuaranteeHit[];
    lootBox: LootBoxDefinition;
  }): LootBoxRewardResult[] {
    const { rewardCandidates, guaranteeRules, guaranteeHits } = params;
    const rewards: LootBoxRewardResult[] = [];

    guaranteeRules.forEach((rule) => {
      if (rule.guaranteeType === "rarity" && rule.rarity) {
        const candidate = this.rollReward(
          rewardCandidates.filter((entry) => entry.rarity === rule.rarity)
        );
        rewards.push({
          ...candidate,
          guaranteeSource: `rarity-${rule.rarity}`,
        });
        guaranteeHits.push({ rule });
      } else if (rule.guaranteeType === "item" && rule.itemIds?.length) {
        const candidate = this.rollReward(
          rewardCandidates.filter((entry) => rule.itemIds?.includes(entry.itemId))
        );
        rewards.push({
          ...candidate,
          guaranteeSource: "item",
        });
        guaranteeHits.push({ rule });
      }
    });

    return rewards;
  }

  private resolvePityReward(
    lootBox: LootBoxDefinition,
    pityCounters: Record<string, number>
  ): LootBoxRewardResult | null {
    if (!lootBox.pityConfig) {
      return null;
    }

    const { counterId, guaranteeAt } = lootBox.pityConfig;
    const currentCounter = pityCounters[counterId] ?? 0;

    if (currentCounter + 1 >= guaranteeAt) {
      const topRarityEntries = lootBox.rewardTable.filter((entry) => entry.rarity === "mythic");
      const rewardEntry =
        topRarityEntries.length > 0
          ? this.rollReward(topRarityEntries)
          : this.rollReward(lootBox.rewardTable);

      pityCounters[counterId] = 0;

      return {
        ...rewardEntry,
        guaranteeSource: "pity",
      };
    }

    return null;
  }

  private rollReward(entries: LootBoxRewardEntry[]): LootBoxRewardResult {
    if (!entries.length) {
      throw new Error("LootBox reward entries is empty");
    }

    const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const entry of entries) {
      roll -= entry.weight;
      if (roll <= 0) {
        return this.createRewardResult(entry);
      }
    }

    return this.createRewardResult(entries[entries.length - 1]);
  }

  private createRewardResult(entry: LootBoxRewardEntry): LootBoxRewardResult {
    const quantity = entry.quantity ? this.randomInt(entry.quantity.min, entry.quantity.max) : 1;
    const item = ITEMS_MASTER_MAP[entry.itemId];

    if (!item) {
      throw new Error(`Item not found for loot entry ${entry.itemId}`);
    }

    return {
      item,
      quantity,
      rarity: entry.rarity ?? item.rarity,
      featured: entry.featured,
    };
  }

  private updatePityCounters(
    lootBox: LootBoxDefinition,
    pityCounters: Record<string, number>,
    rewards: LootBoxRewardResult[]
  ) {
    if (!lootBox.pityConfig) {
      return;
    }

    const { counterId, resetOnHit } = lootBox.pityConfig;
    const hitTopRarity = rewards.some((reward) => reward.rarity === "mythic");

    if (hitTopRarity && resetOnHit) {
      pityCounters[counterId] = 0;
    } else {
      pityCounters[counterId] = (pityCounters[counterId] ?? 0) + 1;
    }
  }

  private applyStepBonusRewards(
    lootBox: LootBoxDefinition,
    step: number | undefined,
    rewards: LootBoxRewardResult[]
  ) {
    if (!step || !lootBox.stepConfigs) {
      return;
    }

    const stepConfig = lootBox.stepConfigs.find((config) => config.step === step);
    if (!stepConfig?.bonusRewards?.length) {
      return;
    }

    stepConfig.bonusRewards.forEach((bonus) => {
      const bonusReward = this.createRewardResult(bonus);
      rewards.push({ ...bonusReward, guaranteeSource: "step-bonus" });
    });
  }

  private getLootBoxOrThrow(id: string): LootBoxDefinition {
    const lootBox = this.lootboxes.get(id);
    if (!lootBox) {
      throw new Error(`LootBox with id ${id} not found`);
    }
    return lootBox;
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
