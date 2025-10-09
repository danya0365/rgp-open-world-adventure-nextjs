"use client";

import { TreasureMarker } from "@/src/domain/types/location.types";
import { X, Gem, Sparkles, Coins } from "lucide-react";
import { useState } from "react";

interface TreasureModalProps {
  treasure: TreasureMarker;
  isOpen: boolean;
  onClose: () => void;
  onCollect?: (treasureId: string) => void;
}

// Mock treasure contents (TODO: Replace with actual treasure data)
const MOCK_TREASURE_CONTENTS = {
  gold: Math.floor(Math.random() * 500) + 100,
  items: [
    { name: "Health Potion", quantity: Math.floor(Math.random() * 3) + 1, icon: "💊" },
    { name: "Mana Potion", quantity: Math.floor(Math.random() * 2) + 1, icon: "🧪" },
  ],
};

export function TreasureModal({
  treasure,
  isOpen,
  onClose,
  onCollect,
}: TreasureModalProps) {
  const [isCollected, setIsCollected] = useState(treasure.isDiscovered || false);
  const [showRewards, setShowRewards] = useState(false);

  if (!isOpen) return null;

  const handleCollect = () => {
    setShowRewards(true);
    setTimeout(() => {
      setIsCollected(true);
      onCollect?.(treasure.treasureId);
    }, 1500);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[9998] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-2xl animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-br from-amber-900 to-yellow-900 rounded-2xl shadow-2xl border-4 border-yellow-600 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-600 to-amber-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                <Gem className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {treasure.name || "Treasure Chest"}
                </h2>
                <div className="flex items-center gap-1 text-yellow-200 text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>{isCollected ? "Already Opened" : "Unopened"}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isCollected ? (
              /* Already Opened */
              <div className="text-center py-8">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-600/50 flex items-center justify-center border-4 border-gray-500">
                  <Gem className="w-16 h-16 text-gray-400" />
                </div>
                <p className="text-white text-xl mb-2">This chest has already been opened.</p>
                <p className="text-gray-300">There&apos;s nothing left inside.</p>
              </div>
            ) : showRewards ? (
              /* Showing Rewards */
              <div className="text-center py-8 animate-in zoom-in duration-500">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center border-4 border-yellow-300 animate-bounce">
                  <Sparkles className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-yellow-300 mb-6">You found:</h3>
                
                {/* Gold */}
                <div className="bg-yellow-800/50 rounded-lg p-4 mb-4 flex items-center justify-center gap-3">
                  <Coins className="w-8 h-8 text-yellow-400" />
                  <span className="text-2xl font-bold text-yellow-300">
                    {MOCK_TREASURE_CONTENTS.gold} Gold
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {MOCK_TREASURE_CONTENTS.items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-amber-800/50 rounded-lg p-3 flex items-center justify-between animate-in slide-in-from-bottom duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-white font-semibold">{item.name}</span>
                      </div>
                      <span className="text-yellow-300 font-bold">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Unopened Chest */
              <div className="text-center py-8">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center border-4 border-yellow-300 animate-pulse">
                  <Gem className="w-16 h-16 text-white" />
                </div>
                <p className="text-white text-xl mb-6">
                  You found a mysterious treasure chest!
                </p>
                <p className="text-yellow-200 mb-8">
                  What treasures lie within? Open it to find out!
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              {!isCollected && !showRewards ? (
                <>
                  <button
                    onClick={handleCollect}
                    className="flex-1 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Gem className="w-5 h-5" />
                    Open Chest
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all"
                  >
                    Leave
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                >
                  {showRewards ? "Collect & Close" : "Close"}
                </button>
              )}
            </div>
          </div>

          {/* Sparkle Effects */}
          {!isCollected && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-ping" />
              <div className="absolute top-20 right-20 w-2 h-2 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
              <div className="absolute bottom-20 left-20 w-2 h-2 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: "1s" }} />
              <div className="absolute bottom-10 right-10 w-2 h-2 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: "1.5s" }} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
