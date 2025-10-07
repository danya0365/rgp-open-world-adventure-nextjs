import { mockQuests } from "@/src/data/mock/quests.mock";
import { Quest, QuestStatus, QuestType } from "@/src/domain/types/quest.types";

/**
 * Quest View Model
 * Represents the data structure for Quest UI
 */
export interface QuestViewModel {
  // All quests
  allQuests: Quest[];

  // Categorized quests
  mainQuests: Quest[];
  sideQuests: Quest[];
  eventQuests: Quest[];
  dailyQuests: Quest[];
  bountyQuests: Quest[];

  // Filtered by status
  availableQuests: Quest[];
  activeQuests: Quest[];
  completedQuests: Quest[];

  // Statistics
  stats: {
    total: number;
    active: number;
    completed: number;
    available: number;
  };
}

/**
 * Quest Presenter
 * Handles business logic for Quest management
 */
export class QuestPresenter {
  private quests: Quest[];

  constructor(quests: Quest[]) {
    this.quests = quests;
  }

  /**
   * Get view model for Quest UI
   */
  async getViewModel(
    activeQuestIds: string[] = [],
    completedQuestIds: string[] = []
  ): Promise<QuestViewModel> {
    // Update quest statuses based on player progress
    const questsWithStatus = this.quests.map((quest) => {
      let status: QuestStatus = quest.status;

      if (completedQuestIds.includes(quest.id)) {
        status = "completed";
      } else if (activeQuestIds.includes(quest.id)) {
        status = "active";
      } else if (this.isQuestAvailable(quest, completedQuestIds)) {
        status = "available";
      } else {
        status = "locked";
      }

      return { ...quest, status };
    });

    // Categorize by type
    const mainQuests = questsWithStatus.filter((q) => q.type === "main");
    const sideQuests = questsWithStatus.filter((q) => q.type === "side");
    const eventQuests = questsWithStatus.filter((q) => q.type === "event");
    const dailyQuests = questsWithStatus.filter((q) => q.type === "daily");
    const bountyQuests = questsWithStatus.filter((q) => q.type === "bounty");

    // Filter by status
    const availableQuests = questsWithStatus.filter(
      (q) => q.status === "available"
    );
    const activeQuests = questsWithStatus.filter((q) => q.status === "active");
    const completedQuests = questsWithStatus.filter(
      (q) => q.status === "completed"
    );

    // Calculate stats
    const stats = {
      total: questsWithStatus.length,
      active: activeQuests.length,
      completed: completedQuests.length,
      available: availableQuests.length,
    };

    return {
      allQuests: questsWithStatus,
      mainQuests,
      sideQuests,
      eventQuests,
      dailyQuests,
      bountyQuests,
      availableQuests,
      activeQuests,
      completedQuests,
      stats,
    };
  }

  /**
   * Check if quest is available to player
   */
  private isQuestAvailable(quest: Quest, completedQuestIds: string[]): boolean {
    // Check if required quest is completed
    if (
      quest.requiredQuestId &&
      !completedQuestIds.includes(quest.requiredQuestId)
    ) {
      return false;
    }

    // Quest is available
    return true;
  }

  /**
   * Get quest by ID
   */
  getQuestById(questId: string): Quest | undefined {
    return this.quests.find((q) => q.id === questId);
  }

  /**
   * Filter quests by type
   */
  filterByType(type: QuestType): Quest[] {
    return this.quests.filter((q) => q.type === type);
  }

  /**
   * Filter quests by status
   */
  filterByStatus(status: QuestStatus): Quest[] {
    return this.quests.filter((q) => q.status === status);
  }
}

/**
 * Quest Presenter Factory
 * Creates presenter instances for different environments
 */
export class QuestPresenterFactory {
  /**
   * Create presenter for client-side (uses mock data)
   */
  static async createClient(): Promise<QuestPresenter> {
    return new QuestPresenter(mockQuests);
  }

  /**
   * Create presenter for server-side (uses mock data for now)
   */
  static async createServer(): Promise<QuestPresenter> {
    return new QuestPresenter(mockQuests);
  }
}
