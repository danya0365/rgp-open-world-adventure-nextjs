"use client";

import { Sword, Users, Map, Sparkles, Shield, Zap, Trophy, BookOpen } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export function LandingView() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
          <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse delay-500"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              Tactical Grid Combat RPG
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
            RPG Open World
            <br />
            Adventure
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            ผจญภัยในโลกแฟนตาซีกว้างใหญ่ พร้อมระบบต่อสู้แบบ Dynamic Tactical Grid
            <br />
            เนื้อเรื่องหลายจบ และโหมด Co-op Multiplayer
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/party"
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Users className="w-5 h-5" />
                จัดการทีม
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            <Link
              href="/characters"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-semibold text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              ตัวละคร
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-400 mb-1">Dynamic</div>
              <div className="text-sm text-gray-400">Grid Combat</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold text-pink-400 mb-1">100+</div>
              <div className="text-sm text-gray-400">เควสต์</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-400 mb-1">4</div>
              <div className="text-sm text-gray-400">ผู้เล่น Co-op</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-400 mb-1">∞</div>
              <div className="text-sm text-gray-400">โลกเปิดกว้าง</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              ระบบเกมที่โดดเด่น
            </h2>
            <p className="text-xl text-gray-400">
              สัมผัสประสบการณ์ RPG ที่ไม่เหมือนใคร
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-purple-900/50 to-purple-950/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sword className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Dynamic Tactical Grid
                </h3>
                <p className="text-gray-400">
                  ระบบต่อสู้แบบ Dynamic Grid (5x5 ถึง 10x10+) เหมือน Dragon Quest Tact
                  พร้อมกลยุทธ์การวางตำแหน่ง การโจมตีแบบ Flanking และระบบธาตุ 6 ธาตุ
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-pink-900/50 to-pink-950/50 backdrop-blur-sm border border-pink-500/30 rounded-xl p-8 hover:border-pink-500/60 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-pink-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Map className="w-8 h-8 text-pink-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  โลกเปิดกว้าง
                </h3>
                <p className="text-gray-400">
                  สำรวจโลกแฟนตาซีขนาดใหญ่ พร้อมระบบ Fog of War, Fast Travel
                  และสภาพอากาศแบบไดนามิก
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-blue-900/50 to-blue-950/50 backdrop-blur-sm border border-blue-500/30 rounded-xl p-8 hover:border-blue-500/60 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Co-op Multiplayer
                </h3>
                <p className="text-gray-400">
                  เล่นร่วมกับเพื่อนได้สูงสุด 4 คน พร้อมระบบ Quest ร่วมกัน
                  และการแบ่งปันไอเทม
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative bg-gradient-to-br from-green-900/50 to-green-950/50 backdrop-blur-sm border border-green-500/30 rounded-xl p-8 hover:border-green-500/60 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  เนื้อเรื่องหลายจบ
                </h3>
                <p className="text-gray-400">
                  เนื้อเรื่องที่มีการแตกแขนงตามการตัดสินใจของคุณ พร้อม Multiple
                  Endings และ New Game+
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative bg-gradient-to-br from-yellow-900/50 to-yellow-950/50 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-8 hover:border-yellow-500/60 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  ระบบตัวละคร
                </h3>
                <p className="text-gray-400">
                  สร้างและพัฒนาตัวละคร พร้อม Skill Tree, Multi-class
                  และระบบความสัมพันธ์กับเพื่อนร่วมทาง
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group relative bg-gradient-to-br from-red-900/50 to-red-950/50 backdrop-blur-sm border border-red-500/30 rounded-xl p-8 hover:border-red-500/60 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-red-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  ระบบธาตุ
                </h3>
                <p className="text-gray-400">
                  6 ธาตุ (Fire, Water, Earth, Wind, Light, Dark) พร้อมระบบ
                  Weakness/Resistance และ Elemental Reactions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Systems Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-950/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              ระบบเกมที่ครบครัน
            </h2>
            <p className="text-xl text-gray-400">
              ทุกสิ่งที่คุณต้องการในเกม RPG
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* System 1 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Quest & Achievement System
                  </h3>
                  <p className="text-gray-400">
                    เควสต์หลัก, เควสต์รอง, เควสต์อีเวนต์ และระบบ Achievement
                    ที่ครบครัน พร้อม Bestiary และ Codex
                  </p>
                </div>
              </div>
            </div>

            {/* System 2 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Inventory & Equipment
                  </h3>
                  <p className="text-gray-400">
                    ระบบ Inventory แบบ Grid, Equipment Slots, Set Bonuses, Crafting,
                    Enchanting และ Upgrading
                  </p>
                </div>
              </div>
            </div>

            {/* System 3 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Map className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Dungeon Exploration
                  </h3>
                  <p className="text-gray-400">
                    สำรวจดันเจี้ยนที่มี Puzzle, กับดัก, ห้องลับ และบอสที่ท้าทาย
                    พร้อมระบบ Procedural Generation
                  </p>
                </div>
              </div>
            </div>

            {/* System 4 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Dynamic World
                  </h3>
                  <p className="text-gray-400">
                    ระบบสภาพอากาศแบบไดนามิก, วงจรกลางวัน-กลางคืน, NPC ที่มีกิจวัตร
                    และ Time-specific Events
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              พร้อมเริ่มการผจญภัยแล้วหรือยัง?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              สร้างตัวละคร เริ่มต้นเนื้อเรื่อง และสำรวจโลกแฟนตาซีที่กว้างใหญ่
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/game/character/create"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105"
              >
                สร้างตัวละคร
              </Link>
              <Link
                href="/game/world"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-semibold text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                เข้าสู่โลกเกม
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                RPG Open World Adventure
              </h3>
              <p className="text-gray-400">
                เกม RPG โลกเปิดกว้างแฟนตาซี พร้อมระบบต่อสู้แบบ Tactical Grid
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">เกม</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/game/world"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    โลกเกม
                  </Link>
                </li>
                <li>
                  <Link
                    href="/game/characters"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ตัวละคร
                  </Link>
                </li>
                <li>
                  <Link
                    href="/game/quests"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    เควสต์
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">ข้อมูล</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    เกี่ยวกับเกม
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guide"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    คู่มือการเล่น
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ชุมชน
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>© 2025 RPG Open World Adventure. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
