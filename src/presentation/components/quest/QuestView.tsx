"use client";

import { useState } from "react";
import { QuestViewModel } from "@/src/presentation/presenters/quest/QuestPresenter";
import { useQuestPresenter } from "@/src/presentation/presenters/quest/useQuestPresenter";
import { QuestCard } from "./QuestCard";
import { QuestDetail } from "./QuestDetail";
import { Quest, QuestType, QuestStatus } from "@/src/domain/types/quest.types";
import { Scroll, Filter, Search, Award, Target, CheckCircle } from "lucide-react";
import Link from "next/link";

interface QuestViewProps {
  initialViewModel?: QuestViewModel;
}

export function QuestView({ initialViewModel }: QuestViewProps) {
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

  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  // Show loading only on initial load
  if (loading && !viewModel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading quests...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !viewModel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-red-400 font-medium mb-2">Failed to load quests</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!viewModel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📜</div>
          <p className="text-gray-400 font-medium mb-2">No quests available</p>
        </div>
      </div>
    );
  }

  // Filter quests based on selected filters
  let filteredQuests = viewModel.allQuests;
  
  if (selectedType !== "all") {
    filteredQuests = filteredQuests.filter((q) => q.type === selectedType);
  }
  
  if (selectedStatus !== "all") {
    filteredQuests = filteredQuests.filter((q) => q.status === selectedStatus);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Navigation */}
        <div className="mb-6 flex gap-2">
          <Link
            href="/"
            className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 rounded-lg transition-colors"
          >
            ← Home
          </Link>
          <Link
            href="/characters"
            className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 rounded-lg transition-colors"
          >
            Characters
          </Link>
          <Link
            href="/party"
            className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 rounded-lg transition-colors"
          >
            Party
          </Link>
          <Link
            href="/world"
            className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 rounded-lg transition-colors"
          >
            World
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Scroll className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Quest Log</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Track your adventures and complete quests to earn rewards
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl">
            <div className="flex items-center gap-3">
              <Scroll className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-gray-400 text-sm">Total Quests</p>
                <p className="text-2xl font-bold text-white">{viewModel.stats.total}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-gray-400 text-sm">Active</p>
                <p className="text-2xl font-bold text-purple-400">{viewModel.stats.active}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-900/50 backdrop-blur-sm border border-green-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-400">{viewModel.stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-900/50 backdrop-blur-sm border border-blue-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-gray-400 text-sm">Available</p>
                <p className="text-2xl font-bold text-blue-400">{viewModel.stats.available}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Type Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-400">Type:</span>
              {(["all", "main", "side", "event", "daily", "bounty"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === type
                      ? "bg-purple-600 text-white"
                      : "bg-slate-800 text-gray-400 hover:bg-slate-700"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-400">Status:</span>
              {(["all", "available", "active", "completed", "locked"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
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
        </div>

        {/* Quest Grid */}
        {filteredQuests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onClick={() => setSelectedQuest(quest)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No quests found with current filters</p>
          </div>
        )}

        {/* Quest Detail Modal */}
        <QuestDetail
          quest={selectedQuest}
          isOpen={!!selectedQuest}
          onClose={() => setSelectedQuest(null)}
          onStart={startQuest}
          onComplete={completeQuest}
          onAbandon={abandonQuest}
        />

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
