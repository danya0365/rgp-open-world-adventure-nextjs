"use client";

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

  // Selection state
  selectedUnitId: string | null;
  selectedTilePosition: { x: number; y: number } | null;
  movementRange: { x: number; y: number }[];
  attackRange: { x: number; y: number }[];

  // Actions
  loadData: () => Promise<void>;
  selectUnit: (unitId: string) => void;
  selectTile: (x: number, y: number) => void;
  moveUnit: (unitId: string, x: number, y: number) => void;
  attackUnit: (attackerId: string, targetId: string) => void;
  endTurn: () => void;
  selectAction: (action: "move" | "attack" | "skill" | null) => void;
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

  // Selection state
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedTilePosition, setSelectedTilePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [movementRange, setMovementRange] = useState<
    { x: number; y: number }[]
  >([]);
  const [attackRange, setAttackRange] = useState<{ x: number; y: number }[]>(
    []
  );

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

  /**
   * Select a unit
   */
  const selectUnit = useCallback(
    async (unitId: string) => {
      if (!viewModel) return;

      const unit = [...viewModel.allyUnits, ...viewModel.enemyUnits].find(
        (u) => u.id === unitId
      );
      if (!unit) return;

      setSelectedUnitId(unitId);

      // Calculate ranges
      const presenter = getPresenter();
      const moveRange = presenter.calculateMovementRange(
        unit,
        viewModel.battleMap.width,
        viewModel.battleMap.height
      );
      const atkRange = presenter.calculateAttackRange(
        unit,
        viewModel.battleMap.width,
        viewModel.battleMap.height
      );

      setMovementRange(moveRange);
      setAttackRange(atkRange);
    },
    [viewModel]
  );

  /**
   * Select a tile
   */
  const selectTile = useCallback((x: number, y: number) => {
    setSelectedTilePosition({ x, y });
  }, []);

  /**
   * Move unit to new position
   */
  const moveUnit = useCallback(
    (unitId: string, x: number, y: number) => {
      if (!viewModel) return;

      const newViewModel = { ...viewModel };

      // Update ally units
      newViewModel.allyUnits = newViewModel.allyUnits.map((unit) =>
        unit.id === unitId ? { ...unit, position: { x, y } } : unit
      );

      // Update enemy units
      newViewModel.enemyUnits = newViewModel.enemyUnits.map((unit) =>
        unit.id === unitId ? { ...unit, position: { x, y } } : unit
      );

      setViewModel(newViewModel);
      setSelectedUnitId(null);
      setMovementRange([]);
    },
    [viewModel]
  );

  /**
   * Attack target unit
   */
  const attackUnit = useCallback(
    async (attackerId: string, targetId: string) => {
      if (!viewModel) return;

      const attacker = [...viewModel.allyUnits, ...viewModel.enemyUnits].find(
        (u) => u.id === attackerId
      );
      const target = [...viewModel.allyUnits, ...viewModel.enemyUnits].find(
        (u) => u.id === targetId
      );

      if (!attacker || !target) return;

      const presenter = getPresenter();
      const damage = presenter.calculateDamage(attacker, target);

      const newViewModel = { ...viewModel };

      // Update target HP
      newViewModel.allyUnits = newViewModel.allyUnits.map((unit) =>
        unit.id === targetId
          ? { ...unit, currentHp: Math.max(0, unit.currentHp - damage) }
          : unit
      );

      newViewModel.enemyUnits = newViewModel.enemyUnits.map((unit) =>
        unit.id === targetId
          ? { ...unit, currentHp: Math.max(0, unit.currentHp - damage) }
          : unit
      );

      // Mark attacker as acted
      newViewModel.allyUnits = newViewModel.allyUnits.map((unit) =>
        unit.id === attackerId ? { ...unit, hasActed: true } : unit
      );

      newViewModel.enemyUnits = newViewModel.enemyUnits.map((unit) =>
        unit.id === attackerId ? { ...unit, hasActed: true } : unit
      );

      setViewModel(newViewModel);
      setSelectedUnitId(null);
      setAttackRange([]);
    },
    [viewModel]
  );

  /**
   * End current turn
   */
  const endTurn = useCallback(() => {
    if (!viewModel) return;

    const newViewModel = { ...viewModel };

    // Reset hasActed for all units
    newViewModel.allyUnits = newViewModel.allyUnits.map((unit) => ({
      ...unit,
      hasActed: false,
    }));
    newViewModel.enemyUnits = newViewModel.enemyUnits.map((unit) => ({
      ...unit,
      hasActed: false,
    }));

    // Increment turn
    newViewModel.state.turn += 1;

    // Get next unit in turn order
    const currentIndex = newViewModel.turnOrder.findIndex(
      (u) => u.id === newViewModel.state.currentUnitId
    );
    const nextIndex = (currentIndex + 1) % newViewModel.turnOrder.length;
    newViewModel.state.currentUnitId = newViewModel.turnOrder[nextIndex].id;

    setViewModel(newViewModel);
    setSelectedUnitId(null);
    setMovementRange([]);
    setAttackRange([]);
  }, [viewModel]);

  /**
   * Select action
   */
  const selectAction = useCallback(
    (action: "move" | "attack" | "skill" | null) => {
      if (!viewModel) return;

      const newViewModel = { ...viewModel };
      newViewModel.state.selectedAction = action;
      setViewModel(newViewModel);
    },
    [viewModel]
  );

  return {
    // State
    viewModel,
    loading,
    error,
    selectedUnitId,
    selectedTilePosition,
    movementRange,
    attackRange,

    // Actions
    loadData,
    selectUnit,
    selectTile,
    moveUnit,
    attackUnit,
    endTurn,
    selectAction,
  };
}
