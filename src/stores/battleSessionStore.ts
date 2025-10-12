import { create } from "zustand";
import { BattleMapConfig } from "../domain/types/battle.types";
import { Character, Enemy } from "../domain/types/character.types";
import { Location } from "../domain/types/location.types";

/**
 * Battle Session Store - For Encounter Battles
 * Separate from battleStore to handle encounter-specific battle sessions
 * This store manages the battle session data needed to initialize and track encounter battles
 */

export interface BattleSession {
  id: string;
  // Core Battle Data
  allies: Character[]; // Characters from active party
  enemies: Enemy[]; // Enemies from encounter
  battleMap: BattleMapConfig; // Battle map configuration
  location: Location; // Where the battle takes place
  
  // Session Metadata
  createdAt: string;
  encounterData?: {
    canFlee: boolean;
    fleeChance: number;
    triggeredAt: number;
  };
}

interface BattleSessionState {
  // Current active session
  currentSession: BattleSession | null;
  
  // Session history (optional, for tracking)
  sessionHistory: BattleSession[];
  
  // Actions
  createSession: (
    allies: Character[],
    enemies: Enemy[],
    battleMap: BattleMapConfig,
    location: Location,
    encounterData?: BattleSession["encounterData"]
  ) => BattleSession;
  
  clearSession: () => void;
  
  getCurrentSession: () => BattleSession | null;
  
  // Session validation
  hasActiveSession: () => boolean;
}

// Helper to generate unique session ID
const generateSessionId = () => 
  `battle_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useBattleSessionStore = create<BattleSessionState>((set, get) => ({
  currentSession: null,
  sessionHistory: [],
  
  createSession: (allies, enemies, battleMap, location, encounterData) => {
    const session: BattleSession = {
      id: generateSessionId(),
      allies,
      enemies,
      battleMap,
      location,
      createdAt: new Date().toISOString(),
      encounterData,
    };
    
    set((state) => ({
      currentSession: session,
      sessionHistory: [...state.sessionHistory, session].slice(-10), // Keep last 10 sessions
    }));
    
    return session;
  },
  
  clearSession: () => {
    set({ currentSession: null });
  },
  
  getCurrentSession: () => {
    return get().currentSession;
  },
  
  hasActiveSession: () => {
    return get().currentSession !== null;
  },
}));
