import { getLocationById } from "@/src/data/master/locations.master";
import {
  Location,
  MapTile as MapTileType,
} from "@/src/domain/types/location.types";
import { usePOIInteraction } from "@/src/hooks/usePOIInteraction";
import { useVirtualMapStore } from "@/src/stores/virtualMapStore";
import { isWithinPOIBounds } from "@/src/utils/poiGridUtils";
import { useEffect, useMemo } from "react";
import { BattleMarkerComponent } from "./BattleMarkerComponent";
import { ConnectionMarker } from "./ConnectionMarker";
import { InnModal } from "./InnModal";
import { MapTile } from "./MapTile";
import { Minimap } from "./Minimap";
import { NPCDialogueModal } from "./NPCDialogueModal";
import { NPCMarker } from "./NPCMarker";
import { PlayerMarker } from "./PlayerMarker";
import { ServiceMarker } from "./ServiceMarker";
import { ServiceModal } from "./ServiceModal";
import { ShopMarker } from "./ShopMarker";
import { ShopModal } from "./ShopModal";
import { TreasureMarkerComponent } from "./TreasureMarkerComponent";
import { TreasureModal } from "./TreasureModal";

interface VirtualMapGridProps {
  currentLocation: Location;
  onLocationClick: (location: Location) => void;
  gridSize?: number;
  onMinimapDataReady?: (data: MinimapViewProps | null) => void;
  onMapInfoDataReady?: (data: MapInfoViewProps | null) => void;
}

export interface MinimapViewProps {
  currentLocation: Location;
  tiles: MapTileType[];
  gridColumns: number;
  gridRows: number;
  viewportStartX: number;
  viewportStartY: number;
  viewportEndX: number;
  viewportEndY: number;
  gridSize: number;
}

export interface MapInfoViewProps {
  currentLocation: Location;
  gridColumns: number;
  gridRows: number;
  actualViewportWidth: number;
  actualViewportHeight: number;
  playerTileX: number;
  playerTileY: number;
  viewportStartX: number;
  viewportStartY: number;
  viewportEndX: number;
  viewportEndY: number;
}

