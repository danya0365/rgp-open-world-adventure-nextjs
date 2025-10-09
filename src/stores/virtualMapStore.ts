import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Coordinates, Location } from "@/src/domain/types/location.types";
import {
  LOCATIONS_MASTER,
  getLocationById,
  getLocationChildren,
} from "@/src/data/master/locations.master";

/**
 * Virtual Map Store - Player Position & Map State
 * Stores user state for virtual world map navigation
 * 
 * Design Decision:
 * - User state only (player position, discovered locations)
 * - Cached/computed data from master (current location, nearby locations)
 * - Does NOT duplicate entire master data (uses LOCATIONS_MASTER directly)
 */

export interface PlayerPosition {
  locationId: string; // Current location ID (references LOCATIONS_MASTER)
  coordinates: Coordinates; // Exact position within the location
  facing: "north" | "south" | "east" | "west"; // Direction player is facing
}

export interface VirtualMapState {
  // ========================================
  // User State (Persisted)
  // ========================================
  
  // Player Position
  playerPosition: PlayerPosition;
  
  // Discovered Locations (Fog of War)
  discoveredLocations: Set<string>; // Location IDs that have been discovered
  
  // Visited Tiles (for detailed exploration tracking)
  visitedTiles: Map<string, Coordinates[]>; // locationId → array of visited coordinates
  
  // Camera/Viewport State
  cameraPosition: Coordinates; // Camera center position
  zoom: number;
  
  // UI State
  showMinimap: boolean;
  showLocationInfo: boolean;
  
  // ========================================
  // Cached/Computed Data (Not Persisted)
  // ========================================
  
  // Current location full data (computed from master)
  currentLocationData: Location | null;
  
  // Child locations of current location (computed from master)
  childLocations: Location[];
  
  // Nearby locations within radius (computed)
  nearbyLocations: Location[];
  
  // Discovered locations with full data (computed)
  discoveredLocationData: Location[];
  
  // Quick lookup map (computed)
  locationMap: Map<string, Location>;
  
  // ========================================
  // Actions
  // ========================================
  setPlayerPosition: (position: PlayerPosition) => void;
  movePlayer: (coordinates: Coordinates) => void;
  setPlayerFacing: (facing: "north" | "south" | "east" | "west") => void;
  teleportToLocation: (locationId: string, coordinates?: Coordinates) => void;
  discoverLocation: (locationId: string) => void;
  visitTile: (locationId: string, coordinates: Coordinates) => void;
  setCameraPosition: (position: Coordinates) => void;
  setZoom: (zoom: number) => void;
  toggleMinimap: () => void;
  toggleLocationInfo: () => void;
  resetMapState: () => void;
  refreshCachedData: () => void; // Recompute cached data
}

// Default player starting position
const DEFAULT_PLAYER_POSITION: PlayerPosition = {
  locationId: "city-silverhold", // Start at Silverhold City
  coordinates: { x: 100, y: 50 },
  facing: "south",
};

// Helper: Build location map for O(1) lookup
const buildLocationMap = (): Map<string, Location> => {
  const map = new Map<string, Location>();
  LOCATIONS_MASTER.forEach((loc) => map.set(loc.id, loc));
  return map;
};

// Helper: Get nearby locations within radius
const getNearbyLocations = (
  currentLocationId: string,
  radius: number = 200
): Location[] => {
  const currentLoc = getLocationById(currentLocationId);
  if (!currentLoc?.coordinates) return [];

  return LOCATIONS_MASTER.filter((loc) => {
    if (!loc.coordinates || loc.id === currentLocationId) return false;
    const dx = loc.coordinates.x - currentLoc.coordinates!.x;
    const dy = loc.coordinates.y - currentLoc.coordinates!.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= radius;
  });
};

// Helper: Compute cached data from state (extracted to top level)
const computeCachedData = (state: {
  playerPosition: PlayerPosition;
  discoveredLocations: Set<string>;
}): {
  currentLocationData: Location | null;
  childLocations: Location[];
  nearbyLocations: Location[];
  discoveredLocationData: Location[];
  locationMap: Map<string, Location>;
} => {
  const currentLocationData = getLocationById(state.playerPosition.locationId) || null;
  const childLocations = currentLocationData
    ? getLocationChildren(currentLocationData.id)
    : [];
  const nearbyLocations = getNearbyLocations(state.playerPosition.locationId);
  const discoveredLocationData = Array.from(state.discoveredLocations)
    .map((id) => getLocationById(id))
    .filter((loc): loc is Location => loc !== undefined);
  const locationMap = buildLocationMap();

  return {
    currentLocationData,
    childLocations,
    nearbyLocations,
    discoveredLocationData,
    locationMap,
  };
};

