"use client";

import { WorldViewModel } from "@/src/presentation/presenters/world/WorldPresenter";
import { useWorldPresenter } from "@/src/presentation/presenters/world/useWorldPresenter";
import { LocationCard } from "./LocationCard";
import { Breadcrumb } from "./Breadcrumb";
import { Map, Globe, MapPin, Compass, Users, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useGameStore, getPartyStats } from "@/src/stores/gameStore";
import { useEffect } from "react";

interface WorldViewProps {
  initialViewModel?: WorldViewModel;
}

export function WorldView({ initialViewModel }: WorldViewProps) {
  const { party, setCurrentLocation: saveCurrentLocation } = useGameStore();
  const partyStats = getPartyStats(party);
  
  const {
    viewModel,
    loading,
    error,
    currentLocation,
    breadcrumb,
    navigateToLocation,
    setCurrentLocation,
  } = useWorldPresenter(initialViewModel);
  
  // Save location to game store when it changes
  useEffect(() => {
    if (currentLocation) {
      saveCurrentLocation(currentLocation.id);
    }
  }, [currentLocation?.id, saveCurrentLocation]);

  // Show loading only on initial load
  if (loading && !viewModel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">กำลังโหลดแผนที่โลก...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !viewModel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
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
    );
  }

  // Show empty state
  if (!viewModel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🗺️</div>
          <p className="text-gray-400 font-medium mb-2">ยังไม่มีข้อมูลแผนที่</p>
        </div>
      </div>
    );
  }

  // Check if party is empty
  if (party.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-8">
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
    );
  }

  // Get locations to display
  const locationsToShow = currentLocation
    ? viewModel.locations.filter((loc) => loc.parentId === currentLocation.id)
    : viewModel.rootLocations;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/"
            className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 rounded-lg transition-colors"
          >
            ← หน้าแรก
          </Link>
          <Link
            href="/characters"
            className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 rounded-lg transition-colors"
          >
            ตัวละคร
          </Link>
          <Link
            href="/party"
            className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 rounded-lg transition-colors"
          >
            ทีม
          </Link>
        </div>

        {/* Party Display */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-purple-400" />
              <div>
                <h3 className="text-white font-semibold">ทีมปัจจุบัน</h3>
                <p className="text-gray-400 text-sm">
                  {party.length} สมาชิก | HP: {partyStats.totalHp.toLocaleString()} | MP: {partyStats.totalMp.toLocaleString()}
                </p>
              </div>
            </div>
            <Link
              href="/party"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
            >
              จัดการทีม
            </Link>
          </div>
          <div className="mt-3 flex gap-2">
            {party.map((member: import("@/src/stores/gameStore").PartyMember) => (
              <div
                key={member.character.id}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg"
              >
                <span className="text-white text-sm font-medium">
                  {member.character.name}
                </span>
                {member.isLeader && (
                  <span className="text-amber-400 text-xs">👑</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Map className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">
              {currentLocation ? currentLocation.name : "แผนที่โลก"}
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            {currentLocation
              ? currentLocation.description
              : "สำรวจโลกแฟนตาซีกว้างใหญ่"}
          </p>
        </div>

        {/* Breadcrumb */}
        {breadcrumb.length > 0 && (
          <Breadcrumb
            path={breadcrumb}
            onNavigate={(locationId) => {
              if (locationId === "root") {
                // Go back to root (show all continents)
                setCurrentLocation(null);
              } else {
                // Navigate to specific location
                navigateToLocation(locationId);
              }
            }}
          />
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-purple-400" />
              <div className="text-sm text-gray-400">สถานที่ทั้งหมด</div>
            </div>
            <div className="text-3xl font-bold text-purple-400">
              {viewModel.totalLocations}
            </div>
          </div>

          <div className="bg-blue-900/30 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              <div className="text-sm text-gray-400">ค้นพบแล้ว</div>
            </div>
            <div className="text-3xl font-bold text-blue-400">
              {viewModel.discoveredCount}
            </div>
          </div>

          <div className="bg-green-900/30 backdrop-blur-sm border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Map className="w-5 h-5 text-green-400" />
              <div className="text-sm text-gray-400">ทวีป</div>
            </div>
            <div className="text-3xl font-bold text-green-400">
              {viewModel.continentCount}
            </div>
          </div>

          <div className="bg-amber-900/30 backdrop-blur-sm border border-amber-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <div className="text-sm text-gray-400">เมือง</div>
            </div>
            <div className="text-3xl font-bold text-amber-400">
              {viewModel.cityCount}
            </div>
          </div>
        </div>

        {/* Locations Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {currentLocation ? "สถานที่ภายใน" : "ทวีปหลัก"}
          </h2>
          
          {locationsToShow.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locationsToShow.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  onClick={() => navigateToLocation(location.id)}
                  isDiscovered={location.isDiscoverable}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">ไม่มีสถานที่ภายใน</p>
              <button
                onClick={() => setCurrentLocation(null)}
                className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
              >
                ← กลับไปแผนที่หลัก
              </button>
            </div>
          )}
        </div>

        {/* Error Toast */}
        {error && viewModel && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
