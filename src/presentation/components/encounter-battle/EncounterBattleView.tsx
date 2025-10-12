"use client";

import { useBattlePresenter } from "@/src/presentation/presenters/battle/useBattlePresenter";
import { useBattleSessionStore } from "@/src/stores/battleSessionStore";
import {
  Heart,
  Shield,
  Skull,
  Swords,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BattleLog } from "../battle/BattleLog";
import BattleTileView from "../battle/BattleTileView";

interface EncounterBattleViewProps {
  onForfeit: () => void;
  onVictory: (rewards: {
    exp: number;
    gold: number;
    items: { itemId: string; quantity: number }[];
  }) => void;
  onDefeat: () => void;
}

export function EncounterBattleView({
  onForfeit,
  onVictory,
  onDefeat,
}: EncounterBattleViewProps) {
  const { currentSession, clearSession } = useBattleSessionStore();
  const [showBattleLog, setShowBattleLog] = useState(true);
  const [showCurrentUnit, setShowCurrentUnit] = useState(true);
  const [showTeamPanels, setShowTeamPanels] = useState(true);
  const [showSurrenderModal, setShowSurrenderModal] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const hasResetRef = useRef(false);

  // Prepare initial view model from battle session
  const initialViewModel = currentSession
    ? {
        battleMap: currentSession.battleMap,
        characters: currentSession.allies,
        enemies: currentSession.enemies,
      }
    : null;

  // Presenter - handles ALL state and business logic
  // Must be called before any conditional returns (React Hooks rules)
  const {
    battleStateId,
    battleMap,
    loading,
    allyUnits: storeAllyUnits,
    enemyUnits: storeEnemyUnits,
    turn,
    phase,
    rewards,
    battleLogs,
    currentUnit,
    aliveTurnOrder,
    handleTileClick,
    handlePlayEnemyTurn,
    handleEndTurn,
    handleResetBattle,
    handleRestartBattle,
    handleClearLogs,
    getUnitAtPosition,
    isTileInMovementRange,
    isTileInAttackRange,
  } = useBattlePresenter(currentSession?.battleMap.id || "", initialViewModel);

  // Reset battle state only if it's a NEW session (not continuing existing battle)
  useEffect(() => {
    if (currentSession && !hasResetRef.current && !battleStateId) {
      hasResetRef.current = true;
      handleResetBattle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount - intentionally empty deps

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // If no session, show error (after all hooks)
  if (!currentSession) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center z-99">
        <div className="text-center">
          <p className="text-red-400 mb-4">❌ No active battle session</p>
          <button
            onClick={onForfeit}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            กลับ
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading && !battleMap) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center z-99">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">กำลังโหลดสนามรบ...</p>
        </div>
      </div>
    );
  }

  if (!battleMap) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center z-99">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">กำลังเตรียมสนามรบ</p>
        </div>
      </div>
    );
  }

  // Victory Screen
  if (phase === "victory") {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center z-99 p-4">
        <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center">
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Victory!</h1>
          <p className="text-gray-400 mb-6">คุณชนะการต่อสู้!</p>

          {rewards && (
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-bold text-white mb-3">Rewards</h2>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-400">EXP:</span>
                  <span className="text-green-400 font-bold">
                    +{rewards.exp}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Gold:</span>
                  <span className="text-yellow-400 font-bold">
                    +{rewards.gold}
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              handleResetBattle();
              clearSession();
              onVictory(rewards || { exp: 0, gold: 0, items: [] });
            }}
            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-semibold"
          >
            กลับแผนที่โลก
          </button>
        </div>
      </div>
    );
  }

  // Defeat Screen
  if (phase === "defeat") {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center z-99 p-4">
        <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center">
          <Skull className="w-20 h-20 text-red-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Defeat...</h1>
          <p className="text-gray-400 mb-6">คุณแพ้การต่อสู้</p>

          <button
            onClick={() => {
              handleResetBattle();
              clearSession();
              onDefeat();
            }}
            className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-semibold"
          >
            กลับแผนที่โลก
          </button>
        </div>
      </div>
    );
  }

  // Calculate viewport size (10x10 tiles as base)
  const TILE_SIZE = 60; // pixels
  const VIEWPORT_WIDTH = Math.min(10, battleMap.width);
  const VIEWPORT_HEIGHT = Math.min(10, battleMap.height);
  const needsScroll =
    battleMap.width > VIEWPORT_WIDTH || battleMap.height > VIEWPORT_HEIGHT;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex flex-col overflow-hidden z-[100]">
      {/* Header - Fixed Top */}
      <div className="flex-none bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSurrenderModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-800/50 text-red-300 border border-red-700/50 rounded-lg transition-colors"
              title="ยอมแพ้และออกจากการต่อสู้"
            >
              <Skull className="w-4 h-4" />
              ยอมแพ้
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {battleMap.name}
              </h1>
              <p className="text-gray-400 text-sm">
                {currentSession.location.name} - Encounter Battle
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-slate-800/50 rounded-lg">
              <p className="text-gray-400 text-sm">Turn</p>
              <p className="text-2xl font-bold text-white text-center">
                {turn}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Battle Area - Flex Grow */}
      <div className="flex-1 relative overflow-hidden">
        {/* Battle Map Container - Centered with Scrollable Viewport */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            ref={mapContainerRef}
            className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4"
            style={{
              maxWidth: needsScroll
                ? `${VIEWPORT_WIDTH * TILE_SIZE + 32}px`
                : "auto",
              maxHeight: needsScroll
                ? `${VIEWPORT_HEIGHT * TILE_SIZE + 32}px`
                : "auto",
            }}
          >
            {/* Scrollable Map Content */}
            <div
              className="overflow-auto"
              style={{
                maxWidth: needsScroll
                  ? `${VIEWPORT_WIDTH * TILE_SIZE}px`
                  : "auto",
                maxHeight: needsScroll
                  ? `${VIEWPORT_HEIGHT * TILE_SIZE}px`
                  : "auto",
              }}
            >
              <div
                className="grid mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${battleMap.width}, ${TILE_SIZE}px)`,
                  width: `${battleMap.width * TILE_SIZE}px`,
                }}
              >
                {Array.from({ length: battleMap.height }).map((_, y) =>
                  Array.from({ length: battleMap.width }).map((_, x) => {
                    const unit = getUnitAtPosition(x, y);
                    const tile = battleMap.tiles.find(
                      (t) => t.x === x && t.y === y
                    );
                    const isObstacle =
                      battleMap.obstacles?.some(
                        (obs) => obs.x === x && obs.y === y
                      ) || false;
                    const isInMoveRange = isTileInMovementRange(x, y);
                    const isInAttackRange = isTileInAttackRange(x, y);
                    const isCurrent = unit?.id === currentUnit?.id;

                    return (
                      <BattleTileView
                        key={`${x}-${y}`}
                        x={x}
                        y={y}
                        tile={tile}
                        isObstacle={isObstacle}
                        isInMoveRange={isInMoveRange}
                        isInAttackRange={isInAttackRange}
                        isCurrent={isCurrent}
                        unit={unit || null}
                        onClick={handleTileClick}
                        isAllyTurn={!!currentUnit?.isAlly}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* HUD Overlays */}
        {/* Current Unit Status - Top Left Overlay */}
        {currentUnit && (
          <div className="absolute top-4 left-4 max-w-md z-10">
            <div
              className={`p-4 rounded-lg border backdrop-blur-sm ${
                currentUnit.isAlly
                  ? "bg-blue-900/30 border-blue-500/30"
                  : "bg-orange-900/30 border-orange-500/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                    currentUnit.isAlly ? "bg-blue-600" : "bg-orange-600"
                  }`}
                >
                  {currentUnit.isAlly ? "🛡️" : "👹"}
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold">
                    {currentUnit.isAlly ? "🎮 Your Turn" : "⏳ Enemy Turn"} -{" "}
                    {currentUnit.character.name}
                  </p>
                  {currentUnit.isAlly && !currentUnit.hasActed ? (
                    <p className="text-gray-300 text-xs">
                      💡 คลิกช่อง
                      <span className="text-blue-400 font-semibold">
                        สีน้ำเงิน
                      </span>
                      เพื่อเคลื่อนที่ หรือศัตรูในช่อง
                      <span className="text-red-400 font-semibold">สีแดง</span>
                      เพื่อโจมตี
                    </p>
                  ) : currentUnit.isAlly && currentUnit.hasActed ? (
                    <p className="text-gray-400 text-xs">
                      ✅ ทำการเคลื่อนที่/โจมตีแล้ว - คลิก &quot;End Turn&quot;
                    </p>
                  ) : (
                    <p className="text-orange-300 text-xs">🤖 AI กำลังคิด...</p>
                  )}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-2 p-3 bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg">
              <p className="text-white font-semibold text-xs mb-2">📖 Legend</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {currentUnit?.isAlly ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-blue-900/50 border border-blue-500"></div>
                      <span className="text-gray-300">เคลื่อนที่ได้</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-red-900/50 border border-red-500"></div>
                      <span className="text-gray-300">โจมตีได้</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-orange-900/40 border border-orange-500"></div>
                      <span className="text-gray-300">ศัตรูเคลื่อนที่</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-red-900/40 border border-red-500"></div>
                      <span className="text-gray-300">ศัตรูโจมตี</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Battle Log - Top Right Overlay */}
        {showBattleLog && (
          <div className="absolute top-4 right-4 w-80 max-h-[500px] z-10">
            <div className="relative">
              <button
                onClick={() => setShowBattleLog(false)}
                className="absolute -top-2 -right-2 z-20 p-1 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
              <BattleLog logs={battleLogs} onClear={handleClearLogs} />
            </div>
          </div>
        )}

        {/* Show Battle Log Button */}
        {!showBattleLog && (
          <button
            onClick={() => setShowBattleLog(true)}
            className="absolute top-4 right-4 px-3 py-2 bg-slate-900/50 hover:bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg transition-colors text-white text-sm z-10"
          >
            📜 Battle Log
          </button>
        )}

        {/* Current Unit Panel - Right Side */}
        {showCurrentUnit && currentUnit && (
          <div className="absolute bottom-4 right-4 w-80 z-10">
            <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
              <button
                onClick={() => setShowCurrentUnit(false)}
                className="absolute -top-2 -right-2 z-20 p-1 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>

              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-400" />
                Current Turn
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      currentUnit.isAlly ? "bg-blue-600" : "bg-red-600"
                    }`}
                  >
                    {currentUnit.isAlly ? "🦸" : "👹"}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">
                      {currentUnit.character.name}
                    </p>
                    <p className="text-gray-400 text-xs capitalize">
                      {"class" in currentUnit.character
                        ? currentUnit.character.class
                        : currentUnit.character.type}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Heart className="w-3 h-3" /> HP
                      </span>
                      <span className="text-white">
                        {currentUnit.currentHp}/
                        {currentUnit.character.stats.maxHp}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{
                          width: `${
                            (currentUnit.currentHp /
                              currentUnit.character.stats.maxHp) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> MP
                      </span>
                      <span className="text-white">
                        {currentUnit.currentMp}/
                        {currentUnit.character.stats.maxMp}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{
                          width: `${
                            (currentUnit.currentMp /
                              currentUnit.character.stats.maxMp) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {!currentUnit.isAlly && (
                  <div className="space-y-2 pt-2 border-t border-slate-700">
                    <button
                      onClick={handlePlayEnemyTurn}
                      className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-semibold"
                    >
                      Play Enemy Turn
                    </button>
                  </div>
                )}
                {currentUnit.isAlly && (
                  <div className="space-y-2 pt-2 border-t border-slate-700">
                    <button
                      onClick={handleEndTurn}
                      className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-semibold"
                    >
                      End Turn
                    </button>
                  </div>
                )}
                {battleStateId && (
                  <div className="space-y-2 pt-2 border-t border-slate-700">
                    <button
                      onClick={handleRestartBattle}
                      className="w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-semibold"
                    >
                      Restart
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Show Current Unit Button */}
        {!showCurrentUnit && currentUnit && (
          <button
            onClick={() => setShowCurrentUnit(true)}
            className="absolute bottom-4 right-4 px-3 py-2 bg-slate-900/50 hover:bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg transition-colors text-white text-sm z-10"
          >
            👤 Current Unit
          </button>
        )}

        {/* Team Panels - Bottom Overlay */}
        {showTeamPanels && (
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="relative max-w-5xl mx-auto">
              <button
                onClick={() => setShowTeamPanels(false)}
                className="absolute -top-2 -right-2 z-20 p-1 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>

              <div className="grid grid-cols-3 gap-4">
                {/* Turn Order */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
                  <h2 className="text-sm font-bold text-white mb-2">
                    Turn Order
                  </h2>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {aliveTurnOrder.map((unit, index) => (
                      <div
                        key={unit.id}
                        className={`flex items-center gap-2 p-1.5 rounded-lg text-xs ${
                          unit.id === currentUnit?.id
                            ? "bg-green-900/30 border border-green-500/30"
                            : "bg-slate-800/50"
                        }`}
                      >
                        <div className="text-gray-400 text-xs w-4">
                          {index + 1}
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            unit.isAlly ? "bg-blue-600" : "bg-red-600"
                          }`}
                        >
                          {unit.isAlly ? "🦸" : "👹"}
                        </div>
                        <p className="text-white text-xs truncate flex-1">
                          {unit.character.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Allies */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
                  <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    Allies
                  </h2>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {storeAllyUnits.map((unit) => (
                      <div
                        key={unit.id}
                        className="flex items-center gap-2 p-1.5 bg-slate-800/50 rounded-lg"
                      >
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs">
                          🦸
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs truncate">
                            {unit.character.name}
                          </p>
                          <div className="flex items-center gap-1 text-[10px]">
                            <span className="text-gray-400">
                              HP: {unit.currentHp}/{unit.character.stats.maxHp}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enemies */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
                  <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Swords className="w-4 h-4 text-red-400" />
                    Enemies
                  </h2>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {storeEnemyUnits.map((unit) => (
                      <div
                        key={unit.id}
                        className="flex items-center gap-2 p-1.5 bg-slate-800/50 rounded-lg"
                      >
                        <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-xs">
                          👹
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs truncate">
                            {unit.character.name}
                          </p>
                          <div className="flex items-center gap-1 text-[10px]">
                            <span className="text-gray-400">
                              HP: {unit.currentHp}/{unit.character.stats.maxHp}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show Team Panels Button */}
        {!showTeamPanels && (
          <button
            onClick={() => setShowTeamPanels(true)}
            className="absolute bottom-4 left-4 px-3 py-2 bg-slate-900/50 hover:bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg transition-colors text-white text-sm z-10"
          >
            👥 Teams
          </button>
        )}
      </div>

      {/* Surrender Confirmation Modal */}
      {showSurrenderModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-red-500/50 rounded-xl shadow-2xl p-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 border border-red-500 rounded-full flex items-center justify-center">
                <Skull className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">ยอมแพ้?</h2>
              <p className="text-gray-300 mb-6">
                คุณแน่ใจหรือไม่ว่าต้องการยอมแพ้?
                <br />
                <span className="text-red-400 font-semibold">
                  การยอมแพ้จะนับเป็นการแพ้การต่อสู้
                </span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSurrenderModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => {
                    setShowSurrenderModal(false);
                    clearSession();
                    handleResetBattle();
                    onDefeat?.();
                    onForfeit();
                  }}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
                >
                  ยอมแพ้
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
