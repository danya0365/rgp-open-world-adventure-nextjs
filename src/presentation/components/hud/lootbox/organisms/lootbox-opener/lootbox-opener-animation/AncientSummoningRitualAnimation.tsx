"use client";

import { LootBoxOpenResult } from "@/src/application/services/lootbox/LootBoxService";
import { animated, config, useSpring, useTrail } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";

interface AncientSummoningRitualAnimationProps {
  isOpen: boolean;
  result: LootBoxOpenResult | null;
  onClose: () => void;
  onAnimationStart?: () => void;
  onAnimationFinish?: () => void;
}

const RARITY_COLORS = {
  common: {
    primary: "#94a3b8",
    secondary: "#64748b",
    glow: "rgba(148, 163, 184, 0.5)",
  },
  uncommon: {
    primary: "#22c55e",
    secondary: "#16a34a",
    glow: "rgba(34, 197, 94, 0.6)",
  },
  rare: {
    primary: "#3b82f6",
    secondary: "#2563eb",
    glow: "rgba(59, 130, 246, 0.7)",
  },
  epic: {
    primary: "#a855f7",
    secondary: "#9333ea",
    glow: "rgba(168, 85, 247, 0.8)",
  },
  legendary: {
    primary: "#eab308",
    secondary: "#ca8a04",
    glow: "rgba(234, 179, 8, 0.9)",
  },
  mythic: {
    primary: "#ef4444",
    secondary: "#dc2626",
    glow: "rgba(239, 68, 68, 1)",
  },
};

const ANIMATION_PHASES = {
  IDLE: "idle",
  PLACING_STONE: "placing_stone",
  RUNE_DRAWING: "rune_drawing",
  MAGIC_CIRCLE: "magic_circle",
  POWER_SURGE: "power_surge",
  EXPLOSION: "explosion",
  REVEAL: "reveal",
  COMPLETE: "complete",
};

