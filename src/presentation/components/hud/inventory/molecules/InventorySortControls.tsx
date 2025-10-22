"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/src/presentation/components/ui/Button";
import type { InventorySortOrder } from "@/src/stores/gameStore";

const SORT_OPTIONS: { value: InventorySortOrder; label: string }[] = [
  { value: "rarity-desc", label: "ความหายากสูง → ต่ำ" },
  { value: "name-asc", label: "ชื่อ A → Z" },
  { value: "type", label: "ประเภทไอเทม" },
];

export type EquipmentViewMode = "all" | "equipped" | "available";

const EQUIPMENT_VIEW_OPTIONS: { value: EquipmentViewMode; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "equipped", label: "สวมใส่แล้ว" },
  { value: "available", label: "ว่าง" },
];

interface InventorySortControlsProps {
  sortOrder: InventorySortOrder;
  autoSort: boolean;
  onChangeSortOrder: (order: InventorySortOrder) => void;
  onToggleAutoSort: () => void;
  equipmentViewMode: EquipmentViewMode;
  onChangeEquipmentView: (mode: EquipmentViewMode) => void;
  className?: string;
}

export function InventorySortControls({
  sortOrder,
  autoSort,
  onChangeSortOrder,
  onToggleAutoSort,
  equipmentViewMode,
  onChangeEquipmentView,
  className,
}: InventorySortControlsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-white/10 bg-black/30 p-3 text-white md:flex-row md:items-center md:justify-between",
        className
      )}
    >
      <div className="flex flex-1 flex-col gap-1 md:flex-row md:items-center md:gap-2">
        <span className="text-xs uppercase tracking-wide text-white/50">เรียงตาม</span>
        <div className="relative">
          <select
            value={sortOrder}
            onChange={(event) => onChangeSortOrder(event.target.value as InventorySortOrder)}
            className="w-full appearance-none rounded-md border border-white/15 bg-black/40 px-3 py-2 pr-8 text-sm text-white focus:border-purple-500 focus:outline-none md:min-w-[220px]"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-slate-900">
                {option.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-white/60">⌄</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
        <Button
          variant={autoSort ? "secondary" : "ghost"}
          size="sm"
          onClick={onToggleAutoSort}
          className="whitespace-nowrap"
        >
          Auto Sort: {autoSort ? "เปิด" : "ปิด"}
        </Button>

        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_VIEW_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={equipmentViewMode === option.value ? "primary" : "ghost"}
              size="sm"
              onClick={() => onChangeEquipmentView(option.value)}
              className="whitespace-nowrap"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
