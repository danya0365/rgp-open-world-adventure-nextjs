"use client";

import { cn } from "@/lib/utils";
import type { LootBoxDefinition } from "@/src/domain/types/lootbox.types";

interface LootBoxOptionCardProps {
  lootBox: LootBoxDefinition;
  isSelected?: boolean;
  onSelect: () => void;
  stepLabel?: string;
}

const TYPE_LABELS: Record<LootBoxDefinition["type"], string> = {
  standard: "สุ่มทั่วไป",
  guaranteed: "การันตี",
  stepup: "Step-Up",
};

function formatCost(lootBox: LootBoxDefinition) {
  return lootBox.costOptions
    .map((cost) => {
      switch (cost.type) {
        case "gold":
          return `${cost.amount.toLocaleString()} Gold`;
        case "ticket":
          return cost.ticketId ? `Ticket (${cost.ticketId}) x${cost.amount}` : "Ticket";
        case "premium":
          return `Premium x${cost.amount}`;
        case "item":
          return cost.itemId ? `${cost.itemId} x${cost.amount}` : `Item x${cost.amount}`;
        default:
          return "ไม่ระบุ";
      }
    })
    .join(" • ");
}

export function LootBoxOptionCard({ lootBox, isSelected, onSelect, stepLabel }: LootBoxOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl border px-4 py-3 text-left transition-colors",
        isSelected
          ? "border-purple-500 bg-purple-500/20 text-white"
          : "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-white">{lootBox.name}</p>
          <p className="text-xs text-white/60">{TYPE_LABELS[lootBox.type]}</p>
        </div>
        {stepLabel ? (
          <span className="rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-200">
            {stepLabel}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-xs text-white/50">{lootBox.description}</p>
      <p className="mt-3 text-xs font-medium text-white/70">{formatCost(lootBox)}</p>
    </button>
  );
}
