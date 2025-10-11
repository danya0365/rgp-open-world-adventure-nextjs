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
  gridSize?: number;
  onClose?: () => void;
}

export function Minimap({
  currentLocation,
  tiles,
  gridWidth,
  viewportStartX,
  viewportStartY,
  viewportEndX,
  viewportEndY,
  gridSize = 40,
  gridHeight,
  onClose,
}: MinimapProps) {
  const { playerPosition, getAllConnections } = useVirtualMapStore();

  // Get all connections for the current location
  const connections = getAllConnections(currentLocation.id);

  // Minimap settings
  const minimapScale = 4; // Each tile = 4px on minimap
  const minimapWidth = gridWidth * minimapScale;
  const minimapHeight = gridHeight * minimapScale;
  const maxMinimapSize = 200; // Max size in pixels

  // Scale down if too large (maintain aspect ratio)
  const scale = Math.min(
    1,
    maxMinimapSize / Math.max(minimapWidth, minimapHeight)
  );
  const finalWidth = Math.floor(minimapWidth * scale);
  const finalHeight = Math.floor(minimapHeight * scale);
  const tileSize = minimapScale * scale;

  // Calculate player position on minimap
  const playerTileX = Math.floor(playerPosition.pixelCoordinate.x / gridSize);
  const playerTileY = Math.floor(playerPosition.pixelCoordinate.y / gridSize);

  return (
    <div className="flex flex-col">
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

      <div className="p-2 w-full flex-1 flex items-center justify-center gap-4">
        {/* Minimap Canvas */}
        <div
          className="relative border border-slate-700 rounded bg-slate-950 shrink-0"
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
            className="absolute bg-yellow-400/10 pointer-events-none"
            style={{
              left: `${Math.floor(viewportStartX * tileSize)}px`,
              top: `${Math.floor(viewportStartY * tileSize)}px`,
              width: `${Math.ceil(
                (viewportEndX - viewportStartX) * tileSize
              )}px`,
              height: `${Math.ceil(
                (viewportEndY - viewportStartY) * tileSize
              )}px`,
              boxShadow: "inset 0 0 0 2px rgb(250 204 21)", // yellow-400
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
                  transform: "translate(-50%, -50%)", // Center on tile
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
                  transform: "translate(-50%, -50%)", // Center on tile
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
                  transform: "translate(-50%, -50%)", // Center on tile
                  zIndex: 85,
                }}
                title={`Battle (${battle.difficulty || "normal"})`}
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
                  transform: "translate(-50%, -50%)", // Center on tile
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
                  transform: "translate(-50%, -50%)", // Center on tile
                  zIndex: 80,
                }}
                title={shop.shopType || "Shop"}
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
      </div>

      {/* Legend - Right Side */}
      <div
        className={`flex flex-col items-start gap-1.5 p-2 border border-slate-700 rounded bg-slate-900/95 backdrop-blur-sm text-[10px] text-gray-300 ${
          onClose ? "border-purple-500/50" : ""
        }`}
        style={{
          height: `${finalHeight}px`,
          minWidth: '100px',
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(139, 92, 246, 0.5) transparent',
        }}
      >
        <div className="text-xs font-semibold text-purple-300 mb-1">Legend</div>
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-blue-400 border border-white rounded-full flex-shrink-0" />
            <span className="whitespace-nowrap">You</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-purple-500 border-2 border-white rounded-full flex-shrink-0" />
            <span className="whitespace-nowrap">Exit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-yellow-400 border border-yellow-600 flex-shrink-0" />
            <span className="whitespace-nowrap">Treasure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-red-500 border border-red-300 flex-shrink-0" />
            <span className="whitespace-nowrap">Battle</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-cyan-400 border border-white rounded-sm flex-shrink-0" />
            <span className="whitespace-nowrap">Service</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-orange-400 border border-white rounded-sm flex-shrink-0" />
            <span className="whitespace-nowrap">Shop</span>
          </div>
        </div>
      </div>
    </div>
  );
}
