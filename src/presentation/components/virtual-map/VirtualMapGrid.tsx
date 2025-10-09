import { Location } from "@/src/domain/types/location.types";
import { PlayerMarker } from "./PlayerMarker";
import { LocationMarker } from "./LocationMarker";
import { useVirtualMapStore } from "@/src/stores/virtualMapStore";

interface VirtualMapGridProps {
  currentLocation: Location;
  childLocations: Location[];
  onLocationClick: (location: Location) => void;
  gridSize?: number;
}

export function VirtualMapGrid({
  currentLocation,
  childLocations,
  onLocationClick,
  gridSize = 40,
}: VirtualMapGridProps) {
  const { playerPosition, discoveredLocations } = useVirtualMapStore();

  // Calculate grid dimensions based on location mapData
  const mapWidth = currentLocation.mapData?.width || 800;
  const mapHeight = currentLocation.mapData?.height || 600;

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />

      {/* Map Container */}
      <div
        className="absolute"
        style={{
          width: `${mapWidth}px`,
          height: `${mapHeight}px`,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Current Location Info (Background Text) */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg px-4 py-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
              {currentLocation.name}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              {currentLocation.description}
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <span className="capitalize">{currentLocation.type}</span>
              {currentLocation.coordinates && (
                <>
                  <span>•</span>
                  <span>
                    X: {currentLocation.coordinates.x}, Y: {currentLocation.coordinates.y}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Child Location Markers */}
        {childLocations.map((location) => (
          <LocationMarker
            key={location.id}
            location={location}
            onClick={() => onLocationClick(location)}
            isDiscovered={discoveredLocations.has(location.id)}
            isCurrentLocation={location.id === playerPosition.locationId}
          />
        ))}

        {/* Player Marker (only show if player is in this location) */}
        {playerPosition.locationId === currentLocation.id && (
          <PlayerMarker
            x={playerPosition.coordinates.x / gridSize}
            y={playerPosition.coordinates.y / gridSize}
            facing={playerPosition.facing}
            gridSize={gridSize}
          />
        )}

        {/* Coordinate Indicators (Corners) */}
        <div className="absolute top-2 left-2 text-xs text-gray-600 font-mono">
          (0, 0)
        </div>
        <div className="absolute bottom-2 right-2 text-xs text-gray-600 font-mono">
          ({mapWidth}, {mapHeight})
        </div>
      </div>

      {/* Empty State */}
      {childLocations.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold text-white mb-2">
              No Sub-Locations
            </h3>
            <p className="text-gray-400">
              This is the deepest level in this area
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
