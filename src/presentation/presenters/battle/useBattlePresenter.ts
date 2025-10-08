"use client";

import { BattleUnitState, useBattleStore } from "@/src/stores/battleStore";
import { useGameStore } from "@/src/stores/gameStore";
import { useCallback, useEffect, useState } from "react";
import {
  BattlePresenter,
  BattlePresenterFactory,
  BattleViewModel,
} from "./BattlePresenter";

export interface BattlePresenterHook {
  // State
  viewModel: BattleViewModel | null;
  loading: boolean;
  error: string | null;

  // Battle state from store
  allyUnits: BattleUnitState[];
  enemyUnits: BattleUnitState[];
  turn: number;
  phase: "placement" | "battle" | "victory" | "defeat";
  currentUnitId: string | null;
  rewards: {
    exp: number;
    gold: number;
    items: { itemId: string; quantity: number }[];
  } | null;

  // Computed state
  currentUnit: BattleUnitState | null;
  aliveTurnOrder: BattleUnitState[];

  // Actions (delegate to store)
  handleTileClick: (x: number, y: number) => void;
  handleEndTurn: () => void;
  handleResetBattle: () => void;
  getUnitAtPosition: (x: number, y: number) => BattleUnitState | undefined;
  isTileInMovementRange: (x: number, y: number) => boolean;
  isTileInAttackRange: (x: number, y: number) => boolean;
}

let presenterInstance: BattlePresenter | null = null;

/**
 * Get or create presenter instance
 */
function getPresenter(): BattlePresenter {
  if (!presenterInstance) {
    presenterInstance = BattlePresenterFactory.createClient();
  }
  return presenterInstance;
}

/**
 * Custom hook for Battle presenter
 * Provides state management and actions for battle operations
 */
