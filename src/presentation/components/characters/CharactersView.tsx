"use client";

import { Character } from "@/src/domain/types/character.types";
import { GameLayoutOverlay } from "@/src/presentation/components/layout/GameLayout";
import {
  HUDPanel,
  HUDPanelToggle,
} from "@/src/presentation/components/layout/HUDPanel";
import { Button, Modal } from "@/src/presentation/components/ui";
import { CharactersViewModel } from "@/src/presentation/presenters/characters/CharactersPresenter";
import { useCharactersPresenter } from "@/src/presentation/presenters/characters/useCharactersPresenter";
import { useGameStore } from "@/src/stores/gameStore";
import { BarChart3, Filter, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CharactersViewProps {
  initialViewModel?: CharactersViewModel;
}

export function CharactersView({ initialViewModel }: CharactersViewProps) {
  const { recruitCharacter, isCharacterRecruited } = useGameStore();
  const [showFiltersPanel, setShowFiltersPanel] = useState(true);
  const [showStatsPanel, setShowStatsPanel] = useState(true);
  const [filterRarity, setFilterRarity] = useState<string>("all");
  const [filterRecruitedStatus, setFilterRecruitedStatus] =
    useState<string>("all");
  const [filterMinLevel, setFilterMinLevel] = useState<number>(1);

  // Pan & Zoom state - restored from localStorage
  const [zoom, setZoom] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("charactersMapZoom");
      return saved ? parseFloat(saved) : 1;
    }
    return 1;
  });
  const [pan, setPan] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("charactersMapPan");
      return saved ? JSON.parse(saved) : { x: 0, y: 0 };
    }
    return { x: 0, y: 0 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const {
    viewModel,
    loading,
    error,
    selectedCharacter,
    filterClass,
    showOnlyPlayable,
    filteredCharacters,
    setSelectedCharacter,
    setFilterClass,
    setShowOnlyPlayable,
  } = useCharactersPresenter(initialViewModel);

  const handleRecruitCharacter = (character: Character) => {
    recruitCharacter(character);
    // Close modal after recruit
    setSelectedCharacter(null);
  };

  // Save zoom/pan to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("charactersMapZoom", zoom.toString());
    }
  }, [zoom]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("charactersMapPan", JSON.stringify(pan));
    }
  }, [pan]);

  // Pan & Zoom handlers
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't drag if clicking on character marker
    if ((e.target as HTMLElement).closest("button")) return;

    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Show loading only on initial load
  if (loading && !viewModel) {
    return (
      <>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-400">กำลังโหลดข้อมูลตัวละคร...</p>
          </div>
        </div>
      </>
    );
  }

  // Show error state if there's an error but we have no data
  if (error && !viewModel) {
    return (
      <>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-400 font-medium mb-2">เกิดข้อผิดพลาด</p>
            <p className="text-gray-400 mb-4">{error}</p>
            <Link
              href="/"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
            >
              กลับหน้าแรก
            </Link>
          </div>
        </div>
      </>
    );
  }

  // If we have no view model and not loading, show empty state
  if (!viewModel) {
    return (
      <>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <p className="text-gray-400 font-medium mb-2">
              ยังไม่มีข้อมูลตัวละคร
            </p>
          </div>
        </div>
      </>
    );
  }

  // Additional filtering (rarity, recruited, level)
  const advancedFilteredCharacters = filteredCharacters.filter((char) => {
    // Rarity filter
    if (filterRarity !== "all" && char.rarity !== filterRarity) {
      return false;
    }

    // Recruited status filter
    if (
      filterRecruitedStatus === "recruited" &&
      !isCharacterRecruited(char.id)
    ) {
      return false;
    }
    if (
      filterRecruitedStatus === "not-recruited" &&
      isCharacterRecruited(char.id)
    ) {
      return false;
    }

    // Level filter
    if (char.level < filterMinLevel) {
      return false;
    }

    return true;
  });

  // Generate positions for characters (grid layout - responsive)
  const charactersWithPositions = advancedFilteredCharacters.map(
    (char, index) => {
      // Responsive grid: 3 columns on mobile, 5 on desktop
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const columns = isMobile ? 3 : 5;
      const col = index % columns;
      const row = Math.floor(index / columns);

      // Calculate position (centered with spacing)
      const spacingX = isMobile ? 25 : 18;
      const spacingY = isMobile ? 25 : 20;
      const startX = isMobile ? 10 : 15;
      const startY = isMobile ? 10 : 15;

      const x = startX + col * spacingX; // % from left
      const y = startY + row * spacingY; // % from top

      return {
        ...char,
        x,
        y,
      };
    }
  );

  return (
    <>
      {/* Full Screen Map Container with Pan & Zoom */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-auto"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? "grabbing" : "grab", zIndex: 0 }}
      >
        {/* Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
          {/* Grid Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Radial Glow */}
          <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent" />
        </div>

        {/* Character Markers - with Pan & Zoom transform */}
        <div
          className="absolute inset-0 transition-transform"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          {/* Empty State */}
          {charactersWithPositions.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center pointer-events-auto">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  ไม่พบตัวละครที่ตรงกับเงื่อนไข
                </p>
              </div>
            </div>
          )}

          {charactersWithPositions.map((character) => {
            const isRecruited = isCharacterRecruited(character.id);

            return (
              <button
                key={character.id}
                onClick={() => setSelectedCharacter(character)}
                className="absolute group transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${character.x}%`,
                  top: `${character.y}%`,
                }}
              >
                {/* Marker Glow */}
                <div
                  className={`absolute inset-0 rounded-full blur-xl transition-all ${
                    isRecruited
                      ? "bg-green-400/50 w-24 h-24 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
                      : "bg-purple-400/30 w-20 h-20 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 group-hover:bg-purple-400/50"
                  }`}
                />

                {/* Character Portrait Container */}
                <div className="relative">
                  {/* Character Portrait Circle - Responsive */}
                  <div
                    className={`relative w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-24 rounded-full flex items-center justify-center transition-all border-2 sm:border-3 md:border-4 overflow-hidden ${
                      isRecruited
                        ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-300 scale-110"
                        : "bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400 group-hover:scale-110 group-hover:border-purple-300"
                    }`}
                  >
                    {/* Character Avatar/Icon (Placeholder - could be image) */}
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                      {character.name.substring(0, 2).toUpperCase()}
                    </div>
                  </div>

                  {/* Info Overlay on Circle */}
                  <div className="absolute inset-0 rounded-full pointer-events-none">
                    {/* Recruited Badge - Top Right */}
                    {isRecruited && (
                      <div className="absolute -top-1 -right-1 w-7 h-7 bg-green-500 border-2 border-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                    )}

                    {/* Level Badge - Top Left - Responsive */}
                    <div className="absolute -top-1 -left-1 w-5 h-5 sm:w-6 md:w-7 sm:h-6 md:h-7 bg-slate-900 border-2 border-purple-400 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-purple-300 text-[8px] sm:text-[9px] md:text-[10px] font-bold">
                        {character.level}
                      </span>
                    </div>

                    {/* Class Icon - Bottom Left - Responsive */}
                    <div className="absolute -bottom-1 -left-1 px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-0.5 md:py-1 bg-slate-900/95 border border-purple-400 rounded-lg shadow-lg">
                      <span className="text-purple-300 text-[7px] sm:text-[8px] md:text-[9px] font-bold uppercase">
                        {character.class.substring(0, 3)}
                      </span>
                    </div>

                    {/* Rarity Badge - Bottom Right - Responsive */}
                    <div
                      className={`absolute -bottom-1 -right-1 px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-0.5 md:py-1 rounded-lg text-[7px] sm:text-[8px] md:text-[9px] font-bold shadow-lg border-2 ${
                        character.rarity === "legendary"
                          ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-300"
                          : character.rarity === "epic"
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-400"
                          : character.rarity === "rare"
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400"
                          : "bg-gray-600 text-white border-gray-400"
                      }`}
                    >
                      {character.rarity === "legendary"
                        ? "⭐"
                        : character.rarity === "epic"
                        ? "💎"
                        : character.rarity === "rare"
                        ? "🔷"
                        : "⚪"}
                    </div>
                  </div>
                </div>

                {/* Character Name */}
                <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <div
                    className={`px-3 py-1 rounded-lg text-sm font-semibold shadow-lg transition-all ${
                      isRecruited
                        ? "bg-green-500/90 text-white"
                        : "bg-slate-800/90 text-gray-200 group-hover:bg-purple-600/90 group-hover:text-white"
                    }`}
                  >
                    {character.name}
                  </div>
                </div>

                {/* Stats Overlay - Hover (Below Name) */}
                <div className="absolute top-full mt-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-99">
                  <div className="px-4 py-2 bg-slate-900/95 border border-purple-500/50 rounded-lg shadow-xl min-w-[120px]">
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="text-center">
                        <div className="text-red-400 font-bold">
                          {character.stats.maxHp}
                        </div>
                        <div className="text-gray-400">HP</div>
                      </div>
                      <div className="text-center">
                        <div className="text-orange-400 font-bold">
                          {character.stats.atk}
                        </div>
                        <div className="text-gray-400">ATK</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 font-bold">
                          {character.stats.def}
                        </div>
                        <div className="text-gray-400">DEF</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-400 font-bold">
                          {character.stats.agi}
                        </div>
                        <div className="text-gray-400">SPD</div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Map Controls - Bottom Center */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-auto z-40">
          <button
            onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.2))}
            className="px-3 py-2 bg-slate-900/80 hover:bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg transition-colors text-white text-sm"
            title="Zoom Out"
          >
            −
          </button>
          <button
            onClick={handleResetView}
            className="px-4 py-2 bg-slate-900/80 hover:bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg transition-colors text-white text-sm"
            title="Reset View"
          >
            ⛶ รีเซ็ต
          </button>
          <button
            onClick={() => setZoom((prev) => Math.min(3, prev + 0.2))}
            className="px-3 py-2 bg-slate-900/80 hover:bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg transition-colors text-white text-sm"
            title="Zoom In"
          >
            +
          </button>
        </div>
      </div>

      {/* HUD Overlays */}
      <GameLayoutOverlay>
        {/* Filters Panel - Top Left */}
        {showFiltersPanel ? (
          <HUDPanel
            title="ตัวกรอง"
            icon={<Filter className="w-5 h-5" />}
            position="top-left"
            closable
            onClose={() => setShowFiltersPanel(false)}
            maxHeight="600px"
            maxWidth="min(380px, 90vw)"
          >
            <div className="space-y-4">
              {/* Rarity Filter */}
              <div>
                <span className="text-sm text-gray-400 block mb-2">
                  ความหายาก:
                </span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filterRarity === "all" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setFilterRarity("all")}
                  >
                    ทั้งหมด
                  </Button>
                  <Button
                    variant={filterRarity === "legendary" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setFilterRarity("legendary")}
                    className="text-amber-400"
                  >
                    ⭐ Legendary
                  </Button>
                  <Button
                    variant={filterRarity === "epic" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setFilterRarity("epic")}
                    className="text-purple-400"
                  >
                    💎 Epic
                  </Button>
                  <Button
                    variant={filterRarity === "rare" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setFilterRarity("rare")}
                    className="text-blue-400"
                  >
                    🔷 Rare
                  </Button>
                  <Button
                    variant={filterRarity === "common" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setFilterRarity("common")}
                  >
                    ⚪ Common
                  </Button>
                </div>
              </div>

              {/* Class Filter */}
              <div>
                <span className="text-sm text-gray-400 block mb-2">คลาส:</span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filterClass === "all" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setFilterClass("all")}
                  >
                    ทั้งหมด
                  </Button>
                  {viewModel.classes.map((cls) => (
                    <Button
                      key={cls}
                      variant={filterClass === cls ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => setFilterClass(cls)}
                    >
                      {cls}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Recruited Status Filter */}
              <div>
                <span className="text-sm text-gray-400 block mb-2">สถานะ:</span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={
                      filterRecruitedStatus === "all" ? "primary" : "ghost"
                    }
                    size="sm"
                    onClick={() => setFilterRecruitedStatus("all")}
                  >
                    ทั้งหมด
                  </Button>
                  <Button
                    variant={
                      filterRecruitedStatus === "recruited"
                        ? "primary"
                        : "ghost"
                    }
                    size="sm"
                    onClick={() => setFilterRecruitedStatus("recruited")}
                    className="text-green-400"
                  >
                    ✓ รีครูทแล้ว
                  </Button>
                  <Button
                    variant={
                      filterRecruitedStatus === "not-recruited"
                        ? "primary"
                        : "ghost"
                    }
                    size="sm"
                    onClick={() => setFilterRecruitedStatus("not-recruited")}
                  >
                    ยังไม่รีครูท
                  </Button>
                </div>
              </div>

              {/* Level Filter */}
              <div>
                <span className="text-sm text-gray-400 block mb-2">
                  Level ขั้นต่ำ: {filterMinLevel}
                </span>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={filterMinLevel}
                  onChange={(e) => setFilterMinLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    accentColor: "#a855f7",
                  }}
                />
              </div>

              {/* Playable Filter */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="playable"
                  checked={showOnlyPlayable}
                  onChange={(e) => setShowOnlyPlayable(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-slate-800 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="playable" className="text-sm text-gray-300">
                  แสดงเฉพาะตัวละครที่เล่นได้
                </label>
              </div>

              {/* Reset Filters Button */}
              <div className="pt-2 border-t border-slate-700">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilterRarity("all");
                    setFilterClass("all");
                    setFilterRecruitedStatus("all");
                    setFilterMinLevel(1);
                    setShowOnlyPlayable(false);
                  }}
                  className="w-full text-gray-400 hover:text-white"
                >
                  🔄 รีเซ็ตตัวกรอง
                </Button>
              </div>
            </div>
          </HUDPanel>
        ) : (
          <HUDPanelToggle
            label="ตัวกรอง"
            icon={<Filter className="w-4 h-4" />}
            onClick={() => setShowFiltersPanel(true)}
            position="top-left"
          />
        )}

        {/* Stats Panel - Top Right */}
        {showStatsPanel ? (
          <HUDPanel
            title="สถิติ"
            icon={<BarChart3 className="w-5 h-5" />}
            position="top-right"
            closable
            onClose={() => setShowStatsPanel(false)}
            maxHeight="300px"
            maxWidth="280px"
          >
            <div className="space-y-3 text-xs">
              <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {advancedFilteredCharacters.length}
                </div>
                <div className="text-xs text-gray-400">
                  แสดงอยู่ / {viewModel.totalCharacters}
                </div>
              </div>
              <div className="bg-blue-900/30 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {viewModel.playableCount}
                </div>
                <div className="text-xs text-gray-400">เล่นได้</div>
              </div>
              <div className="bg-amber-900/30 backdrop-blur-sm border border-amber-500/30 rounded-lg p-3">
                <div className="text-2xl font-bold text-amber-400 mb-1">
                  {viewModel.recruitableCount}
                </div>
                <div className="text-xs text-gray-400">รีครูทได้</div>
              </div>
              <div className="bg-pink-900/30 backdrop-blur-sm border border-pink-500/30 rounded-lg p-3">
                <div className="text-2xl font-bold text-pink-400 mb-1">
                  {viewModel.legendaryCount}
                </div>
                <div className="text-xs text-gray-400">Legendary+</div>
              </div>
            </div>
          </HUDPanel>
        ) : (
          <HUDPanelToggle
            label="สถิติ"
            icon={<BarChart3 className="w-4 h-4" />}
            onClick={() => setShowStatsPanel(true)}
            position="top-right"
          />
        )}
      </GameLayoutOverlay>

      {/* Character Detail Modal - Responsive */}
      {selectedCharacter && (
        <Modal
          isOpen={!!selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
          title={selectedCharacter.name}
          size="lg"
          className="max-h-[90vh] overflow-y-auto"
        >
          <CharacterDetailContent
            character={selectedCharacter}
            onRecruit={handleRecruitCharacter}
            isRecruited={isCharacterRecruited(selectedCharacter.id)}
          />
        </Modal>
      )}

      {/* Error Toast */}
      {error && viewModel && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 pointer-events-auto">
          <div className="flex items-center">
            <span className="mr-2">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}
    </>
  );
}

interface CharacterDetailContentProps {
  character: Character;
  onRecruit: (character: Character) => void;
  isRecruited: boolean;
}

function CharacterDetailContent({
  character,
  onRecruit,
  isRecruited,
}: CharacterDetailContentProps) {
  return (
    <div className="space-y-4">
      {/* Header with Recruit Button - Responsive */}
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 pb-4 border-b border-slate-700">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 flex-wrap">
            <span
              className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold ${
                character.rarity === "legendary"
                  ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
                  : character.rarity === "epic"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : character.rarity === "rare"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                  : "bg-gray-600 text-white"
              }`}
            >
              {character.rarity.toUpperCase()}
            </span>
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-purple-600 text-white">
              {character.class}
            </span>
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-slate-700 text-white">
              Level {character.level}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 hidden sm:block">
            {character.description}
          </p>
        </div>

        {/* Recruit Button - Top Right - Responsive */}
        {!isRecruited ? (
          <Button
            variant="action"
            size="md"
            onClick={() => onRecruit(character)}
            className="shrink-0 w-full sm:w-auto"
          >
            ⭐ รีครูท
          </Button>
        ) : (
          <div className="shrink-0 w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
            <span>✓</span>
            <span>รีครูทแล้ว</span>
          </div>
        )}
      </div>

      {/* Stats Grid - Compact - Responsive */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-3">สถานะ</h3>
        <div className="grid grid-cols-4 md:grid-cols-4 gap-2">
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-red-400">
              {character.stats.maxHp}
            </div>
            <div className="text-[10px] text-gray-400">HP</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-cyan-400">
              {character.stats.maxMp}
            </div>
            <div className="text-[10px] text-gray-400">MP</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-orange-400">
              {character.stats.atk}
            </div>
            <div className="text-[10px] text-gray-400">ATK</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-blue-400">
              {character.stats.def}
            </div>
            <div className="text-[10px] text-gray-400">DEF</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-purple-400">
              {character.stats.wis}
            </div>
            <div className="text-[10px] text-gray-400">WIS</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-green-400">
              {character.stats.agi}
            </div>
            <div className="text-[10px] text-gray-400">AGI</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-yellow-400">
              {character.stats.mov}
            </div>
            <div className="text-[10px] text-gray-400">MOV</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-pink-400">
              {character.level}
            </div>
            <div className="text-[10px] text-gray-400">LVL</div>
          </div>
        </div>
      </div>

      {/* Elements & Affinities - Compact */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-3">
          ธาตุ & ความสัมพันธ์
        </h3>
        <div className="space-y-2">
          {/* Main Elements */}
          <div className="flex gap-2 flex-wrap">
            {character.elements.map((element) => (
              <span
                key={element}
                className="px-3 py-1 rounded-lg bg-slate-800 text-white capitalize text-sm"
              >
                {element}
              </span>
            ))}
          </div>

          {/* Elemental Affinities - Compact */}
          <div className="grid grid-cols-2 gap-2">
            {character.elementalAffinities.slice(0, 4).map((affinity) => (
              <div
                key={affinity.element}
                className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-2"
              >
                <span className="text-[10px] text-gray-400 capitalize w-12">
                  {affinity.element}
                </span>
                <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${
                      affinity.strength > 0
                        ? "bg-green-500"
                        : affinity.strength < 0
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }`}
                    style={{
                      width: `${Math.abs(affinity.strength)}%`,
                    }}
                  />
                </div>
                <span
                  className={`text-[10px] font-semibold w-8 text-right ${
                    affinity.strength > 0
                      ? "text-green-400"
                      : affinity.strength < 0
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                >
                  {affinity.strength > 0 ? "+" : ""}
                  {affinity.strength}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills - Compact - Responsive */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-3">
          สกิล ({character.skills.length})
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 gap-2">
          {character.skills.slice(0, 8).map((skillId) => (
            <div
              key={skillId}
              className="bg-slate-800/50 rounded-lg p-2 text-center hover:bg-purple-500/20 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg mx-auto flex items-center justify-center">
                <span className="text-purple-400 text-[10px] font-bold">
                  ⚔️
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
