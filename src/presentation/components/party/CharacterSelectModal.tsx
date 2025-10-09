import { Character } from "@/src/domain/types/character.types";
import { Modal } from "@/src/presentation/components/ui";
import { X } from "lucide-react";

interface CharacterSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: number;
  characters: Character[];
  onSelect: (character: Character) => void;
}

export function CharacterSelectModal({
  isOpen,
  onClose,
  position,
  characters,
  onSelect,
}: CharacterSelectModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`เลือกตัวละครสำหรับ Slot ${position + 1}`}
      size="lg"
      className="max-h-[85vh]"
    >
      {/* Search/Filter Bar */}
      <div className="mb-4 sticky top-0 bg-slate-900 z-10 pb-3 border-b border-slate-700">
        <p className="text-sm text-gray-400">
          {characters.length} ตัวละครที่สามารถเลือกได้
        </p>
      </div>

      {/* Character List - Compact Grid */}
      {characters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-2">
          {characters.map((character) => (
            <button
              key={character.id}
              onClick={() => onSelect(character)}
              className="group relative p-3 rounded-lg border-2 transition-all bg-slate-800/50 border-slate-700 hover:border-purple-500 hover:bg-purple-900/30 text-left"
            >
              {/* Character Info */}
              <div className="flex items-center gap-3 mb-2">
                {/* Avatar Circle */}
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg border-2 border-purple-400 group-hover:border-purple-300 transition-colors">
                    {character.name.substring(0, 2).toUpperCase()}
                  </div>
                  {/* Level Badge */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-900 border-2 border-purple-400 rounded-full flex items-center justify-center">
                    <span className="text-purple-300 text-[9px] font-bold">
                      {character.level}
                    </span>
                  </div>
                </div>

                {/* Name & Class */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm truncate group-hover:text-purple-300 transition-colors">
                    {character.name}
                  </h3>
                  <p className="text-gray-400 text-xs capitalize">
                    {character.class}
                  </p>
                </div>

                {/* Rarity Badge */}
                <div
                  className={`shrink-0 px-2 py-1 rounded text-[9px] font-bold ${
                    character.rarity === "legendary"
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
                      : character.rarity === "epic"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : character.rarity === "rare"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                      : "bg-gray-600 text-white"
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

              {/* Stats - Compact */}
              <div className="grid grid-cols-4 gap-1 text-center">
                <div className="bg-slate-900/50 rounded px-1 py-1">
                  <div className="text-red-400 font-bold text-xs">
                    {character.stats.maxHp}
                  </div>
                  <div className="text-gray-500 text-[9px]">HP</div>
                </div>
                <div className="bg-slate-900/50 rounded px-1 py-1">
                  <div className="text-cyan-400 font-bold text-xs">
                    {character.stats.maxMp}
                  </div>
                  <div className="text-gray-500 text-[9px]">MP</div>
                </div>
                <div className="bg-slate-900/50 rounded px-1 py-1">
                  <div className="text-orange-400 font-bold text-xs">
                    {character.stats.atk}
                  </div>
                  <div className="text-gray-500 text-[9px]">ATK</div>
                </div>
                <div className="bg-slate-900/50 rounded px-1 py-1">
                  <div className="text-blue-400 font-bold text-xs">
                    {character.stats.def}
                  </div>
                  <div className="text-gray-500 text-[9px]">DEF</div>
                </div>
              </div>

              {/* Hover Indicator */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-400 rounded-lg pointer-events-none transition-all" />
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-gray-400 text-lg mb-2">ไม่มีตัวละครที่สามารถเลือกได้</p>
          <p className="text-gray-500 text-sm">
            ตัวละครทั้งหมดอยู่ในทีมแล้ว หรือยังไม่ได้รีครูท
          </p>
        </div>
      )}

      {/* Footer Actions */}
      <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
        <p className="text-xs text-gray-500">
          คลิกตัวละครเพื่อเพิ่มเข้า Slot {position + 1}
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
        >
          ยกเลิก
        </button>
      </div>
    </Modal>
  );
}
