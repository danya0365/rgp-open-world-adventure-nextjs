import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Character } from "@/src/domain/types/character.types";

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
    int: number;
    agi: number;
    luk: number;
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

export interface GameProgress {
  currentLocationId: string | null;
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
  gold: number;
  
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
  unequipItem: (itemId: string) => void;
  addGold: (amount: number) => void;
  removeGold: (amount: number) => boolean;
  
  // ==================== Progress Actions ====================

  setCurrentLocation: (locationId: string) => void;
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

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial State
      parties: [], // Will be initialized on first load
      activePartyId: null,
      inventory: [],
      gold: 1000,
      progress: initialProgress,
      events: [],
      isLoading: false,

      // ==================== Multiple Party Actions ====================

      addItem: (itemId: string, quantity: number) => {
        const state = get();
        const existingItem = state.inventory.find((i) => i.itemId === itemId);

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

      // ==================== Progress Actions ====================

      setCurrentLocation: (locationId: string) => {
        set((state) => ({
          progress: {
            ...state.progress,
            currentLocationId: locationId,
            lastSaveTime: new Date().toISOString(),
          },
        }));

        // Auto-discover location
        get().discoverLocation(locationId);

        // Add event
        get().addEvent({
          type: "discovery",
          data: {
            action: "enter_location",
            locationId,
          },
        });
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
