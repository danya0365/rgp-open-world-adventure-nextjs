import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Character } from "@/src/domain/types/character.types";

/**
 * Party Management Store
 * Manages party composition (max 4 characters)
 */

export interface PartyMember {
  character: Character;
  position: number; // 0-3 (party slot position)
  isLeader: boolean;
}

interface PartyState {
  // Party members (max 4)
  party: PartyMember[];
  
  // Available characters (not in party)
  availableCharacters: Character[];
  
  // Actions
  addToParty: (character: Character, position?: number) => boolean;
  removeFromParty: (characterId: string) => void;
  swapPartyMembers: (position1: number, position2: number) => void;
  setLeader: (characterId: string) => void;
  clearParty: () => void;
  isInParty: (characterId: string) => boolean;
  getPartyMember: (position: number) => PartyMember | null;
  setAvailableCharacters: (characters: Character[]) => void;
}

export const usePartyStore = create<PartyState>()(
  persist(
    (set, get) => ({
      party: [],
      availableCharacters: [],

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

      setAvailableCharacters: (characters: Character[]) => {
        set({ availableCharacters: characters });
      },
    }),
    {
      name: "party-storage",
    }
  )
);

// Helper functions
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
