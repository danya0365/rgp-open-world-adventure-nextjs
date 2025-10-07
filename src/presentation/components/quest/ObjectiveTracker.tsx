"use client";

import { QuestObjective } from "@/src/domain/types/quest.types";
import { CheckCircle, Circle, Target, Skull, Package, MessageCircle, MapPin, Shield } from "lucide-react";

interface ObjectiveTrackerProps {
  objectives: QuestObjective[];
}

export function ObjectiveTracker({ objectives }: ObjectiveTrackerProps) {
  // Objective type icons
  const typeIcons = {
    kill: <Skull className="w-4 h-4" />,
    collect: <Package className="w-4 h-4" />,
    talk: <MessageCircle className="w-4 h-4" />,
    explore: <MapPin className="w-4 h-4" />,
    escort: <Shield className="w-4 h-4" />,
    defend: <Target className="w-4 h-4" />,
  };

  return (
    <div className="space-y-3">
      {objectives.map((objective) => {
        const progress = objective.required > 0 
          ? (objective.current / objective.required) * 100 
          : 0;

        return (
          <div
            key={objective.id}
            className={`p-3 rounded-lg border transition-all ${
              objective.isCompleted
                ? "bg-green-900/20 border-green-500/30"
                : "bg-slate-800/50 border-slate-700"
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  objective.isCompleted
                    ? "bg-green-500/20 text-green-400"
                    : "bg-slate-700 text-gray-400"
                }`}
              >
                {objective.isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  typeIcons[objective.type] || <Circle className="w-5 h-5" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium mb-2 ${
                    objective.isCompleted ? "text-green-400 line-through" : "text-white"
                  }`}
                >
                  {objective.description}
                </p>

                {/* Progress */}
                {!objective.isCompleted && objective.required > 0 && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span className="capitalize">{objective.type}</span>
                      <span>
                        {objective.current}/{objective.required}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Completed Badge */}
                {objective.isCompleted && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
