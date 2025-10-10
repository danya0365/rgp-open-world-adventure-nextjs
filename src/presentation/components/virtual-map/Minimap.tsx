"use client";

import { Location, MapTile } from "@/src/domain/types/location.types";
import { useVirtualMapStore } from "@/src/stores/virtualMapStore";
import { getLocationConnections } from "@/src/data/master/locations.master";

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
  onClose?: () => void;
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
  onClose,
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
    <div className="inline-flex flex-col">
      {/* Title with Close Button - Only show if onClose is provided (standalone mode) */}
      {onClose && (
        <div className="flex items-center justify-between gap-2 mb-1.5 bg-slate-900/95 backdrop-blur-sm border-2 border-purple-500/50 rounded-t-lg p-2">
          <div className="text-xs font-bold text-purple-300 whitespace-nowrap flex-1 text-center">
            Minimap
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 rounded transition-colors"
            title="Close Minimap"
          >
            <span className="text-xs leading-none">✕</span>
          </button>
        </div>
      )}

      {/* Minimap Canvas */}
      <div
        className="relative border border-slate-700 rounded overflow-hidden bg-slate-950 shrink-0"
        style={{
          width: `${finalWidth}px`,
          height: `${finalHeight}px`,
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
        {(() => {
          // Get connections from current location to child locations
          const connections = getLocationConnections(currentLocation.id);
          
          return childLocations.map((location) => {
            // Find connection to this child location
            const connection = connections.find(
              (conn) => conn.to.locationId === location.id
            );
            
            if (!connection) return null;
            
            // Use entrance coordinates (from.coordinates)
            const markerX = Math.floor((connection.from.coordinates.x / gridSize) * tileSize);
            const markerY = Math.floor((connection.from.coordinates.y / gridSize) * tileSize);

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
          });
        })()}

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
      <div className={`mt-1.5 pt-1.5 border-t border-slate-700 flex items-center justify-center gap-3 text-[8px] text-gray-400 ${onClose ? 'bg-slate-900/95 backdrop-blur-sm border-2 border-purple-500/50 border-t-0 rounded-b-lg p-2' : ''}`}>
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
