"use client";

import { LootBoxOpenResult } from "@/src/application/services/lootbox/LootBoxService";
import { animated, useSpring, useSpringValue } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";

interface SpiritDuelSummonAnimationProps {
  isOpen: boolean;
  result: LootBoxOpenResult | null;
  onClose: () => void;
  onAnimationStart?: () => void;
  onAnimationFinish?: () => void;
}

type AnimationStage =
  | "idle"
  | "spiritAppear"
  | "charging"
  | "clash"
  | "victory"
  | "reveal"
  | "finished";

const rarityColors: Record<string, string> = {
  common: "#9CA3AF",
  uncommon: "#10B981",
  rare: "#3B82F6",
  epic: "#A855F7",
  legendary: "#F59E0B",
  mythic: "#EF4444",
};

const rarityGlows: Record<string, string> = {
  common: "rgba(156, 163, 175, 0.5)",
  uncommon: "rgba(16, 185, 129, 0.6)",
  rare: "rgba(59, 130, 246, 0.7)",
  epic: "rgba(168, 85, 247, 0.8)",
  legendary: "rgba(245, 158, 11, 0.9)",
  mythic: "rgba(239, 68, 68, 1)",
};

export function SpiritDuelSummonAnimation({
  isOpen,
  result,
  onClose,
  onAnimationStart,
  onAnimationFinish,
}: SpiritDuelSummonAnimationProps) {
  const [stage, setStage] = useState<AnimationStage>("idle");
  const [chargeProgress, setChargeProgress] = useState(0);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; vx: number; vy: number }>
  >([]);
  const [showRarityHint, setShowRarityHint] = useState(false);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const highestRarity =
    result?.rewards.reduce((max, r) => {
      const rarityOrder = [
        "common",
        "uncommon",
        "rare",
        "epic",
        "legendary",
        "mythic",
      ];
      const currentIndex = rarityOrder.indexOf(r.rarity || "common");
      const maxIndex = rarityOrder.indexOf(max);
      return currentIndex > maxIndex ? r.rarity || "common" : max;
    }, "common") || "common";

  const rarityIndex = [
    "common",
    "uncommon",
    "rare",
    "epic",
    "legendary",
    "mythic",
  ].indexOf(highestRarity);
  const isHighRarity = rarityIndex >= 3; // epic or above

  const chargeValue = useSpringValue(0);

  const overlaySpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: { tension: 200, friction: 30 },
  });

  const spiritSpring = useSpring({
    opacity:
      stage === "spiritAppear" || stage === "charging" || stage === "clash"
        ? 1
        : 0,
    scale:
      stage === "spiritAppear" || stage === "charging" || stage === "clash"
        ? 1
        : 0.5,
    y: stage === "clash" ? -20 : 0,
    color: stage === "clash" && isHighRarity ? 1 : 0,
    config: { tension: 180, friction: 20 },
  });

  const playerSpring = useSpring({
    opacity: stage === "charging" || stage === "clash" ? 1 : 0,
    scale: stage === "charging" || stage === "clash" ? 1 : 0.8,
    y: stage === "clash" ? 20 : 0,
    config: { tension: 180, friction: 20 },
  });

  const clashSpring = useSpring({
    scale: stage === "clash" ? 3 : 0,
    opacity: stage === "clash" ? 1 : 0,
    config: { tension: 300, friction: 10 },
  });

  const victorySpring = useSpring({
    scale: stage === "victory" || stage === "reveal" ? 1 : 0,
    opacity: stage === "victory" || stage === "reveal" ? 1 : 0,
    config: { tension: 200, friction: 25 },
  });

  const rewardSpring = useSpring({
    opacity: stage === "reveal" ? 1 : 0,
    y: stage === "reveal" ? 0 : 50,
    scale: stage === "reveal" ? 1 : 0.5,
    config: { tension: 150, friction: 20 },
  });

  useEffect(() => {
    if (isOpen && result && stage === "idle") {
      onAnimationStart?.();
      setTimeout(() => setStage("spiritAppear"), 100);
    }

    // Reset state when modal closes
    if (!isOpen) {
      setStage("idle");
      setChargeProgress(0);
      setShowRarityHint(false);
      setParticles([]);
      chargeValue.start(0);
    }
  }, [isOpen, result, stage, onAnimationStart, chargeValue]);

  useEffect(() => {
    if (stage === "spiritAppear") {
      setTimeout(() => setStage("charging"), 1500);
    } else if (stage === "charging") {
      const startTime = Date.now();
      const duration = 2500;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        setChargeProgress(eased);
        chargeValue.start(eased * 100);

        // Show rarity hint when charge reaches 70% for high rarity
        if (isHighRarity && eased >= 0.7 && !showRarityHint) {
          setShowRarityHint(true);
        }

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setStage("clash");
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    } else if (stage === "clash") {
      const particleCount = isHighRarity ? 100 : 50;
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: 50,
        y: 50,
        vx: (Math.random() - 0.5) * (isHighRarity ? 15 : 10),
        vy: (Math.random() - 0.5) * (isHighRarity ? 15 : 10),
      }));
      setParticles(newParticles);

      setTimeout(
        () => {
          setStage("victory");
          setParticles([]);
        },
        isHighRarity ? 1500 : 1200
      );
    } else if (stage === "victory") {
      setTimeout(() => setStage("reveal"), 1000);
    }
  }, [stage, chargeValue, onAnimationFinish]);

  useEffect(() => {
    if (particles.length > 0) {
      const interval = setInterval(() => {
        setParticles((prev) =>
          prev
            .map((p) => ({
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
            }))
            .filter((p) => p.x > -10 && p.x < 110 && p.y > -10 && p.y < 110)
        );
      }, 50);

      return () => clearInterval(interval);
    }
  }, [particles.length]);

  const handleSkip = () => {
    setStage("reveal");
  };

  const handleClose = () => {
    onAnimationFinish?.();
    onClose();
  };

  if (!isOpen || !result) return null;

  return (
    <animated.div
      style={overlaySpring}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <div className="relative w-full h-full overflow-hidden">
        {/* Background with mystical gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-indigo-950 to-black">
          <div className="absolute inset-0 opacity-30">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 3}px`,
                  height: `${Math.random() * 3}px`,
                  animation: `twinkle ${2 + Math.random() * 3}s infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Spirit Guardian */}
        <animated.div
          style={{
            opacity: spiritSpring.opacity,
            transform: spiritSpring.scale.to(
              (s) => `scale(${s}) translateY(${spiritSpring.y.get()}px)`
            ),
          }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            {/* Spirit aura - changes color based on rarity */}
            <div
              className="absolute inset-0 blur-3xl opacity-60 scale-150 animate-pulse"
              style={{
                backgroundColor: isHighRarity
                  ? rarityColors[highestRarity]
                  : "#06b6d4",
              }}
            />

            {/* Extra intense glow for legendary+ */}
            {isHighRarity && (
              <div
                className="absolute inset-0 blur-2xl scale-200 animate-ping"
                style={{
                  backgroundColor: rarityColors[highestRarity],
                  animationDuration: "2s",
                }}
              />
            )}

            {/* Spirit body */}
            <div
              className="relative w-48 h-48 rounded-full flex items-center justify-center shadow-2xl"
              style={{
                background: isHighRarity
                  ? `linear-gradient(to bottom right, ${rarityColors[highestRarity]}, ${rarityColors[highestRarity]}dd)`
                  : "linear-gradient(to bottom right, #22d3ee, #2563eb)",
              }}
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-white to-cyan-200 opacity-80 animate-pulse" />
              <div
                className="absolute inset-0 rounded-full border-4 animate-spin"
                style={{
                  borderColor: isHighRarity
                    ? rarityColors[highestRarity]
                    : "#67e8f9",
                  animationDuration: isHighRarity ? "2s" : "3s",
                }}
              />
            </div>

            {stage === "spiritAppear" && (
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-cyan-300 text-xl font-bold whitespace-nowrap animate-pulse">
                Spirit Guardian Appears!
              </div>
            )}

            {/* Rarity hint during charging */}
            {showRarityHint && stage === "charging" && (
              <div
                className="absolute -top-20 left-1/2 -translate-x-1/2 text-2xl font-bold whitespace-nowrap animate-bounce"
                style={{
                  color: rarityColors[highestRarity],
                  textShadow: `0 0 20px ${rarityGlows[highestRarity]}, 0 0 40px ${rarityGlows[highestRarity]}`,
                }}
              >
                ✨ {highestRarity.toUpperCase()} ENERGY! ✨
              </div>
            )}
          </div>
        </animated.div>

        {/* Player casting */}
        <animated.div
          style={{
            opacity: playerSpring.opacity,
            transform: playerSpring.scale.to(
              (s) => `scale(${s}) translateY(${playerSpring.y.get()}px)`
            ),
          }}
          className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2"
        >
          <div className="relative">
            {/* Player aura */}
            <div className="absolute inset-0 blur-3xl bg-orange-500 opacity-60 scale-150 animate-pulse" />

            {/* Player body */}
            <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center shadow-2xl">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 opacity-80" />
            </div>

            {/* Charge bar */}
            {stage === "charging" && (
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-64">
                <div
                  className="h-6 rounded-full overflow-hidden border-2 transition-all duration-300"
                  style={{
                    backgroundColor: "#1f2937",
                    borderColor:
                      isHighRarity && chargeProgress > 0.7
                        ? rarityColors[highestRarity]
                        : "#eab308",
                  }}
                >
                  <div
                    className="h-full transition-all duration-100 relative overflow-hidden"
                    style={{
                      width: `${chargeProgress * 100}%`,
                      background:
                        isHighRarity && chargeProgress > 0.7
                          ? `linear-gradient(to right, ${rarityColors[highestRarity]}, ${rarityColors[highestRarity]}cc)`
                          : "linear-gradient(to right, #facc15, #f97316, #ef4444)",
                    }}
                  >
                    <div className="w-full h-full bg-white opacity-30 animate-pulse" />
                    {isHighRarity && chargeProgress > 0.7 && (
                      <div className="absolute inset-0 bg-white opacity-20 animate-ping" />
                    )}
                  </div>
                </div>
                <div
                  className="text-center font-bold mt-2 transition-all duration-300"
                  style={{
                    color:
                      isHighRarity && chargeProgress > 0.7
                        ? rarityColors[highestRarity]
                        : "#fde047",
                  }}
                >
                  {isHighRarity && chargeProgress > 0.7 ? (
                    <span className="animate-pulse text-lg">
                      ⚡ OVERWHELMING POWER ⚡{" "}
                      {Math.floor(chargeProgress * 100)}%
                    </span>
                  ) : (
                    <span>
                      Charging Power... {Math.floor(chargeProgress * 100)}%
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </animated.div>

        {/* Clash effect */}
        {stage === "clash" && (
          <>
            <animated.div
              style={{
                transform: clashSpring.scale.to((s) => `scale(${s})`),
                opacity: clashSpring.opacity,
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div
                className="w-64 h-64 rounded-full blur-3xl"
                style={{
                  backgroundColor: isHighRarity
                    ? rarityColors[highestRarity]
                    : "white",
                }}
              />
            </animated.div>

            {/* Extra explosion rings for high rarity */}
            {isHighRarity && (
              <>
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-4 animate-ping"
                  style={{
                    borderColor: rarityColors[highestRarity],
                    animationDuration: "0.8s",
                  }}
                />
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full border-4 animate-ping"
                  style={{
                    borderColor: rarityColors[highestRarity],
                    animationDuration: "1s",
                    animationDelay: "0.1s",
                  }}
                />
              </>
            )}

            {/* Particles */}
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: isHighRarity ? "4px" : "3px",
                  height: isHighRarity ? "4px" : "3px",
                  backgroundColor: isHighRarity
                    ? rarityColors[highestRarity]
                    : "white",
                  boxShadow: `0 0 ${isHighRarity ? "15px" : "10px"} ${
                    isHighRarity
                      ? rarityGlows[highestRarity]
                      : "rgba(255, 255, 255, 0.8)"
                  }`,
                }}
              />
            ))}

            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold animate-pulse"
              style={{
                fontSize: isHighRarity ? "5rem" : "2.25rem",
                color: isHighRarity ? rarityColors[highestRarity] : "white",
                textShadow: `0 0 30px ${
                  isHighRarity
                    ? rarityGlows[highestRarity]
                    : "rgba(255, 255, 255, 0.8)"
                }`,
              }}
            >
              {isHighRarity ? "💥 CRITICAL CLASH! 💥" : "CLASH!"}
            </div>
          </>
        )}

        {/* Victory */}
        <animated.div
          style={{
            transform: victorySpring.scale.to((s) => `scale(${s})`),
            opacity: victorySpring.opacity,
          }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          {stage === "victory" && (
            <div className="text-center">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse">
                VICTORY!
              </div>
              <div className="text-2xl text-cyan-300 mt-4">
                Spirit Yields to Your Power
              </div>
            </div>
          )}
        </animated.div>

        {/* Reward Reveal */}
        <animated.div
          style={{
            opacity: rewardSpring.opacity,
            transform: rewardSpring.y.to(
              (y) => `translateY(${y}px) scale(${rewardSpring.scale.get()})`
            ),
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          {stage === "reveal" && (
            <div className="text-center">
              <div className="mb-8 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Sacred Rewards Bestowed
              </div>

              <div className="flex flex-wrap justify-center gap-6 max-w-4xl">
                {result.rewards.map((reward, idx) => {
                  const rarity = reward.rarity || "common";
                  const color = rarityColors[rarity];
                  const glow = rarityGlows[rarity];

                  return (
                    <div
                      key={idx}
                      className="relative group"
                      style={{
                        animation: `float 3s ease-in-out infinite`,
                        animationDelay: `${idx * 0.1}s`,
                      }}
                    >
                      <div
                        className="absolute inset-0 blur-2xl opacity-60 rounded-2xl"
                        style={{ backgroundColor: glow }}
                      />

                      <div
                        className="relative bg-gray-900 bg-opacity-80 p-6 rounded-2xl border-2 backdrop-blur-sm min-w-[200px]"
                        style={{ borderColor: color }}
                      >
                        {reward.featured && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                            FEATURED
                          </div>
                        )}

                        <div
                          className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl font-bold"
                          style={{
                            backgroundColor: color,
                            boxShadow: `0 0 30px ${glow}`,
                          }}
                        >
                          {String.fromCodePoint(0x2728)}
                        </div>

                        <div className="text-white font-bold mb-1">
                          {(reward.item as any)?.name || "Mysterious Item"}
                        </div>

                        <div
                          className="text-sm font-semibold mb-2 uppercase"
                          style={{ color }}
                        >
                          {rarity}
                        </div>

                        <div className="text-gray-300 text-sm">
                          Quantity: {reward.quantity}
                        </div>

                        {reward.guaranteeSource && (
                          <div className="text-xs text-yellow-400 mt-2">
                            ⭐ Guaranteed
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleClose}
                className="mt-12 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-full text-lg shadow-2xl transition-all transform hover:scale-105"
              >
                Claim Rewards
              </button>
            </div>
          )}
        </animated.div>

        {/* Skip button */}
        {stage !== "reveal" && (
          <button
            onClick={handleSkip}
            className="absolute top-8 right-8 px-4 py-2 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white rounded-lg transition-all"
          >
            Skip →
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </animated.div>
  );
}
