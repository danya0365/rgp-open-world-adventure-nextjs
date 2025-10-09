import { NPCMarker as NPCMarkerType } from "@/src/domain/types/location.types";
import { User, MessageCircle } from "lucide-react";

interface NPCMarkerProps {
  npc: NPCMarkerType;
  gridSize: number;
  viewportOffsetX: number;
  viewportOffsetY: number;
  isPlayerNearby?: boolean;
}

export function NPCMarker({
  npc,
  gridSize,
  viewportOffsetX,
  viewportOffsetY,
  isPlayerNearby = false,
}: NPCMarkerProps) {
  // Calculate position relative to viewport
  const x = (npc.coordinates.x - viewportOffsetX) * gridSize;
  const y = (npc.coordinates.y - viewportOffsetY) * gridSize;

  return (
    <div
      className="absolute pointer-events-none group"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${gridSize}px`,
        height: `${gridSize}px`,
        zIndex: 50,
      }}
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

      {/* Name Label (always show) */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap">
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded shadow-lg">
          {npc.name || "NPC"}
          {npc.hasQuest && (
            <MessageCircle className="inline-block w-3 h-3 ml-1 text-yellow-400" />
          )}
        </div>
      </div>

      {/* Interaction Indicator (when player is nearby) */}
      {isPlayerNearby && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap animate-bounce">
          <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-lg font-bold">
            Press SPACE to talk
          </div>
        </div>
      )}
    </div>
  );
}
