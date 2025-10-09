import { Character } from "@/src/domain/types/character.types";
import { PartyMemberMarker } from "./PartyMemberMarker";
import { PartyEmptySlot } from "./PartyEmptySlot";
import { Users } from "lucide-react";

interface PartyMember {
  character: Character;
  position: number;
  isLeader: boolean;
}

interface PartyFormationViewProps {
  members: PartyMember[];
  onSlotClick: (position: number) => void;
  onMemberClick: (characterId: string) => void;
  zoom: number;
  setZoom: (value: number | ((prev: number) => number)) => void;
  pan: { x: number; y: number };
  isDragging: boolean;
  onWheel: (e: React.WheelEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onResetView: () => void;
}

// Formation positions (percentage-based)
const FORMATION_POSITIONS = [
  { x: 35, y: 65 }, // Position 0 - Front Left
  { x: 65, y: 65 }, // Position 1 - Front Right
  { x: 35, y: 35 }, // Position 2 - Back Left
  { x: 65, y: 35 }, // Position 3 - Back Right
];

export function PartyFormationView({
  members,
  onSlotClick,
  onMemberClick,
  zoom,
  setZoom,
  pan,
  isDragging,
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onResetView,
}: PartyFormationViewProps) {
  return (
    <>
      {/* Map Container */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-auto"
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{ cursor: isDragging ? "grabbing" : "grab", zIndex: 0 }}
      >
        {/* Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Formation Lines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Front Line */}
            <div
              className="absolute w-full h-0.5 bg-purple-500/20"
              style={{ top: "65%" }}
            >
              <div className="absolute -top-6 left-4 text-purple-400 text-sm font-semibold">
                FRONT ROW
              </div>
            </div>
            {/* Back Line */}
            <div
              className="absolute w-full h-0.5 bg-purple-500/20"
              style={{ top: "35%" }}
            >
              <div className="absolute -top-6 left-4 text-purple-400 text-sm font-semibold">
                BACK ROW
              </div>
            </div>
          </div>

          {/* Radial Glow */}
          <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent" />
        </div>

        {/* Party Formation - with Pan & Zoom transform */}
        <div
          className="absolute inset-0 transition-transform"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          {/* Empty State */}
          {members.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center pointer-events-auto">
                <Users className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  ทีมของคุณว่างเปล่า
                </h3>
                <p className="text-gray-400 text-lg mb-4">
                  คลิกที่ช่องว่างเพื่อเพิ่มสมาชิกเข้าทีม
                </p>
                <p className="text-gray-500 text-sm">
                  (สูงสุด 4 คน - 2 แถวหน้า, 2 แถวหลัง)
                </p>
              </div>
            </div>
          )}

          {/* Party Slots - 4 positions */}
          {FORMATION_POSITIONS.map((pos, index) => {
            const member = members.find((m) => m.position === index);

            if (member) {
              // Show party member
              return (
                <PartyMemberMarker
                  key={`member-${index}`}
                  character={member.character}
                  position={index}
                  isLeader={member.isLeader}
                  onClick={() => onMemberClick(member.character.id)}
                  x={pos.x}
                  y={pos.y}
                />
              );
            } else {
              // Show empty slot
              return (
                <PartyEmptySlot
                  key={`empty-${index}`}
                  position={index}
                  onClick={() => onSlotClick(index)}
                  x={pos.x}
                  y={pos.y}
                />
              );
            }
          })}
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-auto z-40">
          <button
            onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.2))}
            className="px-3 py-2 bg-slate-900/80 hover:bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg transition-colors text-white text-sm"
          >
            −
          </button>
          <button
            onClick={onResetView}
            className="px-4 py-2 bg-slate-900/80 hover:bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg transition-colors text-white text-sm"
          >
            ⛶ รีเซ็ต
          </button>
          <button
            onClick={() => setZoom((prev) => Math.min(3, prev + 0.2))}
            className="px-3 py-2 bg-slate-900/80 hover:bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg transition-colors text-white text-sm"
          >
            +
          </button>
        </div>

        {/* Formation Info */}
        <div className="absolute bottom-4 right-4 pointer-events-auto">
          <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg">
            <div className="text-xs text-gray-400">
              <span className="text-purple-400 font-semibold">{members.length}/4</span> สมาชิก
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
