"use client";

import { BattleViewModel } from "@/src/presentation/presenters/battle/BattlePresenter";
import { useBattlePresenter } from "@/src/presentation/presenters/battle/useBattlePresenter";
import {
  ArrowLeft,
  Heart,
  Shield,
  Skull,
  Swords,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import BattleTileView from "./BattleTileView";

interface BattleViewProps {
  mapId: string;
  initialViewModel?: BattleViewModel;
}

export function BattleView({ mapId, initialViewModel }: BattleViewProps) {
  const router = useRouter();

  // Presenter - handles ALL state and business logic
  const {
    battleStateId,
    battleMap,
    loading,
    error,
    allyUnits: storeAllyUnits,
    enemyUnits: storeEnemyUnits,
    turn,
    phase,
    rewards,
    currentUnit,
    aliveTurnOrder,
    handleTileClick,
    handlePlayEnemyTurn,
    handleEndTurn,
    handleResetBattle,
    handleRestartBattle,
    getUnitAtPosition,
    isTileInMovementRange,
    isTileInAttackRange,
  } = useBattlePresenter(mapId, initialViewModel);

  // Show loading state
  if (loading && !battleMap) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">กำลังโหลดสนามรบ...</p>
        </div>
      </div>
    );
  }

  if (!battleMap) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
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
              router.push("/world");
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center">
          <Skull className="w-20 h-20 text-red-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Defeat...</h1>
          <p className="text-gray-400 mb-6">คุณแพ้การต่อสู้</p>

          <button
            onClick={() => {
              handleResetBattle();
              router.push("/world");
            }}
            className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-semibold"
          >
            กลับแผนที่โลก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                // Try to go back in history, if that fails (no history), go to /world
                if (window.history.length > 1) {
                  router.back();
                } else {
                  router.push("/world");
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              กลับ
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {battleMap.name}
              </h1>
              <p className="text-gray-400">{battleMap.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-slate-800/50 rounded-lg">
              <p className="text-gray-400 text-sm">Turn</p>
              <p className="text-2xl font-bold text-white">{turn}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Battle Grid */}
          <div className="lg:col-span-3">
            {/* Battle Status Message */}
            {currentUnit && (
              <div
                className={`mb-4 p-4 rounded-lg border ${
                  currentUnit.isAlly
                    ? "bg-blue-900/20 border-blue-500/30"
                    : "bg-orange-900/20 border-orange-500/30"
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
                    <p className="text-white font-bold text-lg">
                      {currentUnit.isAlly ? "🎮 Your Turn" : "⏳ Enemy Turn"} -{" "}
                      {currentUnit.character.name}
                    </p>
                    {currentUnit.isAlly && !currentUnit.hasActed ? (
                      <p className="text-gray-300 text-sm">
                        💡 คลิกช่อง
                        <span className="text-blue-400 font-semibold">
                          สีน้ำเงิน
                        </span>
                        เพื่อเคลื่อนที่ หรือ คลิกศัตรูในช่อง
                        <span className="text-red-400 font-semibold">
                          สีแดง
                        </span>
                        เพื่อโจมตี
                      </p>
                    ) : currentUnit.isAlly && currentUnit.hasActed ? (
                      <p className="text-gray-400 text-sm">
                        ✅ ทำการเคลื่อนที่/โจมตีแล้ว - คลิก &quot;End Turn&quot;
                        เพื่อจบเทิร์น
                      </p>
                    ) : (
                      <p className="text-orange-300 text-sm">
                        🤖 AI กำลังคิด... ช่อง
                        <span className="text-orange-400 font-semibold">
                          สีส้ม
                        </span>
                        คือที่ศัตรูสามารถเคลื่อนที่ได้
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Legend - Color Guide */}
            <div className="mb-4 p-3 bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg">
              <p className="text-white font-semibold text-sm mb-2">
                📖 Legend (คำอธิบายสี)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {currentUnit?.isAlly ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-blue-900/50 border border-blue-500"></div>
                      <span className="text-gray-300">เคลื่อนที่ได้</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-900/50 border border-red-500"></div>
                      <span className="text-gray-300">โจมตีได้</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-purple-900/50 border border-purple-500"></div>
                      <span className="text-gray-300">ทั้งสองอย่าง</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-orange-900/40 border border-orange-500"></div>
                      <span className="text-gray-300">ศัตรูเคลื่อนที่</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-900/40 border border-red-500"></div>
                      <span className="text-gray-300">ศัตรูโจมตี</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-yellow-900/40 border border-yellow-500"></div>
                      <span className="text-gray-300">ทั้งสองอย่าง</span>
                    </div>
                  </>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-slate-700 border border-slate-500"></div>
                  <span className="text-gray-300">สิ่งกีดขวาง</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div
                className="grid mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${battleMap.width}, minmax(0, 1fr))`,
                  maxWidth: `${battleMap.width * 60}px`,
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
                    // Always show ranges for current unit
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Unit */}
            {currentUnit && (
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
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
                      {currentUnit.isAlly ? "🛡️" : "👹"}
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
                      {!currentUnit.hasActed && (
                        <div className="text-xs text-gray-400 mb-2">
                          💡 คลิกช่องสีน้ำเงินเพื่อเคลื่อนที่
                          <br />
                          💡 คลิกศัตรูในช่องสีแดงเพื่อโจมตี
                        </div>
                      )}
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
                        className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-semibold"
                      >
                        Restart
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Turn Order */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
              <h2 className="text-lg font-bold text-white mb-3">Turn Order</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {aliveTurnOrder.map((unit, index) => (
                  <div
                    key={unit.id}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      unit.id === currentUnit?.id
                        ? "bg-green-900/30 border border-green-500/30"
                        : "bg-slate-800/50"
                    }`}
                  >
                    <div className="text-gray-400 text-xs w-4">{index + 1}</div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        unit.isAlly ? "bg-blue-600" : "bg-red-600"
                      }`}
                    >
                      {unit.isAlly ? "🛡️" : "👹"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">
                        {unit.character.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Allies */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Allies
              </h2>
              <div className="space-y-2">
                {storeAllyUnits.map((unit) => (
                  <div
                    key={unit.id}
                    className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm">
                      🛡️
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">
                        {unit.character.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
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
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Swords className="w-5 h-5 text-red-400" />
                Enemies
              </h2>
              <div className="space-y-2">
                {storeEnemyUnits.map((unit) => (
                  <div
                    key={unit.id}
                    className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-sm">
                      👹
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">
                        {unit.character.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
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
    </div>
  );
}
