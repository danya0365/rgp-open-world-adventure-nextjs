import { Location } from "@/src/domain/types/location.types";
import { MapPin, Building2, Castle, Home, Mountain, Trees, Lock } from "lucide-react";

interface LocationMarkerProps {
  location: Location;
  onClick: () => void;
  isDiscovered: boolean;
  isCurrentLocation: boolean;
}

const LOCATION_ICONS = {
  world: MapPin,
  continent: Mountain,
  region: Trees,
  area: MapPin,
  city: Building2,
  town: Home,
  village: Home,
  building: Building2,
  castle: Castle,
  dungeon: Castle,
  tower: Building2,
  temple: Castle,
  floor: Building2,
  room: Home,
  field: MapPin,
  forest: Trees,
  mountain: Mountain,
  cave: Mountain,
};

const LOCATION_COLORS = {
  world: "from-purple-500 to-pink-500",
  continent: "from-indigo-500 to-blue-500",
  region: "from-green-500 to-emerald-500",
  area: "from-cyan-500 to-teal-500",
  city: "from-orange-500 to-red-500",
  town: "from-amber-500 to-orange-500",
  village: "from-yellow-500 to-amber-500",
  building: "from-gray-500 to-slate-500",
  castle: "from-purple-600 to-indigo-600",
  dungeon: "from-red-600 to-rose-600",
  tower: "from-indigo-600 to-purple-600",
  temple: "from-yellow-600 to-orange-600",
  floor: "from-slate-500 to-gray-500",
  room: "from-gray-400 to-slate-400",
  field: "from-green-400 to-lime-400",
  forest: "from-green-600 to-emerald-600",
  mountain: "from-gray-600 to-slate-600",
  cave: "from-stone-600 to-gray-700",
};

export function LocationMarker({
  location,
  onClick,
  isDiscovered,
  isCurrentLocation,
}: LocationMarkerProps) {
  const Icon = LOCATION_ICONS[location.type] || MapPin;
  const colorClass = LOCATION_COLORS[location.type] || "from-gray-500 to-slate-500";
  
  // Check if location is locked
  const isLocked = location.requiredLevel || location.requiredQuestId;

  if (!isDiscovered && isLocked) {
    // Show as locked/unknown
    return (
      <button
        onClick={onClick}
        disabled
        className="absolute transform -translate-x-1/2 -translate-y-1/2 opacity-40 cursor-not-allowed"
        style={{
          left: `${location.coordinates?.x || 0}px`,
          top: `${location.coordinates?.y || 0}px`,
        }}
      >
        <div className="w-8 h-8 sm:w-10 md:w-12 sm:h-10 md:h-12 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
          <Lock className="w-4 h-4 sm:w-5 md:w-6 sm:h-5 md:h-6 text-gray-500" />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`absolute group transform -translate-x-1/2 -translate-y-1/2 ${
        isCurrentLocation ? "z-40" : "z-30"
      }`}
      style={{
        left: `${location.coordinates?.x || 0}px`,
        top: `${location.coordinates?.y || 0}px`,
      }}
    >
      {/* Glow Effect */}
      <div
        className={`absolute inset-0 rounded-full blur-lg transition-all ${
          isCurrentLocation
            ? "w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-24 bg-blue-400/50 animate-pulse"
            : "w-12 h-12 sm:w-14 md:w-16 sm:h-14 md:h-16 bg-purple-400/30 group-hover:bg-purple-400/50"
        } -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2`}
      />

      {/* Location Circle */}
      <div
        className={`relative w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 rounded-full flex items-center justify-center transition-all border-3 ${
          isCurrentLocation
            ? `bg-gradient-to-br ${colorClass} border-white scale-125 shadow-xl`
            : `bg-gradient-to-br ${colorClass} border-purple-400 group-hover:scale-110 group-hover:border-purple-300`
        }`}
      >
        <Icon className="w-5 h-5 sm:w-6 md:w-7 sm:h-6 md:h-7 text-white" />
      </div>

      {/* Location Name */}
      <div className="absolute top-full mt-1 sm:mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className={`px-2 py-1 rounded text-xs font-semibold shadow-lg ${
          isCurrentLocation
            ? "bg-blue-500/90 text-white"
            : "bg-slate-800/90 text-gray-200"
        }`}>
          {location.name}
        </div>
      </div>

      {/* Level Requirement */}
      {location.requiredLevel && (
        <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-slate-900 border border-purple-400 rounded text-[8px] sm:text-[9px] font-bold text-purple-300">
          Lv.{location.requiredLevel}
        </div>
      )}

      {/* Fast Travel Icon */}
      {location.isFastTravelPoint && isDiscovered && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
          <span className="text-white text-[8px]">⚡</span>
        </div>
      )}
    </button>
  );
}