export function AncientSummoningRitualAnimation({
  isOpen,
  result,
  onClose,
  onAnimationStart,
  onAnimationFinish,
}: AncientSummoningRitualAnimationProps) {
  const [phase, setPhase] = useState(ANIMATION_PHASES.IDLE);
  const [runes, setRunes] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [highestRarity, setHighestRarity] = useState<string>("common");

  useEffect(() => {
    if (isOpen && result) {
      const rarities = result.rewards
        .map((r) => r.rarity || "common")
        .sort((a, b) => {
          const order = [
            "common",
            "uncommon",
            "rare",
            "epic",
            "legendary",
            "mythic",
          ];
          return order.indexOf(b) - order.indexOf(a);
        });
      setHighestRarity(rarities[0] || "common");
      onAnimationStart?.();
      startAnimation();
    }
  }, [isOpen, result]);

  const startAnimation = () => {
    setPhase(ANIMATION_PHASES.PLACING_STONE);
    setTimeout(() => setPhase(ANIMATION_PHASES.RUNE_DRAWING), 800);
    setTimeout(() => setPhase(ANIMATION_PHASES.MAGIC_CIRCLE), 2000);
    setTimeout(() => setPhase(ANIMATION_PHASES.POWER_SURGE), 3500);
    setTimeout(() => setPhase(ANIMATION_PHASES.EXPLOSION), 5500);
    setTimeout(() => setPhase(ANIMATION_PHASES.REVEAL), 6200);
    setTimeout(() => {
      setPhase(ANIMATION_PHASES.COMPLETE);
      onAnimationFinish?.();
    }, 7500);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (phase !== ANIMATION_PHASES.RUNE_DRAWING) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setDragPos({ x, y });

    if (runes.length < 6 && Math.random() > 0.7) {
      setRunes((prev) => [...prev, { x, y, id: Date.now() + Math.random() }]);
    }
  };

  const colors =
    RARITY_COLORS[highestRarity as keyof typeof RARITY_COLORS] ||
    RARITY_COLORS.common;

  const overlaySpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: config.slow,
  });

  const stoneSpring = useSpring({
    opacity: phase === ANIMATION_PHASES.PLACING_STONE ? 1 : 0,
    transform:
      phase === ANIMATION_PHASES.PLACING_STONE
        ? "translateY(0px) scale(1)"
        : "translateY(-100px) scale(0)",
    config: config.wobbly,
  });

  const circleSpring = useSpring({
    opacity:
      phase === ANIMATION_PHASES.MAGIC_CIRCLE ||
      phase === ANIMATION_PHASES.POWER_SURGE ||
      phase === ANIMATION_PHASES.EXPLOSION
        ? 1
        : 0,
    transform:
      phase === ANIMATION_PHASES.MAGIC_CIRCLE ||
      phase === ANIMATION_PHASES.POWER_SURGE ||
      phase === ANIMATION_PHASES.EXPLOSION
        ? "scale(1) rotate(0deg)"
        : "scale(0) rotate(-180deg)",
    config: { tension: 120, friction: 14 },
  });

  const surgeSpring = useSpring({
    opacity: phase === ANIMATION_PHASES.POWER_SURGE ? 1 : 0,
    transform:
      phase === ANIMATION_PHASES.POWER_SURGE ? "scale(1.5)" : "scale(1)",
    config: { tension: 300, friction: 10 },
  });

  const explosionSpring = useSpring({
    opacity: phase === ANIMATION_PHASES.EXPLOSION ? 1 : 0,
    transform: phase === ANIMATION_PHASES.EXPLOSION ? "scale(3)" : "scale(0)",
    config: { tension: 200, friction: 20 },
  });

  const rewardTrail = useTrail(result?.rewards.length || 0, {
    opacity:
      phase === ANIMATION_PHASES.REVEAL || phase === ANIMATION_PHASES.COMPLETE
        ? 1
        : 0,
    transform:
      phase === ANIMATION_PHASES.REVEAL || phase === ANIMATION_PHASES.COMPLETE
        ? "translateY(0px) scale(1)"
        : "translateY(50px) scale(0.5)",
    config: config.wobbly,
  });

  if (!isOpen) return null;

  return (
    <animated.div
      ref={containerRef}
      style={overlaySpring}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onPointerMove={handlePointerMove}
    >
      {/* Background Ancient Temple */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 opacity-60">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
      </div>

      {/* Main Altar Container */}
      <div className="relative w-full max-w-4xl h-screen flex flex-col items-center justify-center">
        {/* Spirit Stone Placement */}
        <animated.div
          style={stoneSpring}
          className="absolute top-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-2xl"
        >
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent animate-pulse" />
        </animated.div>

        {/* Rune Drawing Trail */}
        {phase === ANIMATION_PHASES.RUNE_DRAWING && dragPos && (
          <div
            className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50 pointer-events-none"
            style={{ left: `${dragPos.x}%`, top: `${dragPos.y}%` }}
          />
        )}
        {runes.map((rune) => (
          <div
            key={rune.id}
            className="absolute w-8 h-8 text-cyan-400 opacity-60 animate-pulse pointer-events-none"
            style={{ left: `${rune.x}%`, top: `${rune.y}%` }}
          >
            ᚱ
          </div>
        ))}

        {/* Magic Circle */}
        <animated.div style={circleSpring} className="absolute">
          <div className="relative w-96 h-96">
            {/* Outer Ring */}
            <div
              className="absolute inset-0 rounded-full border-4 opacity-80 animate-spin"
              style={{
                borderColor: colors.primary,
                boxShadow: `0 0 30px ${colors.glow}`,
                animationDuration: "8s",
              }}
            />
            {/* Middle Ring */}
            <div
              className="absolute inset-8 rounded-full border-2 opacity-60"
              style={{
                borderColor: colors.secondary,
                animation: "spin 6s linear infinite reverse",
              }}
            />
            {/* Inner Runes */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <div
                  key={i}
                  className="absolute text-2xl font-bold opacity-70"
                  style={{
                    color: colors.primary,
                    transform: `rotate(${angle}deg) translateY(-140px)`,
                  }}
                >
                  ᚦ
                </div>
              ))}
            </div>
          </div>
        </animated.div>

        {/* Power Surge Effect */}
        <animated.div style={surgeSpring} className="absolute">
          <div
            className="w-64 h-64 rounded-full opacity-60 animate-pulse"
            style={{
              background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
            }}
          />
        </animated.div>

        {/* Explosion Effect */}
        <animated.div style={explosionSpring} className="absolute">
          <div
            className="w-96 h-96 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.primary} 0%, transparent 60%)`,
              boxShadow: `0 0 100px 50px ${colors.glow}`,
            }}
          />
        </animated.div>

        {/* Reward Reveal */}
        <div className="absolute bottom-20 flex flex-wrap gap-4 justify-center max-w-3xl px-4">
          {result?.rewards.map((reward, idx) => {
            const rewardRarity = reward.rarity || "common";
            const rewardColors =
              RARITY_COLORS[rewardRarity as keyof typeof RARITY_COLORS];
            return (
              <animated.div
                key={idx}
                className="relative bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border-2 min-w-[140px]"
                style={{
                  ...rewardTrail[idx],
                  borderColor: rewardColors.primary,
                  boxShadow: `0 0 20px ${rewardColors.glow}`,
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${rewardColors.primary}, ${rewardColors.secondary})`,
                    }}
                  >
                    {reward.featured ? "★" : "◆"}
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400 uppercase">
                      {rewardRarity}
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {(reward.item?.name as string) || "Mystery Item"}
                    </div>
                    <div className="text-xs text-gray-400">
                      ×{reward.quantity}
                    </div>
                  </div>
                </div>
              </animated.div>
            );
          })}
        </div>

        {/* Instruction Text */}
        {phase === ANIMATION_PHASES.RUNE_DRAWING && (
          <div className="absolute top-16 text-cyan-400 text-center animate-pulse">
            <p className="text-lg font-semibold">วาดรูนเพื่อเพิ่มพลังอัญเชิญ</p>
            <p className="text-sm opacity-70">ลากนิ้วหรือเมาส์บนหน้าจอ</p>
          </div>
        )}

        {/* Close Button */}
        {phase === ANIMATION_PHASES.COMPLETE && (
          <button
            onClick={onClose}
            className="absolute bottom-8 px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105"
          >
            รับรางวัล
          </button>
        )}
      </div>
    </animated.div>
  );
}
