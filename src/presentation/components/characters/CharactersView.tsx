"use client";

import { CharactersViewModel } from "@/src/presentation/presenters/characters/CharactersPresenter";
import { useCharactersPresenter } from "@/src/presentation/presenters/characters/useCharactersPresenter";
import { Character } from "@/src/domain/types/character.types";
import { CharacterCard } from "@/src/presentation/components/character/CharacterCard";
import { Button, Modal } from "@/src/presentation/components/ui";
import { Users, Filter, Search } from "lucide-react";
import Link from "next/link";
import { useGameStore } from "@/src/stores/gameStore";
import { useRouter } from "next/navigation";

interface CharactersViewProps {
  initialViewModel?: CharactersViewModel;
}

export function CharactersView({ initialViewModel }: CharactersViewProps) {
  const router = useRouter();
  const { addToParty, isInParty, party, recruitCharacter, isCharacterRecruited, progress } = useGameStore();
  
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
    // Don't close modal, let user decide what to do next
  };

  const handleAddToParty = (character: Character) => {
    // Check if party is full
    if (party.length >= 4) {
      alert("ทีมเต็มแล้ว! (สูงสุด 4 คน)");
      return;
    }

    const success = addToParty(character);
    if (success) {
      setSelectedCharacter(null);
      // Show success message
      const remaining = 4 - (party.length + 1);
      if (remaining > 0) {
        // Optional: You can add a toast notification here
        console.log(`เพิ่ม ${character.name} เข้าทีมแล้ว! เลือกได้อีก ${remaining} คน`);
      }
    }
  };
  
  const handleGoToParty = () => {
    if (party.length === 0) {
      alert("กรุณาเลือกตัวละครอย่างน้อย 1 คน");
      return;
    }
    router.push("/party");
  };

  // Show loading only on initial load
  if (loading && !viewModel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">กำลังโหลดข้อมูลตัวละคร...</p>
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
          <p className="text-gray-400 font-medium mb-2">ยังไม่มีข้อมูลตัวละคร</p>
        </div>
      </div>
    );
  }

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
        </div>

        {/* Selected Characters Summary */}
        {(progress.recruitedCharacters.length > 0 || party.length > 0) && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-purple-400" />
                <div>
                  <h3 className="text-white font-semibold">
                    รีครูท: {progress.recruitedCharacters.length} คน | ทีม: {party.length}/4
                  </h3>
                  {party.length > 0 && (
                    <p className="text-gray-400 text-sm">
                      ทีม: {party.map((m) => m.character.name).join(", ")}
                    </p>
                  )}
                </div>
              </div>
              {party.length > 0 && (
                <button
                  onClick={handleGoToParty}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all font-semibold shadow-lg shadow-purple-500/50"
                >
                  ยืนยันและไปจัดทีม →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">ตัวละคร</h1>
          </div>
          <p className="text-gray-400 text-lg">
            {party.length === 0 
              ? "เลือกตัวละครที่ต้องการเข้าทีม (สูงสุด 4 คน) แล้วกดยืนยัน"
              : `เลือกแล้ว ${party.length}/4 คน - เลือกเพิ่มหรือกดยืนยันเพื่อไปจัดทีม`
            }
          </p>
        </div>

        {/* Filters */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Class Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-400">คลาส:</span>
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

            {/* Playable Filter */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="playable"
                checked={showOnlyPlayable}
                onChange={(e) => setShowOnlyPlayable(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-slate-800 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="playable" className="text-sm text-gray-400">
                แสดงเฉพาะตัวละครที่เล่นได้
              </label>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {viewModel.totalCharacters}
            </div>
            <div className="text-sm text-gray-400">ตัวละครทั้งหมด</div>
          </div>
          <div className="bg-blue-900/30 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {viewModel.playableCount}
            </div>
            <div className="text-sm text-gray-400">เล่นได้</div>
          </div>
          <div className="bg-amber-900/30 backdrop-blur-sm border border-amber-500/30 rounded-lg p-4">
            <div className="text-3xl font-bold text-amber-400 mb-1">
              {viewModel.recruitableCount}
            </div>
            <div className="text-sm text-gray-400">รีครูทได้</div>
          </div>
          <div className="bg-pink-900/30 backdrop-blur-sm border border-pink-500/30 rounded-lg p-4">
            <div className="text-3xl font-bold text-pink-400 mb-1">
              {viewModel.legendaryCount}
            </div>
            <div className="text-sm text-gray-400">Legendary+</div>
          </div>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onClick={() => setSelectedCharacter(character)}
              isSelected={selectedCharacter?.id === character.id}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredCharacters.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">ไม่พบตัวละครที่ตรงกับเงื่อนไข</p>
          </div>
        )}

        {/* Character Detail Modal */}
        {selectedCharacter && (
          <Modal
            isOpen={!!selectedCharacter}
            onClose={() => setSelectedCharacter(null)}
            title={selectedCharacter.name}
            size="lg"
          >
            <CharacterDetailContent 
              character={selectedCharacter}
              onAddToParty={handleAddToParty}
              onRecruit={handleRecruitCharacter}
              isInParty={isInParty(selectedCharacter.id)}
              isRecruited={isCharacterRecruited(selectedCharacter.id)}
            />
          </Modal>
        )}

        {/* Error Toast */}
        {error && viewModel && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface CharacterDetailContentProps {
  character: Character;
  onAddToParty: (character: Character) => void;
  onRecruit: (character: Character) => void;
  isInParty: boolean;
  isRecruited: boolean;
}

function CharacterDetailContent({ 
  character, 
  onAddToParty,
  onRecruit,
  isInParty,
  isRecruited
}: CharacterDetailContentProps) {
  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">รายละเอียด</h3>
        <p className="text-gray-300">{character.description}</p>
      </div>

      {/* Backstory */}
      {character.backstory && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">ประวัติ</h3>
          <p className="text-gray-300">{character.backstory}</p>
        </div>
      )}

      {/* Stats Detail */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">สถานะ</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">HP</div>
            <div className="text-2xl font-bold text-red-400">
              {character.stats.hp} / {character.stats.maxHp}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">MP</div>
            <div className="text-2xl font-bold text-cyan-400">
              {character.stats.mp} / {character.stats.maxMp}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">ATK</div>
            <div className="text-2xl font-bold text-orange-400">
              {character.stats.atk}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">DEF</div>
            <div className="text-2xl font-bold text-blue-400">
              {character.stats.def}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">INT</div>
            <div className="text-2xl font-bold text-purple-400">
              {character.stats.int}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">AGI</div>
            <div className="text-2xl font-bold text-green-400">
              {character.stats.agi}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">LUK</div>
            <div className="text-2xl font-bold text-yellow-400">
              {character.stats.luk}
            </div>
          </div>
        </div>
      </div>

      {/* Elements */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">ธาตุ</h3>
        <div className="flex gap-2">
          {character.elements.map((element) => (
            <span
              key={element}
              className="px-4 py-2 rounded-lg bg-slate-800 text-white capitalize"
            >
              {element}
            </span>
          ))}
        </div>
      </div>

      {/* Elemental Affinities */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          ความสัมพันธ์ธาตุ
        </h3>
        <div className="space-y-2">
          {character.elementalAffinities.map((affinity) => (
            <div key={affinity.element} className="flex items-center gap-4">
              <span className="w-20 text-gray-400 capitalize">
                {affinity.element}
              </span>
              <div className="flex-1 bg-slate-800 rounded-full h-6 overflow-hidden">
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
                className={`w-16 text-right font-semibold ${
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

      {/* Skills */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">สกิล</h3>
        <div className="grid grid-cols-3 gap-2">
          {character.skills.map((skillId) => (
            <div
              key={skillId}
              className="bg-slate-800/50 rounded-lg p-3 text-center"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-purple-400 text-xs">{skillId}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-4">
        {/* Recruit Button */}
        {!isRecruited && (
          <Button 
            variant="action" 
            className="w-full"
            onClick={() => onRecruit(character)}
          >
            ⭐ รีครูทตัวละคร
          </Button>
        )}
        
        {/* Add to Party Button */}
        {isRecruited && (
          <>
            {isInParty ? (
              <Button variant="ghost" className="w-full" disabled>
                ✓ อยู่ในทีมแล้ว
              </Button>
            ) : (
              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => onAddToParty(character)}
              >
                เพิ่มเข้าทีม (Party)
              </Button>
            )}
          </>
        )}
        
        {/* Status Messages */}
        {!isRecruited && (
          <p className="text-sm text-gray-400 text-center">
            รีครูทตัวละครก่อนเพื่อเพิ่มเข้าทีม
          </p>
        )}
      </div>
    </div>
  );
}
