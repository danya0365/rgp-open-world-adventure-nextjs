"use client";

import { Quest } from "@/src/domain/types/quest.types";
import { Modal } from "@/src/presentation/components/ui";
import {
  Star,
  Clock,
  Award,
  Coins,
  Play,
  CheckCircle,
  XCircle,
  Target,
} from "lucide-react";

interface QuestDetailCompactProps {
  quest: Quest | null;
  isOpen: boolean;
  onClose: () => void;
  onStart?: (questId: string) => void;
  onComplete?: (questId: string) => void;
  onAbandon?: (questId: string) => void;
}

export function QuestDetailCompact({
  quest,
  isOpen,
  onClose,
  onStart,
  onComplete,
  onAbandon,
}: QuestDetailCompactProps) {
  if (!quest) return null;

  // Quest type colors
  const typeColors = {
    main: "from-amber-500 to-orange-500",
    side: "from-blue-500 to-cyan-500",
    event: "from-purple-500 to-pink-500",
    daily: "from-green-500 to-emerald-500",
    bounty: "from-red-500 to-rose-500",
  };

  // Calculate progress
  const totalObjectives = quest.objectives.length;
  const completedObjectives = quest.objectives.filter((obj) => obj.isCompleted).length;
  const isAllObjectivesComplete = totalObjectives > 0 && completedObjectives === totalObjectives;
  const progressPercent = totalObjectives > 0 ? (completedObjectives / totalObjectives) * 100 : 0;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={quest.name} 
      size="md"
      className="max-h-[85vh]"
    >
      <div className="space-y-4">
        {/* Header - Type & Level */}
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className={`px-3 py-1 bg-gradient-to-r ${typeColors[quest.type]} text-white text-xs font-bold rounded shadow-lg`}
          >
            {quest.type.toUpperCase()}
          </div>
          <div className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-gray-300 flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400" />
            Lv.{quest.requiredLevel}
          </div>
          {quest.timeLimit && (
            <div className="px-2 py-1 bg-red-900/30 border border-red-500/30 rounded text-xs text-red-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {quest.timeLimit}m
            </div>
          )}
          {quest.isRepeatable && (
            <div className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
              🔄
            </div>
          )}
        </div>

        {/* Description - Compact */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
            {quest.description}
          </p>
        </div>

        {/* Objectives - Compact Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              Objectives
            </h3>
            <span className="text-xs text-gray-400">
              {completedObjectives}/{totalObjectives}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Objectives List - Compact */}
          <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
            {quest.objectives.map((obj) => (
              <div
                key={obj.id}
                className={`flex items-start gap-2 text-xs p-2 rounded ${
                  obj.isCompleted
                    ? "bg-green-900/20 border border-green-500/20"
                    : "bg-slate-800/50 border border-slate-700"
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {obj.isCompleted ? (
                    <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <div className="w-3.5 h-3.5 border-2 border-slate-600 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`${obj.isCompleted ? "text-green-400" : "text-gray-300"}`}>
                    {obj.description}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {obj.current}/{obj.required}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards - Compact */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Rewards
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {quest.rewards.exp > 0 && (
              <div className="flex items-center gap-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded">
                <Award className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-[10px] text-gray-400">EXP</p>
                  <p className="text-xs font-bold text-blue-400">+{quest.rewards.exp}</p>
                </div>
              </div>
            )}
            {quest.rewards.gold > 0 && (
              <div className="flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded">
                <Coins className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-[10px] text-gray-400">Gold</p>
                  <p className="text-xs font-bold text-amber-400">+{quest.rewards.gold}</p>
                </div>
              </div>
            )}
            {quest.rewards.items && quest.rewards.items.length > 0 && (
              <div className="col-span-2 p-2 bg-purple-500/10 border border-purple-500/30 rounded">
                <p className="text-[10px] text-gray-400 mb-1">Items</p>
                <div className="flex flex-wrap gap-1">
                  {quest.rewards.items.map((item, index) => (
                    <div
                      key={index}
                      className="px-1.5 py-0.5 bg-slate-800 text-gray-300 text-[10px] rounded"
                    >
                      x{item.quantity}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions - Compact */}
        <div className="flex gap-2 pt-3 border-t border-slate-700">
          {quest.status === "available" && onStart && (
            <button
              onClick={() => {
                onStart(quest.id);
                onClose();
              }}
              className="flex-1 px-3 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all font-semibold flex items-center justify-center gap-2 text-sm"
            >
              <Play className="w-4 h-4" />
              Start
            </button>
          )}

          {quest.status === "active" && isAllObjectivesComplete && onComplete && (
            <button
              onClick={() => {
                onComplete(quest.id);
                onClose();
              }}
              className="flex-1 px-3 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all font-semibold flex items-center justify-center gap-2 text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Complete
            </button>
          )}

          {quest.status === "active" && onAbandon && (
            <button
              onClick={() => {
                if (confirm("Abandon this quest?")) {
                  onAbandon(quest.id);
                  onClose();
                }
              }}
              className="px-3 py-2.5 bg-red-900/50 hover:bg-red-800/50 text-white rounded-lg transition-all font-semibold flex items-center justify-center gap-2 text-sm"
            >
              <XCircle className="w-4 h-4" />
              Abandon
            </button>
          )}

          {quest.status === "completed" && (
            <div className="flex-1 px-3 py-2.5 bg-green-900/30 border border-green-500/30 text-green-400 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4" />
              Completed
            </div>
          )}

          {quest.status === "locked" && (
            <div className="flex-1 px-3 py-2.5 bg-slate-800 border border-slate-700 text-gray-400 rounded-lg font-semibold text-center text-sm">
              🔒 Locked
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
