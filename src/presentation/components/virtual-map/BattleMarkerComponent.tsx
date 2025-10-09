import { BattleMarker } from "@/src/domain/types/location.types";
import { Swords, Skull, Flame, Zap } from "lucide-react";

interface BattleMarkerComponentProps {
  battle: BattleMarker;
  gridSize: number;
  viewportOffsetX: number;
  viewportOffsetY: number;
  onClick?: (battle: BattleMarker) => void;
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
  onClick,
}: BattleMarkerComponentProps) {
  // Calculate position relative to viewport
  const x = (battle.coordinates.x - viewportOffsetX) * gridSize;
  const y = (battle.coordinates.y - viewportOffsetY) * gridSize;

  const difficulty = battle.difficulty || "normal";
  const Icon = DIFFICULTY_ICONS[difficulty];
  const colorClass = DIFFICULTY_COLORS[difficulty];

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
      onClick={() => onClick?.(battle)}
      title={battle.name || "Battle Area"}
    >
      {/* Battle Circle with pulsing animation */}
      <div
        className={`w-full h-full rounded-full flex items-center justify-center transition-all ${colorClass} border-4 group-hover:scale-110 group-hover:shadow-lg animate-pulse`}
      >
        <Swords className="w-1/2 h-1/2 text-white" />
      </div>

      {/* Difficulty Badge */}
      <div className={`absolute -top-1 -right-1 w-5 h-5 ${colorClass} rounded-full border-2 border-white flex items-center justify-center`}>
        <Icon className="w-3 h-3 text-white" />
      </div>

      {/* Name Label (on hover) */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded shadow-lg">
          {battle.name || "Battle Area"}
          <div className="text-[10px] text-gray-300 capitalize">
            {difficulty} difficulty
          </div>
        </div>
      </div>

      {/* Glow effect for boss battles */}
      {difficulty === "boss" && (
        <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-md animate-pulse -z-10" />
      )}
    </div>
  );
}
