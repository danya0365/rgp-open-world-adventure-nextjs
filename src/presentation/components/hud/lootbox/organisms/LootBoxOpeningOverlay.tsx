"use client";

import { useEffect, useMemo, useState } from "react";
import { animated, config, useSpring, useTrail } from "react-spring";
import { cn } from "@/lib/utils";
import type { LootBoxOpenResult } from "@/src/application/services/lootbox/LootBoxService";

interface LootBoxOpeningOverlayProps {
  isOpen: boolean;
  result: LootBoxOpenResult | null;
  onClose: () => void;
  onAnimationStart?: () => void;
  onAnimationFinish?: () => void;
}

const rarityPriority: Record<string, number> = {
  mythic: 6,
  legendary: 5,
  epic: 4,
  rare: 3,
  uncommon: 2,
  common: 1,
};

const rarityGlowClass: Record<string, string> = {
  mythic: "lootbox-glow-mythic",
  legendary: "lootbox-glow-legendary",
  epic: "lootbox-glow-epic",
  rare: "lootbox-glow-rare",
  uncommon: "lootbox-glow-uncommon",
  common: "lootbox-glow-common",
};

const rarityGradientClass: Record<string, string> = {
  mythic: "lootbox-gradient-mythic",
  legendary: "lootbox-gradient-legendary",
  epic: "lootbox-gradient-epic",
  rare: "lootbox-gradient-rare",
  uncommon: "lootbox-gradient-uncommon",
  common: "lootbox-gradient-common",
};

export function LootBoxOpeningOverlay({
  isOpen,
  result,
  onClose,
  onAnimationStart,
  onAnimationFinish,
}: LootBoxOpeningOverlayProps) {
  const [allowClose, setAllowClose] = useState(false);
  const rewards = useMemo(() => result?.rewards ?? [], [result]);

  const peakRarity = useMemo(() => {
    return rewards.reduce<string | null>((highest, reward) => {
      const rarity = reward.rarity ?? reward.item.rarity ?? "common";
      if (!highest) return rarity;
      return rarityPriority[rarity] > rarityPriority[highest] ? rarity : highest;
    }, null);
  }, [rewards]);

  const containerSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: config.default,
  });

  const burstSpring = useSpring({
    from: { scale: 0.6, opacity: 0.4, rotateZ: 0 },
    to: async (next) => {
      if (!isOpen) return;
      await next({ scale: 1.35, opacity: 0.9, rotateZ: 15 });
      await next({ scale: 1.05, opacity: 0.5, rotateZ: 0 });
    },
    reset: isOpen,
    config: config.wobbly,
    immediate: !isOpen,
  });

  const chestSpring = useSpring({
    from: { scale: 0.9, rotateX: 65, opacity: 0 },
    to: async (next) => {
      if (!isOpen) return;
      await next({ opacity: 1, scale: 1.1, rotateX: 0 });
      await next({ scale: 1, rotateX: 0 });
    },
    reset: isOpen,
    config: { tension: 220, friction: 20 },
    immediate: !isOpen,
  });

  const trail = useTrail(rewards.length, {
    from: { opacity: 0, y: 40, rotateX: -45, scale: 0.85 },
    to: async (next) => {
      if (!isOpen) return;
      await next({ opacity: 1, y: 0, rotateX: 0, scale: 1 });
    },
    delay: 600,
    config: config.gentle,
    reset: isOpen,
    immediate: !isOpen,
  });

  useEffect(() => {
    if (!isOpen) {
      setAllowClose(false);
      return;
    }
    onAnimationStart?.();
    const finishTimer = window.setTimeout(() => {
      setAllowClose(true);
      onAnimationFinish?.();
    }, 2600);
    return () => window.clearTimeout(finishTimer);
  }, [isOpen, onAnimationStart, onAnimationFinish]);

  useEffect(() => {
    if (!isOpen) {
      setAllowClose(false);
    }
  }, [isOpen]);

  if (!isOpen || !result) return null;

  const rarityKey = peakRarity ?? "common";

  return (
    <animated.div
      style={containerSpring}
      className="fixed inset-0 z-[130] flex flex-col items-center justify-center bg-black/85 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
    >
      <animated.div
        style={{
          transform: burstSpring.scale.to((s) => `scale(${s})`) as unknown as undefined,
          opacity: burstSpring.opacity,
          rotateZ: burstSpring.rotateZ,
        }}
        className={`absolute inset-0 -z-10 bg-gradient-to-br ${rarityGradientClass[rarityKey]} blur-3xl transition-all duration-700`}
      />

      <animated.div
        style={chestSpring}
        className={cn(
          "relative flex w-full max-w-[680px] flex-col items-center gap-6 rounded-3xl border bg-slate-900/80 p-8 text-center",
          "backdrop-blur-xl",
          rarityGlowClass[rarityKey]
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm uppercase tracking-[0.4em] text-white/50">Summoning Result</p>
          <h2 className="text-3xl font-bold text-white">{result.lootBox.name}</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {trail.map((style, index) => {
            const reward = rewards[index];
            if (!reward) return null;
            const rewardRarity = reward.rarity ?? reward.item.rarity ?? "common";

            return (
              <animated.div
                key={`${reward.item.id}-${index}`}
                style={{
                  opacity: style.opacity,
                  transform: style.y.to((y) => `translateY(${y}px)`) as unknown as undefined,
                }}
                className={cn(
                  "relative flex min-w-[140px] flex-col items-center gap-2 rounded-2xl border bg-slate-900/60 px-4 py-5 text-white shadow-lg",
                  rarityGlowClass[rewardRarity]
                )}
              >
                <span className="text-xs uppercase tracking-[0.3em] text-white/60">
                  {rewardRarity}
                </span>
                <span className="text-lg font-semibold text-white/95">{reward.item.name}</span>
                <span className="text-sm text-white/70">x{reward.quantity}</span>
                {reward.guaranteeSource ? (
                  <span className="text-xs text-amber-300/80">{reward.guaranteeSource}</span>
                ) : null}
              </animated.div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            if (!allowClose) return;
            onClose();
          }}
          className={cn(
            "mt-4 rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] transition-all",
            allowClose
              ? "bg-white text-slate-900 hover:bg-amber-300"
              : "bg-white/30 text-white/60 cursor-not-allowed"
          )}
        >
          {allowClose ? "ต่อไป" : "กำลังดำเนินการ..."}
        </button>
      </animated.div>
    </animated.div>
  );
}
