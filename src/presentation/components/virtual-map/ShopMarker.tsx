import { ShopMarker as ShopMarkerType } from "@/src/domain/types/location.types";
import { ShoppingBag, Sword, Shield, Sparkles, Droplet } from "lucide-react";
import { getPOIPixelSize } from "@/src/utils/poiGridUtils";

interface ShopMarkerProps {
  shop: ShopMarkerType;
  gridSize: number;
  viewportOffsetX: number;
  viewportOffsetY: number;
  isPlayerNearby?: boolean;
}

// Shop type icons
const SHOP_ICONS = {
  weapons: Sword,
  armor: Shield,
  items: ShoppingBag,
  magic: Sparkles,
  potions: Droplet,
  general: ShoppingBag,
};

// Shop type colors
const SHOP_COLORS = {
  weapons: "bg-red-500 border-red-300",
  armor: "bg-gray-500 border-gray-300",
  items: "bg-green-500 border-green-300",
  magic: "bg-purple-500 border-purple-300",
  potions: "bg-blue-500 border-blue-300",
  general: "bg-orange-500 border-orange-300",
};

export function ShopMarker({
  shop,
  gridSize,
  viewportOffsetX,
  viewportOffsetY,
  isPlayerNearby = false,
}: ShopMarkerProps) {
  // Calculate position relative to viewport
  const x = (shop.tileCoordinate.x - viewportOffsetX) * gridSize;
  const y = (shop.tileCoordinate.y - viewportOffsetY) * gridSize;

  const shopType = shop.shopType || "general";
  const Icon = SHOP_ICONS[shopType];
  const colorClass = SHOP_COLORS[shopType];

  // Get POI size in pixels based on grid size
  const { width, height } = getPOIPixelSize(shop.gridSize, gridSize);
  
  // Determine if POI is 1x1 (use circle) or larger (use rounded rectangle)
  const is1x1 = (!shop.gridSize || (shop.gridSize.width === 1 && shop.gridSize.height === 1));
  const shapeClass = is1x1 ? "rounded-full" : "rounded-lg";

  return (
    <div
      className="absolute pointer-events-none group"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: 50,
      }}
      title={shop.name || "Shop"}
    >
      {/* Shop Marker */}
      <div
        className={`w-full h-full ${shapeClass} flex items-center justify-center transition-all ${colorClass} border-4 group-hover:scale-110 group-hover:shadow-lg`}
      >
        <Icon className="w-1/2 h-1/2 text-white" />
      </div>

      {/* Shop Icon Badge */}
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center">
        <ShoppingBag className="w-2.5 h-2.5 text-gray-700" />
      </div>

      {/* Name Label (always show) */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap">
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded shadow-lg">
          {shop.name || "Shop"}
          <div className="text-[10px] text-gray-300 capitalize">
            {shopType}
          </div>
        </div>
      </div>

      {/* Interaction Indicator (when player is nearby) */}
      {isPlayerNearby && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap animate-bounce">
          <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-lg font-bold">
            Press SPACE to enter
          </div>
        </div>
      )}
    </div>
  );
}
