"use client";

import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import {
  useGameStore,
  InventoryCategory,
  InventoryItem,
  RecruitedCharacter,
  InventorySlot as InventorySlotData,
} from "@/src/stores/gameStore";
import { ITEMS_MASTER_MAP } from "@/src/data/master/items.master";
import { CHARACTERS_MASTER } from "@/src/data/master/characters.master";
import type { Character } from "@/src/domain/types/character.types";
import Image from "next/image";
import { InventorySlotGrid } from "../molecules/InventorySlotGrid";
import { InventoryFilters } from "../molecules/InventoryFilters";
import { InventoryDetailCard } from "../molecules/InventoryDetailCard";
import {
  InventorySortControls,
  type EquipmentViewMode,
} from "../molecules/InventorySortControls";
import { Button } from "@/src/presentation/components/ui/Button";

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

const isEquipmentItem = (itemType: string | undefined) => {
  return itemType === "weapon" || itemType === "armor" || itemType === "accessory";
};

const CHARACTERS_BY_ID: Record<string, Character> = CHARACTERS_MASTER.reduce(
  (acc, character) => {
    acc[character.id] = character;
    return acc;
  },
  {} as Record<string, Character>
);

type PartyMemberDisplay = {
  recruit: RecruitedCharacter;
  master: Character | null;
};

