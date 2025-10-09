"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GameLayout, GameLayoutOverlay } from "@/src/presentation/components/layout/GameLayout";
import { HUDPanel, HUDPanelToggle } from "@/src/presentation/components/layout/HUDPanel";
import { VirtualMapGrid } from "./VirtualMapGrid";
import { KeyboardHint } from "./KeyboardHint";
import { useVirtualMapStore } from "@/src/stores/virtualMapStore";
import { getLocationById, getLocationPath, getLocationConnections } from "@/src/data/master/locations.master";
import { useMovementAnimation } from "@/src/hooks/useMovementAnimation";
import { useKeyboardMovement } from "@/src/hooks/useKeyboardMovement";
import { Home, Map, Navigation, MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";

interface VirtualMapFullViewProps {
  initialLocationId?: string;
}

export function VirtualMapFullView({ initialLocationId }: VirtualMapFullViewProps) {
  const router = useRouter();
  const {
    playerPosition,
    discoveredLocations,
    teleportToLocation,
    discoverLocation,
    // Use cached data from store
    currentLocationData,
    childLocations,
    discoveredLocationData,
    refreshCachedData,
  } = useVirtualMapStore();

  // Enable movement animation
  useMovementAnimation();

  // Enable keyboard controls (WASD + Arrow Keys)
  useKeyboardMovement(true);

  // UI State
  const [showLocationListPanel, setShowLocationListPanel] = useState(true);
  const [showBreadcrumbPanel, setShowBreadcrumbPanel] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);

  // Get breadcrumb from master data (not cached as it's lightweight)
  const breadcrumb = currentLocationData ? getLocationPath(currentLocationData.id) : [];

  // Sync URL with player's actual location on mount
  useEffect(() => {
    console.log(`[VirtualMapFullView] Initializing...`);
    console.log(`  - URL locationId:`, initialLocationId);
    
    const currentPos = useVirtualMapStore.getState().playerPosition;
    console.log(`  - Player's actual location:`, currentPos.locationId);
    
    // If URL doesn't match player's actual location, redirect to correct location
    if (initialLocationId && currentPos.locationId !== initialLocationId) {
      console.log(`  ⚠️ URL mismatch! Player is at ${currentPos.locationId}, but URL shows ${initialLocationId}`);
      console.log(`  ↻ Redirecting to player's actual location...`);
      router.push(`/virtual-world/${currentPos.locationId}`);
    } else if (!initialLocationId && currentPos.locationId) {
      // If no URL param, redirect to player's current location
      console.log(`  ↻ No URL param, redirecting to player location: ${currentPos.locationId}`);
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

  // Check for connection triggers when player moves
  useEffect(() => {
    if (!currentLocationData) return;

    // Get connections for current location
    const connections = getLocationConnections(currentLocationData.id);

    // Check if player is standing on a connection point
    for (const connection of connections) {
      if (connection.fromLocationId !== currentLocationData.id) continue;
      if (!connection.coordinates) continue;

      // Calculate tile position
      const connTileX = Math.floor(connection.coordinates.x / 40);
      const connTileY = Math.floor(connection.coordinates.y / 40);
      const playerTileX = Math.floor(playerPosition.coordinates.x / 40);
      const playerTileY = Math.floor(playerPosition.coordinates.y / 40);

      // If player is on connection tile, trigger navigation
      if (connTileX === playerTileX && connTileY === playerTileY) {
        console.log(`[VirtualMapFullView] Player stepped on connection:`, connection.id);
        
        // Find target location
        const target = childLocations.find(loc => loc.id === connection.toLocationId);
        if (target) {
          console.log(`  → Auto-navigating to:`, target.id);
          
          // Auto-discover and teleport
          if (!discoveredLocations.has(target.id)) {
            discoverLocation(target.id);
          }
          teleportToLocation(target.id, target.coordinates);
          router.push(`/virtual-world/${target.id}`);
        }
        break;
      }
    }
  }, [playerPosition.coordinates.x, playerPosition.coordinates.y, currentLocationData, childLocations, discoveredLocations, discoverLocation, teleportToLocation, router]);

  // Handle location click - teleport + update URL
  const handleLocationClick = (location: Location) => {
    console.log(`[VirtualMapFullView] Location clicked:`, location.id);
    
    // Auto-discover location when clicking (connections are always accessible)
    if (!discoveredLocations.has(location.id)) {
      console.log(`  ℹ️ Auto-discovering location: ${location.id}`);
      discoverLocation(location.id);
    }
    
    console.log(`  ✓ Teleporting to ${location.id}`);
    
    // Teleport to location (updates store)
    teleportToLocation(location.id, location.coordinates);
    
    // Update URL to match new location
    router.push(`/virtual-world/${location.id}`);
  };

  // Handle breadcrumb click - teleport + update URL
  const handleBreadcrumbClick = (location: Location) => {
    console.log(`[VirtualMapFullView] Breadcrumb clicked:`, location.id);
    
    // Breadcrumbs are always accessible (parent locations)
    console.log(`  ✓ Teleporting to ${location.id}`);
    
    // Teleport to location (updates store)
    teleportToLocation(location.id, location.coordinates);
    
    // Update URL to match new location
    router.push(`/virtual-world/${location.id}`);
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
          showMinimap={showMinimap}
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

        {/* Help Text - Bottom Center */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
          <HUDPanel>
            <p className="text-xs text-gray-400 text-center">
              🖱️ Click on location markers to navigate • ⚡ Fast travel available
            </p>
          </HUDPanel>
        </div>

        {/* Keyboard Controls Hint */}
        <KeyboardHint />

        {/* Minimap Toggle - Top Right */}
        <div className="fixed top-4 right-4 z-40">
          <button
            data-minimap-toggle
            onClick={() => setShowMinimap(!showMinimap)}
            className={`px-3 py-2 backdrop-blur-sm border rounded-lg transition-colors text-white text-sm flex items-center gap-2 ${
              showMinimap
                ? "bg-purple-900/80 border-purple-500 hover:bg-purple-800/80"
                : "bg-slate-900/80 border-slate-700 hover:bg-slate-800/80"
            }`}
            title={showMinimap ? "Hide Minimap" : "Show Minimap"}
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">{showMinimap ? "Hide" : "Show"} Map</span>
          </button>
        </div>
      </GameLayoutOverlay>

      {/* Main Menu Button - Bottom Left */}
      <div className="fixed bottom-4 left-4 z-40">
        <Link
          href="/"
          className="px-4 py-2 bg-slate-900/80 hover:bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg transition-colors text-white text-sm flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
        </Link>
      </div>
    </GameLayout>
  );
}
