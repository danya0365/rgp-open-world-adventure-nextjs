"use client";

import { Location, LocationConnection, MapTile } from "@/src/domain/types/location.types";
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
  gridSize?: number;
  connections?: LocationConnection[];
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
  gridSize = 40,
  connections = [],
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
  const playerTileX = Math.floor(playerPosition.pixelCoordinate.x / gridSize);
  const playerTileY = Math.floor(playerPosition.pixelCoordinate.y / gridSize);

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

        {/* Connection Markers - Important POIs */}
        {connections.map((connection) => {
          const x = Math.floor(connection.from.tileCoordinate.x * tileSize);
          const y = Math.floor(connection.from.tileCoordinate.y * tileSize);
          const size = Math.max(Math.ceil(tileSize * 1.5), 6); // Slightly larger than tile

          return (
            <div
              key={`minimap-connection-${connection.id}`}
              className="absolute bg-purple-500 border-2 border-white rounded-full shadow-lg"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${size}px`,
                height: `${size}px`,
                transform: 'translate(-50%, -50%)', // Center on tile
                zIndex: 90,
              }}
              title={connection.connectionType}
            />
          );
        })}

        {/* Treasure Markers */}
        {currentLocation.metadata?.treasures?.map((treasure) => {
          // Skip already discovered treasures
          if (treasure.isDiscovered) return null;

          const x = Math.floor(treasure.tileCoordinate.x * tileSize);
          const y = Math.floor(treasure.tileCoordinate.y * tileSize);
          const size = Math.max(Math.ceil(tileSize * 1.2), 5);

          return (
            <div
              key={`minimap-treasure-${treasure.id}`}
              className="absolute bg-yellow-400 border border-yellow-600 rounded shadow-md"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${size}px`,
                height: `${size}px`,
                transform: 'translate(-50%, -50%)', // Center on tile
                zIndex: 85,
              }}
              title="Treasure"
            />
          );
        })}

        {/* Battle Markers */}
        {currentLocation.metadata?.battleMaps?.map((battle) => {
          const x = Math.floor(battle.tileCoordinate.x * tileSize);
          const y = Math.floor(battle.tileCoordinate.y * tileSize);
          const size = Math.max(Math.ceil(tileSize * 1.2), 5);

          let color = "bg-red-500";
          if (battle.difficulty === "boss") color = "bg-red-700";
          else if (battle.difficulty === "hard") color = "bg-red-600";

          return (
            <div
              key={`minimap-battle-${battle.id}`}
              className={`absolute ${color} border border-red-300 shadow-md`}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${size}px`,
                height: `${size}px`,
                transform: 'translate(-50%, -50%)', // Center on tile
                zIndex: 85,
              }}
              title={`Battle (${battle.difficulty || 'normal'})`}
            />
          );
        })}

        {/* Service/Shop Markers */}
        {currentLocation.metadata?.services?.map((service) => {
          const x = Math.floor(service.tileCoordinate.x * tileSize);
          const y = Math.floor(service.tileCoordinate.y * tileSize);
          const size = Math.max(Math.ceil(tileSize * 1.1), 4);

          let color = "bg-cyan-400";
          if (service.serviceType === "inn") color = "bg-green-400";
          else if (service.serviceType === "guild") color = "bg-indigo-400";

          return (
            <div
              key={`minimap-service-${service.id}`}
              className={`absolute ${color} border border-white rounded-sm shadow-sm`}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${size}px`,
                height: `${size}px`,
                transform: 'translate(-50%, -50%)', // Center on tile
                zIndex: 80,
              }}
              title={service.serviceType}
            />
          );
        })}

        {currentLocation.metadata?.shops?.map((shop) => {
          const x = Math.floor(shop.tileCoordinate.x * tileSize);
          const y = Math.floor(shop.tileCoordinate.y * tileSize);
          const size = Math.max(Math.ceil(tileSize * 1.1), 4);

          return (
            <div
              key={`minimap-shop-${shop.id}`}
              className="absolute bg-orange-400 border border-white rounded-sm shadow-sm"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${size}px`,
                height: `${size}px`,
                transform: 'translate(-50%, -50%)', // Center on tile
                zIndex: 80,
              }}
              title={shop.shopType || 'Shop'}
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
      <div className={`mt-1.5 pt-1.5 border-t border-slate-700 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[8px] text-gray-400 ${onClose ? 'bg-slate-900/95 backdrop-blur-sm border-2 border-purple-500/50 border-t-0 rounded-b-lg p-2' : ''}`}>
        <div className="flex items-center gap-0.5">
          <div className="w-2 h-2 bg-blue-400 border border-white rounded-full shrink-0" />
          <span>You</span>
        </div>
        <div className="flex items-center gap-0.5">
          <div className="w-2 h-2 bg-purple-500 border-2 border-white rounded-full shrink-0" />
          <span>Exit</span>
        </div>
        <div className="flex items-center gap-0.5">
          <div className="w-2 h-2 bg-yellow-400 border border-yellow-600 shrink-0" />
          <span>Treasure</span>
        </div>
        <div className="flex items-center gap-0.5">
          <div className="w-2 h-2 bg-red-500 border border-red-300 shrink-0" />
          <span>Battle</span>
        </div>
        <div className="flex items-center gap-0.5">
          <div className="w-2 h-2 bg-cyan-400 border border-white rounded-sm shrink-0" />
          <span>Service</span>
        </div>
        <div className="flex items-center gap-0.5">
          <div className="w-2 h-2 bg-orange-400 border border-white rounded-sm shrink-0" />
          <span>Shop</span>
        </div>
      </div>
    </div>
  );
}
