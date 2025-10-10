"use client";

import {
  getLocationById,
  getLocationConnections,
  getLocationPath,
} from "@/src/data/master/locations.master";
import { Location } from "@/src/domain/types/location.types";
import { useKeyboardMovement } from "@/src/hooks/useKeyboardMovement";
import { useMovementAnimation } from "@/src/hooks/useMovementAnimation";
import { GameLayoutOverlay } from "@/src/presentation/components/layout/GameLayout";
import {
  HUDPanel,
  HUDPanelToggle,
} from "@/src/presentation/components/layout/HUDPanel";
import { useVirtualMapStore } from "@/src/stores/virtualMapStore";
import { ChevronRight, Home, Info, Keyboard, Map, MapPin, Navigation } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { KeyboardHintContent } from "./KeyboardHint";
import {
  MapInfoView,
  MapInfoViewProps,
  MinimapView,
  MinimapViewProps,
  VirtualMapGrid,
} from "./VirtualMapGrid";

interface VirtualMapFullViewProps {
  initialLocationId?: string;
}

export function VirtualMapFullView({
  initialLocationId,
}: VirtualMapFullViewProps) {
  const router = useRouter();
  const {
    discoveredLocations,
    teleportToLocation,
    discoverLocation,
    // Use cached data from store
    currentLocationData,
    childLocations,
    discoveredLocationData,
    refreshCachedData,
    // UI State from store (persisted)
    showLocationListPanel,
    showBreadcrumbPanel,
    showMinimapPanel,
    showMapInfoPanel,
    showKeyboardHintPanel,
    setShowLocationListPanel,
    setShowBreadcrumbPanel,
    setShowMinimapPanel,
    setShowMapInfoPanel,
    setShowKeyboardHintPanel,
  } = useVirtualMapStore();

  // Local state for minimap data and map info data
  const [minimapData, setMinimapData] = useState<MinimapViewProps | null>(null);
  const [mapInfoData, setMapInfoData] = useState<MapInfoViewProps | null>(null);

  // Enable movement animation
  useMovementAnimation();

  // Enable keyboard controls (WASD + Arrow Keys)
  useKeyboardMovement(true);

  // Get breadcrumb from master data (not cached as it's lightweight)
  const breadcrumb = currentLocationData
    ? getLocationPath(currentLocationData.id)
    : [];

  // Sync URL with player's actual location on mount
  useEffect(() => {
    console.log(`[VirtualMapFullView] Initializing...`);
    console.log(`  - URL locationId:`, initialLocationId);

    const currentPos = useVirtualMapStore.getState().playerPosition;
    console.log(`  - Player's actual location:`, currentPos.locationId);

    // If URL doesn't match player's actual location, redirect to correct location
    if (initialLocationId && currentPos.locationId !== initialLocationId) {
      console.log(
        `  ⚠️ URL mismatch! Player is at ${currentPos.locationId}, but URL shows ${initialLocationId}`
      );
      console.log(`  ↻ Redirecting to player's actual location...`);
      router.push(`/virtual-world/${currentPos.locationId}`);
    } else if (!initialLocationId && currentPos.locationId) {
      // If no URL param, redirect to player's current location
      console.log(
        `  ↻ No URL param, redirecting to player location: ${currentPos.locationId}`
      );
      router.push(`/virtual-world/${currentPos.locationId}`);
    } else {
      console.log(`  ✓ URL matches player location`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Auto-discover current location on mount & refresh cached data
  useEffect(() => {
    if (currentLocationData) {
      discoverLocation(currentLocationData.id);
    }
    refreshCachedData();
  }, [currentLocationData, discoverLocation, refreshCachedData]);

  // Listen for connection triggers from store (event-based, not useEffect!)
  useEffect(() => {
    const handleConnectionTrigger = (event: CustomEvent) => {
      const { connectionId, toLocationId } = event.detail;
      console.log(
        `[VirtualMapFullView] Connection triggered:`,
        connectionId,
        "→",
        toLocationId
      );

      // Get target location from master data
      const target = getLocationById(toLocationId);

      if (target) {
        console.log(`  → Auto-navigating to:`, target.id);

        // Find connection to get spawn point
        const connections = getLocationConnections(currentLocationData?.id || "");
        const connection = connections.find(
          (conn) =>
            conn.from.locationId === currentLocationData?.id &&
            conn.to.locationId === toLocationId
        );

        // Use connection spawn point (to.coordinates), fallback to center
        const spawnCoords = connection?.to.coordinates || { x: 10, y: 7 };
        console.log(
          `  - Spawn at:`,
          spawnCoords,
          connection ? "(from connection)" : "(center)"
        );

        // Auto-discover and teleport
        if (!discoveredLocations.has(target.id)) {
          discoverLocation(target.id);
        }
        teleportToLocation(target.id, spawnCoords);
        router.push(`/virtual-world/${target.id}`);
      }
    };

    window.addEventListener(
      "connection-trigger",
      handleConnectionTrigger as EventListener
    );
    return () =>
      window.removeEventListener(
        "connection-trigger",
        handleConnectionTrigger as EventListener
      );
  }, [
    discoveredLocations,
    discoverLocation,
    teleportToLocation,
    router,
    currentLocationData,
  ]);

  // Handle location click - teleport + update URL
  const handleLocationClick = (location: Location) => {
    console.log(`[VirtualMapFullView] Location clicked:`, location.id);

    // Auto-discover location when clicking (connections are always accessible)
    if (!discoveredLocations.has(location.id)) {
      console.log(`  ℹ️ Auto-discovering location: ${location.id}`);
      discoverLocation(location.id);
    }

    console.log(`  ✓ Teleporting to ${location.id}`);

    // Find connection to get spawn point
    const connections = getLocationConnections(currentLocationData?.id || "");
    const connection = connections.find(
      (conn) => conn.to.locationId === location.id
    );
    const spawnCoords = connection?.to.coordinates || { x: 10, y: 7 };

    // Teleport to location (updates store)
    teleportToLocation(location.id, spawnCoords);

    // Update URL to match new location
    router.push(`/virtual-world/${location.id}`);
  };

  // Handle breadcrumb click - teleport + update URL
  const handleBreadcrumbClick = (location: Location) => {
    console.log(`[VirtualMapFullView] Breadcrumb clicked:`, location.id);

    // Breadcrumbs are always accessible (parent locations)
    console.log(`  ✓ Teleporting to ${location.id}`);

    // For breadcrumbs (going back), spawn at center
    const spawnCoords = { x: 10, y: 7 }; // Default center

    // Teleport to location (updates store)
    teleportToLocation(location.id, spawnCoords);

    // Update URL to match new location
    router.push(`/virtual-world/${location.id}`);
  };

  // Loading state
  if (!currentLocationData) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Virtual Map Container */}
      <div className="absolute inset-0">
        <VirtualMapGrid
          currentLocation={currentLocationData}
          childLocations={childLocations}
          onLocationClick={handleLocationClick}
          onMinimapDataReady={setMinimapData}
          onMapInfoDataReady={setMapInfoData}
        />
      </div>

      {/* HUD Overlays */}
      <GameLayoutOverlay>
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
                  <span className="text-xs text-gray-400">
                    Current Location
                  </span>
                </div>
                <h3 className="text-white font-semibold">
                  {currentLocationData.name}
                </h3>
                <p className="text-xs text-gray-400 capitalize">
                  {currentLocationData.type}
                </p>
              </div>

              {/* Discovered Locations List */}
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                {discoveredLocationData
                  .sort(
                    (a, b) => a.level - b.level || a.name.localeCompare(b.name)
                  )
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

        {/* Keyboard Controls Panel - Bottom Right */}
        {showKeyboardHintPanel ? (
          <HUDPanel
            title="Keyboard Controls"
            icon={<Keyboard className="w-5 h-5" />}
            position="bottom-right"
            closable
            onClose={() => setShowKeyboardHintPanel(false)}
            maxHeight="auto"
            maxWidth="auto"
          >
            <KeyboardHintContent />
          </HUDPanel>
        ) : (
          <HUDPanelToggle
            label="Controls"
            icon={<Keyboard className="w-4 h-4" />}
            onClick={() => setShowKeyboardHintPanel(true)}
            position="bottom-right"
          />
        )}

        {/* Minimap Panel - Top Right */}
        {showMinimapPanel && minimapData ? (
          <HUDPanel
            title="Minimap"
            icon={<Map className="w-5 h-5" />}
            position="top-right"
            closable
            onClose={() => setShowMinimapPanel(false)}
            maxHeight="auto"
            maxWidth="auto"
          >
            <MinimapView {...minimapData} />
          </HUDPanel>
        ) : (
          <HUDPanelToggle
            label="Minimap"
            icon={<Map className="w-4 h-4" />}
            onClick={() => setShowMinimapPanel(true)}
            position="top-right"
          />
        )}

        {/* Breadcrumb Panel - Top Center */}
        {showBreadcrumbPanel ? (
          <HUDPanel
            title=""
            position="top-center"
            closable
            onClose={() => setShowBreadcrumbPanel(false)}
            maxWidth="min(600px, 90vw)"
          >
            <div className="flex items-center gap-2 text-sm -mt-2">
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
          </HUDPanel>
        ) : (
          <HUDPanelToggle
            label={currentLocationData.name}
            icon={<MapPin className="w-4 h-4" />}
            onClick={() => setShowBreadcrumbPanel(true)}
            position="top-center"
          />
        )}

        {/* Map Info Panel - Bottom Left */}
        {showMapInfoPanel && mapInfoData ? (
          <HUDPanel
            title="Map Info"
            icon={<Info className="w-5 h-5" />}
            position="bottom-left"
            closable
            onClose={() => setShowMapInfoPanel(false)}
            maxHeight="auto"
            maxWidth="auto"
          >
            <MapInfoView {...mapInfoData} />
          </HUDPanel>
        ) : (
          <HUDPanelToggle
            label="Map Info"
            icon={<Info className="w-4 h-4" />}
            onClick={() => setShowMapInfoPanel(true)}
            position="bottom-left"
          />
        )}
      </GameLayoutOverlay>
    </>
  );
}
