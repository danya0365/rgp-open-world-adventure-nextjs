import { Character } from "@/src/domain/types/character.types";
import { Plus } from "lucide-react";

interface PartyMember {
  character: Character;
  position: number;
  isLeader: boolean;
}

interface PartySlotsProps {
  members: PartyMember[];
  onSlotClick: (position: number) => void;
  onRemove: (characterId: string) => void;
}

export function PartySlots({ members, onSlotClick, onRemove }: PartySlotsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[0, 1, 2, 3].map((position) => {
        const member = members.find((m) => m.position === position);
        return (
          <button
            key={position}
            onClick={() => {
              if (member) {
                if (confirm(`ลบ ${member.character.name} ออกจากทีม?`)) {
                  onRemove(member.character.id);
                }
              } else {
                onSlotClick(position);
              }
            }}
            className={`relative p-3 rounded-lg border-2 transition-all ${
              member
                ? "bg-purple-900/30 border-purple-500/50 hover:border-purple-400"
                : "bg-slate-800/50 border-slate-600 hover:border-purple-500 border-dashed"
            }`}
          >
            {member ? (
              <>
                {/* Character in slot */}
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                    {member.character.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-white text-sm font-semibold truncate">
                      {member.character.name}
                    </div>
                    <div className="text-gray-400 text-xs">
                      Lv.{member.character.level}
                    </div>
                  </div>
                </div>
                {member.isLeader && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-[10px]">
                    ★
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-2">
                <Plus className="w-6 h-6 text-gray-500 mb-1" />
                <span className="text-gray-500 text-xs">Slot {position + 1}</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
