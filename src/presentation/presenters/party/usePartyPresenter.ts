import { useCallback, useEffect, useState } from "react";
import { PartyViewModel, PartyPresenter, PartyPresenterFactory } from "./PartyPresenter";
import { useGameStore } from "@/src/stores/gameStore";
import { Character } from "@/src/domain/types/character.types";

export interface PartyPresenterHook {
  // State
  viewModel: PartyViewModel | null;
  loading: boolean;
  error: string | null;

  // Actions
  loadData: () => Promise<void>;
  
  // Multiple Party Actions
  createParty: (name: string) => import("@/src/stores/gameStore").Party;
  deleteParty: (partyId: string) => void;
  renameParty: (partyId: string, newName: string) => void;
  copyParty: (partyId: string, newName: string) => import("@/src/stores/gameStore").Party;
  setActiveParty: (partyId: string) => void;
  getActiveParty: () => import("@/src/stores/gameStore").Party | null;
  addToPartyV2: (partyId: string, characterId: string, position?: number) => boolean;
  removeFromPartyV2: (partyId: string, characterId: string) => void;
  
  // State getters
  parties: import("@/src/stores/gameStore").Party[];
  activePartyId: string | null;
  progress: import("@/src/stores/gameStore").GameProgress;
}

let presenterInstance: PartyPresenter | null = null;

/**
 * Get or create presenter instance
 */
async function getPresenter(): Promise<PartyPresenter> {
  if (!presenterInstance) {
    presenterInstance = await PartyPresenterFactory.createClient();
  }
  return presenterInstance;
}

/**
 * Custom hook for Party presenter
 * Provides state management and actions for party operations
 */
export function usePartyPresenter(
  initialViewModel: PartyViewModel | null = null
): PartyPresenterHook {
  const [viewModel, setViewModel] = useState<PartyViewModel | null>(
    initialViewModel !== null ? initialViewModel : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get game store
  const { progress } = useGameStore();

  /**
   * Load data from presenter
   * Pass game state to presenter for filtering
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const presenter = await getPresenter();
      // Pass selected and recruited characters from game state to presenter
      const recruitedCharacterIds = progress.recruitedCharacters.map(rc => rc.characterId);
      const newViewModel = await presenter.getViewModel(
        progress.selectedCharacters,
        recruitedCharacterIds
      );
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error loading party data:", err);
    } finally {
      setLoading(false);
    }
  }, [progress.selectedCharacters, progress.recruitedCharacters]);

  /**
   * Load data on mount if no initial view model
   */
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [initialViewModel, loadData]);
  
  /**
   * Reload data when selected or unlocked characters change
   * This ensures the view model is updated with game state
   */
  useEffect(() => {
    if (initialViewModel) {
      loadData();
    }
  }, [progress.selectedCharacters.length, progress.recruitedCharacters.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Get multiple party state from store
  const {
    parties,
    activePartyId,
    createParty: storeCreateParty,
    deleteParty: storeDeleteParty,
    renameParty: storeRenameParty,
    copyParty: storeCopyParty,
    setActiveParty: storeSetActiveParty,
    getActiveParty: storeGetActiveParty,
    addToPartyV2: storeAddToPartyV2,
    removeFromPartyV2: storeRemoveFromPartyV2,
  } = useGameStore();

  return {
    // State
    viewModel,
    loading,
    error,

    // Actions
    loadData,
    
    // Multiple Party Actions
    createParty: storeCreateParty,
    deleteParty: storeDeleteParty,
    renameParty: storeRenameParty,
    copyParty: storeCopyParty,
    setActiveParty: storeSetActiveParty,
    getActiveParty: storeGetActiveParty,
    addToPartyV2: storeAddToPartyV2,
    removeFromPartyV2: storeRemoveFromPartyV2,
    
    // State getters
    parties,
    activePartyId,
    progress,
  };
}
