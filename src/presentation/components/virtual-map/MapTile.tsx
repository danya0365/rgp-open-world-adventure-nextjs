import { MapTile as MapTileType } from "@/src/domain/types/location.types";
import { Mountain, Trees, Waves, Circle } from "lucide-react";

interface MapTileProps {
  tile: MapTileType;
  gridSize: number;
  isVisited?: boolean;
  isPlayerPosition?: boolean;
  onClick?: () => void;
}

const TERRAIN_COLORS = {
  grass: "bg-green-600",
  water: "bg-blue-600",
  mountain: "bg-gray-700",
  sand: "bg-yellow-600",
  snow: "bg-white",
  lava: "bg-red-600",
  ice: "bg-cyan-400",
  forest: "bg-green-800",
  swamp: "bg-green-900",
  desert: "bg-yellow-700",
};

const TERRAIN_ICONS = {
  mountain: Mountain,
  forest: Trees,
  water: Waves,
  grass: Circle,
  sand: Circle,
  snow: Circle,
  lava: Circle,
  ice: Circle,
  swamp: Trees,
  desert: Circle,
};

export function MapTile({
  tile,
  gridSize,
  isVisited = false,
  isPlayerPosition = false,
  onClick,
}: MapTileProps) {
  const colorClass = TERRAIN_COLORS[tile.type] || "bg-gray-500";
  const Icon = TERRAIN_ICONS[tile.type];

  return (
    <button
      onClick={onClick}
      disabled={!tile.isWalkable}
      className={`
        absolute border border-slate-700/30 transition-all
        ${colorClass}
        ${tile.isWalkable ? "hover:brightness-110 cursor-pointer" : "opacity-50 cursor-not-allowed"}
        ${isVisited ? "brightness-100" : "brightness-75"}
        ${isPlayerPosition ? "ring-4 ring-blue-400 z-10" : ""}
      `}
      style={{
        left: `${tile.x * gridSize}px`,
        top: `${tile.y * gridSize}px`,
        width: `${gridSize}px`,
        height: `${gridSize}px`,
      }}
      title={`${tile.type} (${tile.x}, ${tile.y}) ${tile.isWalkable ? "" : "- Blocked"}`}
    >
      {/* Terrain Icon */}
      {Icon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Icon 
            className="text-white/20" 
            size={gridSize * 0.5}
            strokeWidth={1.5}
          />
        </div>
      )}

      {/* Height Indicator */}
      {tile.height > 0 && (
        <div className="absolute top-0 right-0 px-1 text-[8px] font-bold text-white bg-black/50 rounded-bl">
          {tile.height}
        </div>
      )}

      {/* Grid Coordinates (for debug) */}
      <div className="absolute bottom-0 left-0 px-0.5 text-[6px] text-white/30 font-mono">
        {tile.x},{tile.y}
      </div>

      {/* Visited Overlay */}
      {!isVisited && (
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      )}
    </button>
  );
}
