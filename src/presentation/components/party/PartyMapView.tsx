import { Character } from "@/src/domain/types/character.types";
import { PartyCharacterMarker } from "./PartyCharacterMarker";
import { Users } from "lucide-react";

interface PartyMapViewProps {
  characters: (Character & { x: number; y: number })[];
  onCharacterClick: (character: Character) => void;
  zoom: number;
  setZoom: (value: number | ((prev: number) => number)) => void;
  pan: { x: number; y: number };
  isDragging: boolean;
  onWheel: (e: React.WheelEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onResetView: () => void;
  hasMembers: boolean;
}

export function PartyMapView({
  characters,
  onCharacterClick,
  zoom,
  setZoom,
  pan,
  isDragging,
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onResetView,
  hasMembers,
}: PartyMapViewProps) {
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
          {/* Radial Glow */}
          <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent" />
        </div>

        {/* Character Markers */}
        <div
          className="absolute inset-0 transition-transform"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          {/* Empty State */}
          {characters.length === 0 && !hasMembers && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center pointer-events-auto">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">ยังไม่มีตัวละครในทีม</p>
                <p className="text-gray-500 text-sm mt-2">
                  คลิกช่องว่างในพาร์ตี้เพื่อเลือกตัวละคร
                </p>
              </div>
            </div>
          )}

          {/* Available Characters */}
          {characters.map((character) => (
            <PartyCharacterMarker
              key={character.id}
              character={character}
              onClick={onCharacterClick}
            />
          ))}
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
      </div>
    </>
  );
}
