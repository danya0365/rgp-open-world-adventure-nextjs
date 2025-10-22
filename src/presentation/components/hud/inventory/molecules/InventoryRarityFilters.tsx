"use client";

import { cn } from "@/lib/utils";
import type { Item } from "@/src/domain/types/item.types";

export type InventoryRarityFilter = "all" | Item["rarity"];

const RARITY_OPTIONS: { value: InventoryRarityFilter; label: string; icon: string }[] = [
  { value: "all", label: "ทุกระดับ", icon: "✨" },
  { value: "common", label: "Common", icon: "⚪" },
  { value: "uncommon", label: "Uncommon", icon: "🟢" },
  { value: "rare", label: "Rare", icon: "🔵" },
  { value: "epic", label: "Epic", icon: "🟣" },
  { value: "legendary", label: "Legendary", icon: "🟡" },
  { value: "mythic", label: "Mythic", icon: "🌈" },
];

interface InventoryRarityFiltersProps {
  selected: InventoryRarityFilter;
  onSelect: (rarity: InventoryRarityFilter) => void;
  className?: string;
}

export function InventoryRarityFilters({ selected, onSelect, className }: InventoryRarityFiltersProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {RARITY_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={cn(
            "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
            option.value === selected
              ? "border-purple-400/70 bg-purple-500/20 text-purple-200"
              : "border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:text-white"
          )}
        >
          <span>{option.icon}</span>
          {option.label}
        </button>
      ))}
    </div>
  );
}
