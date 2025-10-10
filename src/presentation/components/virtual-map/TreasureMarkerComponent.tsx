import { TreasureMarker } from "@/src/domain/types/location.types";
import { Gem, Lock } from "lucide-react";
import { getPOIPixelSize } from "@/src/utils/poiGridUtils";

interface TreasureMarkerComponentProps {
  treasure: TreasureMarker;
  gridSize: number;
  viewportOffsetX: number;
  viewportOffsetY: number;
  isPlayerNearby?: boolean;
}

export function TreasureMarkerComponent({
  treasure,
  gridSize,
  viewportOffsetX,
  viewportOffsetY,
  isPlayerNearby = false,
}: TreasureMarkerComponentProps) {
  // Calculate position relative to viewport
  const x = (treasure.coordinates.x - viewportOffsetX) * gridSize;
  const y = (treasure.coordinates.y - viewportOffsetY) * gridSize;

  const isDiscovered = treasure.isDiscovered || false;

  // Get POI size in pixels based on grid size
  const { width, height } = getPOIPixelSize(treasure.gridSize, gridSize);
  
  // Determine if POI is 1x1 (use circle) or larger (use rounded rectangle)
  const is1x1 = (!treasure.gridSize || (treasure.gridSize.width === 1 && treasure.gridSize.height === 1));
  const shapeClass = is1x1 ? "rounded-full" : "rounded-lg";

  return (
    <div
      className="absolute pointer-events-none group"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: 50,
      }}
      title={treasure.name || "Treasure"}
    >
      {/* Treasure Marker */}
      <div
        className={`w-full h-full ${shapeClass} flex items-center justify-center transition-all border-4 group-hover:scale-110 group-hover:shadow-lg ${
          isDiscovered
            ? "bg-gray-500 border-gray-400 opacity-50"
            : "bg-yellow-500 border-yellow-300 animate-pulse"
        }`}
      >
        <Gem className="w-1/2 h-1/2 text-white" />
      </div>

      {/* Lock Badge (if not discovered) */}
      {!isDiscovered && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
          <Lock className="w-2.5 h-2.5 text-white" />
        </div>
      )}

      {/* Checkmark (if discovered) */}
      {isDiscovered && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-[8px] font-bold text-white">✓</span>
        </div>
      )}

      {/* Name Label (always show) */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap">
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded shadow-lg">
          {treasure.name || "Treasure"}
          <div className="text-[10px] text-gray-300">
            {isDiscovered ? "Opened" : "Unopened"}
          </div>
        </div>
      </div>

      {/* Interaction Indicator (when player is nearby and not discovered) */}
      {isPlayerNearby && !isDiscovered && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap animate-bounce">
          <div className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full shadow-lg font-bold">
            Press SPACE to open
          </div>
        </div>
      )}

      {/* Sparkle effect for unopened treasures */}
      {!isDiscovered && (
        <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-sm animate-pulse -z-10" />
      )}
    </div>
  );
}
