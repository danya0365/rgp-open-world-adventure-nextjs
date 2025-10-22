import type { LootBoxDefinition } from "@/src/domain/types/lootbox.types";

export const LOOT_BOX_MASTER: LootBoxDefinition[] = [
  {
    id: "lootbox-standard-001",
    name: "หีบคริสตัลรวม",
    description: "สุ่มไอเทมหลายระดับความหายาก พร้อมอัตราตามมาตรฐาน",
    type: "standard",
    costOptions: [
      {
        type: "gold",
        amount: 500,
      },
      {
        type: "ticket",
        amount: 1,
        ticketId: "ticket-standard",
      },
    ],
    rewardTable: [
      { itemId: "weapon-001", weight: 400, rarity: "common" },
      { itemId: "item-010", weight: 300, rarity: "uncommon" },
      { itemId: "armor-011", weight: 150, rarity: "rare" },
      { itemId: "weapon-050", weight: 80, rarity: "epic" },
      { itemId: "item-100", weight: 50, rarity: "legendary" },
      { itemId: "acc-001", weight: 20, rarity: "mythic", featured: true },
    ],
    pityConfig: {
      counterId: "standard-pity",
      guaranteeAt: 30,
      resetOnHit: true,
    },
    guaranteedRules: [
      {
        guaranteeType: "rarity",
        triggerAtOpenCount: 10,
        rarity: "rare",
      },
    ],
  },
  {
    id: "lootbox-guaranteed-epic",
    name: "หีบการันตียอดนักผจญภัย",
    description: "เปิดครั้งเดียว การันตีไอเทมระดับ Epic ขึ้นไป",
    type: "guaranteed",
    costOptions: [
      {
        type: "ticket",
        amount: 1,
        ticketId: "ticket-guaranteed",
      },
      {
        type: "gold",
        amount: 2000,
      },
    ],
    rewardTable: [
      { itemId: "weapon-050", weight: 250, rarity: "epic" },
      { itemId: "item-050", weight: 200, rarity: "epic" },
      { itemId: "item-100", weight: 150, rarity: "legendary" },
      { itemId: "armor-100", weight: 120, rarity: "legendary" },
      { itemId: "acc-001", weight: 80, rarity: "mythic", featured: true },
      { itemId: "weapon-200", weight: 50, rarity: "legendary" },
    ],
    guaranteedRules: [
      {
        guaranteeType: "rarity",
        triggerAtOpenCount: 1,
        rarity: "epic",
      },
    ],
  },
  {
    id: "lootbox-stepup-mythic",
    name: "หีบขั้นบันไดตำนาน",
    description: "เปิดครบทุกขั้น การันตีไอเทมระดับ Mythic",
    type: "stepup",
    costOptions: [
      {
        type: "gold",
        amount: 800,
      },
    ],
    rewardTable: [
      { itemId: "weapon-001", weight: 350, rarity: "common" },
      { itemId: "item-020", weight: 250, rarity: "rare" },
      { itemId: "weapon-050", weight: 150, rarity: "epic" },
      { itemId: "item-100", weight: 100, rarity: "legendary" },
      { itemId: "acc-001", weight: 50, rarity: "mythic", featured: true },
    ],
    stepConfigs: [
      {
        step: 1,
        cost: {
          type: "gold",
          amount: 500,
        },
      },
      {
        step: 2,
        cost: {
          type: "gold",
          amount: 800,
        },
        guaranteedRules: [
          {
            guaranteeType: "rarity",
            triggerAtOpenCount: 1,
            rarity: "epic",
          },
        ],
      },
      {
        step: 3,
        cost: {
          type: "gold",
          amount: 1200,
        },
        guaranteedRules: [
          {
            guaranteeType: "rarity",
            triggerAtOpenCount: 1,
            rarity: "mythic",
          },
        ],
        bonusRewards: [
          {
            itemId: "ticket-guaranteed",
            weight: 1,
            quantity: { min: 1, max: 1 },
          },
        ],
      },
    ],
    pityConfig: {
      counterId: "stepup-mythic",
      guaranteeAt: 50,
      resetOnHit: true,
    },
  },
];
