"use client";

import type { LootBoxOpenResult } from "@/src/application/services/lootbox/LootBoxService";
import { SimpleAnimation } from "./lootbox-opener-animation/SimpleAnimation";

interface LootBoxOpeningOverlayProps {
  isOpen: boolean;
  result: LootBoxOpenResult | null;
  onClose: () => void;
  onAnimationStart?: () => void;
  onAnimationFinish?: () => void;
}

export function LootBoxOpeningOverlay({
  isOpen,
  result,
  onClose,
  onAnimationStart,
  onAnimationFinish,
}: LootBoxOpeningOverlayProps) {
  return (
    <SimpleAnimation
      isOpen={isOpen}
      result={result}
      onClose={onClose}
      onAnimationStart={onAnimationStart}
      onAnimationFinish={onAnimationFinish}
    />
  );
}
