import { Plus } from "lucide-react";

interface PartyEmptySlotProps {
  position: number; // 0-3
  onClick: () => void;
  x: number;
  y: number;
}

export function PartyEmptySlot({ position, onClick, x, y }: PartyEmptySlotProps) {
  return (
    <button
      onClick={onClick}
      className="absolute group transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-full blur-xl transition-all bg-slate-600/20 w-24 h-24 sm:w-28 md:w-32 sm:h-28 md:h-32 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 group-hover:bg-purple-500/30" />

      {/* Empty Slot */}
      <div className="relative">
        <div className="relative w-24 h-24 sm:w-28 md:w-32 sm:h-28 md:h-32 rounded-full flex flex-col items-center justify-center transition-all border-4 border-dashed border-slate-600 bg-slate-800/50 group-hover:border-purple-500 group-hover:bg-purple-900/30 group-hover:scale-110">
          <Plus className="w-12 h-12 sm:w-14 md:w-16 sm:h-14 md:h-16 text-slate-600 group-hover:text-purple-400 transition-colors" />
          
          {/* Position Number */}
          <div className="absolute top-2 left-2 w-6 h-6 sm:w-7 md:w-8 sm:h-7 md:h-8 bg-slate-900/90 border-2 border-slate-600 rounded-full flex items-center justify-center group-hover:border-purple-500">
            <span className="text-slate-400 text-xs sm:text-sm font-bold group-hover:text-purple-300">
              {position + 1}
            </span>
          </div>
        </div>
      </div>

      {/* Label - Below */}
      <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <div className="px-4 py-2 rounded-lg text-sm font-semibold shadow-lg transition-all bg-slate-800/70 text-gray-400 group-hover:bg-purple-600/70 group-hover:text-white">
          เลือกตัวละคร
        </div>
      </div>

      {/* Hint - On Hover */}
      <div className="absolute top-full mt-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        <div className="px-3 py-2 bg-slate-900/95 border border-purple-500/50 rounded-lg shadow-xl">
          <p className="text-xs text-gray-300 whitespace-nowrap">
            คลิกเพื่อเลือกตัวละครสำหรับ Slot {position + 1}
          </p>
        </div>
      </div>
    </button>
  );
}
