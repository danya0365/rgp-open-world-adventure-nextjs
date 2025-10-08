"use client";

import { Character } from "@/src/domain/types/character.types";
import { Crown, Users, X } from "lucide-react";

interface PartySlotProps {
  position: number;
  member: {
    character: Character;
    position: number;
    isLeader: boolean;
  } | null;
  onRemove?: (characterId: string) => void;
  onSelect?: (position: number) => void;
}

export function PartySlot({
  position,
  member,
  onRemove,
  onSelect,
}: PartySlotProps) {
  const elementColors = {
    fire: "text-red-400",
    water: "text-cyan-400",
    earth: "text-green-400",
    wind: "text-teal-400",
    light: "text-amber-400",
    dark: "text-slate-400",
    ice: "text-blue-400",
    poison: "text-pink-400",
  };

  if (!member) {
    // Empty slot - clickable if onSelect is provided
    const isClickable = !!onSelect;

    return (
      <div
        className={`relative bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center min-h-[200px] transition-all duration-300 ${
          isClickable
            ? "hover:border-purple-500 hover:bg-purple-900/20 cursor-pointer"
            : ""
        }`}
        onClick={() => isClickable && onSelect(position)}
      >
        <Users className="w-12 h-12 text-slate-600 mb-2" />
        <p className="text-slate-500 text-sm">Slot {position + 1}</p>
        {isClickable && (
          <p className="text-purple-400 text-xs mt-2">คลิกเพื่อเลือกตัวละคร</p>
        )}
      </div>
    );
  }

  // Filled slot
  const { character, isLeader } = member;

  return (
    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/30 rounded-xl p-4 hover:border-purple-500/60 transition-all duration-300">
      {/* Leader Badge */}
      {isLeader && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-2 shadow-lg shadow-amber-500/50">
          <Crown className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Remove Button */}
      {onRemove && (
        <button
          onClick={() => onRemove(character.id)}
          className="absolute top-2 right-2 p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-red-400" />
        </button>
      )}

      {/* Character Info */}
      <div className="flex items-center gap-4">
        {/* Portrait Placeholder */}
        <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-purple-400">
            {character.name.charAt(0)}
          </span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-white truncate">
              {character.name}
            </h3>
            <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded">
              Lv {character.level}
            </span>
          </div>

          <p className="text-sm text-gray-400 capitalize mb-2">
            {character.class}
          </p>

          {/* Elements */}
          <div className="flex gap-1">
            {character.elements.map((element) => (
              <span
                key={element}
                className={`text-xs px-2 py-0.5 bg-slate-700 rounded ${elementColors[element]}`}
              >
                {element}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="bg-slate-700/50 rounded p-2 text-center">
          <div className="text-xs text-gray-400">HP</div>
          <div className="text-sm font-bold text-red-400">
            {character.stats.maxHp}
          </div>
        </div>
        <div className="bg-slate-700/50 rounded p-2 text-center">
          <div className="text-xs text-gray-400">ATK</div>
          <div className="text-sm font-bold text-orange-400">
            {character.stats.atk}
          </div>
        </div>
        <div className="bg-slate-700/50 rounded p-2 text-center">
          <div className="text-xs text-gray-400">DEF</div>
          <div className="text-sm font-bold text-blue-400">
            {character.stats.def}
          </div>
        </div>
      </div>

      {/* Position Indicator */}
      <div className="absolute bottom-2 right-2 text-xs text-slate-500">
        Slot {position + 1}
      </div>
    </div>
  );
}
