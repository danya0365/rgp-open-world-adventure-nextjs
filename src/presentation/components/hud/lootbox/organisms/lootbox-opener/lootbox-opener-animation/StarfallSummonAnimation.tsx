"use client";

import { LootBoxOpenResult } from "@/src/application/services/lootbox/LootBoxService";
import { animated, config, useSpring, useTrail } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";

interface StarfallSummonAnimationProps {
  isOpen: boolean;
  result: LootBoxOpenResult | null;
  onClose: () => void;
  onAnimationStart?: () => void;
  onAnimationFinish?: () => void;
}

const RARITY_COLORS: Record<string, string> = {
  common: "#94a3b8",
  uncommon: "#22c55e",
  rare: "#3b82f6",
  epic: "#a855f7",
  legendary: "#eab308",
  mythic: "#ef4444",
};

const RARITY_GLOW: Record<string, string> = {
  common: "rgba(148, 163, 184, 0.5)",
  uncommon: "rgba(34, 197, 94, 0.5)",
  rare: "rgba(59, 130, 246, 0.5)",
  epic: "rgba(168, 85, 247, 0.5)",
  legendary: "rgba(234, 179, 8, 0.5)",
  mythic: "rgba(239, 68, 68, 0.5)",
};

export function StarfallSummonAnimation({
  isOpen,
  result,
  onClose,
  onAnimationStart,
  onAnimationFinish,
}: StarfallSummonAnimationProps) {
  const [phase, setPhase] = useState<
    "idle" | "prayer" | "starfall" | "reveal" | "display"
  >("idle");
  const [stars, setStars] = useState<
    Array<{ id: number; x: number; delay: number; rarity?: string }>
  >([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationTriggeredRef = useRef(false);

  const isMultiSummon = (result?.rewards.length ?? 0) > 1;

  useEffect(() => {
    if (isOpen && result && !animationTriggeredRef.current) {
      animationTriggeredRef.current = true;
      onAnimationStart?.();
      setPhase("prayer");

      const timer1 = setTimeout(() => {
        setPhase("starfall");

        if (isMultiSummon) {
          const newStars = result.rewards.map((reward, i) => ({
            id: i,
            x: 10 + (i * 80) / result.rewards.length,
            delay: i * 150,
            rarity: reward.rarity,
          }));
          setStars(newStars);
        } else {
          setStars([
            {
              id: 0,
              x: 50,
              delay: 0,
              rarity: result.rewards[0]?.rarity,
            },
          ]);
        }
      }, 1500);

      const timer2 = setTimeout(
        () => {
          setPhase("reveal");
        },
        isMultiSummon ? 3500 : 2500
      );

      const timer3 = setTimeout(
        () => {
          setPhase("display");
          onAnimationFinish?.();
        },
        isMultiSummon ? 4500 : 3500
      );

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else if (!isOpen) {
      setPhase("idle");
      setStars([]);
      animationTriggeredRef.current = false;
    }
  }, [isOpen, result]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const bgStars: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
    }> = [];
    for (let i = 0; i < 100; i++) {
      bgStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        opacity: Math.random(),
        speed: 0.1 + Math.random() * 0.3,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bgStars.forEach((star) => {
        star.opacity += star.speed * (Math.random() > 0.5 ? 1 : -1);
        if (star.opacity > 1) star.opacity = 1;
        if (star.opacity < 0.1) star.opacity = 0.1;

        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [isOpen]);

  const overlaySpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: config.molasses,
  });

  const prayerSpring = useSpring({
    opacity: phase === "prayer" ? 1 : 0,
    transform: phase === "prayer" ? "scale(1)" : "scale(0.8)",
    config: config.gentle,
  });

  const starTrail = useTrail(stars.length, {
    from: { top: -100, opacity: 0 },
    to:
      phase === "starfall" || phase === "reveal" || phase === "display"
        ? { top: window.innerHeight / 2, opacity: 1 }
        : { top: -100, opacity: 0 },
    config: { tension: 200, friction: 30 },
  });

  const revealSpring = useSpring({
    opacity: phase === "reveal" || phase === "display" ? 1 : 0,
    scale: phase === "reveal" || phase === "display" ? 1 : 0.5,
    config: { tension: 300, friction: 20 },
  });

  const rewardTrail = useTrail(result?.rewards.length ?? 0, {
    from: { opacity: 0, transform: "translateY(30px) scale(0.8)" },
    to:
      phase === "display"
        ? { opacity: 1, transform: "translateY(0px) scale(1)" }
        : { opacity: 0, transform: "translateY(30px) scale(0.8)" },
    config: config.wobbly,
  });

  if (!isOpen) return null;

  return (
    <animated.div
      style={overlaySpring}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800"
      />

      {phase === "prayer" && (
        <animated.div
          style={prayerSpring}
          className="absolute inset-0 flex flex-col items-center justify-center z-10"
        >
          <div className="text-6xl mb-8 animate-pulse">🤲</div>
          <div className="text-2xl text-white font-bold tracking-wider">
            บิสมิลลาฮิรเราะห์มานิรเราะฮีม...
          </div>
          <div className="text-lg text-slate-300 mt-2">ขออัลลอฮฺประทานพร</div>
        </animated.div>
      )}

      {(phase === "starfall" || phase === "reveal") && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {starTrail.map((style, i) => {
            const star = stars[i];
            const rarity = star?.rarity || "common";
            const color = RARITY_COLORS[rarity] || RARITY_COLORS.common;

            return (
              <animated.div
                key={star?.id ?? i}
                style={{
                  ...style,
                  left: `${star?.x ?? 50}%`,
                  position: "absolute",
                }}
                className="transform -translate-x-1/2"
              >
                <div
                  className="relative w-8 h-8"
                  style={{
                    filter: `drop-shadow(0 0 20px ${color})`,
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${color}, transparent)`,
                      animation: "pulse 1s ease-in-out infinite",
                    }}
                  />
                  <div className="absolute inset-0 text-4xl flex items-center justify-center">
                    ⭐
                  </div>
                </div>
                <div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-32 opacity-60"
                  style={{
                    background: `linear-gradient(to bottom, ${color}, transparent)`,
                  }}
                />
              </animated.div>
            );
          })}
        </div>
      )}

      {phase === "reveal" && (
        <animated.div
          style={{
            opacity: revealSpring.opacity,
            transform: revealSpring.scale.to((s) => `scale(${s})`),
          }}
          className="absolute inset-0 z-30 flex items-center justify-center"
        >
          <div className="text-white text-4xl font-bold animate-pulse">
            ✨ {isMultiSummon ? "ฝนดาวตก!" : "ดาวตกลงมา!"} ✨
          </div>
        </animated.div>
      )}

      {phase === "display" && result && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-8 overflow-auto">
          <div
            className={`grid gap-6 ${
              isMultiSummon
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-1"
            } max-w-6xl w-full`}
          >
            {rewardTrail.map((style, i) => {
              const reward = result.rewards[i];
              if (!reward) return null;

              const rarity = reward.rarity || "common";
              const color = RARITY_COLORS[rarity];
              const glow = RARITY_GLOW[rarity];

              return (
                <animated.div
                  key={i}
                  className="relative bg-slate-800/90 backdrop-blur rounded-xl p-6 border-2"
                  style={{
                    ...style,
                    borderColor: color,
                    boxShadow: `0 0 30px ${glow}, inset 0 0 20px ${glow}`,
                  }}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
                      style={{
                        background: `radial-gradient(circle, ${glow}, transparent)`,
                      }}
                    >
                      {reward.featured ? "🌟" : "🎁"}
                    </div>

                    <div className="text-center">
                      <div
                        className="text-sm font-bold uppercase tracking-wider mb-1"
                        style={{ color }}
                      >
                        {rarity}
                        {reward.featured && " ⭐ Featured"}
                      </div>
                      <div className="text-white font-semibold">
                        {(reward.item as any)?.name || "ไอเทมลึกลับ"}
                      </div>
                      {reward.quantity > 1 && (
                        <div className="text-slate-300 text-sm">
                          x{reward.quantity}
                        </div>
                      )}
                      {reward.guaranteeSource && (
                        <div className="text-yellow-400 text-xs mt-2">
                          ✓ {reward.guaranteeSource}
                        </div>
                      )}
                    </div>
                  </div>
                </animated.div>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full hover:from-blue-500 hover:to-purple-500 transition-all transform hover:scale-105 shadow-lg"
          >
            ปิด
          </button>

          {result.guaranteeHits.length > 0 && (
            <div className="mt-4 text-yellow-400 text-sm">
              🎯 Guarantee Hit:{" "}
              {result.guaranteeHits.map((h) => h.rule.guaranteeType).join(", ")}
            </div>
          )}
        </div>
      )}
    </animated.div>
  );
}
