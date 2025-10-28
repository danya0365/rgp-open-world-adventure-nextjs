"use client";

import type { LootBoxOpenResult } from "@/src/application/services/lootbox/LootBoxService";
import { AncientSummoningRitualAnimation } from "./lootbox-opener-animation/AncientSummoningRitualAnimation";
import { BattleWithDestinyCrystalAnimation } from "./lootbox-opener-animation/BattleWithDestinyCrystalAnimation";
import { DuelOfFateSummonAnimation } from "./lootbox-opener-animation/DuelOfFateSummonAnimation";
import { SimpleAnimation } from "./lootbox-opener-animation/SimpleAnimation";

interface LootBoxOpeningOverlayProps {
  isOpen: boolean;
  result: LootBoxOpenResult | null;
  onClose: () => void;
  onAnimationStart?: () => void;
  onAnimationFinish?: () => void;
}

const enum LootBoxOpenerType {
  Simple = "simple",
  DuelOfFate = "duelOfFate",
  AncientSummoningRitual = "ancientSummoningRitual",
  BattleWithDestinyCrystal = "battleWithDestinyCrystal",
}

const lootboxOpenerType: LootBoxOpenerType =
  LootBoxOpenerType.BattleWithDestinyCrystal;

export function LootBoxOpeningOverlay({
  isOpen,
  result,
  onClose,
  onAnimationStart,
  onAnimationFinish,
}: LootBoxOpeningOverlayProps) {
  switch (lootboxOpenerType) {
    case LootBoxOpenerType.Simple:
      return (
        <SimpleAnimation
          isOpen={isOpen}
          result={result}
          onClose={onClose}
          onAnimationStart={onAnimationStart}
          onAnimationFinish={onAnimationFinish}
        />
      );
    case LootBoxOpenerType.DuelOfFate:
      return (
        <DuelOfFateSummonAnimation
          isOpen={isOpen}
          result={result}
          onClose={onClose}
          onAnimationStart={onAnimationStart}
          onAnimationFinish={onAnimationFinish}
        />
      );
    case LootBoxOpenerType.AncientSummoningRitual:
      return (
        <AncientSummoningRitualAnimation
          isOpen={isOpen}
          result={result}
          onClose={onClose}
          onAnimationStart={onAnimationStart}
          onAnimationFinish={onAnimationFinish}
        />
      );
    case LootBoxOpenerType.BattleWithDestinyCrystal:
      return (
        <BattleWithDestinyCrystalAnimation
          isOpen={isOpen}
          result={result}
          onClose={onClose}
          onAnimationStart={onAnimationStart}
          onAnimationFinish={onAnimationFinish}
        />
      );
    default:
      return null;
  }
}
