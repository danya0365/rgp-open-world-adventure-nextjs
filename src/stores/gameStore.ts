import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Character, RarityType } from "@/src/domain/types/character.types";
import { ITEMS_MASTER_MAP } from "@/src/data/master/items.master";
import {
  LootBoxService,
  type LootBoxOpenResult,
} from "@/src/application/services/lootbox/LootBoxService";
import type {
  LootBoxCostType,
  LootBoxDefinition,
} from "@/src/domain/types/lootbox.types";

/**
 * Game Store - Centralized state management
 * Manages all game state including party, progress, inventory, etc.
 */

// ==================== Types ====================

// Party System (Dragon Quest Tact Style)
export interface PartyMemberV2 {
  characterId: string; // Reference to recruited character
  position: number; // 0-3 (party slot position)
  isLeader: boolean;
}

export interface Party {
  id: string; // UUID
  name: string; // "Main Team", "Boss Team", etc.
  members: PartyMemberV2[]; // max 4
  formation: string; // "offensive", "defensive", "balanced"
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
  equippedBy?: string; // Character ID
}

export interface InventoryConfig {
  capacity: number;
  autoSort: boolean;
  filteredCategory: InventoryCategory;
  sortOrder: InventorySortOrder;
  selectedItemId: string | null;
}

export type InventoryCategory = "all" | "weapons" | "armor" | "consumables" | "materials" | "keyItems";
export type InventorySortOrder = "name-asc" | "rarity-desc" | "type";

export interface RecruitedCharacter {
  characterId: string; // Reference to master data
  recruitedAt: string; // ISO timestamp
  
  // Character progression (mutable)
  level: number;
  exp: number;
  maxExp: number;
  
  // Stats (can change with level up, equipment, etc.)
  stats: {
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    atk: number;
    def: number;
    wis: number;
    agi: number;
    mov: number;
  };
  
  // Equipment (references to item IDs)
  equipment: {
    weapon?: string;
    armor?: string;
    accessory?: string;
  };
  
  // Skills unlocked
  unlockedSkills: string[]; // Skill IDs
  
  // Last updated
  lastUpdated: string;
}

export interface PlayerWorldPosition {
  locationId: string;
  x: number;
  y: number;
  facing: "north" | "south" | "east" | "west";
}

export interface GameProgress {
  currentLocationId: string | null;
  playerWorldPosition: PlayerWorldPosition | null; // Player position in virtual world map
  discoveredLocations: string[]; // Location IDs
  completedQuests: string[]; // Quest IDs
  activeQuests: string[]; // Quest IDs
  recruitedCharacters: RecruitedCharacter[]; // Characters that user has recruited (with full state)
  selectedCharacters: string[]; // Character IDs that user has ever selected/added to party
  gameStarted: boolean;
  lastSaveTime: string;
}

export interface GameEvent {
  id: string;
  type: "quest" | "battle" | "discovery" | "dialogue";
  timestamp: string;
  data: Record<string, unknown>;
}

// ==================== State Interface ====================

interface GameState {
  // Party Management (Multiple Parties - Dragon Quest Tact Style)
  parties: Party[]; // Multiple parties (unlimited)
  activePartyId: string | null; // Currently active party
  
  // Inventory
  inventory: InventoryItem[];
  inventoryConfig: InventoryConfig;
  gold: number;
  lootbox: LootBoxState;
  
  // Game Progress
  progress: GameProgress;
  
  // Events
  events: GameEvent[];
  
  // UI State
  isLoading: boolean;
  
  // ==================== Multiple Party Actions ====================  
  
  createParty: (name: string) => Party;
  deleteParty: (partyId: string) => void;
  renameParty: (partyId: string, newName: string) => void;
  copyParty: (partyId: string, newName: string) => Party;
  setActiveParty: (partyId: string) => void;
  getActiveParty: () => Party | null;
  getParty: (partyId: string) => Party | undefined;
  addToPartyV2: (partyId: string, characterId: string, position?: number) => boolean;
  removeFromPartyV2: (partyId: string, characterId: string) => void;
  isInPartyV2: (partyId: string, characterId: string) => boolean;
  
  // ==================== Inventory Actions ====================
  
