import {
  LOCATIONS_MASTER,
  getLocationById,
  getLocationChildren,
  getLocationConnections,
} from "@/src/data/master/locations.master";
import {
  Coordinates,
  Location,
  LocationConnection,
  MapTile,
} from "@/src/domain/types/location.types";
import {
  generateDefaultTiles,
  generateProceduralMap,
} from "@/src/utils/mapGenerator";
import { findPath } from "@/src/utils/pathfinding";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useGameStore } from "./gameStore";

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

export interface MovementState {
  isMoving: boolean;
  currentPath: Coordinates[];
  currentPathIndex: number;
  movementSpeed: number; // tiles per second
}

export interface ViewportState {
  width: number; // viewport width in tiles
  height: number; // viewport height in tiles
  playerTileX: number;
  playerTileY: number;
  viewportStartX: number;
  viewportStartY: number;
  viewportEndX: number;
  viewportEndY: number;
}

interface VirtualMapState {
  // ========================================
  // User State (Persisted)
  // ========================================
  playerPosition: PlayerPosition;
  discoveredLocations: Set<string>; // Location IDs that have been discovered

  // Visited Tiles (for detailed exploration tracking)
  visitedTiles: Map<string, Coordinates[]>; // locationId → array of visited coordinates

  // Camera/Viewport State
  cameraPosition: Coordinates; // Camera center position
  zoom: number;

  // UI State (Persisted)
  showMinimap: boolean;
  showLocationInfo: boolean;
  showLocationListPanel: boolean;
  showBreadcrumbPanel: boolean;
  showMinimapPanel: boolean;
  showMapInfoPanel: boolean;
  showKeyboardHintPanel: boolean;

  // Viewport State (Not Persisted)
  viewportSize: { width: number; height: number };
  viewport: ViewportState | null;

  // Tile Cache (Not Persisted)
  generatedTiles: Map<string, MapTile[]>; // locationId -> tiles

  // ========================================
  // Movement State (Not Persisted)
  // ========================================
  movementState: MovementState;

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
  visitTile: (locationId: string, coordinates: Coordinates) => void;
  setCameraPosition: (position: Coordinates) => void;
  setZoom: (zoom: number) => void;
  setShowMinimap: (show: boolean) => void;
  toggleMinimap: () => void;
  toggleLocationInfo: () => void;
  setShowLocationListPanel: (show: boolean) => void;
  setShowBreadcrumbPanel: (show: boolean) => void;
  setShowMinimapPanel: (show: boolean) => void;
  setShowMapInfoPanel: (show: boolean) => void;
  setShowKeyboardHintPanel: (show: boolean) => void;
  toggleLocationListPanel: () => void;
  toggleBreadcrumbPanel: () => void;
  toggleMinimapPanel: () => void;
  toggleMapInfoPanel: () => void;
  toggleKeyboardHintPanel: () => void;

  // Movement Actions (with pathfinding)
  startMovementToTile: (targetX: number, targetY: number) => void;
  stopMovement: () => void;
  updateMovement: (deltaTime: number) => void; // Call from animation loop

  // Discovery
  discoverLocation: (locationId: string) => void;

  // Reset
  resetMapState: () => void;

  // Refresh cached data
  refreshCachedData: () => void;

  // Viewport Actions
  setViewportSize: (width: number, height: number) => void;
  calculateViewport: (
    gridSize: number,
    gridWidth: number,
    gridHeight: number
  ) => void;

  // Tile Management
  getOrGenerateTiles: (
    location: Location,
    gridWidth: number,
    gridHeight: number
  ) => MapTile[];
  cacheTiles: (locationId: string, tiles: MapTile[]) => void;
  clearTileCache: () => void;

  // Helper Selectors
  isTileVisited: (
    locationId: string,
    x: number,
    y: number,
    gridSize: number
  ) => boolean;
  getVisibleConnections: (
    locationId: string,
    viewport: ViewportState
  ) => LocationConnection[];
  getVisibleLocations: (
    locations: Location[],
    viewport: ViewportState,
    gridSize: number
  ) => Location[];
}

