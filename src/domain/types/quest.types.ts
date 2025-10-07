/**
 * Quest & Story Types
 */

export type QuestType = "main" | "side" | "event" | "daily" | "bounty";

export type QuestStatus = "locked" | "available" | "active" | "completed" | "failed";

export interface QuestObjective {
  id: string;
  description: string;
  type: "kill" | "collect" | "talk" | "explore" | "escort" | "defend";
  targetId?: string; // Enemy ID, Item ID, NPC ID, Location ID
  current: number;
  required: number;
  isCompleted: boolean;
}

export interface QuestReward {
  exp: number;
  gold: number;
  items?: {
    itemId: string;
    quantity: number;
  }[];
  unlockCharacterId?: string;
  unlockLocationId?: string;
}

export interface Quest {
  id: string;
  name: string;
  type: QuestType;
  description: string;
  story?: string;
  requiredLevel: number;
  requiredQuestId?: string; // Previous quest that must be completed
  locationId: string; // Where to start the quest
  npcId?: string; // Quest giver
  objectives: QuestObjective[];
  rewards: QuestReward;
  timeLimit?: number; // in minutes
  isRepeatable: boolean;
  status: QuestStatus;
}

export interface PlayerQuestProgress {
  questId: string;
  status: QuestStatus;
  objectives: QuestObjective[];
  startedAt?: string;
  completedAt?: string;
}
