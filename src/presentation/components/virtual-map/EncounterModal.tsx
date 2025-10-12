"use client";

import { getEnemyById } from "@/src/data/master/enemies.master";
import { ActiveEncounter } from "@/src/domain/types/encounter.types";
import { Flag, Swords, X } from "lucide-react";
import { useState } from "react";

interface EncounterModalProps {
  encounter: ActiveEncounter;
  onFight: () => void;
  onFlee: () => void;
  onClose: () => void;
}

export function EncounterModal({
  encounter,
  onFight,
  onFlee,
  onClose,
}: EncounterModalProps) {
  const [isFleeingAttempt, setIsFleeingAttempt] = useState(false);

  // Get enemy data
  const enemies = encounter.enemies
    .map((id) => getEnemyById(id))
    .filter((e): e is NonNullable<typeof e> => e !== null);

  // Group enemies by ID for display
  const enemyGroups = new Map<
    string,
    { enemy: NonNullable<ReturnType<typeof getEnemyById>>; count: number }
  >();
  enemies.forEach((enemy) => {
    const existing = enemyGroups.get(enemy.id);
    if (existing) {
      existing.count++;
    } else {
      enemyGroups.set(enemy.id, { enemy, count: 1 });
    }
  });

  const uniqueEnemies = Array.from(enemyGroups.values());

  const handleFight = () => {
    onFight();
  };

  const handleFlee = () => {
    setIsFleeingAttempt(true);

    // Calculate flee chance
    const success = Math.random() * 100 < encounter.fleeChance;

    setTimeout(() => {
      if (success) {
        onFlee();
        onClose();
      } else {
        // Failed to flee, must fight
        alert("Failed to flee! You must fight!");
        handleFight();
      }
      setIsFleeingAttempt(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl mx-4 bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-red-500/50 rounded-xl shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-red-900/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 border border-red-500 rounded-lg">
              <Swords className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Enemy Encounter!</h2>
              <p className="text-xs text-gray-400">A wild enemy appeared!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 mb-6 text-center text-lg">
            You encountered{" "}
            <span className="text-red-400 font-bold">
              {encounter.enemies.length}
            </span>{" "}
            {encounter.enemies.length === 1 ? "enemy" : "enemies"}!
          </p>

          {/* Enemy Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
            {uniqueEnemies.map(({ enemy, count }) => (
              <div
                key={enemy.id}
                className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-red-500/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-red-900/30 border border-red-500/50 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-2xl">👹</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">
                      {enemy.name}
                    </h3>
                    <p className="text-xs text-gray-400">Lv {enemy.level}</p>
                  </div>
                  {count > 1 && (
                    <div className="px-2 py-1 bg-red-500/20 border border-red-500 rounded text-xs text-red-400 font-bold shrink-0">
                      x{count}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">HP:</span>
                    <span className="text-white font-semibold">
                      {enemy.stats.hp}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ATK:</span>
                    <span className="text-white font-semibold">
                      {enemy.stats.atk}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">DEF:</span>
                    <span className="text-white font-semibold">
                      {enemy.stats.def}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">AGI:</span>
                    <span className="text-white font-semibold">
                      {enemy.stats.agi}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleFight}
              disabled={isFleeingAttempt}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/50"
            >
              <Swords className="w-5 h-5" />
              Fight!
            </button>
            {encounter.canFlee && (
              <button
                onClick={handleFlee}
                disabled={isFleeingAttempt}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Flag className="w-5 h-5" />
                {isFleeingAttempt
                  ? "Fleeing..."
                  : `Flee (${encounter.fleeChance}%)`}
              </button>
            )}
          </div>

          {/* Hint */}
          <p className="text-xs text-gray-500 text-center mt-4">
            💡 Tip: Higher AGI increases your flee chance!
          </p>
        </div>
      </div>
    </div>
  );
}
