"use client";

import { LocationDetailViewModel } from "@/src/presentation/presenters/location/LocationDetailPresenter";
import { useLocationDetailPresenter } from "@/src/presentation/presenters/location/useLocationDetailPresenter";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  ArrowLeft,
  Swords,
  Users,
  Scroll,
  Shield,
  Skull,
  Star,
  ShoppingBag,
  Home as HomeIcon,
  Hammer,
  Building,
  AlertTriangle,
} from "lucide-react";

interface LocationDetailViewProps {
  initialViewModel?: LocationDetailViewModel;
  locationId?: string;
  hideBackButton?: boolean; // Option to hide back button when embedded in WorldView
  hideHeader?: boolean; // Option to hide header (icon + title) when embedded
  hideStats?: boolean; // Option to hide stats cards when embedded
  compact?: boolean; // Compact mode for embedding
}

export function LocationDetailView({
  initialViewModel,
  locationId,
  hideBackButton = false,
  hideHeader = false,
  hideStats = false,
  compact = false,
}: LocationDetailViewProps) {
  const router = useRouter();
  const {
    viewModel,
    loading,
    error,
    enterBattle,
    startQuest,
    talkToNPC,
    accessService,
  } = useLocationDetailPresenter(locationId, initialViewModel);

  // Show loading state
  if (loading && !viewModel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading location...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !viewModel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-red-400 font-medium mb-2">Failed to load location</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!viewModel?.location) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🗺️</div>
          <p className="text-gray-400 font-medium mb-4">Location not found</p>
          <Link
            href="/world"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            ← Back to World Map
          </Link>
        </div>
      </div>
    );
  }

  const { location, npcs, availableQuests, enemies, battleMaps, services, stats } =
    viewModel;

  // Danger level colors
  const dangerColors = {
    1: "text-green-400 bg-green-500/20 border-green-500/30",
    2: "text-blue-400 bg-blue-500/20 border-blue-500/30",
    3: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30",
    4: "text-orange-400 bg-orange-500/20 border-orange-500/30",
    5: "text-red-400 bg-red-500/20 border-red-500/30",
  };

  const dangerLabels = {
    1: "Low",
    2: "Medium",
    3: "High",
    4: "Very High",
    5: "Extreme",
  };

  return (
    <div className={compact ? "" : "min-h-screen p-8"}>
      <div className={compact ? "" : "max-w-7xl mx-auto"}>
        {/* Back Button */}
        {!hideBackButton && (
          <Link
            href="/world"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 rounded-lg transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to World Map
          </Link>
        )}

        {/* Header */}
        {!hideHeader && (
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">{location.name}</h1>
                  <p className="text-gray-400 text-lg capitalize">{location.type}</p>
                </div>
              </div>

              {/* Danger Level Badge */}
              <div
                className={`px-4 py-2 rounded-lg border ${
                  dangerColors[stats.dangerLevel as keyof typeof dangerColors]
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  <div>
                    <p className="text-xs opacity-75">Danger Level</p>
                    <p className="font-bold">
                      {dangerLabels[stats.dangerLevel as keyof typeof dangerLabels]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed">{location.description}</p>
          </div>
        )}

        {/* Stats Cards */}
        {!hideStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-gray-400 text-sm">Recommended Level</p>
                <p className="text-2xl font-bold text-white">{stats.recommendedLevel}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-900/50 backdrop-blur-sm border border-red-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <Skull className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-gray-400 text-sm">Enemies</p>
                <p className="text-2xl font-bold text-red-400">{stats.enemyCount}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <Scroll className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-gray-400 text-sm">Quests</p>
                <p className="text-2xl font-bold text-purple-400">{stats.questCount}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-900/50 backdrop-blur-sm border border-blue-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-gray-400 text-sm">NPCs</p>
                <p className="text-2xl font-bold text-blue-400">{npcs.length}</p>
              </div>
            </div>
          </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Battle Section */}
            {battleMaps.length > 0 && (
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Swords className="w-6 h-6 text-red-400" />
                  Battle Arena
                </h2>
                <p className="text-gray-400 mb-4">
                  Enter battle to gain experience and rewards
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {battleMaps.map((map) => (
                    <div
                      key={map.id}
                      className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg"
                    >
                      <h3 className="text-white font-semibold mb-2">{map.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">{map.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          Grid: {map.width}x{map.height}
                        </div>
                        <button
                          onClick={() => {
                            enterBattle(map.id);
                            router.push(`/battle/${map.id}`);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-lg transition-all font-semibold flex items-center gap-2"
                        >
                          <Swords className="w-4 h-4" />
                          Enter Battle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enemies Preview */}
            {enemies.length > 0 && (
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Skull className="w-6 h-6 text-red-400" />
                  Enemies
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {enemies.map((enemy) => (
                    <div
                      key={enemy.id}
                      className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg text-center"
                    >
                      <div className="text-3xl mb-2">👹</div>
                      <p className="text-white font-medium text-sm">{enemy.name}</p>
                      <p className="text-gray-400 text-xs">Lv {enemy.level}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Quests */}
            {availableQuests.length > 0 && (
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Scroll className="w-6 h-6 text-purple-400" />
                  Available Quests
                </h2>
                <div className="space-y-3">
                  {availableQuests.map((quest) => (
                    <div
                      key={quest.id}
                      className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-purple-500/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-1">{quest.name}</h3>
                          <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                            {quest.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>Lv {quest.requiredLevel}</span>
                            <span>•</span>
                            <span className="capitalize">{quest.type}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => startQuest(quest.id)}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Services */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-400" />
                Services
              </h2>
              <div className="space-y-2">
                {services.hasShop && (
                  <button
                    onClick={() => accessService("shop")}
                    className="w-full p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-5 h-5 text-green-400" />
                      <span className="text-white">Shop</span>
                    </div>
                  </button>
                )}
                {services.hasInn && (
                  <button
                    onClick={() => accessService("inn")}
                    className="w-full p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <HomeIcon className="w-5 h-5 text-blue-400" />
                      <span className="text-white">Inn</span>
                    </div>
                  </button>
                )}
                {services.hasGuild && (
                  <button
                    onClick={() => accessService("guild")}
                    className="w-full p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-purple-400" />
                      <span className="text-white">Guild</span>
                    </div>
                  </button>
                )}
                {services.hasBlacksmith && (
                  <button
                    onClick={() => accessService("blacksmith")}
                    className="w-full p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Hammer className="w-5 h-5 text-orange-400" />
                      <span className="text-white">Blacksmith</span>
                    </div>
                  </button>
                )}
                {!services.hasShop &&
                  !services.hasInn &&
                  !services.hasGuild &&
                  !services.hasBlacksmith && (
                    <p className="text-gray-400 text-sm text-center py-4">
                      No services available
                    </p>
                  )}
              </div>
            </div>

            {/* NPCs */}
            {npcs.length > 0 && (
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  NPCs
                </h2>
                <div className="space-y-2">
                  {npcs.map((npc) => (
                    <button
                      key={npc.id}
                      onClick={() => talkToNPC(npc.id)}
                      className="w-full p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-xl">
                          👤
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{npc.name}</p>
                          <p className="text-gray-400 text-xs capitalize">{npc.class}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
