"use client";

import { Character } from "@/src/domain/types/character.types";
import { GameLayout, GameLayoutOverlay } from "@/src/presentation/components/layout/GameLayout";
import { HUDPanel, HUDPanelToggle } from "@/src/presentation/components/layout/HUDPanel";
import { CreatePartyModal } from "./CreatePartyModal";
import { PartySlider } from "./PartySlider";
import { RenamePartyModal } from "./RenamePartyModal";
import { PartyFormationView } from "./PartyFormationView";
import { PartyStatsPanel } from "./PartyStatsPanel";
import { CharacterSelectModal } from "./CharacterSelectModal";
import { PartyViewModel } from "@/src/presentation/presenters/party/PartyPresenter";
import { usePartyPresenter } from "@/src/presentation/presenters/party/usePartyPresenter";
import { getPartyStats, getPartySynergy } from "@/src/stores/gameStore";
import { AlertCircle, Map, Shield, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface PartyViewProps {
  initialViewModel?: PartyViewModel;
}

export function PartyView({ initialViewModel }: PartyViewProps) {
  const {
    viewModel,
    loading,
    error,
    parties,
    activePartyId,
    createParty,
    setActiveParty,
    renameParty,
    copyParty,
    deleteParty,
    progress,
    addToPartyV2,
    removeFromPartyV2,
  } = usePartyPresenter(initialViewModel);

  // UI State
  const [showPartyPanel, setShowPartyPanel] = useState(true);
  const [showStatsPanel, setShowStatsPanel] = useState(true);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renamePartyId, setRenamePartyId] = useState<string>("");
  const [renamePartyName, setRenamePartyName] = useState<string>("");

  // Pan & Zoom state
  const [zoom, setZoom] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("partyMapZoom");
      return saved ? parseFloat(saved) : 1;
    }
    return 1;
  });
  const [pan, setPan] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("partyMapPan");
      return saved ? JSON.parse(saved) : { x: 0, y: 0 };
    }
    return { x: 0, y: 0 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Save zoom/pan to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("partyMapZoom", zoom.toString());
    }
  }, [zoom]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("partyMapPan", JSON.stringify(pan));
    }
  }, [pan]);

  // Pan & Zoom handlers
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
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

  // Party handlers
  const handleCreateParty = (name: string) => {
    const newParty = createParty(name);
    setActiveParty(newParty.id);
  };

  const handleRenameParty = (partyId: string, currentName: string) => {
    setRenamePartyId(partyId);
    setRenamePartyName(currentName);
    setIsRenameModalOpen(true);
  };

  const handleRenameConfirm = (newName: string) => {
    if (renamePartyId) {
      renameParty(renamePartyId, newName);
    }
  };

  const handleCopyParty = (partyId: string, currentName: string) => {
    const newName = prompt(`Copy "${currentName}" as:`, `${currentName} (Copy)`);
    if (newName && newName.trim()) {
      copyParty(partyId, newName.trim());
    }
  };

  const handleDeleteParty = (partyId: string) => {
    if (parties.length <= 1) {
      alert("ไม่สามารถลบ Party สุดท้ายได้!");
      return;
    }
    const party = parties.find((p) => p.id === partyId);
    if (party && confirm(`ต้องการลบ "${party.name}" หรือไม่?`)) {
      deleteParty(partyId);
    }
  };

  // Loading state
  if (loading && !viewModel) {
    return (
      <GameLayout>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-400">กำลังโหลดข้อมูลทีม...</p>
          </div>
        </div>
      </GameLayout>
    );
  }

  // Error state
  if (error && !viewModel) {
    return (
      <GameLayout>
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
      </GameLayout>
    );
  }

  // Empty state
  if (!viewModel) {
    return (
      <GameLayout>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <p className="text-gray-400 font-medium mb-2">ยังไม่มีข้อมูลทีม</p>
          </div>
        </div>
      </GameLayout>
    );
  }

  // No recruited characters
  if (progress.recruitedCharacters.length === 0) {
    return (
      <GameLayout>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center max-w-md pointer-events-auto">
            <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">ยังไม่มีตัวละคร!</h2>
            <p className="text-gray-400 mb-6">
              คุณต้องรีครูทตัวละครก่อนจึงจะสามารถจัดทีมได้
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/characters"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-semibold"
              >
                ไปรีครูทตัวละคร
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                กลับหน้าแรก
              </Link>
            </div>
          </div>
        </div>
      </GameLayout>
    );
  }

  // Get active party data
  const activeParty = parties.find((p) => p.id === activePartyId);
  const activePartyMembers = activeParty?.members || [];

  // Get character objects
  const activePartyCharacters = activePartyMembers
    .map((member) => {
      const recruited = progress.recruitedCharacters.find(
        (rc) => rc.characterId === member.characterId
      );
      if (!recruited) return null;
      const character = viewModel?.playableCharacters.find(
        (c) => c.id === recruited.characterId
      );
      if (!character) return null;
      return {
        character,
        position: member.position,
        isLeader: member.isLeader,
      };
    })
    .filter(Boolean) as {
    character: Character;
    position: number;
    isLeader: boolean;
  }[];

  const stats = getPartyStats(activePartyCharacters);
  const synergies = getPartySynergy(activePartyCharacters);

  // Available characters
  const availableChars =
    viewModel?.playableCharacters.filter((c) => {
      const isRecruited = progress.recruitedCharacters.some(
        (rc) => rc.characterId === c.id
      );
      const isInActiveParty = activePartyMembers.some(
        (m) => m.characterId === c.id
      );
      return isRecruited && !isInActiveParty;
    }) || [];

  // No need to generate positions for available characters
  // They will be shown in modal when selecting

  // Handlers
  const handleSlotClick = (position: number) => {
    setSelectedPosition(position);
    setIsSelectModalOpen(true);
  };

  const handleCharacterSelect = (character: Character) => {
    if (selectedPosition !== null && activePartyId) {
      const success = addToPartyV2(activePartyId, character.id, selectedPosition);
      if (success) {
        setIsSelectModalOpen(false);
        setSelectedPosition(null);
      }
    }
  };

  const handleRemove = (characterId: string) => {
    if (activePartyId) {
      removeFromPartyV2(activePartyId, characterId);
    }
  };

  const handleMemberClick = (characterId: string) => {
    // When clicking on a party member, ask to remove
    if (confirm("ต้องการลบสมาชิกคนนี้ออกจากทีมหรือไม่?")) {
      handleRemove(characterId);
    }
  };

  return (
    <GameLayout>
      {/* Party Formation View */}
      <PartyFormationView
        members={activePartyCharacters}
        onSlotClick={handleSlotClick}
        onMemberClick={handleMemberClick}
        zoom={zoom}
        setZoom={setZoom}
        pan={pan}
        isDragging={isDragging}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onResetView={handleResetView}
      />

      {/* HUD Overlays */}
      <GameLayoutOverlay>
        {/* Party Panel */}
        {showPartyPanel ? (
          <HUDPanel
            title={`ทีม: ${activeParty?.name || "N/A"}`}
            icon={<Users className="w-5 h-5" />}
            position="top-left"
            closable
            onClose={() => setShowPartyPanel(false)}
            maxHeight="500px"
            maxWidth="min(400px, 90vw)"
          >
            <div className="space-y-4">
              <PartySlider
                parties={parties}
                activePartyId={activePartyId}
                onPartyChange={setActiveParty}
                onCreateParty={() => setIsCreateModalOpen(true)}
                onRenameParty={handleRenameParty}
                onCopyParty={handleCopyParty}
                onDeleteParty={handleDeleteParty}
              />
              
              {/* Team Summary */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  สมาชิกทีม
                </h3>
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {activePartyMembers.length}/4
                </div>
                <p className="text-xs text-gray-400">
                  {activePartyMembers.length === 0
                    ? "คลิกช่องว่างบนแผนที่เพื่อเพิ่มสมาชิก"
                    : `${4 - activePartyMembers.length} ช่องว่างเหลืออยู่`}
                </p>
              </div>
              {synergies.length > 0 && (
                <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-semibold text-white">Synergy</h3>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {synergies.map((synergy) => (
                      <span
                        key={synergy}
                        className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs"
                      >
                        ✨ {synergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {activePartyMembers.length > 0 && (
                <Link
                  href="/world"
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all font-semibold shadow-lg text-center flex items-center justify-center gap-2"
                >
                  <Map className="w-5 h-5" />
                  เริ่มผจญภัย
                </Link>
              )}
            </div>
          </HUDPanel>
        ) : (
          <HUDPanelToggle
            label="ทีม"
            icon={<Users className="w-4 h-4" />}
            onClick={() => setShowPartyPanel(true)}
            position="top-left"
          />
        )}

        {/* Stats Panel */}
        {showStatsPanel ? (
          <HUDPanel
            title="สถิติทีม"
            icon={<Shield className="w-5 h-5" />}
            position="top-right"
            closable
            onClose={() => setShowStatsPanel(false)}
            maxHeight="300px"
            maxWidth="280px"
          >
            <PartyStatsPanel stats={stats} availableCount={availableChars.length} />
          </HUDPanel>
        ) : (
          <HUDPanelToggle
            label="สถิติ"
            icon={<Shield className="w-4 h-4" />}
            onClick={() => setShowStatsPanel(true)}
            position="top-right"
          />
        )}
      </GameLayoutOverlay>

      {/* Character Selection Modal - Compact & Responsive */}
      <CharacterSelectModal
        isOpen={isSelectModalOpen}
        onClose={() => {
          setIsSelectModalOpen(false);
          setSelectedPosition(null);
        }}
        position={selectedPosition || 0}
        characters={availableChars}
        onSelect={handleCharacterSelect}
      />

      {/* Create Party Modal */}
      <CreatePartyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateParty}
      />

      {/* Rename Party Modal */}
      <RenamePartyModal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        onRename={handleRenameConfirm}
        currentName={renamePartyName}
      />

      {/* Error Toast */}
      {error && viewModel && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <span className="mr-2">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}
    </GameLayout>
  );
}
