"use client";

import { useState, useEffect } from "react";
import { Quest } from "@/src/domain/types/quest.types";
import { QuestViewModel } from "@/src/presentation/presenters/quest/QuestPresenter";
import { useQuestPresenter } from "@/src/presentation/presenters/quest/useQuestPresenter";
import { GameLayout, GameLayoutOverlay } from "@/src/presentation/components/layout/GameLayout";
import { HUDPanel, HUDPanelToggle } from "@/src/presentation/components/layout/HUDPanel";
import { QuestMapView } from "./QuestMapView";
import { QuestStatsPanel } from "./QuestStatsPanel";
import { QuestDetailCompact } from "./QuestDetailCompact";
import { Scroll, Filter, ListChecks, BarChart3 } from "lucide-react";
import Link from "next/link";

interface QuestFullViewProps {
  initialViewModel?: QuestViewModel;
}

export function QuestFullView({ initialViewModel }: QuestFullViewProps) {
  const {
    viewModel,
    loading,
    error,
    selectedType,
    selectedStatus,
    setSelectedType,
    setSelectedStatus,
    startQuest,
    completeQuest,
    abandonQuest,
  } = useQuestPresenter(initialViewModel);

  // UI State
  const [showQuestLogPanel, setShowQuestLogPanel] = useState(true);
  const [showStatsPanel, setShowStatsPanel] = useState(true);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  // Pan & Zoom state
  const [zoom, setZoom] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("questMapZoom");
      return saved ? parseFloat(saved) : 1;
    }
    return 1;
  });
  const [pan, setPan] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("questMapPan");
      return saved ? JSON.parse(saved) : { x: 0, y: 0 };
    }
    return { x: 0, y: 0 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Save zoom/pan to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("questMapZoom", zoom.toString());
    }
  }, [zoom]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("questMapPan", JSON.stringify(pan));
    }
  }, [pan]);

  // Pan & Zoom handlers
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
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

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Loading state
  if (loading && !viewModel) {
    return (
      <GameLayout>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading quests...</p>
          </div>
        </div>
      </GameLayout>
    );
  }

  // Error state
  if (error && !viewModel) {
    return (
      <GameLayout>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-400 font-medium mb-2">Failed to load quests</p>
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

  // Empty state
  if (!viewModel) {
    return (
      <GameLayout>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📜</div>
            <p className="text-gray-400 font-medium mb-2">No quests available</p>
          </div>
        </div>
      </GameLayout>
    );
  }

  // Filter quests
  let filteredQuests = viewModel.allQuests;
  if (selectedType !== "all") {
    filteredQuests = filteredQuests.filter((q) => q.type === selectedType);
  }
  if (selectedStatus !== "all") {
    filteredQuests = filteredQuests.filter((q) => q.status === selectedStatus);
  }

  // Generate positions for quests (responsive grid) - Improved mobile spacing
  const questsWithPositions = filteredQuests.map((quest, index) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const isTablet = typeof window !== "undefined" && window.innerWidth >= 768 && window.innerWidth < 1024;
    
    let columns, spacingX, spacingY, startX, startY;
    
    if (isMobile) {
      columns = 2; // 2 columns on mobile (wider spacing)
      spacingX = 40;
      spacingY = 30;
      startX = 20;
      startY = 25;
    } else if (isTablet) {
      columns = 3;
      spacingX = 28;
      spacingY = 25;
      startX = 18;
      startY = 22;
    } else {
      columns = 5;
      spacingX = 16;
      spacingY = 20;
      startX = 12;
      startY = 20;
    }

    const col = index % columns;
    const row = Math.floor(index / columns);
    const x = startX + col * spacingX;
    const y = startY + row * spacingY;

    return { ...quest, x, y };
  });

  // Handlers
  const handleQuestClick = (quest: Quest) => {
    setSelectedQuest(quest);
  };

  const handleQuestAction = async (action: "start" | "complete" | "abandon", questId: string) => {
    try {
      switch (action) {
        case "start":
          await startQuest(questId);
          break;
        case "complete":
          await completeQuest(questId);
          break;
        case "abandon":
          await abandonQuest(questId);
          break;
      }
      setSelectedQuest(null);
    } catch (err) {
      console.error(`Failed to ${action} quest:`, err);
    }
  };

  return (
    <GameLayout>
      {/* Quest Map View */}
      <QuestMapView
        quests={questsWithPositions}
        onQuestClick={handleQuestClick}
        zoom={zoom}
        setZoom={setZoom}
        pan={pan}
        isDragging={isDragging}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onResetView={handleResetView}
      />

      {/* HUD Overlays */}
      <GameLayoutOverlay>
        {/* Quest Log Panel - Top Left - Mobile Optimized */}
        {showQuestLogPanel ? (
          <HUDPanel
            title="Active Quests"
            icon={<ListChecks className="w-5 h-5" />}
            position="top-left"
            closable
            onClose={() => setShowQuestLogPanel(false)}
            maxHeight="min(350px, 50vh)"
            maxWidth="min(320px, 85vw)"
          >
            <div className="space-y-2">
              {viewModel.activeQuests.length > 0 ? (
                viewModel.activeQuests.map((quest) => (
                  <button
                    key={quest.id}
                    onClick={() => setSelectedQuest(quest)}
                    className="w-full p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-purple-500 rounded-lg transition-all text-left group"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0">
                        <Scroll className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm truncate group-hover:text-purple-300 transition-colors">
                          {quest.name}
                        </h3>
                        <p className="text-gray-400 text-xs capitalize">{quest.type}</p>
                        <div className="mt-1 flex items-center gap-1">
                          <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                              style={{
                                width: `${(quest.objectives.filter((o) => o.isCompleted).length / quest.objectives.length) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-500">
                            {quest.objectives.filter((o) => o.isCompleted).length}/{quest.objectives.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8">
                  <Scroll className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No active quests</p>
                  <p className="text-gray-500 text-xs mt-1">Start a quest from the map!</p>
                </div>
              )}
            </div>
          </HUDPanel>
        ) : (
          <HUDPanelToggle
            label="Active"
            icon={<ListChecks className="w-4 h-4" />}
            onClick={() => setShowQuestLogPanel(true)}
            position="top-left"
          />
        )}

        {/* Stats Panel - Top Right - Mobile Optimized */}
        {showStatsPanel ? (
          <HUDPanel
            title="Quest Statistics"
            icon={<BarChart3 className="w-5 h-5" />}
            position="top-right"
            closable
            onClose={() => setShowStatsPanel(false)}
            maxHeight="min(280px, 45vh)"
            maxWidth="min(260px, 80vw)"
          >
            <QuestStatsPanel stats={viewModel.stats} />
          </HUDPanel>
        ) : (
          <HUDPanelToggle
            label="Stats"
            icon={<BarChart3 className="w-4 h-4" />}
            onClick={() => setShowStatsPanel(true)}
            position="top-right"
          />
        )}

        {/* Filters Panel - Bottom Left - Mobile Optimized */}
        {showFiltersPanel && (
          <HUDPanel
            title="Filters"
            icon={<Filter className="w-5 h-5" />}
            position="bottom-left"
            closable
            onClose={() => setShowFiltersPanel(false)}
            maxHeight="min(380px, 55vh)"
            maxWidth="min(320px, 85vw)"
          >
            <div className="space-y-4">
              {/* Type Filter */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-2">Quest Type</h3>
                <div className="flex flex-wrap gap-2">
                  {(["all", "main", "side", "event", "daily", "bounty"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedType === type
                          ? "bg-purple-600 text-white"
                          : "bg-slate-800 text-gray-400 hover:bg-slate-700"
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-2">Status</h3>
                <div className="flex flex-wrap gap-2">
                  {(["all", "available", "active", "completed", "locked"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedStatus === status
                          ? "bg-purple-600 text-white"
                          : "bg-slate-800 text-gray-400 hover:bg-slate-700"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSelectedType("all");
                  setSelectedStatus("all");
                }}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
              >
                🔄 Reset Filters
              </button>
            </div>
          </HUDPanel>
        )}

      </GameLayoutOverlay>

      {/* Filter Toggle Button - Outside overlay to avoid Pan/Zoom blocking */}
      {!showFiltersPanel && (
        <div className="fixed bottom-4 left-4 z-[100] pointer-events-auto">
          <button
            onClick={() => setShowFiltersPanel(true)}
            className="px-4 py-2 bg-slate-900/80 hover:bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg transition-colors text-white text-sm flex items-center gap-2 shadow-lg"
          >
            <Filter className="w-4 h-4" />
            Filters
            {(selectedType !== "all" || selectedStatus !== "all") && (
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            )}
          </button>
        </div>
      )}

      {/* Quest Detail Modal - Compact */}
      <QuestDetailCompact
        quest={selectedQuest}
        isOpen={!!selectedQuest}
        onClose={() => setSelectedQuest(null)}
        onStart={(questId: string) => handleQuestAction("start", questId)}
        onComplete={(questId: string) => handleQuestAction("complete", questId)}
        onAbandon={(questId: string) => handleQuestAction("abandon", questId)}
      />

      {/* Error Toast */}
      {error && viewModel && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <span className="mr-2">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}
    </GameLayout>
  );
}