  addItem: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string, quantity: number) => void;
  equipItem: (itemId: string, characterId: string) => void;
  unequipItem: (itemId: string) => void;
  setInventoryCapacity: (capacity: number) => void;
  setInventoryCategory: (category: InventoryCategory) => void;
  setInventorySortOrder: (order: InventorySortOrder) => void;
  setSelectedInventoryItem: (itemId: string | null) => void;
  toggleInventoryAutoSort: () => void;
  sortInventory: (order?: InventorySortOrder) => void;
  getInventorySlots: () => InventorySlot[];
  getInventoryCapacity: () => InventoryCapacityStatus;
  addGold: (amount: number) => void;
  removeGold: (amount: number) => boolean;

  // ==================== Loot Box Actions ====================

  listLootBoxes: () => LootBoxDefinition[];
  getLootBoxDefinition: (lootBoxId: string) => LootBoxDefinition | undefined;
  getLootBoxTicketCount: (ticketId: string) => number;
  addLootBoxTicket: (ticketId: string, amount: number) => void;
  consumeLootBoxTicket: (ticketId: string, amount: number) => boolean;
  openLootBox: (params: {
    lootBoxId: string;
    costType?: LootBoxCostType;
    step?: number;
  }) => LootBoxOpenResult | null;
  
  // ==================== Progress Actions ====================

  setCurrentLocation: (locationId: string) => void;
  setPlayerWorldPosition: (position: PlayerWorldPosition) => void;
  getPlayerWorldPosition: () => PlayerWorldPosition | null;
  discoverLocation: (locationId: string) => void;
  isLocationDiscovered: (locationId: string) => boolean;
  
  // Quest Actions
  startQuest: (questId: string) => void;
  completeQuest: (questId: string) => void;
  abandonQuest: (questId: string) => void;
  isQuestActive: (questId: string) => boolean;
  isQuestCompleted: (questId: string) => boolean;
  
  // Character Actions
  recruitCharacter: (character: Character) => void;
  isCharacterRecruited: (characterId: string) => boolean;
  getRecruitedCharacter: (characterId: string) => RecruitedCharacter | undefined;
  updateRecruitedCharacter: (characterId: string, updates: Partial<RecruitedCharacter>) => void;
  
  startGame: () => void;
  
  // ==================== Event Actions ====================
  
  addEvent: (event: Omit<GameEvent, "id" | "timestamp">) => void;
  getEvents: () => GameEvent[];
  clearEvents: () => void;
  
  // ==================== Validation ====================
  
  canEnterPartyPage: () => boolean;
  canEnterWorldMap: () => boolean;
  
  // ==================== Reset ====================
  
  resetGame: () => void;
}

// ==================== Initial State ====================

const initialProgress: GameProgress = {
  currentLocationId: null,
  playerWorldPosition: null,
  discoveredLocations: [],
  completedQuests: [],
  activeQuests: [],
  recruitedCharacters: [],
  selectedCharacters: [],
  gameStarted: false,
  lastSaveTime: new Date().toISOString(),
};

// ==================== Store ====================

