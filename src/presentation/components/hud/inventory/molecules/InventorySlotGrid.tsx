"use client";

import { InventorySlot } from "../atoms/InventorySlot";
import type { InventorySlot as InventorySlotData } from "@/src/stores/gameStore";
import { cn } from "@/lib/utils";

interface InventorySlotGridProps {
  slots: InventorySlotData[];
  selectedItemId: string | null;
  onSelectSlot?: (slot: InventorySlotData) => void;
  className?: string;
}

export function InventorySlotGrid({
  slots,
  selectedItemId,
  onSelectSlot,
  className,
}: InventorySlotGridProps) {
  return (
    <div className={cn("grid grid-cols-5 gap-3 md:grid-cols-6 lg:grid-cols-8", className)}>
      {slots.map((slot) => (
        <InventorySlot
          key={slot.slotIndex}
          itemId={slot.itemId}
          quantity={slot.quantity}
          isSelected={Boolean(slot.itemId && slot.itemId === selectedItemId)}
          onSelect={() => onSelectSlot?.(slot)}
        />
      ))}
    </div>
  );
}
