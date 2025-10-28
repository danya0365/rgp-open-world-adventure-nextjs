"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { LootBoxDefinition } from "@/src/domain/types/lootbox.types";

interface LootBoxOptionCardProps {
  lootBox: LootBoxDefinition;
  isSelected?: boolean;
  onSelect: () => void;
  stepLabel?: string;
  children?: ReactNode;
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

export function LootBoxOptionCard({ lootBox, isSelected, onSelect, stepLabel, children }: LootBoxOptionCardProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border transition-colors",
        isSelected
          ? "border-purple-500/80 bg-purple-500/10 text-white shadow-[0_0_40px_rgba(168,85,247,0.25)]"
          : "border-white/10 bg-white/5 text-white/70 hover:border-white/25 hover:bg-white/10 hover:text-white"
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <div>
          <p className="text-sm font-semibold text-white">{lootBox.name}</p>
          <p className="text-xs text-white/60">{TYPE_LABELS[lootBox.type]}</p>
        </div>
        {stepLabel ? (
          <span className="rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-200">
            {stepLabel}
          </span>
        ) : null}
      </button>

      <div className="px-4 pb-4 text-xs text-white/60">
        <p>{lootBox.description}</p>
        <p className="mt-2 font-medium text-white/70">{formatCost(lootBox)}</p>
      </div>

      {children ? (
        <div className="border-t border-white/10 bg-black/40 px-4 py-4 text-sm text-white/80">
          {children}
        </div>
      ) : null}
    </div>
  );
}