export function InventoryPanel({ className }: InventoryPanelProps) {
  const {
    inventory,
    inventoryConfig,
    setInventoryCategory,
    setSelectedInventoryItem,
    getInventoryCapacity,
    equipItem,
    unequipItem,
    removeItem,
    getActiveParty,
    progress,
    setInventorySortOrder,
    toggleInventoryAutoSort,
  } = useGameStore(
    useShallow((state) => ({
      inventory: state.inventory,
      inventoryConfig: state.inventoryConfig,
      setInventoryCategory: state.setInventoryCategory,
      setSelectedInventoryItem: state.setSelectedInventoryItem,
      getInventoryCapacity: state.getInventoryCapacity,
      equipItem: state.equipItem,
      unequipItem: state.unequipItem,
      removeItem: state.removeItem,
      getActiveParty: state.getActiveParty,
      progress: state.progress,
      setInventorySortOrder: state.setInventorySortOrder,
      toggleInventoryAutoSort: state.toggleInventoryAutoSort,
    }))
  );

  const [isSelectingCharacter, setIsSelectingCharacter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [equipmentViewMode, setEquipmentViewMode] = useState<EquipmentViewMode>("all");

  const capacityStatus = getInventoryCapacity();

  const filteredInventory = useMemo(() => {
    return inventory
      .filter((entry) => matchesCategory(entry, inventoryConfig.filteredCategory))
      .filter((entry) => {
        if (!searchTerm) {
          return true;
        }
        const master = ITEMS_MASTER_MAP[entry.itemId];
        return master?.name.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .filter((entry) => {
        switch (equipmentViewMode) {
          case "equipped":
            return Boolean(entry.equippedBy);
          case "available":
            return !entry.equippedBy;
          case "all":
          default:
            return true;
        }
      });
  }, [inventory, inventoryConfig.filteredCategory, searchTerm, equipmentViewMode]);

  const slots = useMemo<InventorySlotData[]>(() => {
    const maxSlots = inventoryConfig.capacity;
    const filled: InventorySlotData[] = filteredInventory.slice(0, maxSlots).map(
      (entry, index) => ({
        slotIndex: index,
        itemId: entry.itemId,
        quantity: entry.quantity,
      })
    );

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

  const selectedItemMaster = selectedEntry ? ITEMS_MASTER_MAP[selectedEntry.itemId] : null;

  const activeParty = getActiveParty();
  const recruitedCharacters: RecruitedCharacter[] = progress.recruitedCharacters;
  const activePartyMembers: PartyMemberDisplay[] = activeParty
    ? activeParty.members.flatMap((member) => {
        const recruit = recruitedCharacters.find(
          (rc) => rc.characterId === member.characterId
        );
        if (!recruit) {
          return [];
        }
        const master = CHARACTERS_BY_ID[member.characterId] ?? null;
        return [{ recruit, master }];
      })
    : [];

  const equippedCharacterRecruit = selectedEntry?.equippedBy
    ? recruitedCharacters.find((char) => char.characterId === selectedEntry.equippedBy) || null
    : null;
  const equippedCharacterMaster = equippedCharacterRecruit
    ? CHARACTERS_BY_ID[equippedCharacterRecruit.characterId] ?? null
    : null;

  const handleUseItem = () => {
    if (!selectedEntry) {
      return;
    }
    const master = ITEMS_MASTER_MAP[selectedEntry.itemId];
    if (!master) {
      return;
    }
    if (master.type === "consumable") {
      removeItem(selectedEntry.itemId, 1);
    }
  };

  const handleEquip = (characterId: string) => {
    if (!selectedEntry) {
      return;
    }
    equipItem(selectedEntry.itemId, characterId);
    setIsSelectingCharacter(false);
  };

  const renderActions = () => {
    if (!selectedEntry || !selectedItemMaster) {
      return null;
    }

    const isEquippable = isEquipmentItem(selectedItemMaster.type);
    const isConsumable = selectedItemMaster.type === "consumable";

    return (
      <div className="space-y-2">
        {isConsumable && selectedEntry.quantity > 0 && (
          <Button variant="action" onClick={handleUseItem} className="w-full">
            ใช้ไอเทม (ใช้ทันที)
          </Button>
        )}

        {isEquippable && (
          <div className="space-y-2">
            {equippedCharacterRecruit ? (
              <div className="space-y-2">
                <p className="text-xs text-white/60">
                  สวมใส่ให้: {equippedCharacterMaster?.name ?? equippedCharacterRecruit.characterId}
                </p>
                <Button
                  variant="secondary"
                  onClick={() => unequipItem(selectedEntry.itemId)}
                  className="w-full"
                >
                  ถอดอุปกรณ์
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="primary"
                  onClick={() => setIsSelectingCharacter((prev) => !prev)}
                  className="w-full"
                >
                  {isSelectingCharacter ? "ยกเลิกเลือกตัวละคร" : "เลือกตัวละครเพื่อสวมใส่"}
                </Button>
                {isSelectingCharacter && (
                  <div className="space-y-2 rounded-lg border border-white/10 bg-black/30 p-3 max-h-56 overflow-y-auto">
                    {activePartyMembers.length === 0 ? (
                      <p className="text-xs text-white/60">
                        ยังไม่มีสมาชิกในทีมสำหรับสวมใส่อุปกรณ์
                      </p>
                    ) : (
                      activePartyMembers.map(({ recruit, master }) => (
                        <button
                          key={recruit.characterId}
                          onClick={() => handleEquip(recruit.characterId)}
                          className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10"
                        >
                          <div className="flex items-center gap-3">
                            {master?.portrait ? (
                              <Image
                                src={master.portrait}
                                alt={master.name}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full border border-white/10 object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-sm font-semibold text-white flex items-center justify-center">
                                {(master?.name ?? recruit.characterId)
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </div>
                            )}
                            <div className="space-y-0.5">
                              <p className="font-semibold text-white">
                                {master?.name ?? recruit.characterId}
                              </p>
                              <p className="text-xs text-white/60">
                                {master?.class ? `${master.class.toUpperCase()} • ` : ""}Lv {recruit.level}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

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

      <InventorySortControls
        sortOrder={inventoryConfig.sortOrder}
        autoSort={inventoryConfig.autoSort}
        onChangeSortOrder={setInventorySortOrder}
        onToggleAutoSort={toggleInventoryAutoSort}
        equipmentViewMode={equipmentViewMode}
        onChangeEquipmentView={setEquipmentViewMode}
      />

      <div className="flex items-center gap-2">
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="ค้นหาไอเทม..."
          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-purple-500 focus:outline-none"
        />
        <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")}>
          ล้าง
        </Button>
      </div>

      <InventorySlotGrid
        slots={slots}
        selectedItemId={inventoryConfig.selectedItemId}
        onSelectSlot={(slot) => {
          if (!slot.itemId) {
            setSelectedInventoryItem(null);
            return;
          }
          setSelectedInventoryItem(slot.itemId ?? null);
          setIsSelectingCharacter(false);
        }}
      />

      <InventoryDetailCard
        itemId={selectedEntry?.itemId ?? null}
        quantity={selectedEntry?.quantity ?? 0}
        actions={renderActions()}
      />
    </div>
  );
}