// Helper function to generate UUID
const generateId = () => `party_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const lootBoxService = new LootBoxService();

const rarityPriority: Record<RarityType, number> = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  legendary: 5,
  mythic: 6,
};

const getRarityValue = (rarity?: RarityType) => (rarity ? rarityPriority[rarity] : 0);

const resolveNextStep = (lootBox: LootBoxDefinition, currentStep?: number): number | undefined => {
  if (!lootBox.stepConfigs?.length) {
    return currentStep;
  }

  const orderedSteps = [...lootBox.stepConfigs]
    .map((config) => config.step)
    .sort((a, b) => a - b);
  const activeStep = currentStep ?? orderedSteps[0];
  const currentIndex = orderedSteps.findIndex((step) => step === activeStep);

  if (currentIndex === -1) {
    return orderedSteps[0];
  }

  return orderedSteps[(currentIndex + 1) % orderedSteps.length];
};

export interface InventorySlot {
  slotIndex: number;
  itemId: string | null;
  quantity: number;
}

export interface InventoryCapacityStatus {
  used: number;
  capacity: number;
  remaining: number;
  isFull: boolean;
}

export interface LootBoxState {
  tickets: Record<string, number>;
  pityCounters: Record<string, number>;
  openedCount: Record<string, number>;
  stepState: Record<string, number | undefined>;
  history: LootBoxOpenResult[];
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial State
      parties: [], // Will be initialized on first load
      activePartyId: null,
      inventory: [],
      inventoryConfig: {
        capacity: 60,
        autoSort: true,
        filteredCategory: "all",
        sortOrder: "rarity-desc",
        selectedItemId: null,
      },
      gold: 1000,
      lootbox: {
        tickets: {},
        pityCounters: {},
        openedCount: {},
        stepState: {},
        history: [],
      },
      progress: initialProgress,
      events: [],
      isLoading: false,

      // ==================== Multiple Party Actions ====================

      addItem: (itemId: string, quantity: number) => {
        const state = get();
        const { inventory, inventoryConfig } = state;
        const existingItem = inventory.find((i) => i.itemId === itemId);

        const currentSlots = inventory.reduce((acc, item) => acc + (item.quantity > 0 ? 1 : 0), 0);
        const hasEmptySlot = currentSlots < inventoryConfig.capacity || existingItem;
        if (!hasEmptySlot) {
          console.warn("Inventory full. Cannot add item", itemId);
          return;
        }

        if (existingItem) {
          set({
            inventory: state.inventory.map((i) =>
              i.itemId === itemId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({
            inventory: [...state.inventory, { itemId, quantity }],
          });
        }

        // Add event
        get().addEvent({
          type: "discovery",
          data: {
            action: "add_item",
            itemId,
            quantity,
          },
        });

        if (inventoryConfig.autoSort) {
          get().sortInventory();
        }
      },

      removeItem: (itemId: string, quantity: number) => {
        const state = get();
        const existingItem = state.inventory.find((i) => i.itemId === itemId);

        if (!existingItem || existingItem.quantity < quantity) {
          return;
        }

        if (existingItem.quantity === quantity) {
          set({
            inventory: state.inventory.filter((i) => i.itemId !== itemId),
          });
        } else {
          set({
            inventory: state.inventory.map((i) =>
              i.itemId === itemId
                ? { ...i, quantity: i.quantity - quantity }
                : i
            ),
          });
        }
      },

      setInventoryCapacity: (capacity: number) => {
        set((state) => ({
          inventoryConfig: {
            ...state.inventoryConfig,
            capacity,
          },
        }));
      },

      setInventoryCategory: (category: InventoryCategory) => {
        set((state) => ({
          inventoryConfig: {
            ...state.inventoryConfig,
            filteredCategory: category,
          },
        }));
      },

      setInventorySortOrder: (order: InventorySortOrder) => {
        set((state) => ({
          inventoryConfig: {
            ...state.inventoryConfig,
            sortOrder: order,
          },
        }));
        get().sortInventory(order);
      },

      setSelectedInventoryItem: (itemId: string | null) => {
        set((state) => ({
          inventoryConfig: {
            ...state.inventoryConfig,
            selectedItemId: itemId,
          },
        }));
      },

      toggleInventoryAutoSort: () => {
        set((state) => ({
          inventoryConfig: {
            ...state.inventoryConfig,
            autoSort: !state.inventoryConfig.autoSort,
          },
        }));
      },

      sortInventory: (order?: InventorySortOrder) => {
        const state = get();
        const sortBy = order ?? state.inventoryConfig.sortOrder;
        set({
          inventory: [...state.inventory].sort((a, b) => {
            const itemA = ITEMS_MASTER_MAP[a.itemId];
            const itemB = ITEMS_MASTER_MAP[b.itemId];

            switch (sortBy) {
              case "name-asc":
                return (itemA?.name ?? "").localeCompare(itemB?.name ?? "");
              case "type":
                return (itemA?.type ?? "").localeCompare(itemB?.type ?? "");
              case "rarity-desc":
              default: {
                const rarityA = getRarityValue(itemA?.rarity as RarityType | undefined);
                const rarityB = getRarityValue(itemB?.rarity as RarityType | undefined);
                if (rarityB !== rarityA) {
                  return rarityB - rarityA;
                }
                return (itemA?.name ?? "").localeCompare(itemB?.name ?? "");
              }
            }
          }),
        });
      },

      getInventorySlots: () => {
        const state = get();
        const { inventory, inventoryConfig } = state;
        const slots: InventorySlot[] = [];
        const sorted = [...inventory].sort((a, b) => a.itemId.localeCompare(b.itemId));

        sorted.forEach((item, index) => {
          if (index < inventoryConfig.capacity) {
            slots.push({ slotIndex: index, itemId: item.itemId, quantity: item.quantity });
          }
        });

        if (slots.length < inventoryConfig.capacity) {
          for (let i = slots.length; i < inventoryConfig.capacity; i++) {
            slots.push({ slotIndex: i, itemId: null, quantity: 0 });
          }
        }

        return slots;
      },

      getInventoryCapacity: () => {
        const state = get();
        const usedSlots = state.inventory.length;
        const { capacity } = state.inventoryConfig;
        const remaining = Math.max(capacity - usedSlots, 0);
        return {
          used: usedSlots,
          capacity,
          remaining,
          isFull: remaining === 0,
        };
      },

      equipItem: (itemId: string, characterId: string) => {
        const state = get();
        set({
          inventory: state.inventory.map((i) =>
            i.itemId === itemId ? { ...i, equippedBy: characterId } : i
          ),
        });
      },

      unequipItem: (itemId: string) => {
        const state = get();
        set({
          inventory: state.inventory.map((i) =>
            i.itemId === itemId ? { ...i, equippedBy: undefined } : i
          ),
        });
      },

      addGold: (amount: number) => {
        const state = get();
        set({ gold: state.gold + amount });
      },

      removeGold: (amount: number) => {
        const state = get();
        if (state.gold < amount) {
          return false;
        }
        set({ gold: state.gold - amount });
        return true;
      },

      // ==================== Loot Box Actions ====================

      listLootBoxes: () => lootBoxService.listLootBoxes(),

      getLootBoxDefinition: (lootBoxId: string) => lootBoxService.getLootBoxById(lootBoxId),

      getLootBoxTicketCount: (ticketId: string) => get().lootbox.tickets[ticketId] ?? 0,

      addLootBoxTicket: (ticketId: string, amount: number) => {
        if (amount <= 0) {
          return;
        }
        set((state) => ({
          lootbox: {
            ...state.lootbox,
            tickets: {
              ...state.lootbox.tickets,
              [ticketId]: (state.lootbox.tickets[ticketId] ?? 0) + amount,
            },
          },
        }));
      },

      consumeLootBoxTicket: (ticketId: string, amount: number) => {
        const state = get();
        const current = state.lootbox.tickets[ticketId] ?? 0;
        if (amount <= 0 || current < amount) {
          return false;
        }
        set((setState) => ({
          lootbox: {
            ...setState.lootbox,
            tickets: {
              ...setState.lootbox.tickets,
              [ticketId]: current - amount,
            },
          },
        }));
        return true;
      },

      openLootBox: ({ lootBoxId, costType, step }) => {
        const state = get();
        const lootBox = lootBoxService.getLootBoxById(lootBoxId);
        if (!lootBox) {
          console.warn(`LootBox ${lootBoxId} not found`);
          return null;
        }

        const activeStep =
          lootBox.type === "stepup"
            ? step ?? state.lootbox.stepState[lootBoxId] ?? lootBox.stepConfigs?.[0]?.step
            : undefined;

        const resolveCostOption = () => {
          let baseCost = costType
            ? lootBox.costOptions.find((option) => option.type === costType)
            : lootBox.costOptions[0];

          if (lootBox.type === "stepup" && activeStep) {
            const stepConfig = lootBox.stepConfigs?.find((config) => config.step === activeStep);
            baseCost = stepConfig?.cost ?? baseCost;
          }

          return baseCost;
        };

        const costOption = resolveCostOption();
        if (!costOption) {
          console.warn(`No cost option available for loot box ${lootBoxId}`);
          return null;
        }

        const payCost = () => {
          switch (costOption.type) {
            case "gold":
              return get().removeGold(costOption.amount);
            case "ticket": {
              const ticketId = costOption.ticketId;
              if (!ticketId) {
                console.warn(`Ticket ID missing for cost option in loot box ${lootBoxId}`);
                return false;
              }
              return get().consumeLootBoxTicket(ticketId, costOption.amount);
            }
            default:
              console.warn(`Unsupported loot box cost type ${costOption.type}`);
              return false;
          }
        };

        const paid = payCost();
        if (!paid) {
          console.warn(`Unable to pay cost for loot box ${lootBoxId}`);
          return null;
        }

        const result = lootBoxService.openLootBox(costOption, {
          lootBoxId,
          step: activeStep,
          pityCounters: state.lootbox.pityCounters,
          openedCount: state.lootbox.openedCount,
        });

        result.rewards.forEach((reward) => {
          get().addItem(reward.item.id, reward.quantity);
        });

        const nextStep =
          lootBox.type === "stepup" ? resolveNextStep(lootBox, activeStep) : undefined;

        set((setState) => {
          const updatedStepState = { ...setState.lootbox.stepState };
          if (lootBox.type === "stepup") {
            updatedStepState[lootBoxId] = nextStep;
          } else {
            delete updatedStepState[lootBoxId];
          }

          return {
            lootbox: {
              tickets: setState.lootbox.tickets,
              pityCounters: { ...result.pityCounters },
              openedCount: { ...result.openedCount },
              stepState: updatedStepState,
              history: [...setState.lootbox.history, result].slice(-20),
            },
          };
        });

        get().addEvent({
          type: "discovery",
          data: {
            action: "open_lootbox",
            lootBoxId,
            rollId: result.rollId,
            rewards: result.rewards.map((reward) => ({
              itemId: reward.item.id,
              quantity: reward.quantity,
              rarity: reward.rarity,
              guaranteeSource: reward.guaranteeSource,
            })),
          },
        });

        return result;
      },

      // ==================== Progress Actions ====================

      setCurrentLocation: (locationId: string) => {
        set((state) => ({
          progress: {
            ...state.progress,
            currentLocationId: locationId,
            lastSaveTime: new Date().toISOString(),
          },
        }));

        // Add event
        get().addEvent({
          type: "discovery",
          data: {
            action: "enter_location",
            locationId,
          },
        });
      },

      setPlayerWorldPosition: (position: PlayerWorldPosition) => {
        set((state) => ({
          progress: {
            ...state.progress,
            playerWorldPosition: position,
            currentLocationId: position.locationId,
            lastSaveTime: new Date().toISOString(),
          },
        }));
      },

      getPlayerWorldPosition: () => {
        return get().progress.playerWorldPosition;
      },

      discoverLocation: (locationId: string) => {
        const state = get();
        if (!state.progress.discoveredLocations.includes(locationId)) {
          set((state) => ({
            progress: {
              ...state.progress,
              discoveredLocations: [
                ...state.progress.discoveredLocations,
                locationId,
              ],
            },
          }));

          // Add event
          get().addEvent({
            type: "discovery",
            data: {
              action: "discover_location",
              locationId,
            },
          });
        }
      },

      isLocationDiscovered: (locationId: string) => {
        const state = get();
        return state.progress.discoveredLocations.includes(locationId);
      },

      completeQuest: (questId: string) => {
        set((state) => ({
          progress: {
            ...state.progress,
            completedQuests: [...state.progress.completedQuests, questId],
            activeQuests: state.progress.activeQuests.filter(
              (id) => id !== questId
            ),
          },
        }));

        // Add event
        get().addEvent({
          type: "quest",
          data: {
            action: "complete_quest",
            questId,
          },
        });
      },

      startQuest: (questId: string) => {
        const state = get();
        if (!state.progress.activeQuests.includes(questId)) {
          set((state) => ({
            progress: {
              ...state.progress,
              activeQuests: [...state.progress.activeQuests, questId],
            },
          }));

          // Add event
          get().addEvent({
            type: "quest",
            data: {
              action: "start_quest",
              questId,
            },
          });
        }
      },

      abandonQuest: (questId: string) => {
        set((state) => ({
          progress: {
            ...state.progress,
            activeQuests: state.progress.activeQuests.filter((id) => id !== questId),
          },
        }));

        // Add event
        get().addEvent({
          type: "quest",
          data: {
            action: "abandon_quest",
            questId,
          },
        });
      },

      isQuestActive: (questId: string) => {
        const state = get();
        return state.progress.activeQuests.includes(questId);
      },

      isQuestCompleted: (questId: string) => {
        const state = get();
        return state.progress.completedQuests.includes(questId);
      },

      recruitCharacter: (character: Character) => {
        const state = get();
        const isAlreadyRecruited = state.progress.recruitedCharacters.some(
          (rc) => rc.characterId === character.id
        );
        
        if (!isAlreadyRecruited) {
          const recruitedChar: RecruitedCharacter = {
            characterId: character.id,
            recruitedAt: new Date().toISOString(),
            level: character.level,
            exp: character.exp,
            maxExp: character.maxExp,
            stats: { ...character.stats },
            equipment: { ...character.equipment },
            unlockedSkills: [...character.skills],
            lastUpdated: new Date().toISOString(),
          };
          
          set((state) => ({
            progress: {
              ...state.progress,
              recruitedCharacters: [
                ...state.progress.recruitedCharacters,
                recruitedChar,
              ],
            },
          }));

          // Add event
          get().addEvent({
            type: "discovery",
            data: {
              action: "recruit_character",
              characterId: character.id,
              characterName: character.name,
            },
          });
        }
      },
      
      isCharacterRecruited: (characterId: string) => {
        const state = get();
        return state.progress.recruitedCharacters.some(
          (rc) => rc.characterId === characterId
        );
      },
      
      getRecruitedCharacter: (characterId: string) => {
        const state = get();
        return state.progress.recruitedCharacters.find(
          (rc) => rc.characterId === characterId
        );
      },
      
      updateRecruitedCharacter: (characterId: string, updates: Partial<RecruitedCharacter>) => {
        set((state) => ({
          progress: {
            ...state.progress,
            recruitedCharacters: state.progress.recruitedCharacters.map((rc) =>
              rc.characterId === characterId
                ? { ...rc, ...updates, lastUpdated: new Date().toISOString() }
                : rc
            ),
          },
        }));
      },

      startGame: () => {
        set((state) => ({
          progress: {
            ...state.progress,
            gameStarted: true,
            lastSaveTime: new Date().toISOString(),
          },
        }));
      },

      // ==================== Event Actions ====================

      addEvent: (event: Omit<GameEvent, "id" | "timestamp">) => {
        const newEvent: GameEvent = {
          ...event,
          id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          events: [...state.events, newEvent].slice(-100), // Keep last 100 events
        }));
      },
      
      getEvents: () => {
        const state = get();
        return state.events;
      },

      clearEvents: () => {
        set({ events: [] });
      },

      // ==================== Validation ====================

      canEnterPartyPage: () => {
        // Always can enter party page
        return true;
      },

      canEnterWorldMap: () => {
        const state = get();
        // Must have at least 1 party member
        return state.parties.some((p) => p.members.length > 0);
      },

      // ==================== Multiple Party Actions ====================

      createParty: (name: string) => {
        const newParty: Party = {
          id: generateId(),
          name,
          members: [],
          formation: "balanced",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          parties: [...state.parties, newParty],
          // Set as active if it's the first party
          activePartyId: state.parties.length === 0 ? newParty.id : state.activePartyId,
        }));

        return newParty;
      },

      deleteParty: (partyId: string) => {
        const state = get();
        
        // Cannot delete if it's the last party
        if (state.parties.length <= 1) {
          console.warn("Cannot delete the last party");
          return;
        }

        const newParties = state.parties.filter((p) => p.id !== partyId);
        
        // Determine new active party
        let newActivePartyId = state.activePartyId;
        
        if (state.activePartyId === partyId) {
          // If deleted party was active, set first party as active
          newActivePartyId = newParties[0]?.id || null;
        } else {
          // Check if current active party still exists
          const activeStillExists = newParties.some(p => p.id === state.activePartyId);
          if (!activeStillExists) {
            newActivePartyId = newParties[0]?.id || null;
          }
        }
        
        set({
          parties: newParties,
          activePartyId: newActivePartyId,
        });
      },

      renameParty: (partyId: string, newName: string) => {
        set((state) => ({
          parties: state.parties.map((p) =>
            p.id === partyId
              ? { ...p, name: newName, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      copyParty: (partyId: string, newName: string) => {
        const state = get();
        const sourceParty = state.parties.find((p) => p.id === partyId);
        
        if (!sourceParty) {
          console.warn(`Party ${partyId} not found`);
          return {} as Party;
        }

        const newParty: Party = {
          ...sourceParty,
          id: generateId(),
          name: newName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          parties: [...state.parties, newParty],
        }));

        return newParty;
      },

      setActiveParty: (partyId: string) => {
        set({ activePartyId: partyId });
      },

      getActiveParty: () => {
        const state = get();
        return state.parties.find((p) => p.id === state.activePartyId) || null;
      },

      getParty: (partyId: string) => {
        const state = get();
        return state.parties.find((p) => p.id === partyId);
      },

      addToPartyV2: (partyId: string, characterId: string, position?: number) => {
        const state = get();
        const party = state.parties.find((p) => p.id === partyId);
        
        if (!party) {
          console.warn(`Party ${partyId} not found`);
          return false;
        }

        // Check if party is full
        if (party.members.length >= 4) {
          console.warn("Party is full (max 4 members)");
          return false;
        }

        // Check if character already in this party
        if (party.members.some((m) => m.characterId === characterId)) {
          console.warn("Character already in this party");
          return false;
        }

        // Determine position
        const targetPosition = position ?? party.members.length;

        const newMember: PartyMemberV2 = {
          characterId,
          position: targetPosition,
          isLeader: party.members.length === 0, // First member is leader
        };

        set((state) => ({
          parties: state.parties.map((p) =>
            p.id === partyId
              ? {
                  ...p,
                  members: [...p.members, newMember],
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));

        return true;
      },

      removeFromPartyV2: (partyId: string, characterId: string) => {
        set((state) => ({
          parties: state.parties.map((p) =>
            p.id === partyId
              ? {
                  ...p,
                  members: p.members.filter((m) => m.characterId !== characterId),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      isInPartyV2: (partyId: string, characterId: string) => {
        const state = get();
        const party = state.parties.find((p) => p.id === partyId);
        return party ? party.members.some((m) => m.characterId === characterId) : false;
      },

      // ==================== Reset ====================

      resetGame: () => {
        // Create default party
        const defaultParty: Party = {
          id: generateId(),
          name: "Main Team",
          members: [],
          formation: "balanced",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set({
          parties: [defaultParty],
          activePartyId: defaultParty.id,
          inventory: [],
          gold: 1000,
          progress: initialProgress,
          events: [],
        });
      },
    }),
    {
      name: "game-storage",
    }
  )
);

// ==================== Helper Functions ====================

export function getPartyLeader(party: any[]): any | null {
  return party.find((m) => m.isLeader) || null;
}

export function getPartyStats(party: any[]) {
  const totalHp = party.reduce((sum, m) => sum + m.character.stats.maxHp, 0);
  const totalMp = party.reduce((sum, m) => sum + m.character.stats.maxMp, 0);
  const avgLevel =
    party.length > 0
      ? Math.floor(party.reduce((sum, m) => sum + m.character.level, 0) / party.length)
      : 0;

  return {
    totalHp,
    totalMp,
    avgLevel,
    memberCount: party.length,
  };
}

export function getPartySynergy(party: any[]): string[] {
  const synergies: string[] = [];
  
  // Check for elemental diversity
  const elements = new Set(party.flatMap((m) => m.character.elements));
  if (elements.size >= 3) {
    synergies.push("Elemental Diversity");
  }

  // Check for balanced party (different classes)
  const classes = new Set(party.map((m) => m.character.class));
  if (classes.size === party.length) {
    synergies.push("Balanced Team");
  }

  // Check for healer
  const hasHealer = party.some(
    (m) => m.character.class === "priest" || m.character.class === "paladin"
  );
  if (hasHealer) {
    synergies.push("Healer Support");
  }

  // Check for tank
  const hasTank = party.some(
    (m) => m.character.class === "warrior" || m.character.class === "paladin"
  );
  if (hasTank) {
    synergies.push("Tank Protection");
  }

  // Check for DPS
  const hasDPS = party.some(
    (m) =>
      m.character.class === "mage" ||
      m.character.class === "archer" ||
      m.character.class === "assassin"
  );
  if (hasDPS) {
    synergies.push("High Damage");
  }

  return synergies;
}
