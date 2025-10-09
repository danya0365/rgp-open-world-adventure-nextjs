"use client";

import { LocationConnection } from "@/src/domain/types/location.types";

interface ConnectionMarkerProps {
  connection: LocationConnection;
  x: number; // Tile position
  y: number; // Tile position
  gridSize: number;
  onClick: () => void;
  isDiscovered?: boolean;
}

export function ConnectionMarker({
  connection,
  x,
  y,
  gridSize,
  onClick,
  isDiscovered = true,
}: ConnectionMarkerProps) {
  // Connection type icons and colors (must be before any early returns)
  const getConnectionStyle = () => {
    switch (connection.connectionType) {
      case "portal":
        return {
          icon: "🌀",
          bg: "bg-purple-600",
          border: "border-purple-400",
          glow: "shadow-purple-500/50",
        };
      case "gate":
        return {
          icon: "🚪",
          bg: "bg-blue-600",
          border: "border-blue-400",
          glow: "shadow-blue-500/50",
        };
      case "entrance":
        return {
          icon: "🏛️",
          bg: "bg-green-600",
          border: "border-green-400",
          glow: "shadow-green-500/50",
        };
      case "stairs":
        return {
          icon: "🪜",
          bg: "bg-yellow-600",
          border: "border-yellow-400",
          glow: "shadow-yellow-500/50",
        };
      case "bridge":
        return {
          icon: "🌉",
          bg: "bg-orange-600",
          border: "border-orange-400",
          glow: "shadow-orange-500/50",
        };
      default:
        return {
          icon: "📍",
          bg: "bg-gray-600",
          border: "border-gray-400",
          glow: "shadow-gray-500/50",
        };
    }
  };

  const style = getConnectionStyle();

  // Render undiscovered state
  if (!isDiscovered) {
    return (
      <div
        className="absolute flex items-center justify-center cursor-not-allowed opacity-30"
        style={{
          left: `${x * gridSize}px`,
          top: `${y * gridSize}px`,
          width: `${gridSize}px`,
          height: `${gridSize}px`,
        }}
      >
        <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
          <span className="text-lg">❓</span>
        </div>
      </div>
    );
  }

  // Render discovered state
  return (
    <div
      className="absolute flex items-center justify-center cursor-pointer group pointer-events-auto"
      style={{
        left: `${x * gridSize}px`,
        top: `${y * gridSize}px`,
        width: `${gridSize}px`,
        height: `${gridSize}px`,
        zIndex: 100,
      }}
      onClick={onClick}
      title={`${connection.connectionType} - Click to enter`}
    >
      {/* Debug border */}
      <div className="absolute inset-0 border-4 border-red-500 bg-red-500/20" />
      
      {/* Pulsing ring */}
      <div className={`absolute w-12 h-12 rounded-full ${style.bg} opacity-20 animate-ping`} />
      
      {/* Main marker */}
      <div
        className={`
          relative w-10 h-10 rounded-full ${style.bg} border-3 ${style.border}
          flex items-center justify-center
          shadow-lg ${style.glow}
          transform transition-all duration-200
          group-hover:scale-125 group-hover:rotate-12
          animate-bounce
        `}
      >
        <span className="text-2xl drop-shadow-lg">{style.icon}</span>
      </div>

      {/* Hover tooltip */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded px-2 py-1 whitespace-nowrap text-xs text-white shadow-xl">
          <div className="font-bold capitalize">{connection.connectionType}</div>
          <div className="text-gray-400 text-[10px]">Click to enter</div>
        </div>
      </div>

      {/* Locked indicator */}
      {connection.isLocked && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-[10px]">🔒</span>
        </div>
      )}
    </div>
  );
}
