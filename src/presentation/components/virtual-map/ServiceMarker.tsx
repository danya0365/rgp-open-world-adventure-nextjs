import { ServiceMarker as ServiceMarkerType } from "@/src/domain/types/location.types";
import { Hotel, Users, Landmark, Church, Hammer, ScrollText, Shield, Target } from "lucide-react";

interface ServiceMarkerProps {
  service: ServiceMarkerType;
  gridSize: number;
  viewportOffsetX: number;
  viewportOffsetY: number;
  isPlayerNearby?: boolean;
}

// Service type icons
const SERVICE_ICONS = {
  inn: Hotel,
  guild: Users,
  bank: Landmark,
  temple: Church,
  blacksmith: Hammer,
  "quest-board": ScrollText,
  "party-formation": Shield,
  bounties: Target,
};

// Service type colors
const SERVICE_COLORS = {
  inn: "bg-amber-600 border-amber-400",
  guild: "bg-indigo-600 border-indigo-400",
  bank: "bg-yellow-600 border-yellow-400",
  temple: "bg-cyan-600 border-cyan-400",
  blacksmith: "bg-gray-700 border-gray-500",
  "quest-board": "bg-orange-600 border-orange-400",
  "party-formation": "bg-blue-600 border-blue-400",
  bounties: "bg-red-600 border-red-400",
};

export function ServiceMarker({
  service,
  gridSize,
  viewportOffsetX,
  viewportOffsetY,
  isPlayerNearby = false,
}: ServiceMarkerProps) {
  // Calculate position relative to viewport
  const x = (service.coordinates.x - viewportOffsetX) * gridSize;
  const y = (service.coordinates.y - viewportOffsetY) * gridSize;

  const Icon = SERVICE_ICONS[service.serviceType];
  const colorClass = SERVICE_COLORS[service.serviceType];

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
      title={service.name || service.serviceType}
    >
      {/* Service Circle */}
      <div
        className={`w-full h-full rounded-full flex items-center justify-center transition-all ${colorClass} border-4 group-hover:scale-110 group-hover:shadow-lg`}
      >
        <Icon className="w-1/2 h-1/2 text-white" />
      </div>

      {/* Service Type Badge */}
      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center">
        <span className="text-[8px] font-bold text-gray-700">S</span>
      </div>

      {/* Name Label (always show) */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap">
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded shadow-lg">
          {service.name || service.serviceType}
          <div className="text-[10px] text-gray-300 capitalize">
            {service.serviceType.replace("-", " ")}
          </div>
        </div>
      </div>

      {/* Interaction Indicator (when player is nearby) */}
      {isPlayerNearby && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap animate-bounce">
          <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-lg font-bold">
            Press SPACE to use
          </div>
        </div>
      )}
    </div>
  );
}
