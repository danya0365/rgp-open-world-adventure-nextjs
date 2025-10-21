"use client";

import { ShopMarker } from "@/src/domain/types/location.types";
import { Item } from "@/src/domain/types/item.types";
import { ITEMS_MASTER, ITEMS_MASTER_MAP } from "@/src/data/master/items.master";
import { useGameStore } from "@/src/stores/gameStore";
import { useShallow } from "zustand/react/shallow";
import { X, ShoppingBag, Sword, Shield, Sparkles, Droplet, Coins, Plus, Minus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface ShopModalProps {
  shop: ShopMarker;
  isOpen: boolean;
  onClose: () => void;
  onBuy?: (itemId: string, quantity: number, totalCost: number) => void;
}

const getShopInventory = (shopType: ShopMarker["shopType"]): Item[] => {
  switch (shopType) {
    case "weapons":
      return ITEMS_MASTER.filter((item) => item.type === "weapon").slice(0, 12);
    case "armor":
      return ITEMS_MASTER.filter((item) => item.type === "armor").slice(0, 12);
    case "magic":
      return ITEMS_MASTER.filter((item) => item.type === "consumable" || item.type === "accessory").slice(0, 12);
    case "potions":
      return ITEMS_MASTER.filter((item) => item.type === "consumable").slice(0, 12);
    case "items":
      return ITEMS_MASTER.filter((item) => item.type === "material" || item.type === "consumable").slice(0, 12);
    default:
      return ITEMS_MASTER.slice(0, 12);
  }
};

const getItemSummary = (item: Item) => {
  if (item.type === "weapon") {
    const weapon = item as Item & { atk?: number; critRate?: number; critDamage?: number; range?: number };
    const summary: string[] = [];
    if (weapon.atk) summary.push(`ATK +${weapon.atk}`);
    if (weapon.critRate) summary.push(`CRIT ${weapon.critRate}%`);
    if (weapon.critDamage) summary.push(`CRIT DMG +${weapon.critDamage}%`);
    if (weapon.range) summary.push(`Range ${weapon.range}`);
    return summary.length > 0 ? summary.join(" • ") : item.description;
  }
  if (item.type === "armor") {
    const armor = item as Item & { def?: number; elementalResistance?: { element: string; value: number }[] };
    const summary: string[] = [];
    if (armor.def) summary.push(`DEF +${armor.def}`);
    if (armor.elementalResistance && armor.elementalResistance.length > 0) {
      summary.push(
        armor.elementalResistance
          .map((resistance) => `${resistance.element.toUpperCase()} +${resistance.value}%`)
          .join(" / ")
      );
    }
    return summary.length > 0 ? summary.join(" • ") : item.description;
  }
  if (item.type === "consumable") {
    const consumable = item as Item & { effects?: { type: string; value: number; target: string; duration?: number }[] };
    if (!consumable.effects || consumable.effects.length === 0) {
      return item.description;
    }
    return consumable.effects
      .map((effect) => {
        const parts = [effect.type.toUpperCase(), `${effect.value}`];
        if (effect.duration) parts.push(`${effect.duration}T`);
        return parts.join(" ");
      })
      .join(" • ");
  }
  return item.description;
};

interface SellableEntry {
  itemId: string;
  quantity: number;
  item: Item | null;
}

export function ShopModal({
  shop,
  isOpen,
  onClose,
  onBuy,
}: ShopModalProps) {
  const [selectedTab, setSelectedTab] = useState<"buy" | "sell">("buy");
  const [selectedBuyItem, setSelectedBuyItem] = useState<Item | null>(null);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [selectedSellItemId, setSelectedSellItemId] = useState<string | null>(null);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const {
    gold,
    inventoryItems,
    addItem,
    removeItem,
    addGold,
    removeGold,
  } = useGameStore(
    useShallow((state) => ({
      gold: state.gold,
      inventoryItems: state.inventory,
      addItem: state.addItem,
      removeItem: state.removeItem,
      addGold: state.addGold,
      removeGold: state.removeGold,
    }))
  );

  const shopType = shop.shopType || "general";
  const shopInventory = useMemo(() => getShopInventory(shopType), [shopType]);
  const sellableItems = useMemo<SellableEntry[]>(() => {
    return inventoryItems
      .map((invItem) => ({
        itemId: invItem.itemId,
        quantity: invItem.quantity,
        item: ITEMS_MASTER_MAP[invItem.itemId] ?? null,
      }))
      .filter((entry) => entry.quantity > 0);
  }, [inventoryItems]);

  useEffect(() => {
    setError(null);
    setSelectedBuyItem(null);
    setBuyQuantity(1);
    setSelectedSellItemId(null);
    setSellQuantity(1);
  }, [selectedTab]);

  if (!isOpen) return null;

  const getShopIcon = () => {
    switch (shopType) {
      case "weapons": return Sword;
      case "armor": return Shield;
      case "magic": return Sparkles;
      case "potions": return Droplet;
      default: return ShoppingBag;
    }
  };

  const getShopTheme = () => {
    switch (shopType) {
      case "weapons":
        return {
          gradient: "from-red-600 to-orange-600",
          bgGradient: "from-red-900 to-orange-900",
          borderColor: "border-red-600",
          accentColor: "red",
        };
      case "armor":
        return {
          gradient: "from-blue-600 to-cyan-600",
          bgGradient: "from-blue-900 to-cyan-900",
          borderColor: "border-blue-600",
          accentColor: "blue",
        };
      case "magic":
        return {
          gradient: "from-purple-600 to-pink-600",
          bgGradient: "from-purple-900 to-pink-900",
          borderColor: "border-purple-600",
          accentColor: "purple",
        };
      case "potions":
        return {
          gradient: "from-green-600 to-emerald-600",
          bgGradient: "from-green-900 to-emerald-900",
          borderColor: "border-green-600",
          accentColor: "green",
        };
      default:
        return {
          gradient: "from-amber-600 to-yellow-600",
          bgGradient: "from-amber-900 to-yellow-900",
          borderColor: "border-amber-600",
          accentColor: "amber",
        };
    }
  };

  const theme = getShopTheme();
  const Icon = getShopIcon();

  const handleBuy = (item: Item) => {
    setError(null);
    const totalCost = item.buyPrice * buyQuantity;
    if (totalCost > gold) {
      setError("ทองไม่พอสำหรับการซื้อครั้งนี้");
      return;
    }
    const removed = removeGold(totalCost);
    if (!removed) {
      setError("ทองไม่พอสำหรับการซื้อครั้งนี้");
      return;
    }
    addItem(item.id, buyQuantity);
    onBuy?.(item.id, buyQuantity, totalCost);
    console.log(`Bought ${buyQuantity}x ${item.name} for ${totalCost} gold`);
    setSelectedBuyItem(null);
    setBuyQuantity(1);
  };

  const handleSell = (entry: SellableEntry) => {
    setError(null);
    if (sellQuantity <= 0) {
      setError("จำนวนขายต้องมากกว่า 0");
      return;
    }
    if (sellQuantity > entry.quantity) {
      setError("มีไอเทมไม่พอสำหรับการขาย");
      return;
    }
    const itemData = entry.item || ITEMS_MASTER_MAP[entry.itemId];
    const sellPrice = itemData?.sellPrice ?? 0;
    const totalGain = sellPrice * sellQuantity;
    if (totalGain <= 0) {
      setError("ไอเทมนี้ไม่สามารถขายได้");
      return;
    }
    removeItem(entry.itemId, sellQuantity);
    addGold(totalGain);
    console.log(`Sold ${sellQuantity}x ${entry.itemId} for ${totalGain} gold`);
    setSelectedSellItemId(null);
    setSellQuantity(1);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[9998] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-3xl max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className={`bg-gradient-to-br ${theme.bgGradient} rounded-2xl shadow-2xl border-4 ${theme.borderColor} overflow-hidden flex flex-col max-h-[90vh]`}>
          {/* Header */}
          <div className={`bg-gradient-to-r ${theme.gradient} px-6 py-4 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {shop.name || `${shopType} Shop`}
                </h2>
                <p className="text-white/80 text-sm capitalize">{shopType} Shop</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setSelectedTab("buy")}
              className={`flex-1 py-3 font-bold transition-colors ${
                selectedTab === "buy"
                  ? "bg-white/10 text-white border-b-2 border-white"
                  : "text-white/60 hover:text-white/80"
              }`}
            >
              Buy Items
            </button>
            <button
              onClick={() => setSelectedTab("sell")}
              className={`flex-1 py-3 font-bold transition-colors ${
                selectedTab === "sell"
                  ? "bg-white/10 text-white border-b-2 border-white"
                  : "text-white/60 hover:text-white/80"
              }`}
            >
              Sell Items
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedTab === "buy" ? (
              /* Buy Tab */
              <div className="space-y-3">
                {shopInventory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-all border-2 border-transparent hover:border-white/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-3xl">{item.type === "weapon" ? "⚔️" : item.type === "armor" ? "🛡️" : "🧪"}</span>
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-lg">{item.name}</h4>
                          <p className="text-white/60 text-sm">{getItemSummary(item)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-yellow-400 font-bold">
                          <Coins className="w-5 h-5" />
                          {item.buyPrice}
                        </div>
                        {selectedBuyItem?.id === item.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setBuyQuantity(Math.max(1, buyQuantity - 1))}
                              className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center"
                            >
                              <Minus className="w-4 h-4 text-white" />
                            </button>
                            <span className="text-white font-bold w-8 text-center">{buyQuantity}</span>
                            <button
                              onClick={() => setBuyQuantity(buyQuantity + 1)}
                              className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center"
                            >
                              <Plus className="w-4 h-4 text-white" />
                            </button>
                            <button
                              onClick={() => handleBuy(item)}
                              className={`bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-60`}
                              disabled={item.buyPrice * buyQuantity > gold}
                            >
                              Buy ({item.buyPrice * buyQuantity}g)
                            </button>
                            <button
                              onClick={() => {
                                setSelectedBuyItem(null);
                                setBuyQuantity(1);
                                setError(null);
                              }}
                              className="text-white/60 hover:text-white"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedBuyItem(item);
                              setBuyQuantity(1);
                              setError(null);
                            }}
                            className={`bg-gradient-to-r ${theme.gradient} hover:opacity-80 text-white font-bold py-2 px-6 rounded-lg transition-all`}
                          >
                            Select
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Sell Tab */
              <div className="space-y-3">
                {sellableItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60 text-lg">ยังไม่มีไอเทมในคลัง</p>
                    <p className="text-white/40 text-sm mt-2">
                      ลองออกผจญภัยหรือเปิดหีบสมบัติเพื่อหาไอเทมมาขาย</p>
                  </div>
                ) : (
                  sellableItems.map((entry) => {
                    const itemData = entry.item;
                    const displayName = itemData?.name ?? entry.itemId;
                    const description = itemData ? getItemSummary(itemData) : "Unknown item";
                    const sellPrice = itemData?.sellPrice ?? 0;
                    return (
                      <div
                        key={entry.itemId}
                        className="bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-all border-2 border-transparent hover:border-white/20"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-3xl">
                              {itemData?.type === "weapon"
                                ? "⚔️"
                                : itemData?.type === "armor"
                                ? "🛡️"
                                : itemData?.type === "consumable"
                                ? "🧪"
                                : "🎒"}
                            </span>
                            <div className="flex-1">
                              <h4 className="text-white font-bold text-lg">{displayName}</h4>
                              <p className="text-white/60 text-sm">{description}</p>
                              <p className="text-white/40 text-xs">Owned: {entry.quantity}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-yellow-400 font-bold">
                              <Coins className="w-5 h-5" />
                              {sellPrice}
                            </div>
                            {selectedSellItemId === entry.itemId ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSellQuantity(Math.max(1, sellQuantity - 1))}
                                  className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center"
                                >
                                  <Minus className="w-4 h-4 text-white" />
                                </button>
                                <span className="text-white font-bold w-8 text-center">{sellQuantity}</span>
                                <button
                                  onClick={() => setSellQuantity(Math.min(entry.quantity, sellQuantity + 1))}
                                  className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center"
                                >
                                  <Plus className="w-4 h-4 text-white" />
                                </button>
                                <button
                                  onClick={() => handleSell(entry)}
                                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
                                >
                                  Sell ({sellPrice * sellQuantity}g)
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedSellItemId(null);
                                    setSellQuantity(1);
                                    setError(null);
                                  }}
                                  className="text-white/60 hover:text-white"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedSellItemId(entry.itemId);
                                  setSellQuantity(1);
                                  setError(null);
                                }}
                                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-80 text-white font-bold py-2 px-6 rounded-lg transition-all"
                              >
                                Select
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="px-6 pb-2 text-center text-red-300 text-sm font-semibold">
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-white/10 p-4 bg-black/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-yellow-400">
                <Coins className="w-6 h-6" />
                <span className="font-bold text-xl">{gold.toLocaleString()}</span>
                <span className="text-white/60">Gold</span>
              </div>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-2 px-6 rounded-lg transition-all"
              >
                Leave Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
