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
  ActiveEncounter,
  EncounterModifier,
} from "@/src/domain/types/encounter.types";
import {
  generateDefaultTiles,
  generateProceduralMap,
} from "@/src/utils/mapGenerator";
import { findPath } from "@/src/utils/pathfinding";
import {
  calculateStepsUntilEncounter,
  generateEncounter,
  updateModifierDurations,
} from "@/src/utils/encounterUtils";
import { getEncounterTableByLocation } from "@/src/data/master/encounterTables.master";
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
  pixelCoordinate: Coordinates; // Exact position within the location - PIXEL units for rendering
  facing: "north" | "south" | "east" | "west"; // Direction player is facing
}

export interface MovementState {
  isMoving: boolean;
  pathPixelCoordinates: Coordinates[]; // Movement path in PIXEL units
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

  // ========================================
  // Random Encounters State (Persisted)
  // ========================================
  stepCount: number; // Total steps taken in current location
  stepsUntilEncounter: number; // Steps remaining until next encounter
  activeModifiers: EncounterModifier[]; // Active encounter modifiers
  lastEncounterAt: number; // Timestamp of last encounter
  encounterHistory: string[]; // History of encountered enemy IDs
  currentEncounter: ActiveEncounter | null; // Active encounter (if any)

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

  // ========================================
  // Encounter Actions
  // ========================================
  incrementSteps: () => void;
  checkForEncounter: () => ActiveEncounter | null;
  triggerEncounter: (encounter: ActiveEncounter) => void;
  clearEncounter: () => void;
  addEncounterModifier: (modifier: EncounterModifier) => void;
  removeEncounterModifier: (id: string) => void;
  resetEncounterSteps: () => void;

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
  getAllConnections: (locationId: string) => LocationConnection[];
}

// Default player starting position
const DEFAULT_PLAYER_POSITION: PlayerPosition = {
  locationId: "city-silverhold", // Start at Silverhold City
  pixelCoordinate: { x: 0, y: 0 }, // PIXEL units
  facing: "south",
};

// Helper: Build location map for O(1) lookup
const buildLocationMap = (): Map<string, Location> => {
  const map = new Map<string, Location>();
  LOCATIONS_MASTER.forEach((loc) => map.set(loc.id, loc));
  return map;
};

