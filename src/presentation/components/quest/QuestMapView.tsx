import { Quest } from "@/src/domain/types/quest.types";
import { QuestMarker } from "./QuestMarker";
import { Scroll } from "lucide-react";

interface QuestWithPosition extends Quest {
  x: number;
  y: number;
}

interface QuestMapViewProps {
  quests: QuestWithPosition[];
  onQuestClick: (quest: Quest) => void;
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

export function QuestMapView({
  quests,
  onQuestClick,
  zoom,
  setZoom,
  pan,
  isDragging,
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onResetView,
}: QuestMapViewProps) {
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
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900">
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Quest Path Lines (decorative) */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="questPath" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              {/* Example quest path - you can generate these dynamically */}
              <path
                d="M 10,50 Q 30,20 50,50 T 90,50"
                stroke="url(#questPath)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
              />
            </svg>
          </div>

          {/* Radial Glow */}
          <div className="absolute inset-0 bg-gradient-radial from-indigo-600/10 via-transparent to-transparent" />
        </div>

        {/* Quest Markers */}
        <div
          className="absolute inset-0 transition-transform"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          {/* Empty State */}
          {quests.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center pointer-events-auto">
                <Scroll className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  No Quests Found
                </h3>
                <p className="text-gray-400 text-lg">
                  Try adjusting your filters
                </p>
              </div>
            </div>
          )}

          {/* Quest Markers */}
          {quests.map((quest) => (
            <QuestMarker
              key={quest.id}
              quest={quest}
              onClick={() => onQuestClick(quest)}
              x={quest.x}
              y={quest.y}
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

        {/* Quest Count Badge */}
        <div className="absolute bottom-4 right-4 pointer-events-auto">
          <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg">
            <div className="text-xs text-gray-400">
              <span className="text-purple-400 font-semibold">{quests.length}</span> quest{quests.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
