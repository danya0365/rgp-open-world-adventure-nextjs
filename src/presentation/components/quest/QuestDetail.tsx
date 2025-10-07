"use client";

import { Quest } from "@/src/domain/types/quest.types";
import { Modal } from "@/src/presentation/components/ui";
import { ObjectiveTracker } from "./ObjectiveTracker";
import { 
  MapPin, 
  Star, 
  Clock, 
  Award, 
  Coins, 
  Package,
  User,
  Scroll,
  Play,
  CheckCircle,
  XCircle
} from "lucide-react";

interface QuestDetailProps {
  quest: Quest | null;
  isOpen: boolean;
  onClose: () => void;
  onStart?: (questId: string) => void;
  onComplete?: (questId: string) => void;
  onAbandon?: (questId: string) => void;
}

export function QuestDetail({
  quest,
  isOpen,
  onClose,
  onStart,
  onComplete,
  onAbandon,
}: QuestDetailProps) {
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={quest.name} size="lg">
      <div className="space-y-6">
        {/* Quest Type Badge */}
        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-2 bg-gradient-to-r ${typeColors[quest.type]} text-white text-sm font-bold rounded-lg shadow-lg`}
          >
            {quest.type.toUpperCase()} QUEST
          </div>
          {quest.isRepeatable && (
            <div className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded">
              Repeatable
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Scroll className="w-5 h-5 text-purple-400" />
            Description
          </h3>
          <p className="text-gray-300 leading-relaxed">{quest.description}</p>
        </div>

        {/* Story (if available) */}
        {quest.story && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Story</h3>
            <p className="text-gray-400 text-sm leading-relaxed italic">{quest.story}</p>
          </div>
        )}

        {/* Quest Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-gray-300">
            <Star className="w-5 h-5 text-amber-400" />
            <span className="text-sm">Required Level: {quest.requiredLevel}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-5 h-5 text-purple-400" />
            <span className="text-sm">Location</span>
          </div>
          {quest.npcId && (
            <div className="flex items-center gap-2 text-gray-300">
              <User className="w-5 h-5 text-blue-400" />
              <span className="text-sm">Quest Giver</span>
            </div>
          )}
          {quest.timeLimit && (
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-5 h-5 text-red-400" />
              <span className="text-sm">Time Limit: {quest.timeLimit}m</span>
            </div>
          )}
        </div>

        {/* Objectives */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Objectives ({completedObjectives}/{totalObjectives})
          </h3>
          <ObjectiveTracker objectives={quest.objectives} />
        </div>

        {/* Rewards */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Rewards
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quest.rewards.exp > 0 && (
              <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <Award className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-400">Experience</p>
                  <p className="text-sm font-bold text-blue-400">+{quest.rewards.exp} EXP</p>
                </div>
              </div>
            )}
            {quest.rewards.gold > 0 && (
              <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <Coins className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-xs text-gray-400">Gold</p>
                  <p className="text-sm font-bold text-amber-400">+{quest.rewards.gold} G</p>
                </div>
              </div>
            )}
            {quest.rewards.items && quest.rewards.items.length > 0 && (
              <div className="col-span-2 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-purple-400" />
                  <p className="text-sm font-semibold text-purple-400">Items</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quest.rewards.items.map((item, index) => (
                    <div
                      key={index}
                      className="px-2 py-1 bg-slate-800 text-gray-300 text-xs rounded"
                    >
                      Item x{item.quantity}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-700">
          {quest.status === "available" && onStart && (
            <button
              onClick={() => {
                onStart(quest.id);
                onClose();
              }}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all font-semibold flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Quest
            </button>
          )}

          {quest.status === "active" && isAllObjectivesComplete && onComplete && (
            <button
              onClick={() => {
                onComplete(quest.id);
                onClose();
              }}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all font-semibold flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Complete Quest
            </button>
          )}

          {quest.status === "active" && onAbandon && (
            <button
              onClick={() => {
                if (confirm("Are you sure you want to abandon this quest?")) {
                  onAbandon(quest.id);
                  onClose();
                }
              }}
              className="flex-1 px-4 py-3 bg-red-900/50 hover:bg-red-800/50 text-white rounded-lg transition-all font-semibold flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              Abandon Quest
            </button>
          )}

          {quest.status === "completed" && (
            <div className="flex-1 px-4 py-3 bg-green-900/30 border border-green-500/30 text-green-400 rounded-lg font-semibold flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Quest Completed
            </div>
          )}

          {quest.status === "locked" && (
            <div className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 text-gray-400 rounded-lg font-semibold text-center">
              Quest Locked
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
