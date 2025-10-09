"use client";

import { useState, useEffect } from "react";
import { Location } from "@/src/domain/types/location.types";
import { GameLayout, GameLayoutOverlay } from "@/src/presentation/components/layout/GameLayout";
import { HUDPanel, HUDPanelToggle } from "@/src/presentation/components/layout/HUDPanel";
import { VirtualMapGrid } from "./VirtualMapGrid";
import { useVirtualMapStore } from "@/src/stores/virtualMapStore";
import {
  getLocationPath,
} from "@/src/data/master/locations.master";
import { Map, Navigation, MapPin, Home, ChevronRight } from "lucide-react";
import Link from "next/link";

export function VirtualMapFullView() {
  const {
    discoveredLocations,
    teleportToLocation,
    discoverLocation,
    // Use cached data from store
    currentLocationData,
    childLocations,
    discoveredLocationData,
    refreshCachedData,
  } = useVirtualMapStore();

  // UI State
  const [showLocationListPanel, setShowLocationListPanel] = useState(true);
  const [showBreadcrumbPanel, setShowBreadcrumbPanel] = useState(true);

  // Get breadcrumb from master data (not cached as it's lightweight)
  const breadcrumb = currentLocationData ? getLocationPath(currentLocationData.id) : [];

  // Auto-discover current location on mount & refresh cached data
  useEffect(() => {
    if (currentLocationData) {
      discoverLocation(currentLocationData.id);
    }
    refreshCachedData();
  }, [currentLocationData, discoverLocation, refreshCachedData]);

  // Handle location click
  const handleLocationClick = (location: Location) => {
    // Teleport to location
    teleportToLocation(location.id, location.coordinates);
  };

  // Handle breadcrumb click
  const handleBreadcrumbClick = (location: Location) => {
    teleportToLocation(location.id, location.coordinates);
  };

  // Loading state
  if (!currentLocationData) {
    return (
      <GameLayout>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading map...</p>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      {/* Virtual Map Grid */}
      <div className="absolute inset-0">
        <VirtualMapGrid
          currentLocation={currentLocationData}
          childLocations={childLocations}
          onLocationClick={handleLocationClick}
        />
      </div>

      {/* HUD Overlays */}
      <GameLayoutOverlay>
        {/* Breadcrumb Panel - Top Center */}
        {showBreadcrumbPanel ? (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg px-4 py-2 max-w-[90vw] overflow-x-auto">
              <div className="flex items-center gap-2 text-sm">
                <Home className="w-4 h-4 text-purple-400 shrink-0" />
                {breadcrumb.map((location, index) => (
                  <div key={location.id} className="flex items-center gap-2">
                    {index > 0 && (
                      <ChevronRight className="w-3 h-3 text-gray-600 shrink-0" />
                    )}
                    <button
                      onClick={() => handleBreadcrumbClick(location)}
                      className={`whitespace-nowrap transition-colors ${
                        index === breadcrumb.length - 1
                          ? "text-white font-semibold"
                          : "text-gray-400 hover:text-gray-300"
                      }`}
                    >
                      {location.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
            <button
              onClick={() => setShowBreadcrumbPanel(true)}
              className="px-3 py-2 bg-slate-900/80 hover:bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg transition-colors text-white text-sm flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              {currentLocationData.name}
            </button>
          </div>
        )}

        {/* Location List Panel - Left */}
        {showLocationListPanel ? (
          <HUDPanel
            title="Discovered Locations"
            icon={<Map className="w-5 h-5" />}
            position="top-left"
            closable
            onClose={() => setShowLocationListPanel(false)}
            maxHeight="min(400px, 60vh)"
            maxWidth="min(320px, 85vw)"
          >
            <div className="space-y-2">
              {/* Current Location */}
              <div className="mb-3 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Navigation className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400">Current Location</span>
                </div>
                <h3 className="text-white font-semibold">{currentLocationData.name}</h3>
                <p className="text-xs text-gray-400 capitalize">
                  {currentLocationData.type}
                </p>
              </div>

              {/* Discovered Locations List */}
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                {discoveredLocationData
                  .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
                  .map((location) => (
                    <button
                      key={location.id}
                      onClick={() => handleLocationClick(location)}
                      className={`w-full p-2 rounded-lg text-left transition-all ${
                        location.id === currentLocationData.id
                          ? "bg-purple-900/50 border border-purple-500"
                          : "bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-purple-500"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white truncate">
                            {location.name}
                          </h4>
                          <p className="text-xs text-gray-400 capitalize">
                            {location.type}
                          </p>
                        </div>
                        {location.isFastTravelPoint && (
                          <div className="shrink-0 w-5 h-5 bg-green-500/20 border border-green-500 rounded flex items-center justify-center">
                            <span className="text-green-400 text-xs">⚡</span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
              </div>

              {/* Stats */}
              <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-gray-400">
                Discovered: {discoveredLocations.size} locations
              </div>
            </div>
          </HUDPanel>
        ) : (
          <HUDPanelToggle
            label="Locations"
            icon={<Map className="w-4 h-4" />}
            onClick={() => setShowLocationListPanel(true)}
            position="top-left"
          />
        )}
      </GameLayoutOverlay>

      {/* Help Text - Bottom Center */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg px-4 py-2">
          <p className="text-xs text-gray-400 text-center">
            🖱️ Click on location markers to navigate • ⚡ Fast travel available
          </p>
        </div>
      </div>

      {/* Back to Main Menu */}
      <div className="fixed bottom-4 right-4 z-40">
        <Link
          href="/"
          className="px-4 py-2 bg-slate-900/80 hover:bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg transition-colors text-white text-sm flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Main Menu</span>
        </Link>
      </div>
    </GameLayout>
  );
}
