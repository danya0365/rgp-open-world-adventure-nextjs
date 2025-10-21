"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { useGameStore, InventoryCategory, InventoryItem } from "@/src/stores/gameStore";
import { ITEMS_MASTER_MAP } from "@/src/data/master/items.master";
import { InventorySlotGrid } from "../molecules/InventorySlotGrid";
import { InventoryFilters } from "../molecules/InventoryFilters";
import { InventoryDetailCard } from "../molecules/InventoryDetailCard";

interface InventoryPanelProps {
  className?: string;
}

const matchesCategory = (item: InventoryItem, category: InventoryCategory) => {
  if (category === "all") {
    return true;
  }
  const itemData = ITEMS_MASTER_MAP[item.itemId];
  if (!itemData) {
    return false;
  }

  switch (category) {
    case "weapons":
      return itemData.type === "weapon";
    case "armor":
      return itemData.type === "armor";
    case "consumables":
      return itemData.type === "consumable";
    case "materials":
      return itemData.type === "material";
    case "keyItems":
      return itemData.type === "key" || itemData.type === "quest";
    default:
      return true;
  }
};

export function InventoryPanel({ className }: InventoryPanelProps) {
  const {
    inventory,
    inventoryConfig,
    setInventoryCategory,
    setSelectedInventoryItem,
    getInventoryCapacity,
  } = useGameStore(
    useShallow((state) => ({
      inventory: state.inventory,
      inventoryConfig: state.inventoryConfig,
      setInventoryCategory: state.setInventoryCategory,
      setSelectedInventoryItem: state.setSelectedInventoryItem,
      getInventoryCapacity: state.getInventoryCapacity,
    }))
  );

  const capacityStatus = getInventoryCapacity();

  const filteredInventory = useMemo(() => {
    return inventory.filter((entry) => matchesCategory(entry, inventoryConfig.filteredCategory));
  }, [inventory, inventoryConfig.filteredCategory]);

  const slots = useMemo(() => {
    const maxSlots = inventoryConfig.capacity;
    const filled = filteredInventory.slice(0, maxSlots).map((entry, index) => ({
      slotIndex: index,
      itemId: entry.itemId,
      quantity: entry.quantity,
    }));

    if (filled.length < maxSlots) {
      for (let i = filled.length; i < maxSlots; i += 1) {
        filled.push({ slotIndex: i, itemId: null, quantity: 0 });
      }
    }

    return filled;
  }, [filteredInventory, inventoryConfig.capacity]);

  const selectedEntry = useMemo(() => {
    if (!inventoryConfig.selectedItemId) {
      return null;
    }
    return inventory.find((entry) => entry.itemId === inventoryConfig.selectedItemId) ?? null;
  }, [inventory, inventoryConfig.selectedItemId]);

  return (
    <div className={cn("space-y-4 text-white", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <InventoryFilters
          selected={inventoryConfig.filteredCategory}
          onSelect={setInventoryCategory}
        />
        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70">
          {capacityStatus.used}/{capacityStatus.capacity} ช่อง
        </div>
      </div>

      <InventorySlotGrid
        slots={slots}
        selectedItemId={inventoryConfig.selectedItemId}
        onSelectSlot={(slot) => {
          if (!slot.itemId) {
            setSelectedInventoryItem(null);
            return;
          }
          setSelectedInventoryItem(slot.itemId);
        }}
      />

      <InventoryDetailCard
        itemId={selectedEntry?.itemId ?? null}
        quantity={selectedEntry?.quantity ?? 0}
      />
    </div>
  );
}
