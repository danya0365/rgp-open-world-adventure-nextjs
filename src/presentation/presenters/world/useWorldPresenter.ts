import { Location } from "@/src/domain/types/location.types";
import { useCallback, useEffect, useState } from "react";
import {
  WorldPresenter,
  WorldPresenterFactory,
  WorldViewModel,
} from "./WorldPresenter";

export interface WorldPresenterHook {
  // State
  viewModel: WorldViewModel | null;
  loading: boolean;
  error: string | null;

  // Current location state (from URL, read-only)
  currentLocation: Location | null;
  breadcrumb: Location[];

  // Actions
  loadData: () => Promise<void>;
}

let presenterInstance: WorldPresenter | null = null;

/**
 * Get or create presenter instance
 */
function getPresenter(): WorldPresenter {
  if (!presenterInstance) {
    presenterInstance = WorldPresenterFactory.createClient();
  }
  return presenterInstance;
}

/**
 * Custom hook for World presenter
 * Provides state management and actions for world map operations
 *
 * Note: Navigation is now handled by Next.js routing via URL
 * currentLocation and breadcrumb are derived from URL params
 */
export function useWorldPresenter(
  initialViewModel: WorldViewModel | null = null,
  currentLocationId?: string
): WorldPresenterHook {
  const [viewModel, setViewModel] = useState<WorldViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derive currentLocation from URL (currentLocationId)
  const currentLocation =
    currentLocationId && viewModel
      ? viewModel.locations.find((loc) => loc.id === currentLocationId) || null
      : null;

  // Build breadcrumb from currentLocation
  const breadcrumb: Location[] = [];
  if (currentLocation && viewModel) {
    let current: Location | undefined = currentLocation;
    while (current) {
      breadcrumb.unshift(current);
      current = viewModel.locations.find((loc) => loc.id === current?.parentId);
    }
  }

  /**
   * Load data from presenter
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const presenter = getPresenter();
      const newViewModel = await presenter.getViewModel(currentLocationId);
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error loading world data:", err);
    } finally {
      setLoading(false);
    }
  }, [currentLocationId]);

  /**
   * Load data on mount if no initial view model
   */
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [initialViewModel, loadData]);

  return {
    // State
    viewModel,
    loading,
    error,
    currentLocation,
    breadcrumb,

    // Actions
    loadData,
  };
}
