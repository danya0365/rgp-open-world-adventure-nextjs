"use client";

import { LootBoxOpenResult } from "@/src/application/services/lootbox/LootBoxService";
import { animated, config, useSpring, useTrail } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";

interface BattleWithDestinyCrystalAnimationProps {
  isOpen: boolean;
  result: LootBoxOpenResult | null;
  onClose: () => void;
  onAnimationStart?: () => void;
  onAnimationFinish?: () => void;
}

const RARITY_COLORS: Record<
  string,
  { primary: string; glow: string; bg: string }
> = {
  common: { primary: "#9ca3af", glow: "#d1d5db", bg: "#374151" },
  uncommon: { primary: "#10b981", glow: "#34d399", bg: "#065f46" },
  rare: { primary: "#3b82f6", glow: "#60a5fa", bg: "#1e3a8a" },
  epic: { primary: "#a855f7", glow: "#c084fc", bg: "#581c87" },
  legendary: { primary: "#f59e0b", glow: "#fbbf24", bg: "#92400e" },
  mythic: { primary: "#ef4444", glow: "#f87171", bg: "#991b1b" },
};

export function BattleWithDestinyCrystalAnimation({
  isOpen,
  result,
  onClose,
  onAnimationStart,
  onAnimationFinish,
}: BattleWithDestinyCrystalAnimationProps) {
  const [stage, setStage] = useState<
    "intro" | "ready" | "attack" | "crack" | "explode" | "rewards" | "complete"
  >("intro");
  const [canAttack, setCanAttack] = useState(false);
  const [crackIntensity, setCrackIntensity] = useState(0);
  const [showRewards, setShowRewards] = useState(false);
  const animationTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const highestRarity =
    result?.rewards.reduce((highest, reward) => {
      const rarities = [
        "common",
        "uncommon",
        "rare",
        "epic",
        "legendary",
        "mythic",
      ];
      const currentIndex = rarities.indexOf(reward.rarity || "common");
      const highestIndex = rarities.indexOf(highest);
      return currentIndex > highestIndex ? reward.rarity || "common" : highest;
    }, "common") || "common";

  const rarityColor = RARITY_COLORS[highestRarity] || RARITY_COLORS.common;

  useEffect(() => {
    if (isOpen && result) {
      setStage("intro");
      setCanAttack(false);
      setCrackIntensity(0);
      setShowRewards(false);
      onAnimationStart?.();

      animationTimerRef.current = setTimeout(() => {
        setStage("ready");
        setCanAttack(true);
      }, 2000);
    }

    return () => {
      if (animationTimerRef.current !== undefined) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, [isOpen, result, onAnimationStart]);

  const containerSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: config.molasses,
  });

  const crystalSpring = useSpring({
    scale:
      stage === "intro"
        ? 0
        : stage === "attack"
        ? 1.2
        : stage === "explode"
        ? 0
        : 1,
    rotateZ: stage === "intro" ? -180 : 0,
    opacity: stage === "explode" ? 0 : 1,
    config: stage === "attack" ? config.wobbly : config.slow,
  });

  const playerSpring = useSpring({
    opacity:
      stage === "intro"
        ? 0
        : stage === "explode" || stage === "rewards"
        ? 0
        : 1,
    x: stage === "attack" ? 50 : 0,
    config: config.wobbly,
  });

  const crackSpring = useSpring({
    opacity: crackIntensity,
    scale: 1 + crackIntensity * 0.5,
  });

  const trail = useTrail(result?.rewards.length || 0, {
    opacity: showRewards ? 1 : 0,
    y: showRewards ? 0 : 100,
    scale: showRewards ? 1 : 0,
    config: config.wobbly,
  });

  const handleAttack = () => {
    if (!canAttack || stage !== "ready") return;

    setCanAttack(false);
    setStage("attack");

    setTimeout(() => {
      setStage("crack");
      setCrackIntensity(0.5);

      setTimeout(() => {
        setCrackIntensity(1);

        setTimeout(() => {
          setStage("explode");

          setTimeout(() => {
            setStage("rewards");
            setShowRewards(true);

            setTimeout(() => {
              setStage("complete");
              onAnimationFinish?.();
            }, 3000);
          }, 500);
        }, 800);
      }, 600);
    }, 600);
  };

  const handleSkip = () => {
    if (stage === "complete" || stage === "rewards") {
      onClose();
    } else {
      setStage("rewards");
      setShowRewards(true);
      setTimeout(() => {
        setStage("complete");
        onAnimationFinish?.();
      }, 1000);
    }
  };

  if (!isOpen || !result) return null;

  return (
    <animated.div
      style={containerSpring}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-black opacity-60" />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5,
            }}
          />
        ))}
      </div>

      {/* Player Character */}
      {stage !== "rewards" && stage !== "complete" && (
        <animated.div
          style={{
            opacity: playerSpring.opacity,
            transform: playerSpring.x.to((x) => `translateX(${x}px)`),
          }}
          className="absolute bottom-32 left-1/3 z-20"
        >
          <div className="relative">
            <div className="w-24 h-32 bg-gradient-to-b from-blue-600 to-blue-800 rounded-lg relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-b from-amber-300 to-amber-600 rounded-full" />
              <div className="absolute top-8 -right-4 w-16 h-4 bg-gradient-to-r from-gray-400 to-gray-600 origin-left transform rotate-45" />
            </div>
          </div>
        </animated.div>
      )}

      {/* Destiny Crystal */}
      {stage !== "rewards" && stage !== "complete" && (
        <animated.div
          style={{
            scale: crystalSpring.scale,
            rotateZ: crystalSpring.rotateZ,
            opacity: crystalSpring.opacity,
          }}
          className="absolute z-10"
        >
          <div className="relative w-64 h-64">
            {/* Crystal core */}
            <div
              className="absolute inset-8 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 transform rotate-45"
              style={{
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                boxShadow: `0 0 60px ${rarityColor.glow}`,
              }}
            >
              {/* Inner glow */}
              <div className="absolute inset-4 bg-white opacity-30 animate-pulse" />
            </div>

            {/* Cracks */}
            {stage === "crack" && (
              <animated.div style={crackSpring} className="absolute inset-0">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <path
                    d="M 50 0 L 50 100 M 0 50 L 100 50 M 20 20 L 80 80 M 80 20 L 20 80"
                    stroke={rarityColor.glow}
                    strokeWidth="2"
                    fill="none"
                    className="animate-pulse"
                  />
                  <path
                    d="M 30 10 L 70 90 M 10 30 L 90 70"
                    stroke={rarityColor.primary}
                    strokeWidth="1.5"
                    fill="none"
                    className="animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  />
                </svg>
              </animated.div>
            )}
          </div>
        </animated.div>
      )}

      {/* Attack prompt */}
      {canAttack && stage === "ready" && (
        <button
          onClick={handleAttack}
          className="absolute z-30 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold text-xl rounded-lg shadow-2xl animate-bounce hover:scale-110 transition-transform"
          style={{
            boxShadow: "0 0 40px rgba(251, 191, 36, 0.8)",
          }}
        >
          ⚔️ STRIKE THE CRYSTAL!
        </button>
      )}

      {/* Rewards display */}
      {(stage === "rewards" || stage === "complete") && (
        <div className="relative z-20 w-full max-w-4xl px-8">
          <h2 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600">
            🎉 Summoned Treasures! 🎉
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {trail.map((style, index) => {
              const reward = result.rewards[index];
              const rewardRarity = reward.rarity || "common";
              const rewardColor = RARITY_COLORS[rewardRarity];

              return (
                <animated.div key={index} style={style} className="relative">
                  <div
                    className="p-6 rounded-xl backdrop-blur-sm border-2 transform hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: `${rewardColor.bg}40`,
                      borderColor: rewardColor.primary,
                      boxShadow: `0 0 20px ${rewardColor.glow}40`,
                    }}
                  >
                    {reward.featured && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-xs font-bold rounded-full">
                        ⭐ FEATURED
                      </div>
                    )}

                    <div
                      className="w-full aspect-square rounded-lg mb-3 flex items-center justify-center text-4xl"
                      style={{
                        backgroundColor: rewardColor.bg,
                        boxShadow: `inset 0 0 20px ${rewardColor.glow}40`,
                      }}
                    >
                      🎁
                    </div>

                    <div
                      className="text-xs font-bold uppercase mb-1 text-center"
                      style={{ color: rewardColor.primary }}
                    >
                      {rewardRarity}
                    </div>

                    <div className="text-sm text-white text-center font-semibold">
                      {(reward.item as { name?: string })?.name ||
                        "Mystery Item"}
                    </div>

                    {reward.quantity > 1 && (
                      <div className="text-xs text-gray-300 text-center mt-1">
                        x{reward.quantity}
                      </div>
                    )}
                  </div>
                </animated.div>
              );
            })}
          </div>

          <button
            onClick={handleSkip}
            className="mt-8 mx-auto block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:scale-105 transition-transform"
          >
            {stage === "complete" ? "Close" : "Continue"}
          </button>
        </div>
      )}

      {/* Skip button */}
      {stage !== "complete" && stage !== "rewards" && (
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 z-40 px-4 py-2 bg-gray-800 bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all"
        >
          Skip ⏭️
        </button>
      )}

      {/* Loot box info */}
      <div className="absolute bottom-4 left-4 z-30 text-white text-sm opacity-60">
        <div>{result.lootBox.name}</div>
        <div className="text-xs">Roll ID: {result.rollId.slice(0, 8)}</div>
      </div>
    </animated.div>
  );
}
