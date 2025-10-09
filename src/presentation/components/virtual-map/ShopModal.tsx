"use client";

import { ShopMarker } from "@/src/domain/types/location.types";
import { X, ShoppingBag, Sword, Shield, Sparkles, Droplet, Coins, Plus, Minus } from "lucide-react";
import { useState } from "react";

interface ShopModalProps {
  shop: ShopMarker;
  isOpen: boolean;
  onClose: () => void;
  onBuy?: (itemId: string, quantity: number, totalCost: number) => void;
}

// Mock shop inventory (TODO: Replace with actual shop data)
const SHOP_INVENTORY = {
  weapons: [
    { id: "sword-iron", name: "Iron Sword", price: 150, icon: "⚔️", stats: "+15 ATK" },
    { id: "sword-steel", name: "Steel Sword", price: 300, icon: "⚔️", stats: "+25 ATK" },
    { id: "bow-wooden", name: "Wooden Bow", price: 120, icon: "🏹", stats: "+12 ATK" },
  ],
  armor: [
    { id: "armor-leather", name: "Leather Armor", price: 200, icon: "🛡️", stats: "+20 DEF" },
    { id: "armor-chainmail", name: "Chainmail", price: 400, icon: "🛡️", stats: "+35 DEF" },
    { id: "helmet-iron", name: "Iron Helmet", price: 150, icon: "⛑️", stats: "+15 DEF" },
  ],
  general: [
    { id: "potion-health", name: "Health Potion", price: 50, icon: "💊", stats: "Restore 50 HP" },
    { id: "potion-mana", name: "Mana Potion", price: 50, icon: "🧪", stats: "Restore 30 MP" },
    { id: "antidote", name: "Antidote", price: 30, icon: "🍶", stats: "Cure Poison" },
  ],
  magic: [
    { id: "scroll-fireball", name: "Fireball Scroll", price: 200, icon: "📜", stats: "Fire DMG" },
    { id: "scroll-heal", name: "Heal Scroll", price: 150, icon: "📜", stats: "Restore 100 HP" },
    { id: "crystal-mana", name: "Mana Crystal", price: 300, icon: "💎", stats: "+50 Max MP" },
  ],
  potions: [
    { id: "potion-health", name: "Health Potion", price: 50, icon: "💊", stats: "Restore 50 HP" },
    { id: "potion-mana", name: "Mana Potion", price: 50, icon: "🧪", stats: "Restore 30 MP" },
    { id: "potion-strength", name: "Strength Potion", price: 100, icon: "💪", stats: "+20% ATK (10min)" },
    { id: "elixir-life", name: "Elixir of Life", price: 500, icon: "✨", stats: "Full HP/MP" },
  ],
  items: [
    { id: "potion-health", name: "Health Potion", price: 50, icon: "💊", stats: "Restore 50 HP" },
    { id: "potion-mana", name: "Mana Potion", price: 50, icon: "🧪", stats: "Restore 30 MP" },
    { id: "antidote", name: "Antidote", price: 30, icon: "🍶", stats: "Cure Poison" },
  ],
};

export function ShopModal({
  shop,
  isOpen,
  onClose,
  onBuy,
}: ShopModalProps) {
  const [selectedTab, setSelectedTab] = useState<"buy" | "sell">("buy");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const shopType = shop.shopType || "general";
  const inventory = SHOP_INVENTORY[shopType as keyof typeof SHOP_INVENTORY] || SHOP_INVENTORY.general;

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

  const handleBuy = (item: typeof inventory[0]) => {
    const totalCost = item.price * quantity;
    onBuy?.(item.id, quantity, totalCost);
    console.log(`Bought ${quantity}x ${item.name} for ${totalCost} gold`);
    setSelectedItem(null);
    setQuantity(1);
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
                {inventory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-all border-2 border-transparent hover:border-white/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-3xl">{item.icon}</span>
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-lg">{item.name}</h4>
                          <p className="text-white/60 text-sm">{item.stats}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-yellow-400 font-bold">
                          <Coins className="w-5 h-5" />
                          {item.price}
                        </div>
                        {selectedItem === item.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center"
                            >
                              <Minus className="w-4 h-4 text-white" />
                            </button>
                            <span className="text-white font-bold w-8 text-center">{quantity}</span>
                            <button
                              onClick={() => setQuantity(quantity + 1)}
                              className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center"
                            >
                              <Plus className="w-4 h-4 text-white" />
                            </button>
                            <button
                              onClick={() => handleBuy(item)}
                              className={`bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-all`}
                            >
                              Buy ({item.price * quantity}g)
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItem(null);
                                setQuantity(1);
                              }}
                              className="text-white/60 hover:text-white"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedItem(item.id)}
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
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/60 text-lg">Your inventory is empty</p>
                <p className="text-white/40 text-sm mt-2">
                  Collect items from battles and treasures to sell them here
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-4 bg-black/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-yellow-400">
                <Coins className="w-6 h-6" />
                <span className="font-bold text-xl">1,250</span>
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
