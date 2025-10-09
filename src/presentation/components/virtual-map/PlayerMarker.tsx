import { User } from "lucide-react";

interface PlayerMarkerProps {
  x: number;
  y: number;
  facing: "north" | "south" | "east" | "west";
  gridSize?: number;
}

const FACING_ROTATION = {
  north: 0,
  east: 90,
  south: 180,
  west: 270,
};

export function PlayerMarker({ x, y, facing, gridSize = 40 }: PlayerMarkerProps) {
  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{
        left: `${x * gridSize}px`,
        top: `${y * gridSize}px`,
        width: `${gridSize}px`,
        height: `${gridSize}px`,
      }}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-lg animate-pulse" />
      
      {/* Player Circle */}
      <div className="absolute inset-1 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
        <User 
          className="text-white" 
          size={gridSize * 0.5}
          style={{
            transform: `rotate(${FACING_ROTATION[facing]}deg)`,
            transition: "transform 0.3s ease",
          }}
        />
      </div>
      
      {/* Direction Indicator */}
      <div
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full shadow-lg animate-bounce"
        style={{
          transform: `translateX(-50%) rotate(${FACING_ROTATION[facing]}deg) translateY(-${gridSize * 0.3}px)`,
        }}
      />
    </div>
  );
}
