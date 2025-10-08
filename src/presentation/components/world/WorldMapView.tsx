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
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  Home,
  MapPin,
  Scroll,
  Swords,
  ShoppingBag,
  Hotel,
  Users2,
  Navigation,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [showPartyPanel, setShowPartyPanel] = useState(true);
  const [showStatsPanel, setShowStatsPanel] = useState(true);
  const [showCurrentAreaPanel, setShowCurrentAreaPanel] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showFastTravelModal, setShowFastTravelModal] = useState(false);
  
  // Pan & Zoom state - restored from localStorage
  const [zoom, setZoom] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('worldMapZoom');
      return saved ? parseFloat(saved) : 1;
    }
    return 1;
  });
  const [pan, setPan] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('worldMapPan');
      return saved ? JSON.parse(saved) : { x: 0, y: 0 };
    }
    return { x: 0, y: 0 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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

  // Save zoom/pan to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('worldMapZoom', zoom.toString());
    }
  }, [zoom]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('worldMapPan', JSON.stringify(pan));
    }
  }, [pan]);

  // Pan & Zoom handlers
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // ไม่ drag ถ้ากำลังคลิก location marker
    if ((e.target as HTMLElement).closest('button')) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(3, prev + 0.2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.5, prev - 0.2));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

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

  // Get child locations of current location only
  const childLocations = currentLocation
    ? viewModel.locations.filter(
        (loc) => loc.parentId === currentLocation.id && loc.isDiscoverable
      )
    : viewModel.rootLocations.filter((loc) => loc.isDiscoverable);

  // Get sibling locations (same parent as current location) - for "You are here" indicator
  const siblingLocations = currentLocation
    ? viewModel.locations.filter(
        (loc) => loc.parentId === currentLocation.parentId && loc.isDiscoverable
      )
    : [];

  // Create virtual locations for current location's services/features
  const virtualServiceLocations: Array<{
    id: string;
    name: string;
    type: string;
    isService: boolean;
    serviceType: string;
    metadata?: any;
  }> = [];
  if (currentLocation?.metadata) {
    
    // Add NPCs as virtual locations
    if (currentLocation.metadata.npcs && currentLocation.metadata.npcs.length > 0) {
      currentLocation.metadata.npcs.forEach((npcId, idx) => {
        virtualServiceLocations.push({
          id: `service-npc-${npcId}`,
          name: `NPC ${idx + 1}`,
          type: 'npc',
          isService: true,
          serviceType: 'npc',
          metadata: { npcId },
        });
      });
    }
    
    // Add shops as virtual locations
    if (currentLocation.metadata.shops && currentLocation.metadata.shops.length > 0) {
      currentLocation.metadata.shops.forEach((shopId) => {
        virtualServiceLocations.push({
          id: `service-shop-${shopId}`,
          name: `Shop`,
          type: 'shop',
          isService: true,
          serviceType: 'shop',
          metadata: { shopId },
        });
      });
    }
    
    // Add inn as virtual location
    if (currentLocation.metadata.services?.includes('inn')) {
      virtualServiceLocations.push({
        id: `service-inn-${currentLocation.id}`,
        name: `Inn`,
        type: 'inn',
        isService: true,
        serviceType: 'inn',
      });
    }
    
    // Add guild as virtual location
    if (currentLocation.metadata.services?.includes('guild')) {
      virtualServiceLocations.push({
        id: `service-guild-${currentLocation.id}`,
        name: `Guild Hall`,
        type: 'guild',
        isService: true,
        serviceType: 'guild',
      });
    }
    
    // Add battle maps as virtual locations
    if (currentLocation.metadata.battleMaps && currentLocation.metadata.battleMaps.length > 0) {
      currentLocation.metadata.battleMaps.forEach((battleMapId, idx) => {
        virtualServiceLocations.push({
          id: `service-battle-${battleMapId}`,
          name: `Battle Area ${idx + 1}`,
          type: 'battle',
          isService: true,
          serviceType: 'battle',
          metadata: { battleMapId },
        });
      });
    }
    
    // Add encounters as virtual locations
    if (currentLocation.metadata.encounters && currentLocation.metadata.encounters.length > 0) {
      currentLocation.metadata.encounters.forEach((encounterId, idx) => {
        virtualServiceLocations.push({
          id: `service-encounter-${encounterId}`,
          name: `Encounter ${idx + 1}`,
          type: 'encounter',
          isService: true,
          serviceType: 'encounter',
          metadata: { encounterId },
        });
      });
    }
    
    // Add treasures as virtual locations
    if (currentLocation.metadata.treasures && currentLocation.metadata.treasures.length > 0) {
      currentLocation.metadata.treasures.forEach((treasureId, idx) => {
        virtualServiceLocations.push({
          id: `service-treasure-${treasureId}`,
          name: `Treasure ${idx + 1}`,
          type: 'treasure',
          isService: true,
          serviceType: 'treasure',
          metadata: { treasureId },
        });
      });
    }
    
    // Add secrets as virtual locations
    if (currentLocation.metadata.secrets && currentLocation.metadata.secrets.length > 0) {
      currentLocation.metadata.secrets.forEach((secretId, idx) => {
        virtualServiceLocations.push({
          id: `service-secret-${secretId}`,
          name: `Secret ${idx + 1}`,
          type: 'secret',
          isService: true,
          serviceType: 'secret',
          metadata: { secretId },
        });
      });
    }
    
    // Add exits as virtual locations
    if (currentLocation.metadata.exits && currentLocation.metadata.exits.length > 0) {
      currentLocation.metadata.exits.forEach((exit, idx) => {
        virtualServiceLocations.push({
          id: `service-exit-${exit.id}`,
          name: `Exit ${idx + 1}`,
          type: 'exit',
          isService: true,
          serviceType: 'exit',
          metadata: { exit },
        });
      });
    }
  }

  // Combine child locations with virtual service locations
  const allDisplayLocations = [...childLocations, ...virtualServiceLocations];

  // Generate positions for locations (simple grid layout for now)
  const locationsWithPositions = allDisplayLocations.map((loc, index) => {
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
      <div 
        className="absolute inset-0 overflow-hidden"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
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

        {/* Location Markers - with Pan & Zoom transform */}
        <div 
          className="absolute inset-0 transition-transform"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Empty State */}
          {childLocations.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center pointer-events-auto">
                <div className="text-6xl mb-4">🏁</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  ไม่มีสถานที่ภายใน
                </h3>
                <p className="text-gray-400 mb-6">
                  นี่คือจุดสิ้นสุดของการเดินทาง
                </p>
                {currentLocation && (
                  <div className="flex flex-col gap-3 items-center">
                    {/* สำรวจที่นี่ */}
                    <button
                      onClick={() => setSelectedLocation(currentLocation)}
                      className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center gap-2 font-bold shadow-xl text-lg"
                    >
                      <MapPin className="w-6 h-6" />
                      สำรวจ {currentLocation.name}
                    </button>
                    
                    {/* Navigation buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          if (currentLocation.parentId) {
                            router.push(`/world/${currentLocation.parentId}`);
                          } else {
                            router.push('/world');
                          }
                        }}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2 font-semibold shadow-lg"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        ย้อนกลับ
                      </button>
                      <button
                        onClick={() => router.push('/world')}
                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2 font-semibold shadow-lg"
                      >
                        <Home className="w-5 h-5" />
                        กลับหน้าแรก
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {locationsWithPositions.map((location: any) => {
            const isCurrentLocation = location.id === currentLocationId;
            const isCityOrTown = location.type === 'city' || location.type === 'town';
            const isService = !!(location as any).isService;
            
            // Check location features (only for real locations, not services)
            const hasBattle = !isService && !!(location.metadata?.battleMaps?.length || location.encounterTableId);
            const hasShop = !isService && !!(location.metadata?.shops?.length);
            const hasInn = !isService && !!(location.metadata?.services?.includes('inn'));
            const hasGuild = !isService && !!(location.metadata?.services?.includes('guild'));
            const hasQuest = !isService && (location.type === 'temple' || location.type === 'castle' || location.type === 'town');
            
            return (
              <button
                key={location.id}
                onClick={() => {
                  if (isService) {
                    // ถ้าคลิก service -> แสดงข้อความตาม service type
                    const serviceMessages: Record<string, string> = {
                      shop: '🏪 เปิดร้านค้า - Feature กำลังพัฒนา',
                      inn: '🏨 พักผ่อน - Feature กำลังพัฒนา',
                      guild: '🏛️ เข้าหอสมาคม - Feature กำลังพัฒนา',
                      battle: '⚔️ เข้าสู่การต่อสู้ - Feature กำลังพัฒนา',
                      npc: '👤 พูดคุยกับ NPC - Feature กำลังพัฒนา',
                      encounter: '💀 Random Encounter - Feature กำลังพัฒนา',
                      treasure: '💎 เปิดกล่องสมบัติ - Feature กำลังพัฒนา',
                      secret: '🔮 สำรวจความลับ - Feature กำลังพัฒนา',
                      exit: '🚪 ใช้ทางออก - Feature กำลังพัฒนา',
                    };
                    alert(serviceMessages[location.serviceType] || `${location.name} - Feature กำลังพัฒนา`);
                  } else if (isCurrentLocation) {
                    // ถ้าคลิกที่ current location -> เปิด detail modal
                    setSelectedLocation(location);
                  } else {
                    // ถ้าคลิก location อื่น -> navigate ไปยัง location นั้น
                    router.push(`/world/${location.id}`);
                  }
                }}
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
                  isService
                    ? location.serviceType === 'shop'
                      ? 'bg-green-600 border-green-400 group-hover:scale-110 group-hover:bg-green-500'
                      : location.serviceType === 'inn'
                      ? 'bg-blue-600 border-blue-400 group-hover:scale-110 group-hover:bg-blue-500'
                      : location.serviceType === 'guild'
                      ? 'bg-purple-600 border-purple-400 group-hover:scale-110 group-hover:bg-purple-500'
                      : location.serviceType === 'battle'
                      ? 'bg-red-600 border-red-400 group-hover:scale-110 group-hover:bg-red-500'
                      : location.serviceType === 'npc'
                      ? 'bg-cyan-600 border-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500'
                      : location.serviceType === 'encounter'
                      ? 'bg-orange-600 border-orange-400 group-hover:scale-110 group-hover:bg-orange-500'
                      : location.serviceType === 'treasure'
                      ? 'bg-yellow-600 border-yellow-400 group-hover:scale-110 group-hover:bg-yellow-500'
                      : location.serviceType === 'secret'
                      ? 'bg-indigo-600 border-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500'
                      : location.serviceType === 'exit'
                      ? 'bg-teal-600 border-teal-400 group-hover:scale-110 group-hover:bg-teal-500'
                      : 'bg-slate-600 border-slate-400 group-hover:scale-110 group-hover:bg-slate-500'
                    : isCurrentLocation
                    ? 'bg-amber-500 border-amber-300 scale-125'
                    : 'bg-purple-600 border-purple-400 group-hover:scale-110 group-hover:bg-purple-500'
                }`}>
                  <span className="text-2xl">
                    {isService
                      ? location.serviceType === 'shop'
                        ? '🏪'
                        : location.serviceType === 'inn'
                        ? '🏨'
                        : location.serviceType === 'guild'
                        ? '🏛️'
                        : location.serviceType === 'battle'
                        ? '⚔️'
                        : location.serviceType === 'npc'
                        ? '👤'
                        : location.serviceType === 'encounter'
                        ? '💀'
                        : location.serviceType === 'treasure'
                        ? '💎'
                        : location.serviceType === 'secret'
                        ? '🔮'
                        : location.serviceType === 'exit'
                        ? '🚪'
                        : '❓'
                      : isCityOrTown ? '🏰' : location.type === 'region' ? '🏔️' : '🗺️'
                    }
                  </span>
                  
                  {/* Current Location Indicator */}
                  {isCurrentLocation && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <div className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded shadow-lg animate-pulse">
                        YOU ARE HERE
                      </div>
                    </div>
                  )}
                  
                  {/* Fast Travel Indicator - Top Left */}
                  {!isService && location.isFastTravelPoint && (
                    <div className="absolute -top-2 -left-2 pointer-events-none">
                      <div className="w-6 h-6 bg-cyan-500 border-2 border-cyan-300 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <Navigation className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Feature Badges - Top Right of Marker (only for real locations) */}
                {!isService && (hasBattle || hasShop || hasInn || hasGuild || hasQuest) && (
                  <div className="absolute -top-2 -right-2 flex flex-col gap-1 pointer-events-none">
                    {hasBattle && (
                      <div className="px-1.5 py-0.5 bg-red-600/90 border border-red-400 rounded-full text-white flex items-center gap-0.5 shadow-lg backdrop-blur-sm" title="Battle Available">
                        <Swords className="w-3 h-3" />
                        {location.metadata?.battleMaps && location.metadata.battleMaps.length > 1 && (
                          <span className="text-[9px] font-bold">{location.metadata.battleMaps.length}</span>
                        )}
                      </div>
                    )}
                    {hasShop && (
                      <div className="px-1.5 py-0.5 bg-green-600/90 border border-green-400 rounded-full text-white flex items-center gap-0.5 shadow-lg backdrop-blur-sm" title="Shop">
                        <ShoppingBag className="w-3 h-3" />
                        {location.metadata?.shops && location.metadata.shops.length > 1 && (
                          <span className="text-[9px] font-bold">{location.metadata.shops.length}</span>
                        )}
                      </div>
                    )}
                    {hasInn && (
                      <div className="px-1.5 py-0.5 bg-blue-600/90 border border-blue-400 rounded-full text-white flex items-center gap-0.5 shadow-lg backdrop-blur-sm" title="Inn">
                        <Hotel className="w-3 h-3" />
                      </div>
                    )}
                    {hasGuild && (
                      <div className="px-1.5 py-0.5 bg-purple-600/90 border border-purple-400 rounded-full text-white flex items-center gap-0.5 shadow-lg backdrop-blur-sm" title="Guild">
                        <Users2 className="w-3 h-3" />
                      </div>
                    )}
                    {hasQuest && (
                      <div className="px-1.5 py-0.5 bg-amber-600/90 border border-amber-400 rounded-full text-white flex items-center gap-0.5 shadow-lg backdrop-blur-sm animate-pulse" title="Quest Available">
                        <Scroll className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                )}
                
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
                <div className="absolute top-full mt-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="px-3 py-2 bg-slate-900/95 border border-purple-500/50 rounded-lg text-xs text-gray-300 whitespace-nowrap shadow-xl">
                    <div className="font-semibold text-purple-400 capitalize">{location.type}</div>
                    
                    {/* Service Info */}
                    {isService && (
                      <div className="mt-1 text-[10px] text-gray-400">
                        {location.serviceType === 'shop' && 'ร้านค้า - ซื้อขายไอเทม'}
                        {location.serviceType === 'inn' && 'โรงแรม - พักฟื้น'}
                        {location.serviceType === 'guild' && 'หอสมาคม - รับเควส'}
                        {location.serviceType === 'battle' && 'สนามรบ - เข้าสู่การต่อสู้'}
                        {location.serviceType === 'npc' && 'NPC - พูดคุย/รับเควส'}
                        {location.serviceType === 'encounter' && 'การสุ่มเจอ - มอนสเตอร์'}
                        {location.serviceType === 'treasure' && 'สมบัติ - เปิดกล่อง'}
                        {location.serviceType === 'secret' && 'ความลับ - สำรวจ'}
                        {location.serviceType === 'exit' && 'ทางออก - เดินทาง'}
                      </div>
                    )}
                    
                    {/* Available Features (only for real locations) */}
                    {!isService && (hasBattle || hasShop || hasInn || hasGuild || hasQuest) && (
                      <div className="mt-2 space-y-1 text-[10px]">
                        {hasBattle && (
                          <div className="flex items-center gap-1 text-red-300">
                            <Swords className="w-3 h-3" /> Battle
                            {location.metadata?.battleMaps && ` (${location.metadata.battleMaps.length})`}
                          </div>
                        )}
                        {hasShop && (
                          <div className="flex items-center gap-1 text-green-300">
                            <ShoppingBag className="w-3 h-3" /> Shop
                            {location.metadata?.shops && ` (${location.metadata.shops.length})`}
                          </div>
                        )}
                        {hasInn && (
                          <div className="flex items-center gap-1 text-blue-300">
                            <Hotel className="w-3 h-3" /> Inn
                          </div>
                        )}
                        {hasGuild && (
                          <div className="flex items-center gap-1 text-purple-300">
                            <Users2 className="w-3 h-3" /> Guild
                          </div>
                        )}
                        {hasQuest && (
                          <div className="flex items-center gap-1 text-amber-300">
                            <Scroll className="w-3 h-3" /> Quest
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="text-gray-400 text-[10px] mt-2 border-t border-slate-700 pt-1">
                      {isService 
                        ? 'คลิกเพื่อใช้บริการ' 
                        : isCurrentLocation 
                        ? 'คลิกเพื่อดูรายละเอียด' 
                        : 'คลิกเพื่อเดินทาง'}
                    </div>
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
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  {currentLocation ? currentLocation.name : "แผนที่โลก Aethoria"}
                  {currentLocation && (
                    <span className="text-xs text-gray-400 font-normal capitalize">
                      ({currentLocation.type})
                    </span>
                  )}
                </h1>
                <p className="text-gray-400 text-xs">
                  สถานที่: {childLocations.length} | บริการ: {virtualServiceLocations.length} | 
                  🖱️ ลาก: Pan | 🎡 Scroll: Zoom
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Bottom Center */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto flex gap-4">
          {/* Fast Travel Button */}
          <button
            onClick={() => setShowFastTravelModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl transition-all flex items-center gap-2 font-bold shadow-2xl border-2 border-cyan-400/50 hover:scale-105 transform"
          >
            <Navigation className="w-5 h-5" />
            <span>Fast Travel</span>
          </button>
          
          {/* Explore Current Location Button */}
          {currentLocation && (
            <button
              onClick={() => setSelectedLocation(currentLocation)}
              className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl transition-all flex items-center gap-3 font-bold shadow-2xl text-lg border-2 border-amber-400/50 hover:scale-105 transform"
            >
              <MapPin className="w-6 h-6" />
              <span>สำรวจ {currentLocation.name}</span>
            </button>
          )}
        </div>

        {/* Navigation Buttons - Top Left */}
        <div className="absolute top-4 left-4 z-50 flex gap-2 pointer-events-auto">
          {/* Back to Parent */}
          {currentLocation && (
            <button
              onClick={() => {
                if (currentLocation.parentId) {
                  router.push(`/world/${currentLocation.parentId}`);
                } else {
                  router.push('/world');
                }
              }}
              className="px-4 py-2 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-xl hover:bg-slate-800/90 transition-colors flex items-center gap-2 shadow-lg"
            >
              <ChevronLeft className="w-4 h-4 text-purple-400" />
              <span className="text-white text-sm font-medium">ย้อนกลับ</span>
            </button>
          )}
          
          {/* Home Button */}
          {currentLocation && (
            <button
              onClick={() => router.push('/world')}
              className="p-2 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-xl hover:bg-slate-800/90 transition-colors shadow-lg"
              title="กลับสู่แผนที่โลก"
            >
              <Home className="w-5 h-5 text-purple-400" />
            </button>
          )}
        </div>

        {/* Minimap - Bottom Left */}
        <div className="absolute bottom-4 left-4 z-10">
          <div className="w-48 h-48 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl p-3">
            <div className="text-xs text-gray-400 mb-2 flex items-center justify-between">
              <span>Minimap</span>
              <span className="text-purple-400">{Math.round(zoom * 100)}%</span>
            </div>
            <div className="relative w-full h-full bg-slate-800/50 rounded overflow-hidden">
              {/* Viewport indicator */}
              <div 
                className="absolute border-2 border-green-400/60 bg-green-400/10 pointer-events-none"
                style={{
                  width: `${100 / zoom}%`,
                  height: `${100 / zoom}%`,
                  left: `${50 - (pan.x / (zoom * 2))}%`,
                  top: `${50 - (pan.y / (zoom * 2))}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
              
              {/* Location dots */}
              {locationsWithPositions.slice(0, 15).map((loc) => (
                <div
                  key={loc.id}
                  className={`absolute w-2 h-2 rounded-full ${
                    loc.id === currentLocationId ? 'bg-amber-400 ring-2 ring-amber-300' : 'bg-purple-400'
                  }`}
                  style={{
                    left: `${loc.x}%`,
                    top: `${loc.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Zoom Controls - Bottom Right */}
        <div className="absolute bottom-4 right-4 z-10">
          <div className="flex flex-col gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl p-2">
            {/* Zoom In */}
            <button
              onClick={handleZoomIn}
              className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors group"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5 text-gray-400 group-hover:text-purple-400" />
            </button>

            {/* Reset Zoom */}
            <button
              onClick={handleResetZoom}
              className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors group"
              title="Reset View"
            >
              <Maximize2 className="w-5 h-5 text-gray-400 group-hover:text-purple-400" />
            </button>

            {/* Zoom Out */}
            <button
              onClick={handleZoomOut}
              className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors group"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5 text-gray-400 group-hover:text-purple-400" />
            </button>

            {/* Zoom Level Indicator */}
            <div className="px-2 py-1 bg-slate-800/50 rounded text-center">
              <span className="text-xs text-gray-400">{Math.round(zoom * 100)}%</span>
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

        {/* Current Area Panel - Top Right (แสดง sibling locations + You are here) */}
        {currentLocation && siblingLocations.length > 0 && (
          showCurrentAreaPanel ? (
            <HUDPanel
              title="พื้นที่ปัจจุบัน"
              icon={<MapPin className="w-5 h-5" />}
              position="top-right"
              onClose={() => setShowCurrentAreaPanel(false)}
              maxWidth="350px"
              maxHeight="400px"
            >
              <div className="space-y-2 pointer-events-auto">
                <p className="text-gray-400 text-xs mb-3">
                  สถานที่ระดับเดียวกัน ({siblingLocations.length})
                </p>
                {siblingLocations.map((location) => {
                  const isCurrentLocation = location.id === currentLocationId;
                  return (
                    <button
                      key={location.id}
                      onClick={() => {
                        if (isCurrentLocation) {
                          // คลิก current location → เปิด detail modal เพื่อสำรวจ
                          setSelectedLocation(location);
                        } else {
                          // คลิก location อื่น → navigate
                          router.push(`/world/${location.id}`);
                        }
                      }}
                      className={`w-full p-3 rounded-lg border transition-all text-left ${
                        isCurrentLocation
                          ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-400/50 cursor-pointer hover:bg-amber-500/30'
                          : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 hover:border-purple-500'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">
                          {location.type === 'city' || location.type === 'town' 
                            ? '🏰' 
                            : location.type === 'region' 
                            ? '🏔️' 
                            : '🗺️'}
                        </span>
                        <span className={`text-sm font-medium ${
                          isCurrentLocation ? 'text-amber-300' : 'text-white'
                        }`}>
                          {location.name}
                        </span>
                        {isCurrentLocation && (
                          <span className="ml-auto px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded animate-pulse">
                            YOU ARE HERE
                          </span>
                        )}
                      </div>
                      <p className={`text-xs capitalize ${
                        isCurrentLocation ? 'text-amber-400/80' : 'text-gray-400'
                      }`}>
                        {location.type}
                      </p>
                      {isCurrentLocation ? (
                        <p className="text-xs text-amber-500/80 mt-1 font-medium">
                          👆 คลิกเพื่อสำรวจพื้นที่
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500 mt-1">
                          คลิกเพื่อเดินทาง →
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </HUDPanel>
          ) : (
            <HUDPanelToggle
              label="พื้นที่"
              icon={<MapPin className="w-4 h-4" />}
              onClick={() => setShowCurrentAreaPanel(true)}
              position="top-right"
            />
          )
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

        {/* Fast Travel Modal */}
        {showFastTravelModal && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] pointer-events-auto">
            <div className="bg-slate-900/95 border-2 border-cyan-500 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-700 bg-gradient-to-r from-cyan-900/50 to-blue-900/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Navigation className="w-6 h-6 text-cyan-400" />
                    <h2 className="text-2xl font-bold text-white">Fast Travel</h2>
                  </div>
                  <button
                    onClick={() => setShowFastTravelModal(false)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  เลือกสถานที่ที่ต้องการเดินทางไปทันที
                </p>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 gap-3">
                  {viewModel.locations
                    .filter((loc) => loc.isFastTravelPoint && loc.isDiscoverable)
                    .map((location) => {
                      const isCurrentLoc = location.id === currentLocationId;
                      const canTravel = !location.requiredLevel || true; // TODO: Check player level
                      
                      return (
                        <button
                          key={location.id}
                          onClick={() => {
                            if (!isCurrentLoc && canTravel) {
                              setShowFastTravelModal(false);
                              router.push(`/world/${location.id}`);
                            }
                          }}
                          disabled={isCurrentLoc || !canTravel}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            isCurrentLoc
                              ? 'bg-amber-500/20 border-amber-500 cursor-default'
                              : canTravel
                              ? 'bg-slate-800/50 border-slate-700 hover:border-cyan-500 hover:bg-slate-700/50 cursor-pointer'
                              : 'bg-slate-800/30 border-slate-800 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${
                              isCurrentLoc 
                                ? 'bg-amber-500 border-amber-300' 
                                : 'bg-cyan-600 border-cyan-400'
                            }`}>
                              <span className="text-2xl">
                                {location.type === 'city' || location.type === 'town'
                                  ? '🏰'
                                  : location.type === 'building' || location.type === 'tower'
                                  ? '🏛️'
                                  : location.type === 'area'
                                  ? '💎'
                                  : '🗺️'}
                              </span>
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-white">{location.name}</h3>
                                {isCurrentLoc && (
                                  <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded animate-pulse">
                                    YOU ARE HERE
                                  </span>
                                )}
                                <div className="w-5 h-5 bg-cyan-500 border-2 border-cyan-300 rounded-full flex items-center justify-center ml-auto">
                                  <Navigation className="w-3 h-3 text-white" />
                                </div>
                              </div>
                              <p className="text-sm text-gray-400 mb-2">{location.description}</p>
                              <div className="flex items-center gap-3 text-xs">
                                <span className="px-2 py-1 bg-slate-700 text-gray-300 rounded capitalize">
                                  {location.type}
                                </span>
                                {location.requiredLevel && (
                                  <span className="px-2 py-1 bg-purple-600/30 text-purple-300 rounded">
                                    Lv. {location.requiredLevel}+
                                  </span>
                                )}
                                {!isCurrentLoc && canTravel && (
                                  <span className="text-cyan-400 ml-auto">คลิกเพื่อเดินทาง →</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
      </GameLayoutOverlay>
    </GameLayout>
  );
}
