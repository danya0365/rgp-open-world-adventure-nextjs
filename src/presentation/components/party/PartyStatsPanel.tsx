import { Heart, Shield, Users, Zap } from "lucide-react";

interface PartyStats {
  memberCount: number;
  totalHp: number;
  totalMp: number;
  avgLevel: number;
}

interface PartyStatsPanelProps {
  stats: PartyStats;
  availableCount: number;
}

export function PartyStatsPanel({ stats, availableCount }: PartyStatsPanelProps) {
  return (
    <div className="space-y-3">
      <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-gray-400">สมาชิก</span>
        </div>
        <div className="text-2xl font-bold text-purple-400">
          {stats.memberCount}/4
        </div>
      </div>

      <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="w-4 h-4 text-red-400" />
          <span className="text-xs text-gray-400">Total HP</span>
        </div>
        <div className="text-2xl font-bold text-red-400">
          {stats.totalHp.toLocaleString()}
        </div>
      </div>

      <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-gray-400">Total MP</span>
        </div>
        <div className="text-2xl font-bold text-cyan-400">
          {stats.totalMp.toLocaleString()}
        </div>
      </div>

      <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-gray-400">Avg Level</span>
        </div>
        <div className="text-2xl font-bold text-amber-400">{stats.avgLevel}</div>
      </div>

      <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
        <div className="text-xs text-gray-400 mb-1">Available</div>
        <div className="text-2xl font-bold text-green-400">{availableCount}</div>
      </div>
    </div>
  );
}
