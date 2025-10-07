import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Character } from "@/src/domain/types/character.types";

/**
 * Game Store - Centralized state management
 * Manages all game state including party, progress, inventory, etc.
 */

// ==================== Types ====================

export interface PartyMember {
  character: Character;
  position: number; // 0-3 (party slot position)
  isLeader: boolean;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
  equippedBy?: string; // Character ID
}

export interface GameProgress {
  currentLocationId: string | null;
  discoveredLocations: string[]; // Location IDs
  completedQuests: string[]; // Quest IDs
  activeQuests: string[]; // Quest IDs
  unlockedCharacters: string[]; // Character IDs that user has unlocked (recruited)
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
  // Party Management
  party: PartyMember[];
  
  // Inventory
  inventory: InventoryItem[];
  gold: number;
  
  // Game Progress
  progress: GameProgress;
  
  // Events
  events: GameEvent[];
  
  // UI State
  isLoading: boolean;
  
  // ==================== Party Actions ====================
  
  addToParty: (character: Character, position?: number) => boolean;
  removeFromParty: (characterId: string) => void;
  swapPartyMembers: (position1: number, position2: number) => void;
  setLeader: (characterId: string) => void;
  clearParty: () => void;
  isInParty: (characterId: string) => boolean;
  getPartyMember: (position: number) => PartyMember | null;
  
  // ==================== Inventory Actions ====================
  
  addItem: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string, quantity: number) => void;
  equipItem: (itemId: string, characterId: string) => void;
  unequipItem: (itemId: string) => void;
  addGold: (amount: number) => void;
  removeGold: (amount: number) => boolean;
  
  // ==================== Progress Actions ====================
  
  setCurrentLocation: (locationId: string) => void;
  discoverLocation: (locationId: string) => void;
  isLocationDiscovered: (locationId: string) => boolean;
  completeQuest: (questId: string) => void;
  startQuest: (questId: string) => void;
  unlockCharacter: (characterId: string) => void;
  startGame: () => void;
  
  // ==================== Event Actions ====================
  
  addEvent: (event: Omit<GameEvent, "id" | "timestamp">) => void;
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
  unlockedCharacters: [],
  selectedCharacters: [],
  gameStarted: false,
  lastSaveTime: new Date().toISOString(),
};

// ==================== Store ====================

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial State
      party: [],
      inventory: [],
      gold: 1000,
      progress: initialProgress,
      events: [],
      isLoading: false,

      // ==================== Party Actions ====================

      addToParty: (character: Character, position?: number) => {
        const state = get();
        
        // Check if already in party
        if (state.isInParty(character.id)) {
          return false;
        }

        // Check if party is full (max 4)
        if (state.party.length >= 4) {
          return false;
        }

        // Determine position
        let targetPosition = position;
        if (targetPosition === undefined) {
          // Find first empty slot
          const occupiedPositions = state.party.map((m) => m.position);
          for (let i = 0; i < 4; i++) {
            if (!occupiedPositions.includes(i)) {
              targetPosition = i;
              break;
            }
          }
        }

        if (targetPosition === undefined) {
          return false;
        }

        // Check if position is already occupied
        const existingMember = state.party.find(
          (m) => m.position === targetPosition
        );
        if (existingMember) {
          return false;
        }

        const newMember: PartyMember = {
          character,
          position: targetPosition,
          isLeader: state.party.length === 0, // First member is leader
        };

        set({
          party: [...state.party, newMember],
        });

        // Track that this character has been selected
        if (!state.progress.selectedCharacters.includes(character.id)) {
          set((state) => ({
            progress: {
              ...state.progress,
              selectedCharacters: [
                ...state.progress.selectedCharacters,
                character.id,
              ],
            },
          }));
        }

        // Add event
        get().addEvent({
          type: "quest",
          data: {
            action: "add_to_party",
            characterId: character.id,
            characterName: character.name,
          },
        });

        return true;
      },

      removeFromParty: (characterId: string) => {
        const state = get();
        const updatedParty = state.party.filter(
          (m) => m.character.id !== characterId
        );

        // If leader was removed, make first member the new leader
        if (updatedParty.length > 0) {
          const hasLeader = updatedParty.some((m) => m.isLeader);
          if (!hasLeader) {
            updatedParty[0].isLeader = true;
          }
        }

        set({ party: updatedParty });

        // Add event
        get().addEvent({
          type: "quest",
          data: {
            action: "remove_from_party",
            characterId,
          },
        });
      },

      swapPartyMembers: (position1: number, position2: number) => {
        const state = get();
        const member1 = state.party.find((m) => m.position === position1);
        const member2 = state.party.find((m) => m.position === position2);

        if (!member1 || !member2) {
          return;
        }

        const updatedParty = state.party.map((member) => {
          if (member.position === position1) {
            return { ...member, position: position2 };
          }
          if (member.position === position2) {
            return { ...member, position: position1 };
          }
          return member;
        });

        set({ party: updatedParty });
      },

      setLeader: (characterId: string) => {
        const state = get();
        const updatedParty = state.party.map((member) => ({
          ...member,
          isLeader: member.character.id === characterId,
        }));

        set({ party: updatedParty });
      },

      clearParty: () => {
        set({ party: [] });
      },

      isInParty: (characterId: string) => {
        const state = get();
        return state.party.some((m) => m.character.id === characterId);
      },

      getPartyMember: (position: number) => {
        const state = get();
        return state.party.find((m) => m.position === position) || null;
      },

      // ==================== Inventory Actions ====================

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

      unlockCharacter: (characterId: string) => {
        const state = get();
        if (!state.progress.unlockedCharacters.includes(characterId)) {
          set((state) => ({
            progress: {
              ...state.progress,
              unlockedCharacters: [
                ...state.progress.unlockedCharacters,
                characterId,
              ],
            },
          }));

          // Add event
          get().addEvent({
            type: "discovery",
            data: {
              action: "unlock_character",
              characterId,
            },
          });
        }
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
        return state.party.length > 0;
      },

      // ==================== Reset ====================

      resetGame: () => {
        set({
          party: [],
          inventory: [],
          gold: 1000,
          progress: initialProgress,
          events: [],
          isLoading: false,
        });
      },
    }),
    {
      name: "game-storage",
      partialize: (state) => ({
        party: state.party,
        inventory: state.inventory,
        gold: state.gold,
        progress: state.progress,
        // Don't persist events (too large)
      }),
    }
  )
);

// ==================== Helper Functions ====================

export function getPartyLeader(party: PartyMember[]): PartyMember | null {
  return party.find((m) => m.isLeader) || null;
}

export function getPartyStats(party: PartyMember[]) {
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

export function getPartySynergy(party: PartyMember[]): string[] {
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
