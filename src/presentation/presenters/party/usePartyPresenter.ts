import { useCallback, useEffect, useState } from "react";
import { PartyViewModel, PartyPresenter, PartyPresenterFactory } from "./PartyPresenter";
import { useGameStore } from "@/src/stores/gameStore";
import { Character } from "@/src/domain/types/character.types";

export interface PartyPresenterHook {
  // State
  viewModel: PartyViewModel | null;
  loading: boolean;
  error: string | null;

  // Party state from store
  party: import("@/src/stores/gameStore").PartyMember[];
  
  // Modal states
  isSelectModalOpen: boolean;
  selectedPosition: number | null;
  
  // Game state
  hasEverSelectedCharacter: boolean;

  // Actions
  loadData: () => Promise<void>;
  addToParty: (character: Character, position?: number) => void;
  removeFromParty: (characterId: string) => void;
  swapPartyMembers: (pos1: number, pos2: number) => void;
  setLeader: (characterId: string) => void;
  clearParty: () => void;
  isInParty: (characterId: string) => boolean;

  // Modal actions
  openSelectModal: (position: number) => void;
  closeSelectModal: () => void;
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
    initialViewModel || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

  // Get party store
  const {
    party,
    addToParty: storeAddToParty,
    removeFromParty: storeRemoveFromParty,
    swapPartyMembers: storeSwapPartyMembers,
    setLeader: storeSetLeader,
    clearParty: storeClearParty,
    isInParty: storeIsInParty,
    events,
  } = useGameStore();
  
  // Check if user has ever selected a character
  // by checking if there are any "add_to_party" events or current party members
  const hasEverSelectedCharacter = party.length > 0 || events.some(
    (e) => e.type === "quest" && e.data.action === "add_to_party"
  );

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
      console.error("Error loading party data:", err);
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
   * Add character to party
   */
  const addToParty = useCallback(
    (character: Character, position?: number) => {
      try {
        storeAddToParty(character, position);
        setIsSelectModalOpen(false);
        setSelectedPosition(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error adding to party:", err);
      }
    },
    [storeAddToParty]
  );

  /**
   * Remove character from party
   */
  const removeFromParty = useCallback(
    (characterId: string) => {
      try {
        storeRemoveFromParty(characterId);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error removing from party:", err);
      }
    },
    [storeRemoveFromParty]
  );

  /**
   * Swap party members
   */
  const swapPartyMembers = useCallback(
    (pos1: number, pos2: number) => {
      try {
        storeSwapPartyMembers(pos1, pos2);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error swapping party members:", err);
      }
    },
    [storeSwapPartyMembers]
  );

  /**
   * Set party leader
   */
  const setLeader = useCallback(
    (characterId: string) => {
      try {
        storeSetLeader(characterId);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error setting leader:", err);
      }
    },
    [storeSetLeader]
  );

  /**
   * Clear party
   */
  const clearParty = useCallback(() => {
    try {
      storeClearParty();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error clearing party:", err);
    }
  }, [storeClearParty]);

  /**
   * Check if character is in party
   */
  const isInParty = useCallback(
    (characterId: string) => {
      return storeIsInParty(characterId);
    },
    [storeIsInParty]
  );

  /**
   * Open character selection modal
   */
  const openSelectModal = useCallback((position: number) => {
    setSelectedPosition(position);
    setIsSelectModalOpen(true);
    setError(null);
  }, []);

  /**
   * Close character selection modal
   */
  const closeSelectModal = useCallback(() => {
    setIsSelectModalOpen(false);
    setSelectedPosition(null);
    setError(null);
  }, []);

  return {
    // State
    viewModel,
    loading,
    error,
    party,

    // Modal states
    isSelectModalOpen,
    selectedPosition,
    
    // Game state
    hasEverSelectedCharacter,

    // Actions
    loadData,
    addToParty,
    removeFromParty,
    swapPartyMembers,
    setLeader,
    clearParty,
    isInParty,

    // Modal actions
    openSelectModal,
    closeSelectModal,
  };
}
