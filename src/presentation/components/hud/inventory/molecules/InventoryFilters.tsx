"use client";

import { cn } from "@/lib/utils";
import { InventoryCategory } from "@/src/stores/gameStore";

interface InventoryFiltersProps {
  selected: InventoryCategory;
  onSelect: (category: InventoryCategory) => void;
  className?: string;
}

const CATEGORY_OPTIONS: { value: InventoryCategory; label: string; icon: string }[] = [
  { value: "all", label: "ทั้งหมด", icon: "📦" },
  { value: "weapons", label: "อาวุธ", icon: "⚔️" },
  { value: "armor", label: "เกราะ", icon: "🛡️" },
  { value: "consumables", label: "ไอเทมใช้", icon: "🧪" },
  { value: "materials", label: "วัสดุ", icon: "🧱" },
  { value: "keyItems", label: "สำคัญ", icon: "🔑" },
];

export function InventoryFilters({ selected, onSelect, className }: InventoryFiltersProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {CATEGORY_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={cn(
            "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
            option.value === selected
              ? "border-yellow-400 bg-yellow-400/20 text-yellow-200"
              : "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
          )}
        >
          <span>{option.icon}</span>
          {option.label}
        </button>
      ))}
    </div>
  );
}
