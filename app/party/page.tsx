"use client";

import { useEffect, useState } from "react";
import { usePartyStore, getPartyStats, getPartySynergy } from "@/src/stores/partyStore";
import { mockCharacters, getPlayableCharacters } from "@/src/data/mock";
import { Character } from "@/src/domain/types/character.types";
import { PartySlot } from "@/src/presentation/components/party/PartySlot";
import { CharacterCard } from "@/src/presentation/components/character/CharacterCard";
import { Button, Modal } from "@/src/presentation/components/ui";
import { Users, Sparkles, Heart, Zap, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PartyPage() {
  const {
    party,
    addToParty,
    removeFromParty,
    setLeader,
    setAvailableCharacters,
    isInParty,
  } = usePartyStore();

  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [isSelectingCharacter, setIsSelectingCharacter] = useState(false);

  // Initialize available characters
  useEffect(() => {
    const playableChars = getPlayableCharacters();
    setAvailableCharacters(playableChars);
  }, [setAvailableCharacters]);

  const stats = getPartyStats(party);
  const synergies = getPartySynergy(party);
  const availableChars = mockCharacters.filter(
    (c) => c.isPlayable && !isInParty(c.id)
  );

  const handleSlotClick = (position: number) => {
    setSelectedPosition(position);
    setIsSelectingCharacter(true);
  };

  const handleCharacterSelect = (character: Character) => {
    if (selectedPosition !== null) {
      const success = addToParty(character, selectedPosition);
      if (success) {
        setIsSelectingCharacter(false);
        setSelectedPosition(null);
      }
    }
  };

  const handleRemove = (characterId: string) => {
    removeFromParty(characterId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/characters"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับไปหน้าตัวละคร
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">จัดการทีม</h1>
          </div>
          <p className="text-gray-400 text-lg">
            เลือกตัวละครสูงสุด 4 ตัวเข้าทีม
          </p>
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
          <h2 className="text-2xl font-bold text-white mb-4">ทีมของคุณ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((position) => {
              const member = party.find((m) => m.position === position) || null;
              return (
                <PartySlot
                  key={position}
                  position={position}
                  member={member}
                  onRemove={handleRemove}
                  onSelect={handleSlotClick}
                  isSelecting={!member}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {availableChars.map((character) => (
                <div
                  key={character.id}
                  onClick={() => {
                    if (party.length < 4) {
                      addToParty(character);
                    }
                  }}
                  className={party.length < 4 ? "cursor-pointer" : "opacity-50"}
                >
                  <CharacterCard
                    character={character}
                    showStats={false}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {party.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">
              ยังไม่มีสมาชิกในทีม
            </p>
            <p className="text-gray-500">
              คลิกที่ช่องว่างหรือเลือกตัวละครด้านล่างเพื่อเพิ่มเข้าทีม
            </p>
          </div>
        )}

        {/* Character Selection Modal */}
        <Modal
          isOpen={isSelectingCharacter}
          onClose={() => {
            setIsSelectingCharacter(false);
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
      </div>
    </div>
  );
}
