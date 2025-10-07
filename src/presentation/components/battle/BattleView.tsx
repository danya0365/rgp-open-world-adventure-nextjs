"use client";

import { BattleViewModel } from "@/src/presentation/presenters/battle/BattlePresenter";
import { useBattlePresenter } from "@/src/presentation/presenters/battle/useBattlePresenter";
import { useBattleStore } from "@/src/stores/battleStore";
import Link from "next/link";
import { ArrowLeft, Swords, Heart, Zap, Shield, Users, Trophy, Skull } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface BattleViewProps {
  mapId: string;
  initialViewModel?: BattleViewModel;
}

export function BattleView({ mapId, initialViewModel }: BattleViewProps) {
  const router = useRouter();
  
  // Presenter for initial data
  const {
    viewModel: presenterViewModel,
    loading,
    error,
  } = useBattlePresenter(mapId, initialViewModel);

  // Battle Store for state management
  const {
    allyUnits: storeAllyUnits,
    enemyUnits: storeEnemyUnits,
    turn,
    phase,
    currentUnitId,
    turnOrder: storeTurnOrder,
    rewards,
    initBattle,
    moveUnit: storeMoveUnit,
    attackUnit: storeAttackUnit,
    endTurn: storeEndTurn,
    resetBattle,
  } = useBattleStore();

  const [movementRange, setMovementRange] = useState<{ x: number; y: number }[]>([]);
  const [attackRange, setAttackRange] = useState<{ x: number; y: number }[]>([]);
  const [originalPosition, setOriginalPosition] = useState<{ x: number; y: number } | null>(null);

  // Get current unit
  const currentUnit = [...storeAllyUnits, ...storeEnemyUnits].find(u => u.id === currentUnitId);

  // Initialize battle when presenter data is ready
  useEffect(() => {
    if (presenterViewModel && storeAllyUnits.length === 0) {
      initBattle(
        presenterViewModel.battleMap.id,
        presenterViewModel.allyUnits,
        presenterViewModel.enemyUnits
      );
    }
  }, [presenterViewModel, storeAllyUnits.length, initBattle]);

  // Save original position when turn starts
  useEffect(() => {
    if (currentUnit && !currentUnit.hasActed) {
      setOriginalPosition({ ...currentUnit.position });
      console.log("💾 Saved original position:", currentUnit.position);
    }
  }, [currentUnitId]); // Only when turn changes

  // Calculate ranges - ALWAYS show for current unit's turn
  useEffect(() => {
    if (!presenterViewModel || !currentUnit) {
      console.log("❌ No presenterViewModel or currentUnit", { presenterViewModel: !!presenterViewModel, currentUnit: !!currentUnit });
      setMovementRange([]);
      setAttackRange([]);
      return;
    }

    // Check if there are enemies to attack
    const hasEnemies = currentUnit.isAlly 
      ? storeEnemyUnits.length > 0 
      : storeAllyUnits.length > 0;

    console.log("🎯 Calculating ranges for:", {
      unit: currentUnit.character.name,
      isAlly: currentUnit.isAlly,
      currentPosition: currentUnit.position,
      originalPosition: originalPosition,
      hasActed: currentUnit.hasActed,
      hasEnemies: hasEnemies,
      mov: currentUnit.character.stats.mov
    });

    // Movement range - use BFS pathfinding (cannot jump over enemies)
    const moveRange: { x: number; y: number }[] = [];
    const positionForMove = originalPosition || currentUnit.position;
    const range = currentUnit.character.stats.mov;

    // BFS to find reachable tiles
    const visited = new Set<string>();
    const queue: { x: number; y: number; distance: number }[] = [
      { x: positionForMove.x, y: positionForMove.y, distance: 0 }
    ];
    visited.add(`${positionForMove.x},${positionForMove.y}`);

    while (queue.length > 0) {
      const current = queue.shift()!;
      
      // Check 4 directions (up, down, left, right)
      const directions = [
        { x: current.x, y: current.y - 1 }, // up
        { x: current.x, y: current.y + 1 }, // down
        { x: current.x - 1, y: current.y }, // left
        { x: current.x + 1, y: current.y }, // right
      ];

      for (const next of directions) {
        const key = `${next.x},${next.y}`;
        
        // Check bounds
        if (next.x < 0 || next.x >= presenterViewModel.battleMap.width || 
            next.y < 0 || next.y >= presenterViewModel.battleMap.height) {
          continue;
        }

        // Skip if already visited
        if (visited.has(key)) continue;

        // Check if tile is occupied by enemy (cannot pass through enemies)
        const occupiedByEnemy = currentUnit.isAlly
          ? storeEnemyUnits.some(u => u.position.x === next.x && u.position.y === next.y)
          : storeAllyUnits.some(u => u.position.x === next.x && u.position.y === next.y);

        // Skip if occupied by enemy (cannot pass through)
        if (occupiedByEnemy) continue;

        // Check if tile is final destination (cannot stop on ally)
        const occupiedByAlly = currentUnit.isAlly
          ? storeAllyUnits.some(u => u.position.x === next.x && u.position.y === next.y && u.id !== currentUnit.id)
          : storeEnemyUnits.some(u => u.position.x === next.x && u.position.y === next.y && u.id !== currentUnit.id);

        const newDistance = current.distance + 1;

        // Add to movement range if within range and not occupied by ally
        if (newDistance <= range) {
          // Can pass through ally but cannot stop on ally
          if (!occupiedByAlly) {
            moveRange.push({ x: next.x, y: next.y });
          }
          visited.add(key);
          queue.push({ x: next.x, y: next.y, distance: newDistance });
        }
      }
    }

    // Show original position (start point) as moveable
    if (originalPosition) {
      const alreadyExists = moveRange.some(pos => pos.x === originalPosition.x && pos.y === originalPosition.y);
      if (!alreadyExists) {
        moveRange.push({ x: originalPosition.x, y: originalPosition.y });
      }
    }

    // Also show current position as moveable (where unit moved to)
    if (originalPosition && 
        (currentUnit.position.x !== originalPosition.x || currentUnit.position.y !== originalPosition.y)) {
      const alreadyExists = moveRange.some(pos => pos.x === currentUnit.position.x && pos.y === currentUnit.position.y);
      if (!alreadyExists) {
        moveRange.push({ x: currentUnit.position.x, y: currentUnit.position.y });
      }
    }

    // Attack range - use CURRENT position (after move)
    // Only show if there are enemies
    const atkRange: { x: number; y: number }[] = [];
    const attackRangeValue = 2; // Can be based on weapon

    if (hasEnemies) {
      for (let x = 0; x < presenterViewModel.battleMap.width; x++) {
        for (let y = 0; y < presenterViewModel.battleMap.height; y++) {
          const attackDistance = Math.abs(x - currentUnit.position.x) + Math.abs(y - currentUnit.position.y);
          if (attackDistance <= attackRangeValue && attackDistance > 0) {
            atkRange.push({ x, y });
          }
        }
      }
    }

    console.log("✅ Ranges calculated:", {
      movementRange: moveRange.length,
      attackRange: atkRange.length,
      hasEnemies: hasEnemies,
      usingOriginalPos: !!originalPosition
    });

    setMovementRange(moveRange);
    setAttackRange(atkRange);
  }, [currentUnit, storeAllyUnits, storeEnemyUnits, presenterViewModel, originalPosition]);

  // Enemy AI - Auto play enemy turn
  useEffect(() => {
    if (!currentUnit || currentUnit.isAlly || currentUnit.hasActed || !presenterViewModel) return;

    const playEnemyTurn = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

      // Find nearest ally
      let nearestAlly = null;
      let minDistance = Infinity;

      for (const ally of storeAllyUnits) {
        const distance = Math.abs(ally.position.x - currentUnit.position.x) + 
                        Math.abs(ally.position.y - currentUnit.position.y);
        if (distance < minDistance) {
          minDistance = distance;
          nearestAlly = ally;
        }
      }

      if (!nearestAlly) {
        storeEndTurn();
        return;
      }

      // Check if in attack range
      const attackRangeValue = 2;
      if (minDistance <= attackRangeValue) {
        // Attack!
        const damage = Math.max(1, currentUnit.character.stats.atk - nearestAlly.character.stats.def);
        storeAttackUnit(currentUnit.id, nearestAlly.id, damage);
        await new Promise(resolve => setTimeout(resolve, 500));
        storeEndTurn();
      } else {
        // Move toward ally
        const dx = nearestAlly.position.x - currentUnit.position.x;
        const dy = nearestAlly.position.y - currentUnit.position.y;
        
        let newX = currentUnit.position.x;
        let newY = currentUnit.position.y;
        
        // Move in the direction of the ally
        if (Math.abs(dx) > Math.abs(dy)) {
          newX += dx > 0 ? 1 : -1;
        } else {
          newY += dy > 0 ? 1 : -1;
        }

        // Check if tile is occupied
        const occupied = [...storeAllyUnits, ...storeEnemyUnits].some(
          u => u.position.x === newX && u.position.y === newY
        );

        if (!occupied) {
          storeMoveUnit(currentUnit.id, newX, newY);
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
        storeEndTurn();
      }
    };

    playEnemyTurn();
  }, [currentUnit, storeAllyUnits, storeEnemyUnits, presenterViewModel, storeMoveUnit, storeAttackUnit, storeEndTurn]);

  // Show loading state
  if (loading && !presenterViewModel) {
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
  if (error && !presenterViewModel) {
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
  if (!presenterViewModel) {
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

  const { battleMap } = presenterViewModel;

  // Validate: Check if there are enemies
  if (presenterViewModel.enemyUnits.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-sm border border-yellow-700 rounded-xl p-8 text-center">
          <div className="text-yellow-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">ไม่มีศัตรู</h1>
          <p className="text-gray-400 mb-6">
            สนามรบนี้ไม่มีศัตรูให้ต่อสู้ กรุณาเลือกสนามรบอื่น
          </p>
          <div className="space-y-3">
            <Link
              href="/world"
              className="block w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-semibold"
            >
              กลับแผนที่โลก
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="block w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              โหลดใหม่
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Validate: Check if there are allies
  if (presenterViewModel.allyUnits.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-sm border border-red-700 rounded-xl p-8 text-center">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-white mb-2">ไม่มีพันธมิตร</h1>
          <p className="text-gray-400 mb-6">
            คุณต้องมีพันธมิตรในทีมก่อนเข้าสู่การต่อสู้
          </p>
          <Link
            href="/party"
            className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
          >
            จัดการทีม
          </Link>
        </div>
      </div>
    );
  }

  // Helper: Check if tile is in range
  const isTileInMovementRange = (x: number, y: number) => {
    const inRange = movementRange.some(pos => pos.x === x && pos.y === y);
    return inRange;
  };

  const isTileInAttackRange = (x: number, y: number) => {
    const inRange = attackRange.some(pos => pos.x === x && pos.y === y);
    if (x === 2 && y === 1) {
      console.log("🔴 Checking tile (2,1) for attack range:", { 
        inRange, 
        attackRangeTotal: attackRange.length,
        attackRangeSample: attackRange.slice(0, 5)
      });
    }
    return inRange;
  };

  // Helper: Get unit at position
  const getUnitAtPosition = (x: number, y: number) => {
    return [...storeAllyUnits, ...storeEnemyUnits].find(u => u.position.x === x && u.position.y === y);
  };

  // Helper: Handle tile click
  const handleTileClick = (x: number, y: number) => {
    // Only allow actions for current unit if it's ally's turn
    if (!currentUnit || !currentUnit.isAlly || currentUnit.hasActed) return;
    
    const unit = getUnitAtPosition(x, y);
    
    if (unit && unit.id !== currentUnit.id) {
      // Click on another unit - try to attack if in range
      if (isTileInAttackRange(x, y) && !unit.isAlly) {
        const damage = Math.max(1, currentUnit.character.stats.atk - unit.character.stats.def);
        storeAttackUnit(currentUnit.id, unit.id, damage);
      }
    } else if (!unit && isTileInMovementRange(x, y)) {
      // Click on empty tile in movement range - move there
      storeMoveUnit(currentUnit.id, x, y);
    }
  };

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
                  <span className="text-green-400 font-bold">+{rewards.exp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Gold:</span>
                  <span className="text-yellow-400 font-bold">+{rewards.gold}</span>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={() => {
              resetBattle();
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
              resetBattle();
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
              <p className="text-2xl font-bold text-white">{turn}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Battle Grid */}
          <div className="lg:col-span-3">
            {/* Battle Status Message */}
            {currentUnit && (
              <div className={`mb-4 p-4 rounded-lg border ${
                currentUnit.isAlly 
                  ? "bg-blue-900/20 border-blue-500/30" 
                  : "bg-orange-900/20 border-orange-500/30"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                    currentUnit.isAlly ? "bg-blue-600" : "bg-orange-600"
                  }`}>
                    {currentUnit.isAlly ? "🛡️" : "👹"}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-lg">
                      {currentUnit.isAlly ? "🎮 Your Turn" : "⏳ Enemy Turn"} - {currentUnit.character.name}
                    </p>
                    {currentUnit.isAlly && !currentUnit.hasActed ? (
                      <p className="text-gray-300 text-sm">
                        💡 คลิกช่อง<span className="text-blue-400 font-semibold">สีน้ำเงิน</span>เพื่อเคลื่อนที่ 
                        หรือ คลิกศัตรูในช่อง<span className="text-red-400 font-semibold">สีแดง</span>เพื่อโจมตี
                      </p>
                    ) : currentUnit.isAlly && currentUnit.hasActed ? (
                      <p className="text-gray-400 text-sm">
                        ✅ ทำการเคลื่อนที่/โจมตีแล้ว - คลิก &quot;End Turn&quot; เพื่อจบเทิร์น
                      </p>
                    ) : (
                      <p className="text-orange-300 text-sm">
                        🤖 AI กำลังคิด... ช่อง<span className="text-orange-400 font-semibold">สีส้ม</span>คือที่ศัตรูสามารถเคลื่อนที่ได้
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Legend - Color Guide */}
            <div className="mb-4 p-3 bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg">
              <p className="text-white font-semibold text-sm mb-2">📖 Legend (คำอธิบายสี)</p>
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
                className="grid gap-1 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${battleMap.width}, minmax(0, 1fr))`,
                  maxWidth: `${battleMap.width * 60}px`,
                }}
              >
                {Array.from({ length: battleMap.height }).map((_, y) =>
                  Array.from({ length: battleMap.width }).map((_, x) => {
                    const unit = getUnitAtPosition(x, y);
                    const tile = battleMap.tiles.find(t => t.x === x && t.y === y);
                    const isObstacle = battleMap.obstacles?.some(obs => obs.x === x && obs.y === y) || false;
                    const isUnwalkable = tile && !tile.isWalkable;
                    // Always show ranges for current unit
                    const isInMoveRange = isTileInMovementRange(x, y);
                    const isInAttackRange = isTileInAttackRange(x, y);
                    const isCurrent = unit?.id === currentUnitId;

                    // Get tile icon based on type
                    const getTileIcon = () => {
                      if (!tile) return null;
                      switch (tile.type) {
                        case "grass": return "🌿";
                        case "water": return "💧";
                        case "mountain": return "⛰️";
                        case "lava": return "🔥";
                        case "ice": return "❄️";
                        case "poison": return "☠️";
                        default: return null;
                      }
                    };

                    return (
                      <button
                        key={`${x}-${y}`}
                        onClick={() => handleTileClick(x, y)}
                        className={`
                          aspect-square relative rounded-lg transition-all
                          bg-slate-800
                          ${
                            isObstacle || isUnwalkable
                              ? "opacity-50 cursor-not-allowed"
                              : isInMoveRange && isInAttackRange && currentUnit?.isAlly
                              ? "ring-2 ring-purple-500"
                              : isInMoveRange && isInAttackRange && currentUnit && !currentUnit.isAlly
                              ? "ring-2 ring-yellow-500"
                              : isInMoveRange && currentUnit?.isAlly
                              ? "ring-2 ring-blue-500"
                              : isInMoveRange && currentUnit && !currentUnit.isAlly
                              ? "ring-2 ring-orange-500"
                              : isInAttackRange && currentUnit?.isAlly
                              ? "ring-2 ring-red-500"
                              : isInAttackRange && currentUnit && !currentUnit.isAlly
                              ? "ring-2 ring-red-500"
                              : ""
                          }
                          ${isCurrent && currentUnit?.isAlly ? "ring-4 ring-green-400" : ""}
                          ${isCurrent && currentUnit && !currentUnit.isAlly ? "ring-4 ring-orange-400" : ""}
                        `}
                        disabled={isObstacle || isUnwalkable}
                      >
                        {/* Tile Icon */}
                        {getTileIcon() && !unit && (
                          <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-30">
                            {getTileIcon()}
                          </div>
                        )}

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
                                className={`h-full transition-all ${unit.isAlly ? "bg-green-500" : "bg-red-500"}`}
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

                        {/* Tile Effect Indicator (top-right corner) */}
                        {tile?.effect && tile.effect.type === "damage" && (
                          <div className="absolute top-0.5 right-0.5 text-xs animate-pulse">
                            ⚠️
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
                      <p className="text-gray-400 text-xs capitalize">
                        {'class' in currentUnit.character ? currentUnit.character.class : currentUnit.character.type}
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
                        <span className="text-white">{currentUnit.currentHp}/{currentUnit.character.stats.maxHp}</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all"
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
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${(currentUnit.currentMp / currentUnit.character.stats.maxMp) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {currentUnit.isAlly && (
                    <div className="space-y-2 pt-2 border-t border-slate-700">
                      {!currentUnit.hasActed && (
                        <div className="text-xs text-gray-400 mb-2">
                          💡 คลิกช่องสีน้ำเงินเพื่อเคลื่อนที่<br/>
                          💡 คลิกศัตรูในช่องสีแดงเพื่อโจมตี
                        </div>
                      )}
                      <button
                        onClick={storeEndTurn}
                        className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-semibold"
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
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {storeTurnOrder.map((unit, index) => (
                  <div 
                    key={unit.id}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      unit.id === currentUnitId ? "bg-green-900/30 border border-green-500/30" : "bg-slate-800/50"
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
                {storeAllyUnits.map(unit => (
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
                {storeEnemyUnits.map(unit => (
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