export const useVirtualMapStore = create<VirtualMapState>()(
  persist(
    (set, get) => {
      // Initial cached data using DEFAULT values (not get() yet)
      const initialCachedData = computeCachedData({
        playerPosition: DEFAULT_PLAYER_POSITION,
        discoveredLocations: new Set([DEFAULT_PLAYER_POSITION.locationId]),
      });

      return {
        // ========================================
        // User State
        // ========================================
        playerPosition: DEFAULT_PLAYER_POSITION,
        discoveredLocations: new Set([DEFAULT_PLAYER_POSITION.locationId]),
        visitedTiles: new Map(),
        cameraPosition: DEFAULT_PLAYER_POSITION.coordinates,
        zoom: 1,
        showMinimap: true,
        showLocationInfo: true,

        // ========================================
        // Cached Data
        // ========================================
        ...initialCachedData,

        // ========================================
        // Actions
        // ========================================
      setPlayerPosition: (position) => {
        set({ playerPosition: position });
        // Auto-discover location when player moves there
        get().discoverLocation(position.locationId);
        // Auto-center camera on player
        get().setCameraPosition(position.coordinates);
        // Refresh cached data
        get().refreshCachedData();
      },

      movePlayer: (coordinates) => {
        const currentPosition = get().playerPosition;
        set({
          playerPosition: {
            ...currentPosition,
            coordinates,
          },
        });
        // Record visited tile
        get().visitTile(currentPosition.locationId, coordinates);
        // Update camera
        get().setCameraPosition(coordinates);
      },

      setPlayerFacing: (facing) => {
        const currentPosition = get().playerPosition;
        set({
          playerPosition: {
            ...currentPosition,
            facing,
          },
        });
      },

      teleportToLocation: (locationId, coordinates) => {
        const newCoords = coordinates || { x: 50, y: 50 }; // Default center if not specified
        set({
          playerPosition: {
            locationId,
            coordinates: newCoords,
            facing: "south",
          },
          cameraPosition: newCoords,
        });
        get().discoverLocation(locationId);
        get().refreshCachedData();
      },

      discoverLocation: (locationId) => {
        set((state) => ({
          discoveredLocations: new Set(state.discoveredLocations).add(locationId),
        }));
      },

      visitTile: (locationId, coordinates) => {
        set((state) => {
          const newVisitedTiles = new Map(state.visitedTiles);
          const existingTiles = newVisitedTiles.get(locationId) || [];
          
          // Check if tile already visited
          const alreadyVisited = existingTiles.some(
            (tile) => tile.x === coordinates.x && tile.y === coordinates.y
          );
          
          if (!alreadyVisited) {
            newVisitedTiles.set(locationId, [...existingTiles, coordinates]);
          }
          
          return { visitedTiles: newVisitedTiles };
        });
      },

      setCameraPosition: (position) => {
        set({ cameraPosition: position });
      },

      setZoom: (zoom) => {
        set({ zoom: Math.max(0.5, Math.min(3, zoom)) }); // Clamp between 0.5 and 3
      },

      toggleMinimap: () => {
        set((state) => ({ showMinimap: !state.showMinimap }));
      },

      toggleLocationInfo: () => {
        set((state) => ({ showLocationInfo: !state.showLocationInfo }));
      },

      resetMapState: () => {
        set({
          playerPosition: DEFAULT_PLAYER_POSITION,
          discoveredLocations: new Set([DEFAULT_PLAYER_POSITION.locationId]),
          visitedTiles: new Map(),
          cameraPosition: DEFAULT_PLAYER_POSITION.coordinates,
          zoom: 1,
          showMinimap: true,
          showLocationInfo: true,
        });
        get().refreshCachedData();
      },

      refreshCachedData: () => {
        const state = get();
        const cached = computeCachedData({
          playerPosition: state.playerPosition,
          discoveredLocations: state.discoveredLocations,
        });
        set(cached);
      },
    };
    },
    {
      name: "virtual-map-storage",
      // Custom serialization for Set and Map
      partialize: (state) => ({
        playerPosition: state.playerPosition,
        discoveredLocations: Array.from(state.discoveredLocations),
        visitedTiles: Array.from(state.visitedTiles.entries()),
        cameraPosition: state.cameraPosition,
        zoom: state.zoom,
        showMinimap: state.showMinimap,
        showLocationInfo: state.showLocationInfo,
      }),
      merge: (persistedState: unknown, currentState) => {
        const persisted = persistedState as Partial<VirtualMapState> & {
          discoveredLocations?: string[];
          visitedTiles?: [string, Coordinates[]][];
        };
        return {
          ...currentState,
          ...persisted,
          discoveredLocations: new Set(persisted.discoveredLocations || []),
          visitedTiles: new Map(persisted.visitedTiles || []),
        };
      },
    }
  )
);

// Helper Selectors
export const getPlayerLocation = () => useVirtualMapStore.getState().playerPosition.locationId;
export const getPlayerCoordinates = () => useVirtualMapStore.getState().playerPosition.coordinates;
export const isLocationDiscovered = (locationId: string) =>
  useVirtualMapStore.getState().discoveredLocations.has(locationId);
export const getVisitedTiles = (locationId: string) =>
  useVirtualMapStore.getState().visitedTiles.get(locationId) || [];
