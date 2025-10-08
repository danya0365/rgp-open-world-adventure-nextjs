import { QuestStatus, QuestType } from "@/src/domain/types/quest.types";
import { useGameStore } from "@/src/stores/gameStore";
import { useCallback, useEffect, useState } from "react";
import {
  QuestPresenter,
  QuestPresenterFactory,
  QuestViewModel,
} from "./QuestPresenter";

export interface QuestPresenterHook {
  // State
  viewModel: QuestViewModel | null;
  loading: boolean;
  error: string | null;

  // Filters
  selectedType: QuestType | "all";
  selectedStatus: QuestStatus | "all";

  // Actions
  loadData: () => Promise<void>;
  setSelectedType: (type: QuestType | "all") => void;
  setSelectedStatus: (status: QuestStatus | "all") => void;
  startQuest: (questId: string) => void;
  completeQuest: (questId: string) => void;
  abandonQuest: (questId: string) => void;
}

let presenterInstance: QuestPresenter | null = null;

/**
 * Get or create presenter instance
 */
function getPresenter(): QuestPresenter {
  if (!presenterInstance) {
    presenterInstance = QuestPresenterFactory.createClient();
  }
  return presenterInstance;
}

/**
 * Custom hook for Quest presenter
 * Provides state management and actions for quest operations
 */
export function useQuestPresenter(
  initialViewModel: QuestViewModel | null = null
): QuestPresenterHook {
  const [viewModel, setViewModel] = useState<QuestViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<QuestType | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<QuestStatus | "all">(
    "all"
  );

  // Get quest progress from game store
  const { progress } = useGameStore();

  /**
   * Load data from presenter
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const presenter = getPresenter();
      const newViewModel = await presenter.getViewModel(
        progress.activeQuests,
        progress.completedQuests
      );
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error loading quest data:", err);
    } finally {
      setLoading(false);
    }
  }, [progress.activeQuests, progress.completedQuests]);

  /**
   * Load data on mount if no initial view model
   */
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [initialViewModel, loadData]);

  /**
   * Reload data when quest progress changes
   */
  useEffect(() => {
    if (initialViewModel) {
      loadData();
    }
  }, [progress.activeQuests.length, progress.completedQuests.length]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Start a quest
   */
  const startQuest = useCallback(
    (questId: string) => {
      const { startQuest: storeStartQuest } = useGameStore.getState();
      storeStartQuest(questId);
      loadData();
    },
    [loadData]
  );

  /**
   * Complete a quest
   */
  const completeQuest = useCallback(
    (questId: string) => {
      const { completeQuest: storeCompleteQuest } = useGameStore.getState();
      storeCompleteQuest(questId);
      loadData();
    },
    [loadData]
  );

  /**
   * Abandon a quest
   */
  const abandonQuest = useCallback(
    (questId: string) => {
      const { progress } = useGameStore.getState();
      const updatedActiveQuests = progress.activeQuests.filter(
        (id) => id !== questId
      );

      useGameStore.setState({
        progress: {
          ...progress,
          activeQuests: updatedActiveQuests,
        },
      });

      loadData();
    },
    [loadData]
  );

  return {
    // State
    viewModel,
    loading,
    error,
    selectedType,
    selectedStatus,

    // Actions
    loadData,
    setSelectedType,
    setSelectedStatus,
    startQuest,
    completeQuest,
    abandonQuest,
  };
}
