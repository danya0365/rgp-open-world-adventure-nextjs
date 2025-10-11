"use client";

import { getLocationById } from "@/src/data/master/locations.master";
import { LocationConnection } from "@/src/domain/types/location.types";
import { getPOIPixelSize } from "@/src/utils/poiGridUtils";

interface ConnectionMarkerProps {
  connection: LocationConnection;
  x: number; // Tile position
  y: number; // Tile position
  gridSize: number;
  onClick: () => void;
  isDiscovered?: boolean;
}

// Location type icons mapping
const locationTypeIcons: Record<string, string> = {
  world: "🌍",
  continent: "🗺️",
  region: "🏞️",
  area: "🗾",
  city: "🏙️",
  town: "🏘️",
  village: "🏡",
  building: "🏢",
  floor: "🏢",
  room: "🛋️",
  dungeon: "🏰",
  field: "🌾",
  forest: "🌲",
  mountain: "⛰️",
  cave: "🕳️",
  castle: "🏰",
  temple: "🛕",
  tower: "🗼",
};

export function ConnectionMarker({
  connection,
  x,
  y,
  gridSize,
  onClick,
  isDiscovered = true,
}: ConnectionMarkerProps) {
  // Get connection marker size in pixels
  const { width, height } = getPOIPixelSize(connection.from.gridSize, gridSize);

  // Get the target location for the connection
  const targetLocation = getLocationById(connection.to.locationId);
  const fromLocation = getLocationById(connection.from.locationId);
  const isFromParent = targetLocation?.parentId === fromLocation?.id;
  const locationTypeIcon = targetLocation
    ? locationTypeIcons[targetLocation.type] || "📍"
    : "📍";
  const isNotShowLocationIcon =
    targetLocation?.type === "floor" || targetLocation?.type === "room";

  // Determine if connection is 1x1 (use circle) or larger (use rounded rectangle)
  const is1x1 =
    !connection.from.gridSize ||
    (connection.from.gridSize.width === 1 &&
      connection.from.gridSize.height === 1);
  const shapeClass = is1x1 ? "rounded-full" : "rounded-xl";

  // Connection type icons and colors
  const getConnectionStyle = () => {
    switch (connection.connectionType) {
      case "portal":
        return {
          bg: "bg-purple-600",
          border: "border-purple-400",
          glow: "shadow-purple-500/50",
        };
      case "gate":
        return {
          bg: "bg-blue-600",
          border: "border-blue-400",
          glow: "shadow-blue-500/50",
        };
      case "entrance":
        return {
          bg: "bg-green-600",
          border: "border-green-400",
          glow: "shadow-green-500/50",
        };
      case "stairs":
        return {
          bg: "bg-yellow-600",
          border: "border-yellow-400",
          glow: "shadow-yellow-500/50",
        };
      case "bridge":
        return {
          bg: "bg-orange-600",
          border: "border-orange-400",
          glow: "shadow-orange-500/50",
        };
      case "door":
        return {
          bg: "bg-gray-600",
          border: "border-gray-400",
          glow: "shadow-gray-500/50",
        };
      default:
        return {
          bg: "bg-gray-600",
          border: "border-gray-400",
          glow: "shadow-gray-500/50",
        };
    }
  };

  const getConnectionIcon = () => {
    switch (connection.connectionType) {
      case "portal":
        return "🌀";
      case "gate":
        return "🚪";
      case "entrance":
        return "🚪";
      case "stairs":
        return "🪜";
      case "bridge":
        return "🌉";
      case "door":
        return "🚪";
      default:
        return "📍";
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
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <div
          className={`w-full h-full ${shapeClass} bg-gray-700 border-4 border-gray-600 flex items-center justify-center`}
        >
          <span className="text-2xl">❓</span>
        </div>
        {targetLocation && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs">
            {locationTypeIcon}
          </div>
        )}
      </div>
    );
  }

  // Render discovered state
  return (
    <div
      className="absolute flex items-center justify-center group"
      style={{
        left: `${x * gridSize}px`,
        top: `${y * gridSize}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: 100,
      }}
      onClick={() => {
        console.log("🎯 ConnectionMarker clicked!", {
          connectionId: connection.id,
          from: connection.from.locationId,
          to: connection.to.locationId,
          type: connection.connectionType,
        });
        onClick();
      }}
      title={`${connection.connectionType} - Click to enter`}
    >
      {/* Pulsing ring */}
      <div
        className={`absolute inset-0 ${shapeClass} ${style.bg} opacity-20 animate-ping`}
      />

      {/* Main marker */}
      <div
        className={`
          relative w-full h-full ${shapeClass} ${style.bg} border-4 ${style.border}
          flex items-center justify-center
          shadow-lg ${style.glow}
          transform transition-all duration-200
          group-hover:scale-110
        `}
      >
        {isFromParent ? (
          <>
            {isNotShowLocationIcon ? (
              <span className="text-3xl drop-shadow-lg">
                {getConnectionIcon()}
              </span>
            ) : (
              <>
                <span className="text-3xl drop-shadow-lg">
                  {locationTypeIcon}
                </span>

                {/* Location type icon overlay */}
                {targetLocation && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs">
                    {getConnectionIcon()}
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <span className="text-3xl drop-shadow-lg">{getConnectionIcon()}</span>
        )}
      </div>

      {/* Hover tooltip */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded px-2 py-1 whitespace-nowrap text-xs text-white shadow-xl">
          <div className="font-bold capitalize">
            {connection.connectionType}
          </div>
          <div className="text-gray-400 text-[10px]">
            {targetLocation ? `To: ${targetLocation.name}` : "Unknown location"}
          </div>
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
