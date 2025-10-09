import { Character } from "@/src/domain/types/character.types";
import { Crown } from "lucide-react";

interface PartyMemberMarkerProps {
  character: Character;
  position: number; // 0-3
  isLeader: boolean;
  onClick: () => void;
  x: number;
  y: number;
}

export function PartyMemberMarker({
  character,
  position,
  isLeader,
  onClick,
  x,
  y,
}: PartyMemberMarkerProps) {
  return (
    <button
      onClick={onClick}
      className="absolute group transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
    >
      {/* Glow Effect - Leader gets special glow */}
      <div
        className={`absolute inset-0 rounded-full blur-xl transition-all ${
          isLeader
            ? "bg-amber-400/50 w-28 h-28 sm:w-32 md:w-36 sm:h-32 md:h-36 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
            : "bg-purple-400/40 w-24 h-24 sm:w-28 md:w-32 sm:h-28 md:h-32 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 group-hover:bg-purple-400/60"
        }`}
      />

      {/* Character Portrait - Larger for party members */}
      <div className="relative">
        <div
          className={`relative w-24 h-24 sm:w-28 md:w-32 sm:h-28 md:h-32 rounded-full flex items-center justify-center transition-all border-4 overflow-hidden ${
            isLeader
              ? "bg-gradient-to-br from-amber-500 to-yellow-600 border-amber-300 scale-110"
              : "bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400 group-hover:scale-110 group-hover:border-purple-300"
          }`}
        >
          {/* Character Avatar */}
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {character.name.substring(0, 2).toUpperCase()}
          </div>

          {/* Position Number Overlay */}
          <div className="absolute top-2 left-2 w-6 h-6 sm:w-7 md:w-8 sm:h-7 md:h-8 bg-slate-900/90 border-2 border-white rounded-full flex items-center justify-center">
            <span className="text-white text-xs sm:text-sm font-bold">{position + 1}</span>
          </div>
        </div>

        {/* Info Overlay */}
        <div className="absolute inset-0 rounded-full pointer-events-none">
          {/* Leader Badge */}
          {isLeader && (
            <div className="absolute -top-2 -right-2 w-8 h-8 sm:w-9 md:w-10 sm:h-9 md:h-10 bg-amber-500 border-2 border-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Crown className="w-4 h-4 sm:w-5 md:w-6 sm:h-5 md:h-6 text-white" fill="white" />
            </div>
          )}

          {/* Level Badge - Bottom Left */}
          <div className="absolute -bottom-2 -left-2 w-8 h-8 sm:w-9 md:w-10 sm:h-9 md:h-10 bg-slate-900 border-2 border-purple-400 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-purple-300 text-xs sm:text-sm font-bold">
              {character.level}
            </span>
          </div>

          {/* Class Badge - Bottom Right */}
          <div className="absolute -bottom-2 -right-2 px-2 py-1 bg-slate-900/95 border-2 border-purple-400 rounded-lg shadow-lg">
            <span className="text-purple-300 text-[9px] sm:text-[10px] md:text-xs font-bold uppercase">
              {character.class}
            </span>
          </div>
        </div>
      </div>

      {/* Character Name - Below */}
      <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <div
          className={`px-4 py-2 rounded-lg text-base sm:text-lg font-bold shadow-lg transition-all ${
            isLeader
              ? "bg-amber-500/90 text-white"
              : "bg-slate-800/90 text-gray-200 group-hover:bg-purple-600/90 group-hover:text-white"
          }`}
        >
          {character.name}
        </div>
      </div>

      {/* Stats Preview - On Hover */}
      <div className="absolute top-full mt-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        <div className="px-4 py-3 bg-slate-900/95 border border-purple-500/50 rounded-lg shadow-xl min-w-[150px]">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center">
              <div className="text-red-400 font-bold text-lg">{character.stats.maxHp}</div>
              <div className="text-gray-400 text-xs">HP</div>
            </div>
            <div className="text-center">
              <div className="text-cyan-400 font-bold text-lg">{character.stats.maxMp}</div>
              <div className="text-gray-400 text-xs">MP</div>
            </div>
            <div className="text-center">
              <div className="text-orange-400 font-bold text-lg">{character.stats.atk}</div>
              <div className="text-gray-400 text-xs">ATK</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold text-lg">{character.stats.def}</div>
              <div className="text-gray-400 text-xs">DEF</div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
