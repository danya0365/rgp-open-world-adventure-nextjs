"use client";

import { ITEMS_MASTER_MAP } from "@/src/data/master/items.master";
import { cn } from "@/lib/utils";

export interface InventorySlotProps {
  itemId: string | null;
  quantity: number;
  isSelected?: boolean;
  onSelect?: (itemId: string | null) => void;
  className?: string;
}

export function InventorySlot({
  itemId,
  quantity,
  isSelected,
  onSelect,
  className,
}: InventorySlotProps) {
  const item = itemId ? ITEMS_MASTER_MAP[itemId] : null;

  const icon = item?.type === "weapon" ? "⚔️" : item?.type === "armor" ? "🛡️" : item?.type === "consumable" ? "🧪" : item ? "🎒" : "➕";

  return (
    <button
      type="button"
      onClick={() => onSelect?.(itemId)}
      className={cn(
        "relative flex h-16 w-16 items-center justify-center rounded-lg border bg-black/40 text-white transition-colors",
        isSelected ? "border-yellow-400 ring-2 ring-yellow-400/40" : "border-white/10 hover:border-white/30",
        className
      )}
    >
      <span className="text-2xl">{icon}</span>
      {quantity > 1 && (
        <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-xs font-semibold">
          {quantity}
        </span>
      )}
      {item && (
        <span className="absolute inset-x-0 bottom-0 truncate px-1 text-[10px] text-white/70">
          {item.name}
        </span>
      )}
    </button>
  );
}
