"use client";

import { Quest } from "@/src/domain/types/quest.types";
import { Scroll, MapPin, Clock, Star, CheckCircle, Lock, Play } from "lucide-react";

interface QuestCardProps {
  quest: Quest;
  onClick?: () => void;
}

export function QuestCard({ quest, onClick }: QuestCardProps) {
  // Quest type colors
  const typeColors = {
    main: "from-amber-500 to-orange-500",
    side: "from-blue-500 to-cyan-500",
    event: "from-purple-500 to-pink-500",
    daily: "from-green-500 to-emerald-500",
    bounty: "from-red-500 to-rose-500",
  };

  // Quest status colors
  const statusColors = {
    locked: "bg-slate-800 border-slate-700",
    available: "bg-slate-900/50 border-purple-500/30 hover:border-purple-500/60",
    active: "bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500",
    completed: "bg-green-900/20 border-green-500/30",
    failed: "bg-red-900/20 border-red-500/30",
  };

  // Quest status icons
  const statusIcons = {
    locked: <Lock className="w-5 h-5 text-slate-500" />,
    available: <Scroll className="w-5 h-5 text-purple-400" />,
    active: <Play className="w-5 h-5 text-purple-400" />,
    completed: <CheckCircle className="w-5 h-5 text-green-400" />,
    failed: <CheckCircle className="w-5 h-5 text-red-400" />,
  };

  // Calculate progress
  const totalObjectives = quest.objectives.length;
  const completedObjectives = quest.objectives.filter((obj) => obj.isCompleted).length;
  const progress = totalObjectives > 0 ? (completedObjectives / totalObjectives) * 100 : 0;

  return (
    <div
      onClick={quest.status !== "locked" ? onClick : undefined}
      className={`relative border-2 rounded-xl p-4 transition-all duration-300 ${
        statusColors[quest.status]
      } ${quest.status !== "locked" ? "cursor-pointer hover:scale-[1.02]" : "opacity-60"}`}
    >
      {/* Quest Type Badge */}
      <div className="absolute -top-3 -right-3">
        <div
          className={`px-3 py-1 bg-gradient-to-r ${typeColors[quest.type]} text-white text-xs font-bold rounded-full shadow-lg`}
        >
          {quest.type.toUpperCase()}
        </div>
      </div>

      {/* Status Icon */}
      <div className="absolute top-4 right-4">{statusIcons[quest.status]}</div>

      {/* Quest Info */}
      <div className="pr-8">
        <h3 className="text-lg font-bold text-white mb-2">{quest.name}</h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-3">{quest.description}</p>

        {/* Quest Details */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>Location</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400" />
            <span>Lv {quest.requiredLevel}</span>
          </div>
          {quest.timeLimit && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-red-400" />
              <span>{quest.timeLimit}m</span>
            </div>
          )}
        </div>

        {/* Progress Bar (for active quests) */}
        {quest.status === "active" && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>
                {completedObjectives}/{totalObjectives}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Rewards */}
        <div className="flex gap-3 text-xs">
          {quest.rewards.exp > 0 && (
            <div className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
              +{quest.rewards.exp} EXP
            </div>
          )}
          {quest.rewards.gold > 0 && (
            <div className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded">
              +{quest.rewards.gold} Gold
            </div>
          )}
          {quest.rewards.items && quest.rewards.items.length > 0 && (
            <div className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
              +{quest.rewards.items.length} Items
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
