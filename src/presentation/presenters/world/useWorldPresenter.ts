import { useCallback, useEffect, useState } from "react";
import {
  WorldViewModel,
  WorldPresenter,
  WorldPresenterFactory,
} from "./WorldPresenter";
import { Location } from "@/src/domain/types/location.types";

export interface WorldPresenterHook {
  // State
  viewModel: WorldViewModel | null;
  loading: boolean;
  error: string | null;

  // Current location state
  currentLocation: Location | null;
  breadcrumb: Location[];

  // Actions
  loadData: () => Promise<void>;
  navigateToLocation: (locationId: string) => void;
  setCurrentLocation: (location: Location | null) => void;
}

let presenterInstance: WorldPresenter | null = null;

/**
 * Get or create presenter instance
 */
async function getPresenter(): Promise<WorldPresenter> {
  if (!presenterInstance) {
    presenterInstance = await WorldPresenterFactory.createClient();
  }
  return presenterInstance;
}

/**
 * Custom hook for World presenter
 * Provides state management and actions for world map operations
 */
export function useWorldPresenter(
  initialViewModel: WorldViewModel | null = null
): WorldPresenterHook {
  const [viewModel, setViewModel] = useState<WorldViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<Location[]>([]);

  /**
   * Load data from presenter
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const presenter = await getPresenter();
      const newViewModel = await presenter.getViewModel();
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error loading world data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load data on mount if no initial view model
   */
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [initialViewModel, loadData]);

  /**
   * Navigate to location
   */
  const navigateToLocation = useCallback((locationId: string) => {
    if (!viewModel) return;

    const location = viewModel.locations.find((loc) => loc.id === locationId);
    if (location) {
      setCurrentLocation(location);
      
      // Build breadcrumb
      const path: Location[] = [];
      let current: Location | undefined = location;
      
      while (current) {
        path.unshift(current);
        current = viewModel.locations.find((loc) => loc.id === current?.parentId);
      }
      
      setBreadcrumb(path);
    }
  }, [viewModel]);

  return {
    // State
    viewModel,
    loading,
    error,
    currentLocation,
    breadcrumb,

    // Actions
    loadData,
    navigateToLocation,
    setCurrentLocation,
  };
}
