"use client";

import { BattleViewModel } from "@/src/presentation/presenters/battle/BattlePresenter";
import { useBattlePresenter } from "@/src/presentation/presenters/battle/useBattlePresenter";
import Link from "next/link";
import { ArrowLeft, Swords, Heart, Zap, Shield, Users } from "lucide-react";

interface BattleViewProps {
  mapId: string;
  initialViewModel?: BattleViewModel;
}

export function BattleView({ mapId, initialViewModel }: BattleViewProps) {
  const {
    viewModel,
    loading,
    error,
    selectedUnitId,
    movementRange,
    attackRange,
    selectUnit,
    moveUnit,
    endTurn,
    selectAction,
  } = useBattlePresenter(mapId, initialViewModel);

  // Show loading state
  if (loading && !viewModel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">กำลังโหลดสนามรบ...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !viewModel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-400 font-medium mb-2">เกิดข้อผิดพลาด</p>
          <p className="text-gray-400 mb-4">{error}</p>
          <Link
            href="/world"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
          >
            กลับแผนที่โลก
          </Link>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!viewModel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">⚔️</div>
          <p className="text-gray-400 font-medium mb-4">ไม่พบสนามรบ</p>
          <Link
            href="/world"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            กลับแผนที่โลก
          </Link>
        </div>
      </div>
    );
  }

  const { battleMap, allyUnits, enemyUnits, state, turnOrder } = viewModel;
  const currentUnit = [...allyUnits, ...enemyUnits].find(u => u.id === state.currentUnitId);

  // Helper: Check if tile is in range
  const isTileInMovementRange = (x: number, y: number) => {
    return movementRange.some(pos => pos.x === x && pos.y === y);
  };

  const isTileInAttackRange = (x: number, y: number) => {
    return attackRange.some(pos => pos.x === x && pos.y === y);
  };

  // Helper: Get unit at position
  const getUnitAtPosition = (x: number, y: number) => {
    return [...allyUnits, ...enemyUnits].find(u => u.position.x === x && u.position.y === y);
  };

  // Helper: Handle tile click
  const handleTileClick = (x: number, y: number) => {
    const unit = getUnitAtPosition(x, y);
    
    if (unit) {
      // Click on unit
      selectUnit(unit.id);
    } else if (selectedUnitId && isTileInMovementRange(x, y)) {
      // Move to empty tile
      moveUnit(selectedUnitId, x, y);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/world"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              กลับ
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">{battleMap.name}</h1>
              <p className="text-gray-400">{battleMap.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-slate-800/50 rounded-lg">
              <p className="text-gray-400 text-sm">Turn</p>
              <p className="text-2xl font-bold text-white">{state.turn}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Battle Grid */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div 
                className="grid gap-1 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${battleMap.width}, minmax(0, 1fr))`,
                  maxWidth: `${battleMap.width * 60}px`,
                }}
              >
                {Array.from({ length: battleMap.height }).map((_, y) =>
                  Array.from({ length: battleMap.width }).map((_, x) => {
                    const unit = getUnitAtPosition(x, y);
                    const isObstacle = battleMap.obstacles?.some(obs => obs.x === x && obs.y === y) || false;
                    const isSelected = unit?.id === selectedUnitId;
                    const isInMoveRange = isTileInMovementRange(x, y);
                    const isInAttackRange = isTileInAttackRange(x, y);
                    const isCurrent = unit?.id === state.currentUnitId;

                    return (
                      <button
                        key={`${x}-${y}`}
                        onClick={() => handleTileClick(x, y)}
                        className={`
                          aspect-square relative rounded-lg transition-all
                          ${isObstacle ? "bg-slate-700 cursor-not-allowed" : "bg-slate-800 hover:bg-slate-700"}
                          ${isSelected ? "ring-2 ring-yellow-400" : ""}
                          ${isInMoveRange ? "bg-blue-900/50 hover:bg-blue-800/50" : ""}
                          ${isInAttackRange ? "bg-red-900/50 hover:bg-red-800/50" : ""}
                          ${isCurrent ? "ring-2 ring-green-400" : ""}
                        `}
                        disabled={isObstacle}
                      >
                        {/* Grid Coordinates (debug) */}
                        <span className="absolute top-0 left-1 text-[8px] text-gray-600">
                          {x},{y}
                        </span>

                        {/* Unit */}
                        {unit && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`
                              w-10 h-10 rounded-full flex items-center justify-center text-xl
                              ${unit.isAlly ? "bg-blue-600" : "bg-red-600"}
                            `}>
                              {unit.isAlly ? "🛡️" : "👹"}
                            </div>
                            {/* HP Bar */}
                            <div className="absolute bottom-1 left-1 right-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${unit.isAlly ? "bg-green-500" : "bg-red-500"}`}
                                style={{ width: `${(unit.currentHp / unit.character.stats.maxHp) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Obstacle */}
                        {isObstacle && (
                          <div className="absolute inset-0 flex items-center justify-center text-2xl">
                            🪨
                          </div>
                        )}
                      </button>
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
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${currentUnit.isAlly ? "bg-blue-600" : "bg-red-600"}`}>
                      {currentUnit.isAlly ? "🛡️" : "👹"}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{currentUnit.character.name}</p>
                      <p className="text-gray-400 text-xs capitalize">{currentUnit.character.class}</p>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Heart className="w-3 h-3" /> HP
                        </span>
                        <span className="text-white">{currentUnit.currentHp}/{currentUnit.character.stats.maxHp}</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500"
                          style={{ width: `${(currentUnit.currentHp / currentUnit.character.stats.maxHp) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Zap className="w-3 h-3" /> MP
                        </span>
                        <span className="text-white">{currentUnit.currentMp}/{currentUnit.character.stats.maxMp}</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500"
                          style={{ width: `${(currentUnit.currentMp / currentUnit.character.stats.maxMp) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {currentUnit.isAlly && !currentUnit.hasActed && (
                    <div className="space-y-2 pt-2 border-t border-slate-700">
                      <button
                        onClick={() => selectAction("move")}
                        className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-semibold"
                      >
                        Move
                      </button>
                      <button
                        onClick={() => selectAction("attack")}
                        className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-semibold"
                      >
                        Attack
                      </button>
                      <button
                        onClick={endTurn}
                        className="w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                      >
                        End Turn
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Turn Order */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
              <h2 className="text-lg font-bold text-white mb-3">Turn Order</h2>
              <div className="space-y-2">
                {turnOrder.slice(0, 5).map((unit, index) => (
                  <div 
                    key={unit.id}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      unit.id === state.currentUnitId ? "bg-green-900/30 border border-green-500/30" : "bg-slate-800/50"
                    }`}
                  >
                    <div className="text-gray-400 text-xs w-4">{index + 1}</div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${unit.isAlly ? "bg-blue-600" : "bg-red-600"}`}>
                      {unit.isAlly ? "🛡️" : "👹"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{unit.character.name}</p>
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
                {allyUnits.map(unit => (
                  <div 
                    key={unit.id}
                    className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm">
                      🛡️
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{unit.character.name}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-400">HP: {unit.currentHp}/{unit.character.stats.maxHp}</span>
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
                {enemyUnits.map(unit => (
                  <div 
                    key={unit.id}
                    className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-sm">
                      👹
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{unit.character.name}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-400">HP: {unit.currentHp}/{unit.character.stats.maxHp}</span>
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
