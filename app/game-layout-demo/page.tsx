"use client";

import { GameLayout, GameLayoutContent, GameLayoutOverlay } from "@/src/presentation/components/layout/GameLayout";
import { HUDPanel, HUDPanelToggle } from "@/src/presentation/components/layout/HUDPanel";
import { Users, Scroll, Shield, Swords, Heart, Zap } from "lucide-react";
import { useState } from "react";

/**
 * Demo Page - แสดงการใช้งาน GameLayout
 * 
 * ทดลองใช้งานที่: http://localhost:3000/game-layout-demo
 */
export default function GameLayoutDemoPage() {
  const [showPartyPanel, setShowPartyPanel] = useState(true);
  const [showQuestPanel, setShowQuestPanel] = useState(true);
  const [showStatsPanel, setShowStatsPanel] = useState(true);

  return (
    <GameLayout>
      {/* Scrollable Content */}
      <GameLayoutContent>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🎮 GameLayout Demo
            </h1>
            <p className="text-gray-400 text-lg">
              ตัวอย่างการใช้งาน GameLayout พร้อม HUD Panels
            </p>
          </div>

          {/* Demo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                  <Swords className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Feature {i}
                </h3>
                <p className="text-gray-400 mb-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quisquam, voluptatum.
                </p>
                <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              💡 คุณสมบัติ GameLayout
            </h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✓</span>
                <span>Fixed full screen layout - ไม่มี scroll ของ window</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✓</span>
                <span>Scrollable content area - scroll ได้เฉพาะ content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✓</span>
                <span>HUD Panels - Toggleable overlay panels</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✓</span>
                <span>Responsive header - แสดง stats และ navigation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✓</span>
                <span>Glass morphism design - สวยงามและทันสมัย</span>
              </li>
            </ul>
          </div>
        </div>
      </GameLayoutContent>

      {/* HUD Overlays */}
      <GameLayoutOverlay>
        {/* Party Panel - Top Left */}
        {showPartyPanel ? (
          <HUDPanel
            title="Party Members"
            icon={<Users className="w-5 h-5" />}
            position="top-left"
            onClose={() => setShowPartyPanel(false)}
            maxWidth="350px"
            maxHeight="400px"
          >
            <div className="space-y-2 pointer-events-auto">
              {[
                { name: "อาเธอร์", class: "Warrior", hp: 850, maxHp: 1000 },
                { name: "เมอร์ลิน", class: "Mage", hp: 420, maxHp: 500 },
                { name: "ลานเซล็อต", class: "Knight", hp: 950, maxHp: 950 },
              ].map((member, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-xl">
                      🦸
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{member.name}</p>
                      <p className="text-gray-400 text-xs">{member.class}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Heart className="w-3 h-3" /> HP
                      </span>
                      <span className="text-white">
                        {member.hp}/{member.maxHp}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{
                          width: `${(member.hp / member.maxHp) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </HUDPanel>
        ) : (
          <HUDPanelToggle
            label="Party"
            icon={<Users className="w-4 h-4" />}
            onClick={() => setShowPartyPanel(true)}
            position="top-left"
          />
        )}

        {/* Quest Panel - Top Right */}
        {showQuestPanel ? (
          <HUDPanel
            title="Active Quests"
            icon={<Scroll className="w-5 h-5" />}
            position="top-right"
            onClose={() => setShowQuestPanel(false)}
            maxWidth="350px"
            maxHeight="400px"
          >
            <div className="space-y-2 pointer-events-auto">
              {[
                {
                  name: "ฆ่ามังกร",
                  progress: 1,
                  total: 1,
                  reward: "1000 EXP",
                },
                {
                  name: "รวบรวมสมุนไพร",
                  progress: 7,
                  total: 10,
                  reward: "500 Gold",
                },
                {
                  name: "ปกป้องหมู่บ้าน",
                  progress: 3,
                  total: 5,
                  reward: "Legendary Sword",
                },
              ].map((quest, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                >
                  <p className="text-white font-semibold mb-2">{quest.name}</p>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">
                      {quest.progress}/{quest.total}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-purple-500 transition-all"
                      style={{
                        width: `${(quest.progress / quest.total) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-yellow-400 text-xs">
                    Reward: {quest.reward}
                  </p>
                </div>
              ))}
            </div>
          </HUDPanel>
        ) : (
          <HUDPanelToggle
            label="Quests"
            icon={<Scroll className="w-4 h-4" />}
            onClick={() => setShowQuestPanel(true)}
            position="top-right"
          />
        )}

        {/* Stats Panel - Bottom Right */}
        {showStatsPanel ? (
          <HUDPanel
            title="Quick Stats"
            icon={<Shield className="w-5 h-5" />}
            position="bottom-right"
            onClose={() => setShowStatsPanel(false)}
            maxWidth="300px"
            maxHeight="300px"
          >
            <div className="space-y-3 pointer-events-auto">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" /> HP
                </span>
                <span className="text-white font-semibold">2220/2450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400" /> MP
                </span>
                <span className="text-white font-semibold">850/920</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <Swords className="w-4 h-4 text-orange-400" /> ATK
                </span>
                <span className="text-white font-semibold">245</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" /> DEF
                </span>
                <span className="text-white font-semibold">180</span>
              </div>
            </div>
          </HUDPanel>
        ) : (
          <HUDPanelToggle
            label="Stats"
            icon={<Shield className="w-4 h-4" />}
            onClick={() => setShowStatsPanel(true)}
            position="bottom-right"
          />
        )}
      </GameLayoutOverlay>
    </GameLayout>
  );
}
