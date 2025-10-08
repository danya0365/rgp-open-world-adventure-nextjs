"use client";

import { BattleLogEntry } from "@/src/stores/battleStore";
import { ScrollText, X } from "lucide-react";
import { useEffect, useRef } from "react";

interface BattleLogProps {
  logs: BattleLogEntry[];
  onClear?: () => void;
}

export function BattleLog({ logs, onClear }: BattleLogProps) {
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type: BattleLogEntry["type"]) => {
    switch (type) {
      case "init":
        return "text-purple-400";
      case "move":
        return "text-blue-400";
      case "attack":
        return "text-orange-400";
      case "damage":
        return "text-red-400";
      case "heal":
        return "text-green-400";
      case "skill":
        return "text-cyan-400";
      case "buff":
        return "text-emerald-400";
      case "debuff":
        return "text-yellow-400";
      case "death":
        return "text-red-500";
      case "turn_start":
        return "text-indigo-400";
      case "turn_end":
        return "text-gray-400";
      case "victory":
        return "text-yellow-300";
      case "defeat":
        return "text-red-500";
      case "info":
        return "text-gray-400";
      default:
        return "text-gray-300";
    }
  };

  const getLogBgColor = (isAlly?: boolean) => {
    if (isAlly === undefined) return "bg-slate-800/30";
    return isAlly ? "bg-blue-900/20" : "bg-orange-900/20";
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-purple-400" />
          Battle Log
        </h2>
        {onClear && logs.length > 0 && (
          <button
            onClick={onClear}
            className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
            title="Clear logs"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div
        ref={logContainerRef}
        className="flex-1 overflow-y-auto space-y-1.5 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50"
        style={{ maxHeight: "400px" }}
      >
        {logs.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            ยังไม่มี log
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`p-2 rounded-lg ${getLogBgColor(log.isAlly)} border border-slate-700/50 hover:border-slate-600/50 transition-colors`}
            >
              <div className="flex items-start gap-2">
                <span className="text-xs text-gray-500 font-mono shrink-0 mt-0.5">
                  T{log.turn}
                </span>
                <p className={`text-sm ${getLogColor(log.type)} flex-1`}>
                  {log.message}
                </p>
              </div>
              {log.value !== undefined && (
                <div className="text-xs text-gray-400 mt-1 ml-8">
                  Value: {log.value}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {logs.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <p className="text-xs text-gray-500 text-center">
            {logs.length} log entries
          </p>
        </div>
      )}
    </div>
  );
}
