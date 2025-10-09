import { Location, MapTile as MapTileType } from "@/src/domain/types/location.types";
import { PlayerMarker } from "./PlayerMarker";
import { LocationMarker } from "./LocationMarker";
import { MapTile } from "./MapTile";
import { useVirtualMapStore } from "@/src/stores/virtualMapStore";
import { generateDefaultTiles, generateProceduralMap } from "@/src/utils/mapGenerator";
import { useMemo } from "react";

interface VirtualMapGridProps {
  currentLocation: Location;
  childLocations: Location[];
  onLocationClick: (location: Location) => void;
  gridSize?: number;
}

export function VirtualMapGrid({
  currentLocation,
  childLocations,
  onLocationClick,
  gridSize = 40,
}: VirtualMapGridProps) {
  const { playerPosition, discoveredLocations, movePlayer, visitedTiles } = useVirtualMapStore();

  // Calculate grid dimensions based on location mapData
  const gridWidth = currentLocation.mapData?.gridSize || 20;
  const gridHeight = currentLocation.mapData?.gridSize || 15;
  const mapWidth = gridWidth * gridSize;
  const mapHeight = gridHeight * gridSize;

  // Get or generate tiles
  const tiles = useMemo<MapTileType[]>(() => {
    // If location has predefined tiles, use them
    if (currentLocation.mapData?.tiles && currentLocation.mapData.tiles.length > 0) {
      return currentLocation.mapData.tiles;
    }

    // Generate procedural tiles based on location type
    const seed = currentLocation.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    if (currentLocation.type === "forest") {
      return generateProceduralMap(gridWidth, gridHeight, seed);
    } else if (currentLocation.type === "mountain") {
      return generateProceduralMap(gridWidth, gridHeight, seed + 1000);
    } else {
      return generateDefaultTiles(gridWidth, gridHeight, "grass");
    }
  }, [currentLocation, gridWidth, gridHeight]);

  // Get visited tiles for current location
  const currentLocationVisitedTiles = visitedTiles.get(currentLocation.id) || [];

  // Check if tile is visited
  const isTileVisited = (x: number, y: number) => {
    return currentLocationVisitedTiles.some(
      (coord) => coord.x === x * gridSize && coord.y === y * gridSize
    );
  };

  // Handle tile click - move player
  const handleTileClick = (tile: MapTileType) => {
    if (!tile.isWalkable) return;
    
    // Only move if player is in this location
    if (playerPosition.locationId === currentLocation.id) {
      movePlayer({ x: tile.x * gridSize, y: tile.y * gridSize });
    }
  };

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
        {/* Render All Tiles (Grid-Based System) */}
        {tiles.map((tile, index) => {
          const isPlayerPos =
            playerPosition.locationId === currentLocation.id &&
            tile.x === Math.floor(playerPosition.coordinates.x / gridSize) &&
            tile.y === Math.floor(playerPosition.coordinates.y / gridSize);

          return (
            <MapTile
              key={`${tile.x}-${tile.y}-${index}`}
              tile={tile}
              gridSize={gridSize}
              isVisited={isTileVisited(tile.x, tile.y)}
              isPlayerPosition={isPlayerPos}
              onClick={() => handleTileClick(tile)}
            />
          );
        })}

        {/* Child Location Markers (on top of tiles) */}
        {childLocations.map((location) => (
          <LocationMarker
            key={location.id}
            location={location}
            onClick={() => onLocationClick(location)}
            isDiscovered={discoveredLocations.has(location.id)}
            isCurrentLocation={location.id === playerPosition.locationId}
          />
        ))}

        {/* Player Marker (only show if player is in this location) */}
        {playerPosition.locationId === currentLocation.id && (
          <PlayerMarker
            x={playerPosition.coordinates.x / gridSize}
            y={playerPosition.coordinates.y / gridSize}
            facing={playerPosition.facing}
            gridSize={gridSize}
          />
        )}

        {/* Map Info Overlay - Top Left */}
        <div className="absolute top-4 left-4 pointer-events-none z-50">
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
              <span>{tiles.length} tiles</span>
            </div>
          </div>
        </div>

        {/* Coordinate Indicators (Corners) */}
        <div className="absolute top-1 left-1 text-[8px] text-gray-600 font-mono bg-black/30 px-1 rounded">
          (0, 0)
        </div>
        <div className="absolute bottom-1 right-1 text-[8px] text-gray-600 font-mono bg-black/30 px-1 rounded">
          ({gridWidth}, {gridHeight})
        </div>
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
