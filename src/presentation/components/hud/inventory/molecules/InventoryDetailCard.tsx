"use client";

import { Item } from "@/src/domain/types/item.types";
import { ITEMS_MASTER_MAP } from "@/src/data/master/items.master";
import { cn } from "@/lib/utils";

interface InventoryDetailCardProps {
  itemId: string | null;
  quantity: number;
  className?: string;
}

const rarityColor: Record<Item["rarity"], string> = {
  common: "text-gray-300",
  uncommon: "text-green-300",
  rare: "text-blue-300",
  epic: "text-purple-300",
  legendary: "text-amber-300",
  mythic: "text-pink-300",
};

export function InventoryDetailCard({ itemId, quantity, className }: InventoryDetailCardProps) {
  const item = itemId ? ITEMS_MASTER_MAP[itemId] : null;

  if (!item) {
    return (
      <div className={cn("rounded-xl border border-white/10 bg-black/30 p-4 text-white/70", className)}>
        <p className="text-sm">เลือกไอเทมจากคลังเพื่อดูรายละเอียด</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4 rounded-xl border border-white/15 bg-black/40 p-5 text-white", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-white">{item.name}</h3>
          <p className={cn("text-sm", rarityColor[item.rarity])}>{item.rarity.toUpperCase()}</p>
        </div>
        <div className="rounded bg-white/10 px-3 py-1 text-sm font-semibold text-white/80">
          {item.type.toUpperCase()}
        </div>
      </div>

      <p className="text-sm text-white/70">{item.description}</p>

      {item.statBonus && (
        <div>
          <h4 className="font-semibold text-white">สถานะที่ได้รับ</h4>
          <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-white/70">
            {Object.entries(item.statBonus).map(([stat, value]) => (
              <li key={stat}>
                <span className="font-semibold text-white/80">{stat.toUpperCase()}</span>: +{value}
              </li>
            ))}
          </ul>
        </div>
      )}

      {item.effects && item.effects.length > 0 && (
        <div>
          <h4 className="font-semibold text-white">เอฟเฟกต์</h4>
          <ul className="mt-2 space-y-1 text-sm text-white/70">
            {item.effects.map((effect, index) => (
              <li key={`${effect.type}-${index}`}>
                <span className="font-semibold text-white/80">{effect.type.toUpperCase()}</span> {effect.value} ({effect.target})
                {effect.duration ? ` • ${effect.duration}T` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-white/70">
        <span>จำนวนที่มี: <span className="font-semibold text-white">{quantity}</span></span>
        <span>ราคาขาย: <span className="font-semibold text-amber-300">{item.sellPrice}g</span></span>
      </div>
    </div>
  );
}
