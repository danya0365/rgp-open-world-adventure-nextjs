"use client";

import { Character } from "@/src/domain/types/character.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/presentation/components/ui";
import { ProgressBar } from "@/src/presentation/components/ui/ProgressBar";
import { Sword, Shield, Sparkles, Heart, Zap, Lock } from "lucide-react";

interface CharacterCardProps {
  character: Character;
  onClick?: () => void;
  isSelected?: boolean;
  showStats?: boolean;
}

export function CharacterCard({
  character,
  onClick,
  isSelected = false,
  showStats = true,
}: CharacterCardProps) {
  const rarityColors = {
    common: "border-gray-500/30 bg-gray-900/50",
    uncommon: "border-green-500/30 bg-green-900/50",
    rare: "border-blue-500/30 bg-blue-900/50",
    epic: "border-purple-500/30 bg-purple-900/50",
    legendary: "border-amber-500/30 bg-amber-900/50",
    mythic: "border-pink-500/30 bg-pink-900/50",
  };

  const elementColors = {
    fire: "text-red-400",
    water: "text-cyan-400",
    earth: "text-green-400",
    wind: "text-teal-400",
    light: "text-amber-400",
    dark: "text-slate-400",
  };

  const classIcons = {
    warrior: Sword,
    mage: Sparkles,
    archer: Zap,
    assassin: Sword,
    paladin: Shield,
    priest: Heart,
    monk: Sword,
    necromancer: Sparkles,
  };

  const ClassIcon = classIcons[character.class];
  const isLocked = character.isRecruitable && !character.isPlayable;

  return (
    <Card
      variant="character"
      glow={isSelected}
      hover={!isLocked}
      className={`relative ${rarityColors[character.rarity]} ${
        isSelected ? "ring-2 ring-purple-500" : ""
      } ${isLocked ? "opacity-60" : ""}`}
      onClick={!isLocked ? onClick : undefined}
    >
      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl z-10">
          <div className="text-center">
            <Lock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">ปลดล็อกผ่านเควสต์</p>
          </div>
        </div>
      )}

      <CardHeader>
        {/* Portrait */}
        <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 bg-slate-800">
          <div className="absolute inset-0 flex items-center justify-center">
            <ClassIcon className="w-24 h-24 text-purple-400 opacity-20" />
          </div>
          {/* Placeholder for actual portrait */}
          <div className="absolute top-2 right-2 flex gap-1">
            {character.elements.map((element) => (
              <div
                key={element}
                className={`w-6 h-6 rounded-full bg-slate-900/80 flex items-center justify-center ${elementColors[element]}`}
              >
                <Sparkles className="w-4 h-4" />
              </div>
            ))}
          </div>
        </div>

        {/* Name & Class */}
        <CardTitle className="text-xl">{character.name}</CardTitle>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-400 capitalize">{character.class}</span>
          <span className="text-sm font-semibold text-purple-400">
            Lv {character.level}
          </span>
        </div>
      </CardHeader>

      {showStats && (
        <CardContent>
          {/* Stats */}
          <div className="space-y-2">
            <ProgressBar
              value={character.stats.hp}
              max={character.stats.maxHp}
              type="hp"
              size="sm"
              showLabel={false}
            />
            <ProgressBar
              value={character.stats.mp}
              max={character.stats.maxMp}
              type="mp"
              size="sm"
              showLabel={false}
            />
            <ProgressBar
              value={character.exp}
              max={character.maxExp}
              type="exp"
              size="sm"
              showLabel={false}
            />
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-slate-800/50 rounded p-2 text-center">
              <div className="text-xs text-gray-400">ATK</div>
              <div className="text-sm font-bold text-red-400">
                {character.stats.atk}
              </div>
            </div>
            <div className="bg-slate-800/50 rounded p-2 text-center">
              <div className="text-xs text-gray-400">DEF</div>
              <div className="text-sm font-bold text-blue-400">
                {character.stats.def}
              </div>
            </div>
            <div className="bg-slate-800/50 rounded p-2 text-center">
              <div className="text-xs text-gray-400">WIS</div>
              <div className="text-sm font-bold text-purple-400">
                {character.stats.wis}
              </div>
            </div>
            <div className="bg-slate-800/50 rounded p-2 text-center">
              <div className="text-xs text-gray-400">MOV</div>
              <div className="text-sm font-bold text-blue-400">
                {character.stats.mov}
              </div>
            </div>
          </div>

          {/* Rarity Badge */}
          <div className="mt-4 text-center">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                character.rarity === "legendary"
                  ? "bg-amber-500/20 text-amber-400"
                  : character.rarity === "epic"
                  ? "bg-purple-500/20 text-purple-400"
                  : character.rarity === "rare"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-gray-500/20 text-gray-400"
              }`}
            >
              {character.rarity.toUpperCase()}
            </span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
