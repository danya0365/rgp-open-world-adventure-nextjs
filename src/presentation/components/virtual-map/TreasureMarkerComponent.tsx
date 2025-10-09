import { TreasureMarker } from "@/src/domain/types/location.types";
import { Gem, Lock } from "lucide-react";

interface TreasureMarkerComponentProps {
  treasure: TreasureMarker;
  gridSize: number;
  viewportOffsetX: number;
  viewportOffsetY: number;
  onClick?: (treasure: TreasureMarker) => void;
}

export function TreasureMarkerComponent({
  treasure,
  gridSize,
  viewportOffsetX,
  viewportOffsetY,
  onClick,
}: TreasureMarkerComponentProps) {
  // Calculate position relative to viewport
  const x = (treasure.coordinates.x - viewportOffsetX) * gridSize;
  const y = (treasure.coordinates.y - viewportOffsetY) * gridSize;

  const isDiscovered = treasure.isDiscovered || false;

  return (
    <div
      className="absolute pointer-events-auto cursor-pointer group"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${gridSize}px`,
        height: `${gridSize}px`,
        zIndex: 50,
      }}
      onClick={() => onClick?.(treasure)}
      title={treasure.name || "Treasure"}
    >
      {/* Treasure Circle */}
      <div
        className={`w-full h-full rounded-full flex items-center justify-center transition-all border-4 group-hover:scale-110 group-hover:shadow-lg ${
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

      {/* Name Label (on hover) */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded shadow-lg">
          {treasure.name || "Treasure"}
          <div className="text-[10px] text-gray-300">
            {isDiscovered ? "Opened" : "Unopened"}
          </div>
        </div>
      </div>

      {/* Sparkle effect for unopened treasures */}
      {!isDiscovered && (
        <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-sm animate-pulse -z-10" />
      )}
    </div>
  );
}
