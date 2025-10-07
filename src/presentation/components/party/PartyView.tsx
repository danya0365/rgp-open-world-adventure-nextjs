"use client";

import { useState, useEffect } from "react";
import { PartyViewModel } from "@/src/presentation/presenters/party/PartyPresenter";
import { usePartyPresenter } from "@/src/presentation/presenters/party/usePartyPresenter";
import { getPartyStats, getPartySynergy } from "@/src/stores/gameStore";
import { Character } from "@/src/domain/types/character.types";
import { PartySlot } from "@/src/presentation/components/party/PartySlot";
import { CharacterCard } from "@/src/presentation/components/character/CharacterCard";
import { Modal } from "@/src/presentation/components/ui";
import { PartySlider } from "@/src/presentation/components/party/PartySlider";
import { CreatePartyModal } from "@/src/presentation/components/party/CreatePartyModal";
import { RenamePartyModal } from "@/src/presentation/components/party/RenamePartyModal";
import { Users, Sparkles, Heart, Zap, Shield, Map, AlertCircle } from "lucide-react";
import Link from "next/link";

interface PartyViewProps {
  initialViewModel?: PartyViewModel;
}

export function PartyView({ initialViewModel }: PartyViewProps) {
  const {
    viewModel,
    loading,
    error,
    // Multiple Party System (ผ่าน presenter)
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

  // Local state for modal
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renamePartyId, setRenamePartyId] = useState<string>("");
  const [renamePartyName, setRenamePartyName] = useState<string>("");

  // Initialize default parties if none exist
  useEffect(() => {
    if (parties.length === 0) {
      const mainParty = createParty("Main Team");
      createParty("Boss Team");
      createParty("Farm Team");
      setActiveParty(mainParty.id);
    }
  }, [parties.length, createParty, setActiveParty]);

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
    
    const party = parties.find(p => p.id === partyId);
    if (party && confirm(`ต้องการลบ "${party.name}" หรือไม่?`)) {
      deleteParty(partyId);
    }
  };

  // Show loading only on initial load
  if (loading && !viewModel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">กำลังโหลดข้อมูลทีม...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error but we have no data
  if (error && !viewModel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
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
    );
  }

  // If we have no view model and not loading, show empty state
  if (!viewModel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <p className="text-gray-400 font-medium mb-2">ยังไม่มีข้อมูลทีม</p>
        </div>
      </div>
    );
  }

  // Get active party data
  const activeParty = parties.find(p => p.id === activePartyId);
  const activePartyMembers = activeParty?.members || [];
  
  // Get character objects from recruited characters
  const activePartyCharacters = activePartyMembers.map(member => {
    const recruited = progress.recruitedCharacters.find(rc => rc.characterId === member.characterId);
    if (!recruited) return null;
    
    // Find character from master data
    const character = viewModel?.playableCharacters.find(c => c.id === recruited.characterId);
    if (!character) return null;
    
    return {
      character,
      position: member.position,
      isLeader: member.isLeader,
    };
  }).filter(Boolean) as { character: Character; position: number; isLeader: boolean }[];

  const stats = getPartyStats(activePartyCharacters);
  const synergies = getPartySynergy(activePartyCharacters);
  
  // Available characters = recruited but not in active party
  const availableChars = viewModel?.playableCharacters.filter(
    (c) => {
      const isRecruited = progress.recruitedCharacters.some(rc => rc.characterId === c.id);
      const isInActiveParty = activePartyMembers.some(m => m.characterId === c.id);
      return isRecruited && !isInActiveParty;
    }
  ) || [];

  // Show warning if no recruited characters
  if (progress.recruitedCharacters.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">ยังไม่มีตัวละคร!</h2>
          <p className="text-gray-400 mb-6">
            คุณต้องรีครูทตัวละครก่อนจึงจะสามารถจัดทีมได้
            <br />
            <span className="text-sm text-gray-500 mt-2 block">
              (ไปหน้าตัวละคร → คลิกตัวละคร → รีครูท)
            </span>
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
    );
  }

  const handleSlotClick = (position: number) => {
    setSelectedPosition(position);
    setIsSelectModalOpen(true);
  };

  const handleCharacterSelect = (character: Character) => {
    console.log('🎮 handleCharacterSelect', {
      character: character.name,
      characterId: character.id,
      selectedPosition,
      activePartyId,
    });
    
    if (selectedPosition !== null && activePartyId) {
      // Add to active party using V2 API
      const success = addToPartyV2(activePartyId, character.id, selectedPosition);
      console.log('✅ addToPartyV2 result:', success);
      
      if (success) {
        setIsSelectModalOpen(false);
        setSelectedPosition(null);
      } else {
        console.error('❌ Failed to add to party');
      }
    } else {
      console.error('❌ Missing data:', { selectedPosition, activePartyId });
    }
  };

  const handleRemove = (characterId: string) => {
    if (activePartyId) {
      removeFromPartyV2(activePartyId, characterId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-6 flex gap-2">
          <Link
            href="/"
            className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 rounded-lg transition-colors"
          >
            ← หน้าแรก
          </Link>
          <Link
            href="/characters"
            className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 rounded-lg transition-colors"
          >
            ← ตัวละคร
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">จัดการทีม</h1>
          </div>
          <p className="text-gray-400 text-lg">
            จัดการหลาย Party พร้อมระบบ Team Synergy
          </p>
        </div>

        {/* Party Slider */}
        <div className="mb-8">
          <PartySlider
            parties={parties}
            activePartyId={activePartyId}
            onPartyChange={setActiveParty}
            onCreateParty={() => setIsCreateModalOpen(true)}
            onRenameParty={handleRenameParty}
            onCopyParty={handleCopyParty}
            onDeleteParty={handleDeleteParty}
          />
        </div>

        {/* Party Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-purple-400" />
              <div className="text-sm text-gray-400">สมาชิก</div>
            </div>
            <div className="text-3xl font-bold text-purple-400">
              {stats.memberCount}/4
            </div>
          </div>

          <div className="bg-red-900/30 backdrop-blur-sm border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-red-400" />
              <div className="text-sm text-gray-400">Total HP</div>
            </div>
            <div className="text-3xl font-bold text-red-400">
              {stats.totalHp.toLocaleString()}
            </div>
          </div>

          <div className="bg-cyan-900/30 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              <div className="text-sm text-gray-400">Total MP</div>
            </div>
            <div className="text-3xl font-bold text-cyan-400">
              {stats.totalMp.toLocaleString()}
            </div>
          </div>

          <div className="bg-amber-900/30 backdrop-blur-sm border border-amber-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <div className="text-sm text-gray-400">Avg Level</div>
            </div>
            <div className="text-3xl font-bold text-amber-400">
              {stats.avgLevel}
            </div>
          </div>
        </div>

        {/* Synergies */}
        {synergies.length > 0 && (
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Team Synergy</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {synergies.map((synergy) => (
                <span
                  key={synergy}
                  className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-semibold"
                >
                  ✨ {synergy}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Party Slots */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            ทีมของคุณ {activeParty ? `- ${activeParty.name}` : ''}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((position) => {
              const member = activePartyCharacters.find(m => m.position === position) || null;
              return (
                <PartySlot
                  key={position}
                  position={position}
                  member={member}
                  onRemove={handleRemove}
                  onSelect={handleSlotClick}
                />
              );
            })}
          </div>
        </div>

        {/* Available Characters */}
        {availableChars.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              ตัวละครที่สามารถเลือกได้ ({availableChars.length})
            </h2>
            <p className="text-gray-400 mb-4">
              คลิกช่องว่างด้านบนเพื่อเลือกตัวละครเข้าทีม
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {availableChars.map((character) => (
                <div key={character.id}>
                  <CharacterCard character={character} showStats={false} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Start Adventure Button */}
        {activePartyMembers.length > 0 && (
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/30 rounded-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Map className="w-8 h-8 text-purple-400" />
                <div>
                  <h3 className="text-xl font-bold text-white">พร้อมออกผจญภัย!</h3>
                  <p className="text-gray-400 text-sm">
                    {activeParty?.name} มี {activePartyMembers.length} คน พร้อมสำรวจโลกแล้ว
                  </p>
                </div>
              </div>
              <Link
                href="/world"
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  เริ่มผจญภัย
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {activePartyMembers.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">ยังไม่มีสมาชิกในทีม</p>
            <p className="text-gray-500 mb-4">
              คลิกที่ช่องว่างหรือเลือกตัวละครด้านล่างเพื่อเพิ่มเข้าทีม
            </p>
            <div className="flex items-center justify-center gap-2 text-amber-400">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">ต้องมีอย่างน้อย 1 คนเพื่อเริ่มผจญภัย</p>
            </div>
          </div>
        )}

        {/* Character Selection Modal */}
        <Modal
          isOpen={isSelectModalOpen}
          onClose={() => {
            setIsSelectModalOpen(false);
            setSelectedPosition(null);
          }}
          title={`เลือกตัวละครสำหรับ Slot ${(selectedPosition || 0) + 1}`}
          size="xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableChars.map((character) => (
              <div
                key={character.id}
                onClick={() => handleCharacterSelect(character)}
                className="cursor-pointer"
              >
                <CharacterCard character={character} />
              </div>
            ))}
          </div>
          {availableChars.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">ไม่มีตัวละครที่สามารถเลือกได้</p>
            </div>
          )}
        </Modal>

        {/* Error Toast */}
        {error && viewModel && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

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
      </div>
    </div>
  );
}
