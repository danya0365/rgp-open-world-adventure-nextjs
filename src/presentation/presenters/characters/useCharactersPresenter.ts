import { useCallback, useEffect, useState } from "react";
import {
  CharactersViewModel,
  CharactersPresenter,
  CharactersPresenterFactory,
} from "./CharactersPresenter";
import { Character } from "@/src/domain/types/character.types";

export interface CharactersPresenterHook {
  // State
  viewModel: CharactersViewModel | null;
  loading: boolean;
  error: string | null;

  // Filter state
  selectedCharacter: Character | null;
  filterClass: string;
  showOnlyPlayable: boolean;
  filteredCharacters: Character[];

  // Actions
  loadData: () => Promise<void>;
  setSelectedCharacter: (character: Character | null) => void;
  setFilterClass: (className: string) => void;
  setShowOnlyPlayable: (show: boolean) => void;
}

let presenterInstance: CharactersPresenter | null = null;

/**
 * Get or create presenter instance
 */
async function getPresenter(): Promise<CharactersPresenter> {
  if (!presenterInstance) {
    presenterInstance = await CharactersPresenterFactory.createClient();
  }
  return presenterInstance;
}

/**
 * Custom hook for Characters presenter
 * Provides state management and actions for characters operations
 */
export function useCharactersPresenter(
  initialViewModel: CharactersViewModel | null = null
): CharactersPresenterHook {
  const [viewModel, setViewModel] = useState<CharactersViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [filterClass, setFilterClass] = useState<string>("all");
  const [showOnlyPlayable, setShowOnlyPlayable] = useState(false);

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
      console.error("Error loading characters data:", err);
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
   * Get filtered characters based on current filters
   */
  const filteredCharacters = viewModel
    ? viewModel.characters.filter((char) => {
        if (showOnlyPlayable && !char.isPlayable) return false;
        if (filterClass !== "all" && char.class !== filterClass) return false;
        return true;
      })
    : [];

  return {
    // State
    viewModel,
    loading,
    error,

    // Filter state
    selectedCharacter,
    filterClass,
    showOnlyPlayable,
    filteredCharacters,

    // Actions
    loadData,
    setSelectedCharacter,
    setFilterClass,
    setShowOnlyPlayable,
  };
}
