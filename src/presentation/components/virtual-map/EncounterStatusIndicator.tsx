"use client";

import { EncounterModifier } from "@/src/domain/types/encounter.types";
import { Shield, Footprints, Clock } from "lucide-react";

interface EncounterStatusIndicatorProps {
  stepsUntilEncounter: number;
  activeModifiers: EncounterModifier[];
  showSteps?: boolean; // Debug mode
}

export function EncounterStatusIndicator({
  stepsUntilEncounter,
  activeModifiers,
  showSteps = false,
}: EncounterStatusIndicatorProps) {
  if (activeModifiers.length === 0 && !showSteps) return null;

  return (
    <div className="fixed top-20 right-4 z-40 space-y-2">
      {/* Active Modifiers */}
      {activeModifiers.map((modifier) => (
        <div
          key={modifier.id}
          className="px-3 py-2 bg-blue-900/90 border border-blue-500/50 rounded-lg backdrop-blur-sm shadow-lg animate-in slide-in-from-right duration-300"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-sm text-white font-medium block truncate">
                {modifier.name}
              </span>
              {modifier.duration !== undefined && (
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">
                    {modifier.duration} steps
                  </span>
                </div>
              )}
            </div>
            {/* Effect indicator */}
            <div className="shrink-0 px-2 py-0.5 bg-blue-500/20 border border-blue-500 rounded text-xs text-blue-300 font-semibold">
              {modifier.rateMultiplier < 1
                ? `${Math.round((1 - modifier.rateMultiplier) * 100)}% ↓`
                : `${Math.round((modifier.rateMultiplier - 1) * 100)}% ↑`}
            </div>
          </div>
        </div>
      ))}

      {/* Debug: Steps Counter */}
      {showSteps && (
        <div className="px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-lg backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-2">
            <Footprints className="w-4 h-4 text-gray-400 shrink-0" />
            <div className="flex-1">
              <span className="text-sm text-white font-medium">
                Next Encounter
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-red-500 transition-all duration-300"
                    style={{
                      width: `${Math.max(0, Math.min(100, ((20 - stepsUntilEncounter) / 20) * 100))}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-400 font-mono shrink-0">
                  {stepsUntilEncounter}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
