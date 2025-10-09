"use client";

import { Location, MapTile } from "@/src/domain/types/location.types";
import { useVirtualMapStore } from "@/src/stores/virtualMapStore";

interface MinimapProps {
  currentLocation: Location;
  tiles: MapTile[];
  gridWidth: number;
  gridHeight: number;
  viewportStartX: number;
  viewportStartY: number;
  viewportEndX: number;
  viewportEndY: number;
  childLocations: Location[];
  gridSize?: number;
}

export function Minimap({
  currentLocation,
  tiles,
  gridWidth,
  gridHeight,
  viewportStartX,
  viewportStartY,
  viewportEndX,
  viewportEndY,
  childLocations,
  gridSize = 40,
}: MinimapProps) {
  const { playerPosition } = useVirtualMapStore();

  // Minimap settings
  const minimapScale = 4; // Each tile = 4px on minimap
  const minimapWidth = gridWidth * minimapScale;
  const minimapHeight = gridHeight * minimapScale;
  const maxMinimapSize = 200; // Max size in pixels

  // Scale down if too large (maintain aspect ratio)
  const scale = Math.min(1, maxMinimapSize / Math.max(minimapWidth, minimapHeight));
  const finalWidth = Math.floor(minimapWidth * scale);
  const finalHeight = Math.floor(minimapHeight * scale);
  const tileSize = minimapScale * scale;
  
  // Calculate player position on minimap
  const playerTileX = Math.floor(playerPosition.coordinates.x / gridSize);
  const playerTileY = Math.floor(playerPosition.coordinates.y / gridSize);

  return (
    <div className="bg-slate-900/95 backdrop-blur-sm border-2 border-purple-500/50 rounded-lg p-2 shadow-xl">
      {/* Title */}
      <div className="text-xs font-bold text-purple-300 mb-1.5 text-center">
        Minimap
      </div>

      {/* Minimap Canvas */}
      <div
        className="relative border border-slate-700 rounded overflow-hidden bg-slate-950"
        style={{
          width: `${finalWidth}px`,
          height: `${finalHeight}px`,
          margin: '0 auto',
        }}
      >
        {tiles.map((tile, index) => {
          const x = Math.floor(tile.x * tileSize);
          const y = Math.floor(tile.y * tileSize);
          const tileSizeRounded = Math.ceil(tileSize);

          // Tile color based on type and walkability
          let bgColor = "bg-gray-800"; // Default (non-walkable)
          if (tile.isWalkable) {
            if (tile.type === "grass") bgColor = "bg-green-700";
            else if (tile.type === "water") bgColor = "bg-blue-700";
            else if (tile.type === "forest") bgColor = "bg-green-900";
            else if (tile.type === "mountain") bgColor = "bg-gray-600";
            else if (tile.type === "sand") bgColor = "bg-yellow-700";
            else bgColor = "bg-green-700";
          }

          return (
            <div
              key={`minimap-tile-${tile.x}-${tile.y}-${index}`}
              className={`absolute ${bgColor}`}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${tileSizeRounded}px`,
                height: `${tileSizeRounded}px`,
              }}
            />
          );
        })}

        {/* Viewport Rectangle */}
        <div
          className="absolute border-2 border-yellow-400 bg-yellow-400/10 pointer-events-none"
          style={{
            left: `${Math.floor(viewportStartX * tileSize)}px`,
            top: `${Math.floor(viewportStartY * tileSize)}px`,
            width: `${Math.ceil((viewportEndX - viewportStartX) * tileSize)}px`,
            height: `${Math.ceil((viewportEndY - viewportStartY) * tileSize)}px`,
          }}
        />

        {/* Child Location Markers */}
        {childLocations
          .filter((loc) => loc.coordinates)
          .map((location) => {
            const markerX = Math.floor((location.coordinates!.x / gridSize) * tileSize);
            const markerY = Math.floor((location.coordinates!.y / gridSize) * tileSize);

            return (
              <div
                key={`minimap-marker-${location.id}`}
                className="absolute w-2 h-2 bg-purple-500 border border-white rounded-full"
                style={{
                  left: `${markerX - 4}px`,
                  top: `${markerY - 4}px`,
                }}
                title={location.name}
              />
            );
          })}

        {/* Player Marker */}
        {playerPosition.locationId === currentLocation.id && (
          <div
            className="absolute w-3 h-3 bg-blue-400 border-2 border-white rounded-full animate-pulse shadow-lg"
            style={{
              left: `${Math.floor(playerTileX * tileSize) - 6}px`,
              top: `${Math.floor(playerTileY * tileSize) - 6}px`,
              zIndex: 100,
            }}
          />
        )}
      </div>

      {/* Legend */}
      <div className="mt-1.5 pt-1.5 border-t border-slate-700 flex items-center justify-center gap-3 text-[8px] text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-400 border border-white rounded-full shrink-0" />
          <span>You</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 border-2 border-yellow-400 shrink-0" />
          <span>View</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-purple-500 border border-white rounded-full shrink-0" />
          <span>Loc</span>
        </div>
      </div>
    </div>
  );
}