// Helper: Compute cached data from state (extracted to top level)
const computeCachedData = (state: {
  playerPosition: PlayerPosition;
  discoveredLocations: Set<string>;
}): {
  currentLocationData: Location | null;
  childLocations: Location[];
  discoveredLocationData: Location[];
  locationMap: Map<string, Location>;
} => {
  const currentLocationData =
    getLocationById(state.playerPosition.locationId) || null;
  const childLocations = currentLocationData
    ? getLocationChildren(currentLocationData.id)
    : [];
  const discoveredLocationData = Array.from(state.discoveredLocations)
    .map((id) => getLocationById(id))
    .filter((loc): loc is Location => loc !== undefined);
  const locationMap = buildLocationMap();

  return {
    currentLocationData,
    childLocations,
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

        // ========================================
        // Random Encounters State
        // ========================================
        stepCount: 0,
        stepsUntilEncounter: 15, // Default 15 steps
        activeModifiers: [],
        lastEncounterAt: 0,
        encounterHistory: [],
        currentEncounter: null,

        cameraPosition: DEFAULT_PLAYER_POSITION.pixelCoordinate,
        zoom: 1,
        showMinimap: true,
        showLocationInfo: false,
        showLocationListPanel: false, // Default to closed to avoid blocking screen
        showBreadcrumbPanel: false, // Default to closed to avoid blocking screen
        showMinimapPanel: true, // Default to open for easy access
        showMapInfoPanel: false, // Default to open for map info
        showKeyboardHintPanel: false, // Default to open for keyboard hints

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
          pathPixelCoordinates: [],
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
          get().setCameraPosition(position.pixelCoordinate);
          // Refresh cached data
          get().refreshCachedData();

          // ✅ Sync to gameStore
          useGameStore.getState().setPlayerWorldPosition({
            locationId: position.locationId,
            x: position.pixelCoordinate.x,
            y: position.pixelCoordinate.y,
            facing: position.facing,
          });
        },

        movePlayer: (pixelCoordinate) => {
          const currentPosition = get().playerPosition;
          set({
            playerPosition: {
              ...currentPosition,
              pixelCoordinate,
            },
          });
          // Record visited tile
          get().visitTile(currentPosition.locationId, pixelCoordinate);
          // Update camera
          get().setCameraPosition(pixelCoordinate);

          // Check for connection triggers (with two-way support)
          const connections = getLocationConnections(
            currentPosition.locationId
          );

          for (const connection of connections) {
            // Convert player PIXEL → TILE
            const playerTileX = Math.floor(pixelCoordinate.x / 40);
            const playerTileY = Math.floor(pixelCoordinate.y / 40);

            // Check forward direction: from → to
            if (connection.from.locationId === currentPosition.locationId) {
              const connTileX = connection.from.tileCoordinate.x; // TILE
              const connTileY = connection.from.tileCoordinate.y; // TILE

              if (connTileX === playerTileX && connTileY === playerTileY) {
                console.log(
                  `[Store] Player stepped on connection (forward):`,
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

            // Check reverse direction: to → from (only if two-way)
            if (
              connection.isTwoWay &&
              connection.to.locationId === currentPosition.locationId
            ) {
              const connTileX = connection.to.tileCoordinate.x; // TILE (spawn point on reverse)
              const connTileY = connection.to.tileCoordinate.y; // TILE

              if (connTileX === playerTileX && connTileY === playerTileY) {
                console.log(
                  `[Store] Player stepped on connection (reverse two-way):`,
                  connection.id
                );
                // Trigger connection via custom event (going back)
                if (typeof window !== "undefined") {
                  window.dispatchEvent(
                    new CustomEvent("connection-trigger", {
                      detail: {
                        connectionId: connection.id,
                        toLocationId: connection.from.locationId, // Going back to 'from'
                      },
                    })
                  );
                }
                break;
              }
            }
          }

          // ✅ Sync to gameStore
          useGameStore.getState().setPlayerWorldPosition({
            locationId: currentPosition.locationId,
            x: pixelCoordinate.x,
            y: pixelCoordinate.y,
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

        teleportToLocation: (locationId, pixelCoordinate) => {
          // Calculate center of map if coordinates not specified
          let newPixelCoord = pixelCoordinate;
          if (!newPixelCoord) {
            const location = getLocationById(locationId);
            const gridColumns = location?.mapData?.dimensions.columns || 20;
            const gridRows = location?.mapData?.dimensions.rows || 15;
            const tileSize = location?.mapData?.tileSize || 40;
            // Center of map (PIXEL)
            newPixelCoord = {
              x: Math.floor(gridColumns / 2) * tileSize,
              y: Math.floor(gridRows / 2) * tileSize,
            };
          }

          set({
            playerPosition: {
              locationId,
              pixelCoordinate: newPixelCoord,
              facing: "south",
            },
            cameraPosition: newPixelCoord,
          });
          get().discoverLocation(locationId);
          get().refreshCachedData();

          // ✅ Sync to gameStore
          useGameStore.getState().setPlayerWorldPosition({
            locationId,
            x: newPixelCoord.x,
            y: newPixelCoord.y,
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
          set((state) => ({
            showKeyboardHintPanel: !state.showKeyboardHintPanel,
          }));
        },

        // ========================================
        // Movement Actions (with Pathfinding)
        // ========================================
        startMovementToTile: (targetX: number, targetY: number) => {
          const state = get();
          const currentPos = state.playerPosition;

          // Get current tile position
          const currentTileX = Math.floor(currentPos.pixelCoordinate.x / 40); // gridSize = 40
          const currentTileY = Math.floor(currentPos.pixelCoordinate.y / 40);

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
              pathPixelCoordinates: pathToWalk.map((p) => ({
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
              pathPixelCoordinates: [],
              currentPathIndex: 0,
              movementSpeed: 3,
            },
          });
        },

        updateMovement: (deltaTime: number) => {
          const state = get();
          const movement = state.movementState;

          if (!movement.isMoving || movement.pathPixelCoordinates.length === 0)
            return;

          const targetPos =
            movement.pathPixelCoordinates[movement.currentPathIndex];
          const currentPos = state.playerPosition.pixelCoordinate;

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
            if (nextIndex >= movement.pathPixelCoordinates.length) {
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
                pixelCoordinate: { x: newX, y: newY },
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

        // ========================================
        // Encounter Actions
        // ========================================
        incrementSteps: () => {
          const state = get();
          const newStepCount = state.stepCount + 1;
          
          // Update modifier durations
          const updatedModifiers = updateModifierDurations(state.activeModifiers, 1);
          
          set({
            stepCount: newStepCount,
            activeModifiers: updatedModifiers,
          });

          // Check if encounter should trigger
          if (newStepCount >= state.stepsUntilEncounter) {
            const encounter = get().checkForEncounter();
            if (encounter) {
              get().triggerEncounter(encounter);
            }
          }
        },

        checkForEncounter: () => {
          const state = get();
          const currentLocation = state.currentLocationData;
          
          if (!currentLocation) {
            return null;
          }

          // Get encounter table by location ID
          const encounterTable = getEncounterTableByLocation(currentLocation.id);
          
          // No encounter table for this location (e.g., safe zones)
          if (!encounterTable) {
            return null;
          }
          
          if (!encounterTable.isActive) {
            return null;
          }

          // TODO: Check for items/skills that disable encounters completely
          // Example: Holy Water, Repel, Stealth Mode
          // const hasEncounterBlocker = state.activeModifiers.some(m => m.disableEncounters);
          // if (hasEncounterBlocker) {
          //   return null;
          // }

          // Get player level from game store
          const gameState = useGameStore.getState();
          const activeParty = gameState.getActiveParty();
          let playerLevel = 1;
          
          if (activeParty && activeParty.members.length > 0) {
            const firstMember = activeParty.members[0];
            if (firstMember) {
              const character = gameState.getRecruitedCharacter(firstMember.characterId);
              playerLevel = character?.level || 1;
            }
          }

          // Generate encounter
          const encounter = generateEncounter(encounterTable, playerLevel);
          
          return encounter;
        },

        triggerEncounter: (encounter) => {
          const state = get();
          
          set({
            currentEncounter: encounter,
            lastEncounterAt: Date.now(),
            encounterHistory: [...state.encounterHistory, ...encounter.enemies],
          });

          // Reset step counter and calculate next encounter
          get().resetEncounterSteps();
        },

        clearEncounter: () => {
          set({ currentEncounter: null });
        },

        addEncounterModifier: (modifier) => {
          const state = get();
          set({
            activeModifiers: [...state.activeModifiers, modifier],
          });
        },

        removeEncounterModifier: (id) => {
          const state = get();
          set({
            activeModifiers: state.activeModifiers.filter((m) => m.id !== id),
          });
        },

        resetEncounterSteps: () => {
          const state = get();
          const currentLocation = state.currentLocationData;
          
          if (!currentLocation) {
            set({ stepCount: 0, stepsUntilEncounter: 999 });
            return;
          }

          // Get encounter table by location ID
          const encounterTable = getEncounterTableByLocation(currentLocation.id);
          
          // No encounter table for this location (e.g., safe zones)
          if (!encounterTable) {
            set({ stepCount: 0, stepsUntilEncounter: 999 });
            return;
          }

          // Check if encounters are active for this location
          if (!encounterTable.isActive) {
            set({ stepCount: 0, stepsUntilEncounter: 999 });
            return;
          }

          // TODO: Check for items/skills that disable encounters
          // If player has encounter-blocking items, set stepsUntilEncounter to 999
          // const hasEncounterBlocker = state.activeModifiers.some(m => m.disableEncounters);
          // if (hasEncounterBlocker) {
          //   set({ stepCount: 0, stepsUntilEncounter: 999 });
          //   return;
          // }

          const stepsUntilNext = calculateStepsUntilEncounter(
            encounterTable.baseRate,
            encounterTable.rateVariance,
            state.activeModifiers
          );

          set({
            stepCount: 0,
            stepsUntilEncounter: stepsUntilNext,
          });
        },

        resetMapState: () => {
          set({
            playerPosition: DEFAULT_PLAYER_POSITION,
            discoveredLocations: new Set([DEFAULT_PLAYER_POSITION.locationId]),
            visitedTiles: new Map(),
            cameraPosition: DEFAULT_PLAYER_POSITION.pixelCoordinate,
            zoom: 1,
            showMinimap: true,
            showLocationInfo: true,
            // Reset encounter state
            stepCount: 0,
            stepsUntilEncounter: 15,
            activeModifiers: [],
            lastEncounterAt: 0,
            encounterHistory: [],
            currentEncounter: null,
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
            playerPosition.pixelCoordinate.x / gridSize
          );
          const playerTileY = Math.floor(
            playerPosition.pixelCoordinate.y / gridSize
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
          // First get all connections
          const allConnections = get().getAllConnections(locationId);

          // Then filter by viewport
          return allConnections.filter((conn) => {
            const tileX = conn.from.tileCoordinate.x;
            const tileY = conn.from.tileCoordinate.y;

            return (
              tileX >= viewport.viewportStartX &&
              tileX < viewport.viewportEndX &&
              tileY >= viewport.viewportStartY &&
              tileY < viewport.viewportEndY
            );
          });
        },

        getAllConnections: (locationId) => {
          const connections = getLocationConnections(locationId);
          const allConnections: LocationConnection[] = [];

          connections.forEach((conn) => {
            // Add forward connection if it starts from this location
            if (conn.from.locationId === locationId) {
              allConnections.push(conn);
            }

            // Add reverse connection if isTwoWay and ends at this location
            if (conn.isTwoWay && conn.to.locationId === locationId) {
              // Create virtual reverse connection
              const reverseConn: LocationConnection = {
                ...conn,
                id: `${conn.id}-reverse`,
                from: {
                  locationId: conn.to.locationId,
                  tileCoordinate: conn.to.tileCoordinate,
                  gridSize: conn.to.gridSize,
                },
                to: {
                  locationId: conn.from.locationId,
                  tileCoordinate: conn.from.tileCoordinate,
                  gridSize: conn.from.gridSize,
                },
              };
              allConnections.push(reverseConn);
            }
          });

          return allConnections;
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
  useVirtualMapStore.getState().playerPosition.pixelCoordinate;
export const isLocationDiscovered = (locationId: string) =>
  useVirtualMapStore.getState().discoveredLocations.has(locationId);
export const getVisitedTiles = (locationId: string) =>
  useVirtualMapStore.getState().visitedTiles.get(locationId) || [];
