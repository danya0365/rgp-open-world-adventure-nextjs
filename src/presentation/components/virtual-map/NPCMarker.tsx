import { NPCMarker as NPCMarkerType } from "@/src/domain/types/location.types";
import { User, MessageCircle } from "lucide-react";

interface NPCMarkerProps {
  npc: NPCMarkerType;
  gridSize: number;
  viewportOffsetX: number;
  viewportOffsetY: number;
  onClick?: (npc: NPCMarkerType) => void;
}

export function NPCMarker({
  npc,
  gridSize,
  viewportOffsetX,
  viewportOffsetY,
  onClick,
}: NPCMarkerProps) {
  // Calculate position relative to viewport
  const x = (npc.coordinates.x - viewportOffsetX) * gridSize;
  const y = (npc.coordinates.y - viewportOffsetY) * gridSize;

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
      onClick={() => onClick?.(npc)}
      title={npc.name || "NPC"}
    >
      {/* NPC Circle */}
      <div
        className={`w-full h-full rounded-full flex items-center justify-center transition-all ${
          npc.hasQuest
            ? "bg-yellow-500 border-4 border-yellow-300 animate-pulse"
            : "bg-blue-500 border-4 border-blue-300"
        } group-hover:scale-110 group-hover:shadow-lg`}
      >
        <User className="w-1/2 h-1/2 text-white" />
      </div>

      {/* Quest Indicator */}
      {npc.hasQuest && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-[8px] font-bold text-white">!</span>
        </div>
      )}

      {/* Name Label (on hover) */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded shadow-lg">
          {npc.name || "NPC"}
          {npc.hasQuest && (
            <MessageCircle className="inline-block w-3 h-3 ml-1 text-yellow-400" />
          )}
        </div>
      </div>
    </div>
  );
}