export function VirtualMapGrid({
  currentLocation,
  onLocationClick,
  gridSize = 40,
  onMinimapDataReady,
  onMapInfoDataReady,
}: VirtualMapGridProps) {
  const {
    playerPosition,
    discoveredLocations,
    startMovementToTile,
    viewport,
    viewportSize,
    setViewportSize,
    calculateViewport,
    getOrGenerateTiles,
    cacheTiles,
    isTileVisited,
    getVisibleConnections,
  } = useVirtualMapStore();

  // POI Interaction Hook - handles SPACE key press for interactions
  const { modals, closeNPCDialogue, closeTreasure, closeService, closeShop } =
    usePOIInteraction(currentLocation, gridSize);

  // Calculate grid dimensions based on location mapData
  const gridColumns = currentLocation.mapData?.dimensions.columns || 20;
  const gridRows = currentLocation.mapData?.dimensions.rows || 15;

  // Calculate viewport size based on screen size
  useEffect(() => {
    const calculateViewportSize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const availableWidth = windowWidth - 100;
      const availableHeight = windowHeight - 200;

      const tilesWidth = Math.floor(availableWidth / gridSize);
      const tilesHeight = Math.floor(availableHeight / gridSize);

      const clampedWidth = Math.max(8, Math.min(25, tilesWidth));
      const clampedHeight = Math.max(6, Math.min(20, tilesHeight));

      setViewportSize(clampedWidth, clampedHeight);
    };

    calculateViewportSize();
    window.addEventListener("resize", calculateViewportSize);
    return () => window.removeEventListener("resize", calculateViewportSize);
  }, [gridSize, setViewportSize]);

  // Get or generate tiles from store (must be before early return)
  const tiles = useMemo<MapTileType[]>(() => {
    return getOrGenerateTiles(currentLocation, gridColumns, gridRows);
  }, [currentLocation, gridColumns, gridRows, getOrGenerateTiles]);

  // Cache tiles after they are generated (in useEffect to avoid setState during render)
  useEffect(() => {
    if (tiles && tiles.length > 0) {
      cacheTiles(currentLocation.id, tiles);
    }
  }, [tiles, currentLocation.id, cacheTiles]);

  // Calculate viewport whenever player moves or location changes
  useEffect(() => {
    calculateViewport(gridSize, gridColumns, gridRows);
  }, [
    playerPosition.pixelCoordinate,
    gridSize,
    gridColumns,
    gridRows,
    viewportSize,
    calculateViewport,
  ]);

  // Get visible connections and locations from store (must be before early return)
  const connections = useMemo(() => {
    if (!viewport) return [];
    return getVisibleConnections(currentLocation.id, viewport);
  }, [currentLocation.id, viewport, getVisibleConnections]);

  // Note: Child locations are now displayed via ConnectionMarkers only
  // No need for visibleChildLocations anymore

  // Notify parent component when minimap data is ready
  useEffect(() => {
    if (!viewport || !tiles || tiles.length === 0) {
      onMinimapDataReady?.(null);
      return;
    }

    const minimapData: MinimapViewProps = {
      currentLocation,
      tiles,
      gridColumns,
      gridRows,
      viewportStartX: viewport.viewportStartX,
      viewportStartY: viewport.viewportStartY,
      viewportEndX: viewport.viewportEndX,
      viewportEndY: viewport.viewportEndY,
      gridSize,
    };

    onMinimapDataReady?.(minimapData);
  }, [
    viewport,
    tiles,
    currentLocation,
    gridColumns,
    gridRows,
    gridSize,
    onMinimapDataReady,
  ]);

  // Notify parent component when map info data is ready
  useEffect(() => {
    if (!viewport) {
      onMapInfoDataReady?.(null);
      return;
    }

    const actualViewportWidth = viewport.viewportEndX - viewport.viewportStartX;
    const actualViewportHeight =
      viewport.viewportEndY - viewport.viewportStartY;

    const mapInfoData: MapInfoViewProps = {
      currentLocation,
      gridColumns,
      gridRows,
      actualViewportWidth,
      actualViewportHeight,
      playerTileX: viewport.playerTileX,
      playerTileY: viewport.playerTileY,
      viewportStartX: viewport.viewportStartX,
      viewportStartY: viewport.viewportStartY,
      viewportEndX: viewport.viewportEndX,
      viewportEndY: viewport.viewportEndY,
    };

    onMapInfoDataReady?.(mapInfoData);
  }, [viewport, currentLocation, gridColumns, gridRows, onMapInfoDataReady]);

  // Handle tile click - start pathfinding movement
  const handleTileClick = (tile: MapTileType) => {
    console.log(`[VirtualMapGrid] Tile clicked:`, tile);
    console.log(`  - Tile walkable:`, tile.isWalkable);
    console.log(`  - Player location:`, playerPosition.locationId);
    console.log(`  - Current location:`, currentLocation.id);

    if (!tile.isWalkable) {
      console.log(`  ✗ Tile not walkable`);
      return;
    }

    // Only move if player is in this location
    if (playerPosition.locationId === currentLocation.id) {
      console.log(`  ✓ Starting movement to (${tile.x}, ${tile.y})`);
      startMovementToTile(tile.x, tile.y);
    } else {
      console.log(
        `  ✗ Player not in this location (player: ${playerPosition.locationId}, current: ${currentLocation.id})`
      );
    }
  };

  // Early return if viewport not calculated yet
  if (!viewport) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="text-white">Loading map...</div>
      </div>
    );
  }

  const { viewportStartX, viewportStartY, viewportEndX, viewportEndY } =
    viewport;

  // Viewport size in pixels (use actual viewport size, not max)
  const actualViewportWidth = viewportEndX - viewportStartX;
  const actualViewportHeight = viewportEndY - viewportStartY;
  const mapWidth = actualViewportWidth * gridSize;
  const mapHeight = actualViewportHeight * gridSize;

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />

      {/* Map Container */}
      <div
        className="absolute"
        style={{
          width: `${mapWidth}px`,
          height: `${mapHeight}px`,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          position: "relative",
          zIndex: 0,
        }}
      >
        {/* Render Only Visible Tiles (Viewport) */}
        {tiles
          .filter(
            (tile) =>
              tile.x >= viewportStartX &&
              tile.x < viewportEndX &&
              tile.y >= viewportStartY &&
              tile.y < viewportEndY
          )
          .map((tile, index) => {
            const isPlayerPos =
              playerPosition.locationId === currentLocation.id &&
              tile.x === Math.floor(playerPosition.pixelCoordinate.x / gridSize) &&
              tile.y === Math.floor(playerPosition.pixelCoordinate.y / gridSize);

            // Offset tile position relative to viewport
            const offsetTile = {
              ...tile,
              x: tile.x - viewportStartX,
              y: tile.y - viewportStartY,
            };

            return (
              <MapTile
                key={`${tile.x}-${tile.y}-${index}`}
                tile={offsetTile}
                gridSize={gridSize}
                isVisited={isTileVisited(
                  currentLocation.id,
                  tile.x,
                  tile.y,
                  gridSize
                )}
                isPlayerPosition={isPlayerPos}
                onClick={() => handleTileClick(tile)}
              />
            );
          })}

        {/* Child locations are displayed via ConnectionMarkers below */}

        {/* Player Marker (only show if player is in this location) */}
        {playerPosition.locationId === currentLocation.id && (
          <PlayerMarker
            x={playerPosition.pixelCoordinate.x / gridSize - viewportStartX}
            y={playerPosition.pixelCoordinate.y / gridSize - viewportStartY}
            facing={playerPosition.facing}
            gridSize={gridSize}
          />
        )}

        {/* POI Markers - NPCs */}
        {currentLocation.metadata?.npcs?.map((npc) => {
          // Check if player is within NPC bounds (supports multi-tile NPCs)
          const playerTileX = Math.floor(
            playerPosition.pixelCoordinate.x / gridSize
          );
          const playerTileY = Math.floor(
            playerPosition.pixelCoordinate.y / gridSize
          );
          const isPlayerAtNPC = isWithinPOIBounds(
            npc.tileCoordinate,
            npc.gridSize,
            { x: playerTileX, y: playerTileY }
          );

          return (
            <NPCMarker
              key={npc.id}
              npc={npc}
              gridSize={gridSize}
              viewportOffsetX={viewportStartX}
              viewportOffsetY={viewportStartY}
              isPlayerNearby={isPlayerAtNPC}
            />
          );
        })}

        {/* POI Markers - Shops */}
        {currentLocation.metadata?.shops?.map((shop) => {
          const playerTileX = Math.floor(
            playerPosition.pixelCoordinate.x / gridSize
          );
          const playerTileY = Math.floor(
            playerPosition.pixelCoordinate.y / gridSize
          );
          const isPlayerAtShop = isWithinPOIBounds(
            shop.tileCoordinate,
            shop.gridSize,
            { x: playerTileX, y: playerTileY }
          );

          return (
            <ShopMarker
              key={shop.id}
              shop={shop}
              gridSize={gridSize}
              viewportOffsetX={viewportStartX}
              viewportOffsetY={viewportStartY}
              isPlayerNearby={isPlayerAtShop}
            />
          );
        })}

        {/* POI Markers - Services */}
        {currentLocation.metadata?.services?.map((service) => {
          const playerTileX = Math.floor(
            playerPosition.pixelCoordinate.x / gridSize
          );
          const playerTileY = Math.floor(
            playerPosition.pixelCoordinate.y / gridSize
          );
          const isPlayerAtService = isWithinPOIBounds(
            service.tileCoordinate,
            service.gridSize,
            { x: playerTileX, y: playerTileY }
          );

          return (
            <ServiceMarker
              key={service.id}
              service={service}
              gridSize={gridSize}
              viewportOffsetX={viewportStartX}
              viewportOffsetY={viewportStartY}
              isPlayerNearby={isPlayerAtService}
            />
          );
        })}

        {/* POI Markers - Battle Triggers */}
        {currentLocation.metadata?.battleMaps?.map((battle) => {
          const playerTileX = Math.floor(
            playerPosition.pixelCoordinate.x / gridSize
          );
          const playerTileY = Math.floor(
            playerPosition.pixelCoordinate.y / gridSize
          );
          const isPlayerAtBattle = isWithinPOIBounds(
            battle.tileCoordinate,
            battle.gridSize,
            { x: playerTileX, y: playerTileY }
          );

          return (
            <BattleMarkerComponent
              key={battle.id}
              battle={battle}
              gridSize={gridSize}
              viewportOffsetX={viewportStartX}
              viewportOffsetY={viewportStartY}
              isPlayerNearby={isPlayerAtBattle}
            />
          );
        })}

        {/* POI Markers - Treasures */}
        {currentLocation.metadata?.treasures?.map((treasure) => {
          const playerTileX = Math.floor(
            playerPosition.pixelCoordinate.x / gridSize
          );
          const playerTileY = Math.floor(
            playerPosition.pixelCoordinate.y / gridSize
          );
          const isPlayerAtTreasure = isWithinPOIBounds(
            treasure.tileCoordinate,
            treasure.gridSize,
            { x: playerTileX, y: playerTileY }
          );

          return (
            <TreasureMarkerComponent
              key={treasure.id}
              treasure={treasure}
              gridSize={gridSize}
              viewportOffsetX={viewportStartX}
              viewportOffsetY={viewportStartY}
              isPlayerNearby={isPlayerAtTreasure}
            />
          );
        })}

        {/* Viewport Coordinate Indicators */}
        <div className="absolute top-1 left-1 text-[8px] text-gray-600 font-mono bg-black/30 px-1 rounded">
          ({viewportStartX}, {viewportStartY})
        </div>
        <div className="absolute bottom-1 right-1 text-[8px] text-gray-600 font-mono bg-black/30 px-1 rounded">
          ({viewportEndX}, {viewportEndY})
        </div>
      </div>

      {/* Connection Markers Layer - Above tiles to ensure clickability */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: `${mapWidth}px`,
          height: `${mapHeight}px`,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 200,
        }}
      >
        {connections.map((connection) => {
          // Coordinates are already in tile units, no need to divide by gridSize
          const tileX = connection.from.tileCoordinate.x;
          const tileY = connection.from.tileCoordinate.y;
          const x = tileX - viewportStartX;
          const y = tileY - viewportStartY;

          // Find target location from master data (supports both child and parent locations)
          const target = getLocationById(connection.to.locationId);

          // TODO: Implement proper discovery system
          // For now, show all connections as discovered for testing
          const isDiscovered = true;

          // Check if target is discovered (COMMENTED OUT FOR TESTING)
          // const isParentLocation = target && target.id === currentLocation.parentId;
          // const isDiscovered = target && (isParentLocation || discoveredLocations.has(target.id));

          return (
            <ConnectionMarker
              key={connection.id}
              connection={connection}
              x={x}
              y={y}
              gridSize={gridSize}
              onClick={() => {
                if (target) {
                  console.log("🚀 Navigating to:", target.name, target.id);
                  onLocationClick(target);
                } else {
                  console.error(
                    "❌ Target location not found:",
                    connection.to.locationId
                  );
                }
              }}
              isDiscovered={isDiscovered}
            />
          );
        })}
      </div>

      {/* POI Modals */}
      {modals.npcDialogue.isOpen && modals.npcDialogue.npc && (
        <NPCDialogueModal
          npc={modals.npcDialogue.npc}
          isOpen={modals.npcDialogue.isOpen}
          onClose={closeNPCDialogue}
          onAcceptQuest={(questId) => {
            console.log("Quest accepted:", questId);
            // TODO: Add quest to player's quest log
          }}
        />
      )}

      {modals.treasure.isOpen && modals.treasure.treasure && (
        <TreasureModal
          treasure={modals.treasure.treasure}
          isOpen={modals.treasure.isOpen}
          onClose={closeTreasure}
          onCollect={(treasureId) => {
            console.log("Treasure collected:", treasureId);
            // TODO: Add items to player inventory and mark treasure as discovered
          }}
        />
      )}

      {modals.service.isOpen && modals.service.service && (
        <>
          {/* Inn uses dedicated InnModal */}
          {modals.service.service.serviceType === "inn" ? (
            <InnModal
              service={modals.service.service}
              isOpen={modals.service.isOpen}
              onClose={closeService}
              onRest={(cost) => {
                console.log("Rested at inn, cost:", cost);
                // TODO: Deduct gold, restore HP/MP
              }}
            />
          ) : (
            /* Other services use ServiceModal */
            <ServiceModal
              service={modals.service.service}
              isOpen={modals.service.isOpen}
              onClose={closeService}
              onAction={(actionType, data) => {
                console.log("Service action:", actionType, data);
                // TODO: Handle service actions
              }}
            />
          )}
        </>
      )}

      {modals.shop.isOpen && modals.shop.shop && (
        <ShopModal
          shop={modals.shop.shop}
          isOpen={modals.shop.isOpen}
          onClose={closeShop}
          onBuy={(itemId, quantity, totalCost) => {
            console.log(`Bought ${quantity}x ${itemId} for ${totalCost} gold`);
            // TODO: Deduct gold, add items to inventory
          }}
        />
      )}
    </div>
  );
}