// Default player starting position
const DEFAULT_PLAYER_POSITION: PlayerPosition = {
  locationId: "city-silverhold", // Start at Silverhold City
  coordinates: { x: 400, y: 280 }, // Center of 20x15 grid (10*40, 7*40)
  facing: "south",
};

// Helper: Build location map for O(1) lookup
const buildLocationMap = (): Map<string, Location> => {
  const map = new Map<string, Location>();
  LOCATIONS_MASTER.forEach((loc) => map.set(loc.id, loc));
  return map;
};

// Helper: Get nearby locations within radius
// NOTE: Deprecated - locations no longer have coordinates
// Use getLocationConnections() instead to find connected locations
const getNearbyLocations = (
  currentLocationId: string,
  radius: number = 200
): Location[] => {
  // Return empty array - this function is deprecated
  // Use connections to find nearby/connected locations instead
  return [];
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
  const currentLocationData =
    getLocationById(state.playerPosition.locationId) || null;
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
        showLocationListPanel: false, // Default to closed to avoid blocking screen
        showBreadcrumbPanel: false, // Default to closed to avoid blocking screen
        showMinimapPanel: true, // Default to open for easy access
        showMapInfoPanel: true, // Default to open for map info
        showKeyboardHintPanel: true, // Default to open for keyboard hints

        // ========================================
        // Viewport State
        // ========================================
        viewportSize: { width: 20, height: 15 },
        viewport: null,

        // ========================================
        // Tile Cache
        // ========================================
        generatedTiles: new Map(),

        // ========================================
        // Movement State
        // ========================================
        movementState: {
          isMoving: false,
          currentPath: [],
          currentPathIndex: 0,
          movementSpeed: 3, // 3 tiles per second
        },

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

          // ✅ Sync to gameStore
          useGameStore.getState().setPlayerWorldPosition({
            locationId: position.locationId,
            x: position.coordinates.x,
            y: position.coordinates.y,
            facing: position.facing,
          });
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

          // Check for connection triggers
          const connections = getLocationConnections(
            currentPosition.locationId
          );

          for (const connection of connections) {
            if (connection.from.locationId !== currentPosition.locationId)
              continue;

            const connTileX = Math.floor(connection.from.coordinates.x / 40);
            const connTileY = Math.floor(connection.from.coordinates.y / 40);
            const playerTileX = Math.floor(coordinates.x / 40);
            const playerTileY = Math.floor(coordinates.y / 40);

            if (connTileX === playerTileX && connTileY === playerTileY) {
              console.log(
                `[Store] Player stepped on connection:`,
                connection.id
              );
              // Trigger connection via custom event
              if (typeof window !== "undefined") {
                window.dispatchEvent(
                  new CustomEvent("connection-trigger", {
                    detail: {
                      connectionId: connection.id,
                      toLocationId: connection.to.locationId,
                    },
                  })
                );
              }
              break;
            }
          }

          // ✅ Sync to gameStore
          useGameStore.getState().setPlayerWorldPosition({
            locationId: currentPosition.locationId,
            x: coordinates.x,
            y: coordinates.y,
            facing: currentPosition.facing,
          });
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
          // Calculate center of map if coordinates not specified
          let newCoords = coordinates;
          if (!newCoords) {
            const location = getLocationById(locationId);
            const gridColumns = location?.mapData?.dimensions.columns || 20;
            const gridRows = location?.mapData?.dimensions.rows || 15;
            const tileSize = location?.mapData?.tileSize || 40;
            // Center of map
            newCoords = {
              x: Math.floor(gridColumns / 2) * tileSize,
              y: Math.floor(gridRows / 2) * tileSize,
            };
          }

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

          // ✅ Sync to gameStore
          useGameStore.getState().setPlayerWorldPosition({
            locationId,
            x: newCoords.x,
            y: newCoords.y,
            facing: "south",
          });
        },

        discoverLocation: (locationId) => {
          set((state) => ({
            discoveredLocations: new Set(state.discoveredLocations).add(
              locationId
            ),
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

        setShowMinimap: (show) => {
          set({ showMinimap: show });
        },

        toggleMinimap: () => {
          set((state) => ({ showMinimap: !state.showMinimap }));
        },

        toggleLocationInfo: () => {
          set((state) => ({ showLocationInfo: !state.showLocationInfo }));
        },

        setShowLocationListPanel: (show) => {
          set({ showLocationListPanel: show });
        },

        setShowBreadcrumbPanel: (show) => {
          set({ showBreadcrumbPanel: show });
        },

        setShowMinimapPanel: (show) => {
          set({ showMinimapPanel: show });
        },

        setShowMapInfoPanel: (show) => {
          set({ showMapInfoPanel: show });
        },

        setShowKeyboardHintPanel: (show) => {
          set({ showKeyboardHintPanel: show });
        },

        toggleLocationListPanel: () => {
          set((state) => ({
            showLocationListPanel: !state.showLocationListPanel,
          }));
        },

        toggleBreadcrumbPanel: () => {
          set((state) => ({ showBreadcrumbPanel: !state.showBreadcrumbPanel }));
        },

        toggleMinimapPanel: () => {
          set((state) => ({ showMinimapPanel: !state.showMinimapPanel }));
        },

        toggleMapInfoPanel: () => {
          set((state) => ({ showMapInfoPanel: !state.showMapInfoPanel }));
        },

        toggleKeyboardHintPanel: () => {
          set((state) => ({ showKeyboardHintPanel: !state.showKeyboardHintPanel }));
        },

        // ========================================
        // Movement Actions (with Pathfinding)
        // ========================================
        startMovementToTile: (targetX: number, targetY: number) => {
          const state = get();
          const currentPos = state.playerPosition;

          // Get current tile position
          const currentTileX = Math.floor(currentPos.coordinates.x / 40); // gridSize = 40
          const currentTileY = Math.floor(currentPos.coordinates.y / 40);

          // Get map tiles from current location
          const currentLocation = state.currentLocationData;
          if (!currentLocation?.mapData?.tiles) return;

          const tiles = currentLocation.mapData.tiles;
          const gridColumns = currentLocation.mapData.dimensions.columns || 20;
          const gridRows = currentLocation.mapData.dimensions.rows || 15;

          // Find path using A*
          const path = findPath(
            currentTileX,
            currentTileY,
            targetX,
            targetY,
            tiles,
            gridColumns,
            gridRows
          );

          if (path.length === 0) {
            console.log("No path found!");
            return;
          }

          // Remove first tile (current position)
          const pathToWalk = path.slice(1);

          if (pathToWalk.length === 0) {
            console.log("Already at destination!");
            return;
          }

          // Start movement
          set({
            movementState: {
              isMoving: true,
              currentPath: pathToWalk.map((p) => ({
                x: p.x * 40,
                y: p.y * 40,
              })),
              currentPathIndex: 0,
              movementSpeed: state.movementState.movementSpeed,
            },
          });

          console.log(
            `Starting movement along path with ${pathToWalk.length} tiles`
          );
        },

        stopMovement: () => {
          set({
            movementState: {
              isMoving: false,
              currentPath: [],
              currentPathIndex: 0,
              movementSpeed: 3,
            },
          });
        },

        updateMovement: (deltaTime: number) => {
          const state = get();
          const movement = state.movementState;

          if (!movement.isMoving || movement.currentPath.length === 0) return;

          const targetPos = movement.currentPath[movement.currentPathIndex];
          const currentPos = state.playerPosition.coordinates;

          // Calculate direction to target
          const dx = targetPos.x - currentPos.x;
          const dy = targetPos.y - currentPos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Calculate movement speed (pixels per second)
          const pixelsPerSecond = movement.movementSpeed * 40; // tiles/sec * pixels/tile
          const moveDistance = pixelsPerSecond * deltaTime;

          if (distance <= moveDistance) {
            // Reached target tile
            get().movePlayer(targetPos);

            // Update facing direction
            if (Math.abs(dx) > Math.abs(dy)) {
              get().setPlayerFacing(dx > 0 ? "east" : "west");
            } else {
              get().setPlayerFacing(dy > 0 ? "south" : "north");
            }

            // Move to next tile in path
            const nextIndex = movement.currentPathIndex + 1;
            if (nextIndex >= movement.currentPath.length) {
              // Finished path
              get().stopMovement();
              console.log("Reached destination!");
            } else {
              // Continue to next tile
              set({
                movementState: {
                  ...movement,
                  currentPathIndex: nextIndex,
                },
              });
            }
          } else {
            // Move towards target
            const ratio = moveDistance / distance;
            const newX = currentPos.x + dx * ratio;
            const newY = currentPos.y + dy * ratio;

            set({
              playerPosition: {
                ...state.playerPosition,
                coordinates: { x: newX, y: newY },
              },
            });

            // Update facing direction
            if (Math.abs(dx) > Math.abs(dy)) {
              set({
                playerPosition: {
                  ...get().playerPosition,
                  facing: dx > 0 ? "east" : "west",
                },
              });
            } else {
              set({
                playerPosition: {
                  ...get().playerPosition,
                  facing: dy > 0 ? "south" : "north",
                },
              });
            }

            // Update camera to follow player
            get().setCameraPosition({ x: newX, y: newY });
          }
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

        // ========================================
        // Viewport Actions
        // ========================================
        setViewportSize: (width, height) => {
          set({ viewportSize: { width, height } });
        },

        calculateViewport: (gridSize, gridWidth, gridHeight) => {
          const state = get();
          const playerPosition = state.playerPosition;
          const viewportSize = state.viewportSize;

          const playerTileX = Math.floor(
            playerPosition.coordinates.x / gridSize
          );
          const playerTileY = Math.floor(
            playerPosition.coordinates.y / gridSize
          );

          // Adjust viewport to map size (don't exceed map dimensions)
          const viewportTilesWidth = Math.min(viewportSize.width, gridWidth);
          const viewportTilesHeight = Math.min(viewportSize.height, gridHeight);

          // If map is smaller than viewport, show entire map centered
          if (
            gridWidth <= viewportTilesWidth &&
            gridHeight <= viewportTilesHeight
          ) {
            set({
              viewport: {
                width: viewportTilesWidth,
                height: viewportTilesHeight,
                playerTileX,
                playerTileY,
                viewportStartX: 0,
                viewportStartY: 0,
                viewportEndX: gridWidth,
                viewportEndY: gridHeight,
              },
            });
            return;
          }

          // Center viewport on player
          const viewportStartX = Math.max(
            0,
            Math.min(
              gridWidth - viewportTilesWidth,
              playerTileX - Math.floor(viewportTilesWidth / 2)
            )
          );
          const viewportStartY = Math.max(
            0,
            Math.min(
              gridHeight - viewportTilesHeight,
              playerTileY - Math.floor(viewportTilesHeight / 2)
            )
          );
          const viewportEndX = Math.min(
            gridWidth,
            viewportStartX + viewportTilesWidth
          );
          const viewportEndY = Math.min(
            gridHeight,
            viewportStartY + viewportTilesHeight
          );

          set({
            viewport: {
              width: viewportTilesWidth,
              height: viewportTilesHeight,
              playerTileX,
              playerTileY,
              viewportStartX,
              viewportStartY,
              viewportEndX,
              viewportEndY,
            },
          });
        },

        // ========================================
        // Tile Management
        // ========================================
        getOrGenerateTiles: (location, gridWidth, gridHeight) => {
          const state = get();
          const cached = state.generatedTiles.get(location.id);

          // Return cached tiles if available
          if (cached) {
            return cached;
          }

          // If location has predefined tiles, use them (don't cache yet)
          if (location.mapData?.tiles && location.mapData.tiles.length > 0) {
            return location.mapData.tiles;
          }

          // Generate procedural tiles based on location type
          const seed = location.id
            .split("")
            .reduce((acc, char) => acc + char.charCodeAt(0), 0);

          let generatedTiles: MapTile[];
          if (location.type === "forest") {
            generatedTiles = generateProceduralMap(gridWidth, gridHeight, seed);
          } else if (location.type === "mountain") {
            generatedTiles = generateProceduralMap(
              gridWidth,
              gridHeight,
              seed + 1000
            );
          } else {
            generatedTiles = generateDefaultTiles(
              gridWidth,
              gridHeight,
              "grass"
            );
          }

          return generatedTiles;
        },

        cacheTiles: (locationId, tiles) => {
          set((state) => {
            const newCache = new Map(state.generatedTiles);
            newCache.set(locationId, tiles);
            return { generatedTiles: newCache };
          });
        },

        clearTileCache: () => {
          set({ generatedTiles: new Map() });
        },

        // ========================================
        // Helper Selectors
        // ========================================
        isTileVisited: (locationId, x, y, gridSize) => {
          const state = get();
          const visitedTiles = state.visitedTiles.get(locationId) || [];
          return visitedTiles.some(
            (coord) => coord.x === x * gridSize && coord.y === y * gridSize
          );
        },

        getVisibleConnections: (locationId, viewport) => {
          const connections = getLocationConnections(locationId);
          const visibleConnections: LocationConnection[] = [];

          connections.forEach((conn) => {
            // Add forward connection if it starts from this location
            if (conn.from.locationId === locationId) {
              // Coordinates are already in tile units
              const tileX = conn.from.coordinates.x;
              const tileY = conn.from.coordinates.y;

              if (
                tileX >= viewport.viewportStartX &&
                tileX < viewport.viewportEndX &&
                tileY >= viewport.viewportStartY &&
                tileY < viewport.viewportEndY
              ) {
                visibleConnections.push(conn);
              }
            }

            // Add reverse connection if isTwoWay and ends at this location
            if (conn.isTwoWay && conn.to.locationId === locationId) {
              // Create virtual reverse connection
              const reverseConn: LocationConnection = {
                ...conn,
                id: `${conn.id}-reverse`,
                from: {
                  locationId: conn.to.locationId,
                  coordinates: conn.to.coordinates,
                  gridSize: conn.from.gridSize, // Use same gridSize as forward
                },
                to: {
                  locationId: conn.from.locationId,
                  coordinates: conn.from.coordinates,
                },
              };

              // Coordinates are already in tile units
              const tileX = reverseConn.from.coordinates.x;
              const tileY = reverseConn.from.coordinates.y;

              if (
                tileX >= viewport.viewportStartX &&
                tileX < viewport.viewportEndX &&
                tileY >= viewport.viewportStartY &&
                tileY < viewport.viewportEndY
              ) {
                visibleConnections.push(reverseConn);
              }
            }
          });

          return visibleConnections;
        },

        getVisibleLocations: (locations, viewport, gridSize) => {
          // NOTE: Locations no longer have coordinates
          // This function now returns all child locations
          // The actual positioning is handled by connections in the rendering layer
          return locations;
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
        showLocationListPanel: state.showLocationListPanel,
        showBreadcrumbPanel: state.showBreadcrumbPanel,
        showMinimapPanel: state.showMinimapPanel,
        showMapInfoPanel: state.showMapInfoPanel,
        showKeyboardHintPanel: state.showKeyboardHintPanel,
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
export const getPlayerLocation = () =>
  useVirtualMapStore.getState().playerPosition.locationId;
export const getPlayerCoordinates = () =>
  useVirtualMapStore.getState().playerPosition.coordinates;
export const isLocationDiscovered = (locationId: string) =>
  useVirtualMapStore.getState().discoveredLocations.has(locationId);
export const getVisitedTiles = (locationId: string) =>
  useVirtualMapStore.getState().visitedTiles.get(locationId) || [];
