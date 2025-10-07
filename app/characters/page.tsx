"use client";

import { useState } from "react";
import { mockCharacters } from "@/src/data/mock";
import { Character } from "@/src/domain/types/character.types";
import { CharacterCard } from "@/src/presentation/components/character/CharacterCard";
import { Button, Modal } from "@/src/presentation/components/ui";
import { Users, Filter, Search } from "lucide-react";

export default function CharactersPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [filterClass, setFilterClass] = useState<string>("all");
  const [showOnlyPlayable, setShowOnlyPlayable] = useState(false);

  const filteredCharacters = mockCharacters.filter((char) => {
    if (showOnlyPlayable && !char.isPlayable) return false;
    if (filterClass !== "all" && char.class !== filterClass) return false;
    return true;
  });

  const classes = Array.from(new Set(mockCharacters.map((c) => c.class)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">ตัวละคร</h1>
          </div>
          <p className="text-gray-400 text-lg">
            เลือกและจัดการทีมนักผจญภัยของคุณ
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
              {classes.map((cls) => (
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
              {mockCharacters.length}
            </div>
            <div className="text-sm text-gray-400">ตัวละครทั้งหมด</div>
          </div>
          <div className="bg-blue-900/30 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {mockCharacters.filter((c) => c.isPlayable).length}
            </div>
            <div className="text-sm text-gray-400">เล่นได้</div>
          </div>
          <div className="bg-amber-900/30 backdrop-blur-sm border border-amber-500/30 rounded-lg p-4">
            <div className="text-3xl font-bold text-amber-400 mb-1">
              {mockCharacters.filter((c) => c.isRecruitable).length}
            </div>
            <div className="text-sm text-gray-400">รีครูทได้</div>
          </div>
          <div className="bg-pink-900/30 backdrop-blur-sm border border-pink-500/30 rounded-lg p-4">
            <div className="text-3xl font-bold text-pink-400 mb-1">
              {mockCharacters.filter((c) => c.rarity === "legendary" || c.rarity === "mythic").length}
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
            <CharacterDetailContent character={selectedCharacter} />
          </Modal>
        )}
      </div>
    </div>
  );
}

function CharacterDetailContent({ character }: { character: Character }) {
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
        <h3 className="text-lg font-semibold text-white mb-4">ความสัมพันธ์ธาตุ</h3>
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
      <div className="flex gap-4 pt-4">
        {character.isPlayable ? (
          <Button variant="primary" className="flex-1">
            เลือกเข้าทีม
          </Button>
        ) : character.isRecruitable ? (
          <Button variant="action" className="flex-1" disabled>
            ต้องทำเควสต์ก่อน
          </Button>
        ) : (
          <Button variant="ghost" className="flex-1" disabled>
            ไม่สามารถใช้ได้
          </Button>
        )}
      </div>
    </div>
  );
}
