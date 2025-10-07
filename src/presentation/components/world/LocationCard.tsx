import { Location } from "@/src/domain/types/location.types";
import { MapPin, Lock, ChevronRight } from "lucide-react";
import Link from "next/link";

interface LocationCardProps {
  location: Location;
  currentPath?: string; // Current URL path for building next URL
  isDiscovered?: boolean;
}

const locationTypeColors: Record<string, string> = {
  world: "from-purple-600 to-pink-600",
  continent: "from-blue-600 to-cyan-600",
  region: "from-green-600 to-emerald-600",
  area: "from-yellow-600 to-orange-600",
  city: "from-red-600 to-rose-600",
  building: "from-indigo-600 to-purple-600",
  floor: "from-slate-600 to-gray-600",
  room: "from-amber-600 to-yellow-600",
};

const locationTypeIcons: Record<string, string> = {
  world: "🌍",
  continent: "🗺️",
  region: "🏞️",
  area: "🌲",
  city: "🏰",
  building: "🏛️",
  floor: "📍",
  room: "🚪",
};

export function LocationCard({ location, currentPath = "/world", isDiscovered = true }: LocationCardProps) {
  const gradientClass = locationTypeColors[location.type] || "from-gray-600 to-slate-600";
  const icon = locationTypeIcons[location.type] || "📍";
  
  // Build next URL: /world/[id] or /world/[parentId]/[id]
  const nextUrl = `${currentPath}/${location.id}`;

  if (!isDiscovered) {
    return (
      <div
        className="relative group rounded-xl overflow-hidden cursor-not-allowed opacity-60 transition-all duration-300"
      >
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-20`} />
        
        {/* Border */}
        <div className="absolute inset-0 border-2 border-white/10 rounded-xl" />

        {/* Content */}
        <div className="relative p-6 bg-slate-900/80 backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{icon}</div>
              <div>
                <h3 className="text-xl font-bold text-white">{location.name}</h3>
                <p className="text-sm text-gray-400 capitalize">{location.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Lock className="w-4 h-4" />
              <span className="text-xs">Locked</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>Level {location.level}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={nextUrl}
      className="block relative group rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-20`} />
      
      {/* Border */}
      <div className="absolute inset-0 border-2 border-white/10 rounded-xl" />

      {/* Content */}
      <div className="relative p-6 bg-slate-900/80 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{icon}</div>
            <div>
              <h3 className="text-xl font-bold text-white">{location.name}</h3>
              <p className="text-sm text-gray-400 capitalize">{location.type}</p>
            </div>
          </div>

          {!isDiscovered && (
            <div className="flex items-center gap-1 text-gray-400">
              <Lock className="w-4 h-4" />
              <span className="text-xs">Locked</span>
            </div>
          )}
        </div>

        {/* Description */}
        {isDiscovered && (
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
            {location.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>Level {location.level}</span>
          </div>

          {isDiscovered && (
            <div className="flex items-center gap-1 text-purple-400 group-hover:text-purple-300 transition-colors">
              <span className="text-sm font-semibold">สำรวจ</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Hover Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`} />
      </div>
    </Link>
  );
}