export function useBattlePresenter(
  mapId: string,
  initialViewModel: BattleViewModel | null = null
): BattlePresenterHook {
  const [viewModel, setViewModel] = useState<BattleViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  // Get multiple party state from store
  const { parties, activePartyId } = useGameStore();

  // Get active party data
  const activeParty = parties.find((p) => p.id === activePartyId);
  const activePartyMembers = activeParty?.members || [];

  // Battle Store - get state and actions
  const store = useBattleStore();
  const {
    allyUnits,
    enemyUnits,
    turn,
    phase,
    currentUnitId,
    rewards,
    originalPosition,
    initBattle,
    moveUnit: storeMoveUnit,
    attackUnit: storeAttackUnit,
    endTurn: storeEndTurn,
    resetBattle,
    setMovementRange,
    setAttackRange,
    setOriginalPosition,
  } = useBattleStore();

  /**
   * Load data from presenter
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const presenter = getPresenter();
      const newViewModel = await presenter.getViewModel(mapId);
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error loading battle data:", err);
    } finally {
      setLoading(false);
    }
  }, [mapId]);

  /**
   * Load data on mount if no initial view model
   */
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [initialViewModel, loadData]);

  // Initialize battle when presenter data is ready
  // Override allyUnits and enemyUnits from store
  useEffect(() => {
    console.log("viewModel?.battleMap", viewModel?.battleMap);
    console.log("activePartyMembers", activePartyMembers);

    if (
      viewModel?.battleMap &&
      !store.battleStateId &&
      activePartyMembers.length > 0
    ) {
      console.log("initBattle store.battleStateId", store.battleStateId);
      initBattle(
        viewModel.battleMap,
        viewModel.characters,
        viewModel.enemies,
        activePartyMembers
      );
    }
  }, [viewModel?.battleMap, store.battleStateId, activePartyMembers]);

  // Get computed state from store
  const currentUnit = store.getCurrentUnit();
  const aliveTurnOrder = store.getAliveTurnOrder();

  // Save original position when turn starts (ONLY when turn changes)
  useEffect(() => {
    if (currentUnit && !currentUnit.hasActed) {
      setOriginalPosition({ ...currentUnit.position });
      console.log("💾 Saved original position:", currentUnit.position);
    }
  }, [currentUnitId]); // ✅ เฉพาะเมื่อเปลี่ยนเทิร์น - ห้ามใส่ currentUnit!

  // Calculate ranges - ALWAYS show for current unit's turn
  // ⚠️ CRITICAL: ต้องใช้ currentUnit object ใน dependencies เพื่อ detect position change หลัง move
  useEffect(() => {
    if (!currentUnit || !store.battleMap) {
      console.log("❌ No viewModel or currentUnit", {
        viewModel: !!viewModel,
        currentUnit: !!currentUnit,
      });
      setMovementRange([]);
      setAttackRange([]);
      return;
    }

    // Check if there are enemies to attack
    const hasEnemies = currentUnit.isAlly
      ? enemyUnits.length > 0
      : allyUnits.length > 0;

    // Movement range - use BFS pathfinding (cannot jump over enemies)
    const moveRange: { x: number; y: number }[] = [];
    const positionForMove = originalPosition || currentUnit.position;
    const range = currentUnit.character.stats.mov;

    // BFS to find reachable tiles
    const visited = new Set<string>();
    const queue: { x: number; y: number; distance: number }[] = [
      { x: positionForMove.x, y: positionForMove.y, distance: 0 },
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
        if (
          next.x < 0 ||
          next.x >= store.battleMap.width ||
          next.y < 0 ||
          next.y >= store.battleMap.height
        ) {
          continue;
        }

        // Skip if already visited
        if (visited.has(key)) continue;

        // Check if tile is occupied by enemy (cannot pass through enemies)
        const occupiedByEnemy = currentUnit.isAlly
          ? enemyUnits.some(
              (u) => u.position.x === next.x && u.position.y === next.y
            )
          : allyUnits.some(
              (u) => u.position.x === next.x && u.position.y === next.y
            );

        // Skip if occupied by enemy (cannot pass through)
        if (occupiedByEnemy) continue;

        // Check if tile is final destination (cannot stop on ally)
        const occupiedByAlly = currentUnit.isAlly
          ? allyUnits.some(
              (u) =>
                u.position.x === next.x &&
                u.position.y === next.y &&
                u.id !== currentUnit.id
            )
          : enemyUnits.some(
              (u) =>
                u.position.x === next.x &&
                u.position.y === next.y &&
                u.id !== currentUnit.id
            );

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
      const alreadyExists = moveRange.some(
        (pos) => pos.x === originalPosition.x && pos.y === originalPosition.y
      );
      if (!alreadyExists) {
        moveRange.push({ x: originalPosition.x, y: originalPosition.y });
      }
    }

    // Also show current position as moveable (where unit moved to)
    if (
      originalPosition &&
      (currentUnit.position.x !== originalPosition.x ||
        currentUnit.position.y !== originalPosition.y)
    ) {
      const alreadyExists = moveRange.some(
        (pos) =>
          pos.x === currentUnit.position.x && pos.y === currentUnit.position.y
      );
      if (!alreadyExists) {
        moveRange.push({
          x: currentUnit.position.x,
          y: currentUnit.position.y,
        });
      }
    }

    // Attack range - use CURRENT position (after move)
    // Only show if there are enemies
    const atkRange: { x: number; y: number }[] = [];
    const attackRangeValue = 2; // Can be based on weapon

    if (hasEnemies) {
      for (let x = 0; x < store.battleMap.width; x++) {
        for (let y = 0; y < store.battleMap.height; y++) {
          const attackDistance =
            Math.abs(x - currentUnit.position.x) +
            Math.abs(y - currentUnit.position.y);
          if (attackDistance <= attackRangeValue && attackDistance > 0) {
            atkRange.push({ x, y });
          }
        }
      }
    }

    setMovementRange(moveRange);
    setAttackRange(atkRange);
  }, [
    currentUnit,
    allyUnits,
    enemyUnits,
    store.battleMap,
    originalPosition,
    setMovementRange,
    setAttackRange,
  ]);

  // Enemy AI - Auto play enemy turn
  useEffect(() => {
    if (
      !currentUnit ||
      currentUnit.isAlly ||
      currentUnit.hasActed ||
      !store.battleMap
    )
      return;

    const playEnemyTurn = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second

      // Find nearest ally
      let nearestAlly = null;
      let minDistance = Infinity;

      for (const ally of allyUnits) {
        const distance =
          Math.abs(ally.position.x - currentUnit.position.x) +
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
        const damage = Math.max(
          1,
          currentUnit.character.stats.atk - nearestAlly.character.stats.def
        );
        storeAttackUnit(currentUnit.id, nearestAlly.id, damage);
        await new Promise((resolve) => setTimeout(resolve, 500));
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
        const occupied = [...allyUnits, ...enemyUnits].some(
          (u) => u.position.x === newX && u.position.y === newY
        );

        if (!occupied) {
          storeMoveUnit(currentUnit.id, newX, newY);
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
        storeEndTurn();
      }
    };

    playEnemyTurn();
  }, [
    currentUnit,
    allyUnits,
    enemyUnits,
    store.battleMap,
    storeMoveUnit,
    storeAttackUnit,
    storeEndTurn,
  ]);

  // Action handlers - delegate to store
  const handleTileClick = useCallback(
    (x: number, y: number) => {
      store.handleTileClick(x, y);
    },
    [store]
  );

  const handleEndTurn = useCallback(() => {
    storeEndTurn();
  }, [storeEndTurn]);

  const handleResetBattle = useCallback(() => {
    resetBattle();
  }, [resetBattle]);

  return {
    // State
    viewModel,
    loading,
    error,

    // Battle state from store
    allyUnits,
    enemyUnits,
    turn,
    phase,
    currentUnitId,
    rewards,

    // Computed state
    currentUnit: currentUnit || null,
    aliveTurnOrder,

    // Actions - delegate to store
    handleTileClick,
    handleEndTurn,
    handleResetBattle,
    getUnitAtPosition: store.getUnitAtPosition,
    isTileInMovementRange: store.isTileInMovementRange,
    isTileInAttackRange: store.isTileInAttackRange,
  };
}
