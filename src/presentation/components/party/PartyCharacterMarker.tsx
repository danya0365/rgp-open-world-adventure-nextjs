import { Character } from "@/src/domain/types/character.types";

interface PartyCharacterMarkerProps {
  character: Character & { x: number; y: number };
  onClick: (character: Character) => void;
}

export function PartyCharacterMarker({ character, onClick }: PartyCharacterMarkerProps) {
  return (
    <button
      onClick={() => onClick(character)}
      className="absolute group transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${character.x}%`,
        top: `${character.y}%`,
      }}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-full blur-xl transition-all bg-purple-400/30 w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-24 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 group-hover:bg-purple-400/50" />

      {/* Character Portrait */}
      <div className="relative">
        <div className="relative w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-24 rounded-full flex items-center justify-center transition-all border-2 sm:border-3 md:border-4 overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400 group-hover:scale-110 group-hover:border-purple-300">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            {character.name.substring(0, 2).toUpperCase()}
          </div>
        </div>

        {/* Info Overlay */}
        <div className="absolute inset-0 rounded-full pointer-events-none">
          {/* Level Badge */}
          <div className="absolute -top-1 -left-1 w-5 h-5 sm:w-6 md:w-7 sm:h-6 md:h-7 bg-slate-900 border-2 border-purple-400 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-purple-300 text-[8px] sm:text-[9px] md:text-[10px] font-bold">
              {character.level}
            </span>
          </div>

          {/* Class Badge */}
          <div className="absolute -bottom-1 -left-1 px-1 sm:px-1.5 md:px-2 py-0.5 bg-slate-900/95 border border-purple-400 rounded-lg shadow-lg">
            <span className="text-purple-300 text-[7px] sm:text-[8px] md:text-[9px] font-bold uppercase">
              {character.class.substring(0, 3)}
            </span>
          </div>

          {/* Rarity Badge */}
          <div
            className={`absolute -bottom-1 -right-1 px-1 sm:px-1.5 md:px-2 py-0.5 rounded-lg text-[7px] sm:text-[8px] md:text-[9px] font-bold shadow-lg border-2 ${
              character.rarity === "legendary"
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-300"
                : character.rarity === "epic"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-400"
                : character.rarity === "rare"
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400"
                : "bg-gray-600 text-white border-gray-400"
            }`}
          >
            {character.rarity === "legendary"
              ? "⭐"
              : character.rarity === "epic"
              ? "💎"
              : character.rarity === "rare"
              ? "🔷"
              : "⚪"}
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <div className="px-3 py-1 rounded-lg text-sm font-semibold shadow-lg transition-all bg-slate-800/90 text-gray-200 group-hover:bg-purple-600/90 group-hover:text-white">
          {character.name}
        </div>
      </div>
    </button>
  );
}
