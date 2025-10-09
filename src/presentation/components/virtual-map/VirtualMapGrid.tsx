import { Location, MapTile as MapTileType } from "@/src/domain/types/location.types";
import { PlayerMarker } from "./PlayerMarker";
import { LocationMarker } from "./LocationMarker";
import { MapTile } from "./MapTile";
import { Minimap } from "./Minimap";
import { useVirtualMapStore } from "@/src/stores/virtualMapStore";
import { useMemo, useEffect } from "react";

interface VirtualMapGridProps {
  currentLocation: Location;
  childLocations: Location[];
  onLocationClick: (location: Location) => void;
  gridSize?: number;
  showMinimap?: boolean;
}

export function VirtualMapGrid({
  currentLocation,
  childLocations,
  onLocationClick,
  gridSize = 40,
  showMinimap = true,
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
    isTileVisited,
    getVisibleConnections,
    getVisibleLocations,
  } = useVirtualMapStore();


  // Calculate grid dimensions based on location mapData
  const gridWidth = currentLocation.mapData?.gridSize || currentLocation.mapData?.width || 20;
  const gridHeight = currentLocation.mapData?.gridSize || currentLocation.mapData?.height || 15;

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
    return getOrGenerateTiles(currentLocation, gridWidth, gridHeight);
  }, [currentLocation, gridWidth, gridHeight, getOrGenerateTiles]);

  // Calculate viewport whenever player moves or location changes
  useEffect(() => {
    calculateViewport(gridSize, gridWidth, gridHeight);
  }, [playerPosition.coordinates, gridSize, gridWidth, gridHeight, viewportSize, calculateViewport]);

  // Get visible connections and locations from store (must be before early return)
  const connections = useMemo(() => {
    if (!viewport) return [];
    return getVisibleConnections(currentLocation.id, viewport);
  }, [currentLocation.id, viewport, getVisibleConnections]);

  const visibleChildLocations = useMemo(() => {
    if (!viewport) return [];
    return getVisibleLocations(childLocations, viewport, gridSize);
  }, [childLocations, viewport, gridSize, getVisibleLocations]);

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
      console.log(`  ✗ Player not in this location (player: ${playerPosition.locationId}, current: ${currentLocation.id})`);
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

  const { playerTileX, playerTileY, viewportStartX, viewportStartY, viewportEndX, viewportEndY } = viewport;
  
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
        }}
      >
        {/* Render Only Visible Tiles (Viewport) */}
        {tiles
          .filter((tile) => 
            tile.x >= viewportStartX && 
            tile.x < viewportEndX && 
            tile.y >= viewportStartY && 
            tile.y < viewportEndY
          )
          .map((tile, index) => {
            const isPlayerPos =
              playerPosition.locationId === currentLocation.id &&
              tile.x === Math.floor(playerPosition.coordinates.x / gridSize) &&
              tile.y === Math.floor(playerPosition.coordinates.y / gridSize);

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
                isVisited={isTileVisited(currentLocation.id, tile.x, tile.y, gridSize)}
                isPlayerPosition={isPlayerPos}
                onClick={() => handleTileClick(tile)}
              />
            );
          })}

        {/* Child Location Markers (on top of tiles) */}
        {visibleChildLocations.map((location) => {
          const markerX = ((location.coordinates!.x / gridSize) - viewportStartX) * gridSize;
          const markerY = ((location.coordinates!.y / gridSize) - viewportStartY) * gridSize;

          const adjustedLocation = {
            ...location,
            coordinates: { x: markerX, y: markerY },
          };

          return (
            <LocationMarker
              key={location.id}
              location={adjustedLocation}
              onClick={() => onLocationClick(location)}
              isDiscovered={discoveredLocations.has(location.id)}
              isCurrentLocation={location.id === playerPosition.locationId}
            />
          );
        })}

        {/* Player Marker (only show if player is in this location) */}
        {playerPosition.locationId === currentLocation.id && (
          <PlayerMarker
            x={(playerPosition.coordinates.x / gridSize) - viewportStartX}
            y={(playerPosition.coordinates.y / gridSize) - viewportStartY}
            facing={playerPosition.facing}
            gridSize={gridSize}
          />
        )}

        {/* Connection Markers */}
        {connections.map((connection) => {
            const tileX = Math.floor(connection.coordinates!.x / gridSize);
            const tileY = Math.floor(connection.coordinates!.y / gridSize);
            const x = tileX - viewportStartX;
            const y = tileY - viewportStartY;
            
            const target = childLocations.find((l) => l.id === connection.toLocationId);
            const isDiscovered = target && discoveredLocations.has(target.id);

            return (
              <div
                key={connection.id}
                className="absolute pointer-events-auto cursor-pointer"
                style={{
                  left: `${x * gridSize}px`,
                  top: `${y * gridSize}px`,
                  width: `${gridSize}px`,
                  height: `${gridSize}px`,
                  zIndex: 999,
                }}
                onClick={() => {
                  if (target) onLocationClick(target);
                }}
                title={target ? `${target.name} - Click to enter` : "Unknown location"}
              >
                <div
                  className={`w-full h-full ${
                    isDiscovered ? "bg-green-500" : "bg-gray-500"
                  } border-4 border-white rounded-full flex items-center justify-center text-2xl ${
                    isDiscovered ? "animate-bounce" : ""
                  }`}
                >
                  {isDiscovered ? "🏛️" : "❓"}
                </div>
              </div>
            );
          })}

        {/* Map Info Overlay - Bottom Left (moved from top) */}
        <div className="absolute bottom-4 left-4 pointer-events-none z-50">
          <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg px-3 py-2 max-w-xs">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
              {currentLocation.name}
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-400 line-clamp-2">
              {currentLocation.description}
            </p>
            <div className="mt-1 flex items-center gap-2 text-[9px] text-gray-500">
              <span className="capitalize">{currentLocation.type}</span>
              <span>•</span>
              <span>{gridWidth}x{gridHeight} tiles</span>
              <span>•</span>
              <span>View: {actualViewportWidth}x{actualViewportHeight}</span>
            </div>
            <div className="mt-1 text-[8px] text-gray-600">
              Position: ({playerTileX}, {playerTileY}) | Viewport: ({viewportStartX}, {viewportStartY})
            </div>
          </div>
        </div>

        {/* Viewport Coordinate Indicators */}
        <div className="absolute top-1 left-1 text-[8px] text-gray-600 font-mono bg-black/30 px-1 rounded">
          ({viewportStartX}, {viewportStartY})
        </div>
        <div className="absolute bottom-1 right-1 text-[8px] text-gray-600 font-mono bg-black/30 px-1 rounded">
          ({viewportEndX}, {viewportEndY})
        </div>

        {/* Minimap - Top Right */}
        {showMinimap && (
          <div className="absolute top-4 right-4 z-50 pointer-events-auto">
            <Minimap
              currentLocation={currentLocation}
              tiles={tiles}
              gridWidth={gridWidth}
              gridHeight={gridHeight}
              viewportStartX={viewportStartX}
              viewportStartY={viewportStartY}
              viewportEndX={viewportEndX}
              viewportEndY={viewportEndY}
              childLocations={childLocations}
              gridSize={gridSize}
              onClose={() => {
                // Toggle minimap via parent component
                const parentToggle = document.querySelector('[data-minimap-toggle]') as HTMLButtonElement;
                parentToggle?.click();
              }}
            />
          </div>
        )}
      </div>

      {/* Empty State */}
      {childLocations.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold text-white mb-2">
              No Sub-Locations
            </h3>
            <p className="text-gray-400">
              This is the deepest level in this area
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
