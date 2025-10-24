"use client";

import { LootBoxOpenResult } from "@/src/application/services/lootbox/LootBoxService";
import { animated, useSpring, useSpringValue } from "@react-spring/web";
import { Shield, Sparkles, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DuelOfFateSummonAnimationProps {
  isOpen: boolean;
  result: LootBoxOpenResult | null;
  onClose: () => void;
  onAnimationStart?: () => void;
  onAnimationFinish?: () => void;
}

type AnimationPhase =
  | "idle"
  | "hero-enter"
  | "enemy-spawn"
  | "clash-ready"
  | "qte-active"
  | "power-clash"
  | "victory"
  | "defeat"
  | "reward-reveal";

const rarityColors: Record<string, string> = {
  common: "rgb(156, 163, 175)",
  uncommon: "rgb(34, 197, 94)",
  rare: "rgb(59, 130, 246)",
  epic: "rgb(168, 85, 247)",
  legendary: "rgb(234, 179, 8)",
};

export function DuelOfFateSummonAnimation({
  isOpen,
  result,
  onClose,
  onAnimationStart,
  onAnimationFinish,
}: DuelOfFateSummonAnimationProps) {
  const [phase, setPhase] = useState<AnimationPhase>("idle");
  const [qtePressed, setQtePressed] = useState(false);
  const [playerPower, setPlayerPower] = useState(0);
  const [enemyPower, setEnemyPower] = useState(0);
  const [isVictory, setIsVictory] = useState(false);
  const qteTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ตรวจสอบว่าได้ของหายากหรือไม่
  const hasRareReward =
    result?.rewards.some(
      (r) => r.rarity && ["rare", "epic", "legendary"].includes(r.rarity)
    ) || false;

  // Animation values
  const overlaySpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: { tension: 280, friction: 60 },
  });

  const heroSpring = useSpring({
    opacity:
      phase === "hero-enter" ||
      phase === "clash-ready" ||
      phase === "qte-active" ||
      phase === "power-clash"
        ? 1
        : 0,
    transform:
      phase === "hero-enter" ||
      phase === "clash-ready" ||
      phase === "qte-active" ||
      phase === "power-clash"
        ? "translateY(0px) scale(1)"
        : "translateY(50px) scale(0.8)",
    config: { tension: 200, friction: 20 },
  });

  const enemySpring = useSpring({
    opacity:
      phase === "enemy-spawn" ||
      phase === "clash-ready" ||
      phase === "qte-active" ||
      phase === "power-clash"
        ? 1
        : 0,
    transform:
      phase === "enemy-spawn" ||
      phase === "clash-ready" ||
      phase === "qte-active" ||
      phase === "power-clash"
        ? "translateY(0px) scale(1)"
        : "translateY(-50px) scale(0.8)",
    config: { tension: 200, friction: 20 },
  });

  const playerBeamScale = useSpringValue(0);
  const enemyBeamScale = useSpringValue(0);

  const rewardSpring = useSpring({
    opacity: phase === "reward-reveal" ? 1 : 0,
    transform: phase === "reward-reveal" ? "scale(1)" : "scale(0.5)",
    config: { tension: 200, friction: 15 },
  });

  // Animation sequence
  useEffect(() => {
    if (!isOpen || !result) {
      setPhase("idle");
      return;
    }

    onAnimationStart?.();

    const sequence = async () => {
      // Phase 1: Hero enters
      setPhase("hero-enter");
      await delay(1500);

      // Phase 2: Enemy spawns
      setPhase("enemy-spawn");
      await delay(1500);

      // Phase 3: Ready to clash
      setPhase("clash-ready");
      await delay(800);

      // Phase 4: QTE Active
      setPhase("qte-active");
      const qteResult = await handleQTE();

      // Phase 5: Power clash
      setPhase("power-clash");
      playerBeamScale.start(1, { config: { tension: 100, friction: 10 } });
      enemyBeamScale.start(1, { config: { tension: 100, friction: 10 } });

      const playerVal = qteResult ? 100 : 50;
      const enemyVal = hasRareReward ? 40 : 80;

      await animatePowerValues(playerVal, enemyVal);
      await delay(1000);

      // Phase 6: Victory or Defeat
      if (playerPower > enemyPower) {
        setIsVictory(true);
        setPhase("victory");
      } else {
        setIsVictory(false);
        setPhase("defeat");
      }
      await delay(2000);

      // Phase 7: Reward reveal
      setPhase("reward-reveal");
      await delay(3000);

      onAnimationFinish?.();
    };

    sequence();
  }, [isOpen, result]);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleQTE = (): Promise<boolean> => {
    return new Promise((resolve) => {
      setQtePressed(false);
      qteTimerRef.current = setTimeout(() => {
        resolve(qtePressed);
      }, 2000);
    });
  };

  const animatePowerValues = async (
    playerTarget: number,
    enemyTarget: number
  ) => {
    const steps = 30;
    const delay = 50;

    for (let i = 0; i <= steps; i++) {
      setPlayerPower(Math.floor((playerTarget / steps) * i));
      setEnemyPower(Math.floor((enemyTarget / steps) * i));
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  };

  const handleQTEPress = () => {
    if (phase === "qte-active" && !qtePressed) {
      setQtePressed(true);
      if (qteTimerRef.current) {
        clearTimeout(qteTimerRef.current);
      }
    }
  };

  const handleSkip = () => {
    setPhase("reward-reveal");
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <animated.div
      style={overlaySpring}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      onClick={phase === "reward-reveal" ? onClose : undefined}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-indigo-950 to-black">
        <div className="absolute inset-0 opacity-30">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                width: Math.random() * 3 + 1 + "px",
                height: Math.random() * 3 + 1 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                animationDelay: Math.random() * 2 + "s",
                animationDuration: Math.random() * 3 + 2 + "s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Skip Button */}
      {phase !== "reward-reveal" && (
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 z-50 px-4 py-2 bg-gray-800/80 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Skip
        </button>
      )}

      {/* Main Stage */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Magic Circle */}
        <div className="absolute bottom-1/4 w-96 h-96">
          <div
            className="w-full h-full border-4 border-cyan-400/50 rounded-full animate-spin"
            style={{ animationDuration: "10s" }}
          />
          <div
            className="absolute inset-4 border-2 border-purple-400/50 rounded-full animate-spin"
            style={{ animationDuration: "8s", animationDirection: "reverse" }}
          />
        </div>

        {/* Hero */}
        <animated.div
          style={heroSpring}
          className="absolute bottom-1/4 left-1/4 flex flex-col items-center"
        >
          <div className="relative">
            <Shield className="w-24 h-24 text-cyan-400" />
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse" />
          </div>
          <p className="mt-2 text-cyan-300 font-bold">Your Hero</p>
          {phase === "power-clash" && (
            <div className="mt-2 text-2xl font-bold text-cyan-400">
              {playerPower}%
            </div>
          )}
        </animated.div>

        {/* Enemy */}
        <animated.div
          style={enemySpring}
          className="absolute top-1/4 right-1/4 flex flex-col items-center"
        >
          <div className="relative">
            <Zap className="w-24 h-24 text-red-500" />
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
          </div>
          <p className="mt-2 text-red-400 font-bold">Guardian of Fate</p>
          {phase === "power-clash" && (
            <div className="mt-2 text-2xl font-bold text-red-400">
              {enemyPower}%
            </div>
          )}
        </animated.div>

        {/* Power Beams */}
        {phase === "power-clash" && (
          <>
            <animated.div
              style={{
                scaleX: playerBeamScale,
                transformOrigin: "left",
              }}
              className="absolute left-1/4 bottom-1/3 w-1/4 h-4 bg-gradient-to-r from-cyan-400 to-cyan-600 blur-sm"
            />
            <animated.div
              style={{
                scaleX: enemyBeamScale,
                transformOrigin: "right",
              }}
              className="absolute right-1/4 top-1/3 w-1/4 h-4 bg-gradient-to-l from-red-500 to-red-700 blur-sm"
            />
          </>
        )}

        {/* QTE Prompt */}
        {phase === "qte-active" && (
          <div
            onClick={handleQTEPress}
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
          >
            <div className="bg-yellow-500/90 px-12 py-8 rounded-2xl animate-pulse shadow-2xl">
              <p className="text-4xl font-bold text-black text-center">
                TAP TO UNLEASH POWER!
              </p>
              <Sparkles className="w-16 h-16 mx-auto mt-4 text-black animate-spin" />
            </div>
          </div>
        )}

        {/* Victory/Defeat */}
        {(phase === "victory" || phase === "defeat") && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`text-6xl font-bold ${
                isVictory ? "text-yellow-400" : "text-gray-400"
              }`}
            >
              {isVictory ? "VICTORY!" : "Next time..."}
            </div>
          </div>
        )}

        {/* Reward Reveal */}
        {phase === "reward-reveal" && result && (
          <animated.div
            style={rewardSpring}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <div className="bg-gray-900/95 rounded-2xl p-8 max-w-2xl max-h-[80vh] overflow-y-auto">
              <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Your Rewards
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {result.rewards.map((reward, idx) => {
                  const color = reward.rarity
                    ? rarityColors[reward.rarity]
                    : rarityColors.common;
                  return (
                    <div
                      key={idx}
                      className="bg-gray-800 rounded-lg p-4 border-2 transition hover:scale-105"
                      style={{ borderColor: color }}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <Sparkles style={{ color }} className="w-12 h-12" />
                      </div>
                      <p className="text-white text-center font-semibold">
                        {(reward.item as any).name || "Unknown Item"}
                      </p>
                      <p className="text-gray-400 text-center text-sm">
                        x{reward.quantity}
                      </p>
                      {reward.rarity && (
                        <p
                          className="text-center text-xs font-bold mt-1 uppercase"
                          style={{ color }}
                        >
                          {reward.rarity}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={onClose}
                className="mt-6 w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition"
              >
                Continue
              </button>
            </div>
          </animated.div>
        )}
      </div>
    </animated.div>
  );
}
