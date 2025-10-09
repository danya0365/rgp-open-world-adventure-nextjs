import { Location, MapTile as MapTileType } from "@/src/domain/types/location.types";
import { PlayerMarker } from "./PlayerMarker";
import { LocationMarker } from "./LocationMarker";
import { MapTile } from "./MapTile";
import { Minimap } from "./Minimap";
import { useVirtualMapStore } from "@/src/stores/virtualMapStore";
import { generateDefaultTiles, generateProceduralMap } from "@/src/utils/mapGenerator";
import { useMemo, useState, useEffect } from "react";

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
  const { playerPosition, discoveredLocations, startMovementToTile, visitedTiles } = useVirtualMapStore();

  // Calculate grid dimensions based on location mapData
  const gridWidth = currentLocation.mapData?.gridSize || currentLocation.mapData?.width || 20;
  const gridHeight = currentLocation.mapData?.gridSize || currentLocation.mapData?.height || 15;
  
  // Calculate viewport size based on screen size
  const [viewportSize, setViewportSize] = useState({ width: 20, height: 15 });
  
  useEffect(() => {
    const calculateViewportSize = () => {
      // Get window dimensions
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Reserve space for UI (panels, margins, etc.)
      const availableWidth = windowWidth - 100; // Reserve 100px for side panels
      const availableHeight = windowHeight - 200; // Reserve 200px for top/bottom UI
      
      // Calculate how many tiles can fit
      const tilesWidth = Math.floor(availableWidth / gridSize);
      const tilesHeight = Math.floor(availableHeight / gridSize);
      
      // Clamp to reasonable values (min 8, max 25)
      const clampedWidth = Math.max(8, Math.min(25, tilesWidth));
      const clampedHeight = Math.max(6, Math.min(20, tilesHeight));
      
      console.log(`[VirtualMapGrid] Viewport calculation:`);
      console.log(`  - Window: ${windowWidth}x${windowHeight}`);
      console.log(`  - Available: ${availableWidth}x${availableHeight}`);
      console.log(`  - Tiles fit: ${tilesWidth}x${tilesHeight}`);
      console.log(`  - Clamped: ${clampedWidth}x${clampedHeight}`);
      
      setViewportSize({ width: clampedWidth, height: clampedHeight });
    };
    
    // Calculate on mount
    calculateViewportSize();
    
    // Recalculate on window resize
    window.addEventListener('resize', calculateViewportSize);
    return () => window.removeEventListener('resize', calculateViewportSize);
  }, [gridSize]);
  
  // Adjust viewport to map size (don't exceed map dimensions)
  const viewportTilesWidth = Math.min(viewportSize.width, gridWidth);
  const viewportTilesHeight = Math.min(viewportSize.height, gridHeight);
  
  // Calculate viewport bounds based on player position (memoized for performance)
  const viewport = useMemo(() => {
    const playerTileX = Math.floor(playerPosition.coordinates.x / gridSize);
    const playerTileY = Math.floor(playerPosition.coordinates.y / gridSize);
    
    // If map is smaller than viewport, show entire map centered
    if (gridWidth <= viewportTilesWidth && gridHeight <= viewportTilesHeight) {
      return {
        playerTileX,
        playerTileY,
        viewportStartX: 0,
        viewportStartY: 0,
        viewportEndX: gridWidth,
        viewportEndY: gridHeight,
      };
    }
    
    // Center viewport on player
    const viewportStartX = Math.max(0, Math.min(gridWidth - viewportTilesWidth, playerTileX - Math.floor(viewportTilesWidth / 2)));
    const viewportStartY = Math.max(0, Math.min(gridHeight - viewportTilesHeight, playerTileY - Math.floor(viewportTilesHeight / 2)));
    const viewportEndX = Math.min(gridWidth, viewportStartX + viewportTilesWidth);
    const viewportEndY = Math.min(gridHeight, viewportStartY + viewportTilesHeight);
    
    return {
      playerTileX,
      playerTileY,
      viewportStartX,
      viewportStartY,
      viewportEndX,
      viewportEndY,
    };
  }, [playerPosition.coordinates.x, playerPosition.coordinates.y, gridSize, gridWidth, gridHeight, viewportTilesWidth, viewportTilesHeight]);
  
  const { playerTileX, playerTileY, viewportStartX, viewportStartY, viewportEndX, viewportEndY } = viewport;
  
  // Viewport size in pixels (use actual viewport size, not max)
  const actualViewportWidth = viewportEndX - viewportStartX;
  const actualViewportHeight = viewportEndY - viewportStartY;
  const mapWidth = actualViewportWidth * gridSize;
  const mapHeight = actualViewportHeight * gridSize;

  // Get or generate tiles
  const tiles = useMemo<MapTileType[]>(() => {
    console.log(`[VirtualMapGrid] Generating tiles for ${currentLocation.id}`);
    console.log(`  - Grid size: ${gridWidth}x${gridHeight}`);
    console.log(`  - Has predefined tiles:`, currentLocation.mapData?.tiles?.length);
    
    // If location has predefined tiles, use them
    if (currentLocation.mapData?.tiles && currentLocation.mapData.tiles.length > 0) {
      console.log(`  ✓ Using predefined tiles (${currentLocation.mapData.tiles.length})`);
      return currentLocation.mapData.tiles;
    }

    // Generate procedural tiles based on location type
    const seed = currentLocation.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    let generatedTiles: MapTileType[];
    if (currentLocation.type === "forest") {
      generatedTiles = generateProceduralMap(gridWidth, gridHeight, seed);
    } else if (currentLocation.type === "mountain") {
      generatedTiles = generateProceduralMap(gridWidth, gridHeight, seed + 1000);
    } else {
      generatedTiles = generateDefaultTiles(gridWidth, gridHeight, "grass");
    }
    
    console.log(`  ✓ Generated ${generatedTiles.length} tiles (type: ${currentLocation.type})`);
    return generatedTiles;
  }, [currentLocation, gridWidth, gridHeight]);

  // Get visited tiles for current location
  const currentLocationVisitedTiles = visitedTiles.get(currentLocation.id) || [];

  // Check if tile is visited
  const isTileVisited = (x: number, y: number) => {
    return currentLocationVisitedTiles.some(
      (coord) => coord.x === x * gridSize && coord.y === y * gridSize
    );
  };

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
  
  // Debug: log render info
  console.log(`[VirtualMapGrid] Rendering:`);
  console.log(`  - Total tiles: ${tiles.length}`);
  console.log(`  - Walkable tiles: ${tiles.filter(t => t.isWalkable).length}`);
  console.log(`  - Viewport: (${viewportStartX}, ${viewportStartY}) → (${viewportEndX}, ${viewportEndY})`);
  console.log(`  - Player: (${playerTileX}, ${playerTileY}) at location: ${playerPosition.locationId}`);
  console.log(`  - Current location: ${currentLocation.id}`);
  
  const visibleTiles = tiles.filter((tile) => 
    tile.x >= viewportStartX && 
    tile.x < viewportEndX && 
    tile.y >= viewportStartY && 
    tile.y < viewportEndY
  );
  console.log(`  - Visible tiles: ${visibleTiles.length}`);
  console.log(`  - Visible walkable: ${visibleTiles.filter(t => t.isWalkable).length}`);

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
                isVisited={isTileVisited(tile.x, tile.y)}
                isPlayerPosition={isPlayerPos}
                onClick={() => handleTileClick(tile)}
              />
            );
          })}

        {/* Child Location Markers (on top of tiles) */}
        {childLocations
          .filter((location) => location.coordinates) // Only show locations with coordinates
          .map((location) => {
            // Calculate marker position relative to viewport
            const markerX = ((location.coordinates!.x / gridSize) - viewportStartX) * gridSize;
            const markerY = ((location.coordinates!.y / gridSize) - viewportStartY) * gridSize;
            
            // Only render if marker is within viewport
            const isInViewport = 
              markerX >= -gridSize && 
              markerX <= mapWidth + gridSize &&
              markerY >= -gridSize && 
              markerY <= mapHeight + gridSize;
            
            if (!isInViewport) return null;
            
            // Create adjusted location with viewport-relative coordinates
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
