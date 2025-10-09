import { Quest } from "@/src/domain/types/quest.types";
import { Scroll, Swords, Calendar, Target, Crown } from "lucide-react";

interface QuestMarkerProps {
  quest: Quest;
  onClick: () => void;
  x: number;
  y: number;
}

// Quest type icons
const QUEST_TYPE_ICONS = {
  main: Crown,
  side: Target,
  event: Scroll,
  daily: Calendar,
  bounty: Swords,
};

// Quest type colors
const QUEST_TYPE_COLORS = {
  main: {
    glow: "bg-amber-400/50",
    border: "border-amber-400",
    bg: "from-amber-500 to-yellow-600",
    text: "text-amber-400",
  },
  side: {
    glow: "bg-blue-400/40",
    border: "border-blue-400",
    bg: "from-blue-500 to-cyan-600",
    text: "text-blue-400",
  },
  event: {
    glow: "bg-pink-400/40",
    border: "border-pink-400",
    bg: "from-pink-500 to-purple-600",
    text: "text-pink-400",
  },
  daily: {
    glow: "bg-green-400/40",
    border: "border-green-400",
    bg: "from-green-500 to-emerald-600",
    text: "text-green-400",
  },
  bounty: {
    glow: "bg-red-400/40",
    border: "border-red-400",
    bg: "from-red-500 to-orange-600",
    text: "text-red-400",
  },
};

export function QuestMarker({ quest, onClick, x, y }: QuestMarkerProps) {
  const Icon = QUEST_TYPE_ICONS[quest.type];
  const colors = QUEST_TYPE_COLORS[quest.type];
  
  const isActive = quest.status === "active";
  const isCompleted = quest.status === "completed";
  const isLocked = quest.status === "locked";

  // Size based on type (main quests are bigger) - Mobile optimized
  const size = quest.type === "main" 
    ? "w-16 h-16 sm:w-20 md:w-24 lg:w-28 sm:h-20 md:h-24 lg:h-28" 
    : "w-14 h-14 sm:w-16 md:w-18 lg:w-20 sm:h-16 md:h-18 lg:h-20";
  const glowSize = quest.type === "main" 
    ? "w-20 h-20 sm:w-24 md:w-28 lg:w-32 sm:h-24 md:h-28 lg:h-32" 
    : "w-16 h-16 sm:w-20 md:w-22 lg:w-24 sm:h-20 md:h-22 lg:h-24";

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`absolute group transform -translate-x-1/2 -translate-y-1/2 ${
        isLocked ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
    >
      {/* Glow Effect */}
      <div
        className={`absolute inset-0 rounded-full blur-xl transition-all ${glowSize} -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 ${
          isCompleted
            ? "bg-green-400/50"
            : isActive
            ? `${colors.glow} animate-pulse`
            : isLocked
            ? "bg-gray-600/20"
            : `${colors.glow} group-hover:opacity-80`
        }`}
      />

      {/* Quest Circle */}
      <div className="relative">
        <div
          className={`relative ${size} rounded-full flex items-center justify-center transition-all border-4 ${
            isCompleted
              ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-400"
              : isActive
              ? `bg-gradient-to-br ${colors.bg} ${colors.border} scale-110`
              : isLocked
              ? "bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500"
              : `bg-gradient-to-br ${colors.bg} ${colors.border} group-hover:scale-110`
          }`}
        >
          {/* Icon - Mobile optimized */}
          <Icon className={`w-6 h-6 sm:w-8 md:w-10 lg:w-12 sm:h-8 md:h-10 lg:h-12 text-white ${isLocked ? "opacity-50" : ""}`} />
        </div>

        {/* Status Badge */}
        <div className="absolute inset-0 rounded-full pointer-events-none">
          {/* Active Badge */}
          {isActive && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 border-2 border-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          )}

          {/* Completed Badge */}
          {isCompleted && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          )}

          {/* Locked Icon */}
          {isLocked && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-700 border-2 border-gray-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-gray-400 text-xs">🔒</span>
            </div>
          )}

          {/* Level Requirement Badge */}
          {quest.requiredLevel > 1 && (
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-slate-900 border-2 border-purple-400 rounded-lg shadow-lg">
              <span className="text-purple-300 text-[9px] font-bold">
                Lv.{quest.requiredLevel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quest Name - Mobile optimized */}
      <div className="absolute top-full mt-2 sm:mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap max-w-[150px] sm:max-w-[200px]">
        <div
          className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-semibold shadow-lg transition-all ${
            isCompleted
              ? "bg-green-500/90 text-white"
              : isActive
              ? "bg-yellow-500/90 text-white"
              : isLocked
              ? "bg-gray-700/90 text-gray-400"
              : "bg-slate-800/90 text-gray-200 group-hover:bg-purple-600/90 group-hover:text-white"
          }`}
        >
          <div className="truncate">{quest.name}</div>
        </div>
      </div>

      {/* Quest Type Label - On Hover */}
      {!isLocked && (
        <div className="absolute top-full mt-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          <div className="px-3 py-2 bg-slate-900/95 border border-purple-500/50 rounded-lg shadow-xl min-w-[120px]">
            <div className="text-center">
              <div className={`text-xs font-bold ${colors.text} mb-1`}>
                {quest.type.toUpperCase()} QUEST
              </div>
              <div className="text-xs text-gray-400">
                {quest.objectives.length} objective{quest.objectives.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
      )}
    </button>
  );
}
