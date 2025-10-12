"use client";

import { useGameStore } from "@/src/stores/gameStore";
import {
  Coins,
  LogOut,
  Map,
  Menu,
  Scroll,
  Settings,
  Star,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export interface GameHeaderProps {
  onMenuToggle?: (isOpen: boolean) => void;
  hideNavigation?: boolean;
}

export function GameHeader({
  onMenuToggle,
  hideNavigation = false,
}: GameHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { parties, activePartyId } = useGameStore();

  // Get active party
  const activeParty = parties.find((p) => p.id === activePartyId);
  const partyLevel = 1; // TODO: Calculate party level later
  const currentGold = 100; // TODO: Calculate current gold later

  const toggleMenu = () => {
    const newState = !menuOpen;
    setMenuOpen(newState);
    onMenuToggle?.(newState);
  };

  const navItems = [
    { href: "/world", label: "World", icon: Map },
    { href: "/virtual-world", label: "Virtual World", icon: Map },
    { href: "/characters", label: "Characters", icon: Users },
    { href: "/party", label: "Party", icon: Users },
    { href: "/quests", label: "Quests", icon: Scroll },
  ];

  return (
    <div className="flex-none bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side - Logo & Navigation Toggle */}
        <div className="flex items-center gap-4">
          {!hideNavigation && (
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              {menuOpen ? (
                <X className="w-5 h-5 text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-300" />
              )}
            </button>
          )}

          <Link href="/world" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-xl">🎮</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">RPG Adventure</h1>
              <p className="text-xs text-gray-400">Open World Journey</p>
            </div>
          </Link>
        </div>

        {/* Center - Navigation (Desktop) */}
        {!hideNavigation && (
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-slate-700/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Side - Player Stats */}
        <div className="flex items-center gap-4">
          {/* Level */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg">
            <Star className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-xs text-gray-400">Level</p>
              <p className="text-sm font-bold text-white">{partyLevel}</p>
            </div>
          </div>

          {/* Gold */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg">
            <Coins className="w-4 h-4 text-yellow-400" />
            <div>
              <p className="text-xs text-gray-400">Gold</p>
              <p className="text-sm font-bold text-white">
                {currentGold.toLocaleString() || 0}
              </p>
            </div>
          </div>

          {/* Party Size */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg">
            <Users className="w-4 h-4 text-blue-400" />
            <div>
              <p className="text-xs text-gray-400">Party</p>
              <p className="text-sm font-bold text-white">
                {activeParty?.members.length || 0}/8
              </p>
            </div>
          </div>

          {/* Settings (Desktop) */}
          <button
            className="hidden lg:block p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {menuOpen && !hideNavigation && (
        <div className="lg:hidden mt-4 pt-4 border-t border-slate-700">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-slate-700/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}

            <div className="border-t border-slate-700 pt-2 mt-2">
              <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-700/50 transition-colors w-full">
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-700/50 transition-colors w-full">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
