import { BattleMarker } from "@/src/domain/types/location.types";
import { Swords, Skull, Flame, Zap } from "lucide-react";
import { getPOIPixelSize } from "@/src/utils/poiGridUtils";

interface BattleMarkerComponentProps {
  battle: BattleMarker;
  gridSize: number;
  viewportOffsetX: number;
  viewportOffsetY: number;
  isPlayerNearby?: boolean;
}

// Difficulty colors
const DIFFICULTY_COLORS = {
  easy: "bg-green-600 border-green-400",
  normal: "bg-blue-600 border-blue-400",
  hard: "bg-red-600 border-red-400",
  boss: "bg-purple-700 border-purple-500",
};

// Difficulty icons
const DIFFICULTY_ICONS = {
  easy: Swords,
  normal: Flame,
  hard: Skull,
  boss: Zap,
};

export function BattleMarkerComponent({
  battle,
  gridSize,
  viewportOffsetX,
  viewportOffsetY,
  isPlayerNearby = false,
}: BattleMarkerComponentProps) {
  // Calculate position relative to viewport
  const x = (battle.coordinates.x - viewportOffsetX) * gridSize;
  const y = (battle.coordinates.y - viewportOffsetY) * gridSize;

  const difficulty = battle.difficulty || "normal";
  const Icon = DIFFICULTY_ICONS[difficulty];
  const colorClass = DIFFICULTY_COLORS[difficulty];

  // Get POI size in pixels based on grid size
  const { width, height } = getPOIPixelSize(battle.gridSize, gridSize);
  
  // Determine if POI is 1x1 (use circle) or larger (use rounded rectangle)
  const is1x1 = (!battle.gridSize || (battle.gridSize.width === 1 && battle.gridSize.height === 1));
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
      title={battle.name || "Battle Area"}
    >
      {/* Battle Marker with pulsing animation */}
      <div
        className={`w-full h-full ${shapeClass} flex items-center justify-center transition-all ${colorClass} border-4 group-hover:scale-110 group-hover:shadow-lg animate-pulse`}
      >
        <Swords className="w-1/2 h-1/2 text-white" />
      </div>

      {/* Difficulty Badge */}
      <div className={`absolute -top-1 -right-1 w-5 h-5 ${colorClass} rounded-full border-2 border-white flex items-center justify-center`}>
        <Icon className="w-3 h-3 text-white" />
      </div>

      {/* Name Label (always show) */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap">
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded shadow-lg">
          {battle.name || "Battle Area"}
          <div className="text-[10px] text-gray-300 capitalize">
            {difficulty} difficulty
          </div>
        </div>
      </div>

      {/* Interaction Indicator (when player is nearby) */}
      {isPlayerNearby && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap animate-bounce">
          <div className="bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow-lg font-bold">
            Press SPACE to battle
          </div>
        </div>
      )}

      {/* Glow effect for boss battles */}
      {difficulty === "boss" && (
        <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-md animate-pulse -z-10" />
      )}
    </div>
  );
}