// Separate Minimap View component for parent to render
// This is a pure component that only renders Minimap
// Parent component is responsible for wrapping with HUDPanel if needed
export function MinimapView({
  currentLocation,
  tiles,
  gridColumns,
  gridRows,
  viewportStartX,
  viewportStartY,
  viewportEndX,
  viewportEndY,
  gridSize,
}: MinimapViewProps) {
  return (
    <Minimap
      currentLocation={currentLocation}
      tiles={tiles}
      gridWidth={gridColumns}
      gridHeight={gridRows}
      viewportStartX={viewportStartX}
      viewportStartY={viewportStartY}
      viewportEndX={viewportEndX}
      viewportEndY={viewportEndY}
      gridSize={gridSize}
      onClose={undefined}
    />
  );
}

// Separate Map Info View component for parent to render
// This is a pure component that only renders the map info content
// Parent component is responsible for wrapping with HUDPanel if needed
export function MapInfoView({
  currentLocation,
  gridColumns,
  gridRows,
  actualViewportWidth,
  actualViewportHeight,
  playerTileX,
  playerTileY,
  viewportStartX,
  viewportStartY,
}: MapInfoViewProps) {
  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-base font-semibold text-white mb-1">
          {currentLocation.name}
        </h3>
        <p className="text-xs text-gray-400 line-clamp-2">
          {currentLocation.description}
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="capitalize">{currentLocation.type}</span>
        <span>•</span>
        <span>
          {gridColumns}x{gridRows} tiles
        </span>
        <span>•</span>
        <span>
          View: {actualViewportWidth}x{actualViewportHeight}
        </span>
      </div>

      <div className="text-[10px] text-gray-600">
        Position: ({playerTileX}, {playerTileY}) | Viewport: ({viewportStartX},{" "}
        {viewportStartY})
      </div>
    </div>
  );
}
