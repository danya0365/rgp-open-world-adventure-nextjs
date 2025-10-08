"use client";

import { WorldViewModel } from "@/src/presentation/presenters/world/WorldPresenter";
import { useWorldPresenter } from "@/src/presentation/presenters/world/useWorldPresenter";
import { getPartyStats, useGameStore } from "@/src/stores/gameStore";
import {
  AlertTriangle,
  Users,
  Shield,
  Heart,
  Zap,
  X,
  Map as MapIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LocationDetailView } from "../location/LocationDetailView";
import {
  GameLayout,
  GameLayoutOverlay,
} from "@/src/presentation/components/layout/GameLayout";
import { HUDPanel, HUDPanelToggle } from "@/src/presentation/components/layout/HUDPanel";
import { Location } from "@/src/domain/types/location.types";

interface WorldMapViewProps {
  initialViewModel?: WorldViewModel;
  currentLocationId?: string;
}

/**
 * WorldMapView - Game-style world map without scrolling
 * Displays locations as interactive markers on a full-screen map
 */
export function WorldMapView({
  initialViewModel,
  currentLocationId,
}: WorldMapViewProps) {
  const [showPartyPanel, setShowPartyPanel] = useState(true);
  const [showStatsPanel, setShowStatsPanel] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const {
    parties,
    activePartyId,
    progress,
    setCurrentLocation: saveCurrentLocation,
  } = useGameStore();

  // Get active party members
  const activeParty = parties.find((p) => p.id === activePartyId);
  const activePartyMembers = activeParty?.members || [];

  // Convert to legacy format for getPartyStats
  const activePartyCharacters = activePartyMembers
    .map((member) => {
      const recruited = progress.recruitedCharacters.find(
        (rc) => rc.characterId === member.characterId
      );
      if (!recruited) return null;

      return {
        character: {
          id: member.characterId,
          name: recruited.characterId,
          level: 1,
          stats: { maxHp: 100, maxMp: 50, atk: 10, def: 10, spd: 10 },
        } as any,
        position: member.position,
        isLeader: member.isLeader,
      };
    })
    .filter(Boolean) as any[];

  const partyStats = getPartyStats(activePartyCharacters);

  const { viewModel, loading, error, currentLocation } =
    useWorldPresenter(initialViewModel, currentLocationId);

  // Save location to game store when it changes
  useEffect(() => {
    if (currentLocation) {
      saveCurrentLocation(currentLocation.id);
    }
  }, [currentLocation?.id, saveCurrentLocation]);

  // Show loading state
  if (loading && !viewModel) {
    return (
      <GameLayout>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-400">กำลังโหลดแผนที่โลก...</p>
          </div>
        </div>
      </GameLayout>
    );
  }

  // Show error state
  if (error && !viewModel) {
    return (
      <GameLayout>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-400 font-medium mb-2">เกิดข้อผิดพลาด</p>
            <p className="text-gray-400 mb-4">{error}</p>
            <Link
              href="/"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
            >
              กลับหน้าแรก
            </Link>
          </div>
        </div>
      </GameLayout>
    );
  }

  // Show empty state
  if (!viewModel) {
    return (
      <GameLayout>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🗺️</div>
            <p className="text-gray-400 font-medium mb-2">ยังไม่มีข้อมูลแผนที่</p>
          </div>
        </div>
      </GameLayout>
    );
  }

  // Check if party is empty
  if (activePartyMembers.length === 0) {
    return (
      <GameLayout>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">ยังไม่มีทีม!</h2>
            <p className="text-gray-400 mb-6">
              คุณต้องเลือกตัวละครเข้าทีมก่อนเริ่มผจญภัย
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/characters"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-semibold"
              >
                เลือกตัวละคร
              </Link>
              <Link
                href="/party"
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                ไปหน้าจัดการทีม
              </Link>
            </div>
          </div>
        </div>
      </GameLayout>
    );
  }

  // Get all locations (flatten hierarchy for map display)
  const allLocations = viewModel.locations;

  // Get discovered locations
  const discoveredLocations = allLocations.filter((loc) => loc.isDiscoverable);

  // Generate positions for locations (simple grid layout for now)
  const locationsWithPositions = discoveredLocations.map((loc, index) => {
    // Simple grid: 4 columns
    const col = index % 4;
    const row = Math.floor(index / 4);
    
    // Calculate position (centered with spacing)
    const x = 20 + col * 23; // % from left
    const y = 20 + row * 25; // % from top
    
    return {
      ...loc,
      x,
      y,
    };
  });

  return (
    <GameLayout>
      {/* Full Screen Map Container */}
      <div className="absolute inset-0">
        {/* Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
          {/* Grid Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
          
          {/* Radial Glow */}
          <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent" />
        </div>

        {/* Location Markers */}
        <div className="absolute inset-0">
          {locationsWithPositions.map((location) => {
            const isCurrentLocation = location.id === currentLocationId;
            const isCityOrTown = location.type === 'city' || location.type === 'town';
            
            return (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className="absolute group transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${location.x}%`,
                  top: `${location.y}%`,
                }}
              >
                {/* Connection Lines (optional - to parent) */}
                
                {/* Marker Glow */}
                <div className={`absolute inset-0 rounded-full blur-xl transition-all ${
                  isCurrentLocation 
                    ? 'bg-amber-400/50 w-24 h-24 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2' 
                    : 'bg-purple-400/30 w-16 h-16 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 group-hover:bg-purple-400/50'
                }`} />
                
                {/* Marker Icon */}
                <div className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all border-2 ${
                  isCurrentLocation
                    ? 'bg-amber-500 border-amber-300 scale-125'
                    : 'bg-purple-600 border-purple-400 group-hover:scale-110 group-hover:bg-purple-500'
                }`}>
                  <span className="text-2xl">
                    {isCityOrTown ? '🏰' : location.type === 'region' ? '🏔️' : '🗺️'}
                  </span>
                  
                  {/* Current Location Indicator */}
                  {isCurrentLocation && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <div className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded shadow-lg animate-pulse">
                        YOU ARE HERE
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Location Name */}
                <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap ${
                  isCurrentLocation ? 'scale-110' : ''
                }`}>
                  <div className={`px-3 py-1 rounded-lg text-sm font-semibold shadow-lg transition-all ${
                    isCurrentLocation
                      ? 'bg-amber-500/90 text-white'
                      : 'bg-slate-800/90 text-gray-200 group-hover:bg-purple-600/90 group-hover:text-white'
                  }`}>
                    {location.name}
                  </div>
                </div>
                
                {/* Hover Info */}
                <div className="absolute top-full mt-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="px-3 py-2 bg-slate-900/95 border border-purple-500/50 rounded-lg text-xs text-gray-300 whitespace-nowrap shadow-xl">
                    <div className="font-semibold text-purple-400 capitalize">{location.type}</div>
                    <div className="text-gray-400 text-[10px] mt-1">คลิกเพื่อดูรายละเอียด</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Map Info - Top Center */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="px-6 py-3 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl">
            <div className="flex items-center gap-3">
              <MapIcon className="w-6 h-6 text-purple-400" />
              <div>
                <h1 className="text-xl font-bold text-white">
                  {currentLocation ? currentLocation.name : "แผนที่โลก Aethoria"}
                </h1>
                <p className="text-gray-400 text-xs">
                  สถานที่: {discoveredLocations.length}/{viewModel.totalLocations} | 
                  คลิกที่ไอคอนเพื่อดูรายละเอียด
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Minimap - Bottom Left (optional) */}
        <div className="absolute bottom-4 left-4 z-10">
          <div className="w-48 h-48 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl p-3">
            <div className="text-xs text-gray-400 mb-2">Minimap</div>
            <div className="relative w-full h-full bg-slate-800/50 rounded">
              {/* Simplified minimap dots */}
              {locationsWithPositions.slice(0, 15).map((loc) => (
                <div
                  key={loc.id}
                  className={`absolute w-2 h-2 rounded-full ${
                    loc.id === currentLocationId ? 'bg-amber-400' : 'bg-purple-400'
                  }`}
                  style={{
                    left: `${loc.x}%`,
                    top: `${loc.y}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Location Detail Modal */}
      {selectedLocation && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-slate-700 rounded-xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedLocation(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            {/* Location Detail */}
            <LocationDetailView
              locationId={selectedLocation.id}
              hideBackButton={true}
              compact={true}
            />
          </div>
        </div>
      )}

      {/* HUD Overlays */}
      <GameLayoutOverlay>
        {/* Party Panel - Top Left */}
        {showPartyPanel ? (
          <HUDPanel
            title="ทีมปัจจุบัน"
            icon={<Users className="w-5 h-5" />}
            position="top-left"
            onClose={() => setShowPartyPanel(false)}
            maxWidth="380px"
            maxHeight="400px"
          >
            <div className="space-y-2 pointer-events-auto">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-sm">
                  {activePartyMembers.length} สมาชิก
                </p>
                <Link
                  href="/party"
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                >
                  จัดการทีม →
                </Link>
              </div>
              {activePartyCharacters.map((member) => (
                <div
                  key={member.character.id}
                  className="p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-white font-medium">
                      {member.character.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      Lv {member.character.level}
                    </span>
                    {member.isLeader && (
                      <span className="text-amber-400 text-xs">👑</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">HP:</span>
                      <span className="text-green-400 ml-1">
                        {member.character.stats.maxHp}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">MP:</span>
                      <span className="text-blue-400 ml-1">
                        {member.character.stats.maxMp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </HUDPanel>
        ) : (
          <HUDPanelToggle
            label="ทีม"
            icon={<Users className="w-4 h-4" />}
            onClick={() => setShowPartyPanel(true)}
            position="top-left"
          />
        )}

        {/* Stats Panel - Bottom Right */}
        {showStatsPanel ? (
          <HUDPanel
            title="สถิติรวม"
            icon={<Shield className="w-5 h-5" />}
            position="bottom-right"
            onClose={() => setShowStatsPanel(false)}
            maxWidth="300px"
            maxHeight="300px"
          >
            <div className="space-y-3 pointer-events-auto">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" /> Total HP
                </span>
                <span className="text-white font-semibold">
                  {partyStats.totalHp.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400" /> Total MP
                </span>
                <span className="text-white font-semibold">
                  {partyStats.totalMp.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" /> Members
                </span>
                <span className="text-white font-semibold">
                  {activePartyMembers.length}/8
                </span>
              </div>
              <div className="border-t border-slate-700 pt-2">
                <div className="text-xs text-gray-400 mb-1">Avg Level</div>
                <div className="text-2xl font-bold text-amber-400">
                  {Math.round(
                    activePartyCharacters.reduce(
                      (sum, m) => sum + m.character.level,
                      0
                    ) / activePartyCharacters.length
                  )}
                </div>
              </div>
            </div>
          </HUDPanel>
        ) : (
          <HUDPanelToggle
            label="สถิติ"
            icon={<Shield className="w-4 h-4" />}
            onClick={() => setShowStatsPanel(true)}
            position="bottom-right"
          />
        )}

        {/* Error Toast */}
        {error && viewModel && (
          <div className="absolute bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg pointer-events-auto">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}
      </GameLayoutOverlay>
    </GameLayout>
  );
}
