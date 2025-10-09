import { Scroll, Target, CheckCircle, Award } from "lucide-react";

interface QuestStats {
  total: number;
  active: number;
  completed: number;
  available: number;
}

interface QuestStatsPanelProps {
  stats: QuestStats;
}

export function QuestStatsPanel({ stats }: QuestStatsPanelProps) {
  return (
    <div className="space-y-3">
      <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Scroll className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-gray-400">Total</span>
        </div>
        <div className="text-2xl font-bold text-purple-400">{stats.total}</div>
      </div>

      <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-4 h-4 text-yellow-400" />
          <span className="text-xs text-gray-400">Active</span>
        </div>
        <div className="text-2xl font-bold text-yellow-400">{stats.active}</div>
      </div>

      <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-xs text-gray-400">Completed</span>
        </div>
        <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
      </div>

      <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-gray-400">Available</span>
        </div>
        <div className="text-2xl font-bold text-blue-400">{stats.available}</div>
      </div>
    </div>
  );
}
