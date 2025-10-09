"use client";

import { ServiceMarker } from "@/src/domain/types/location.types";
import { X, Users, Landmark, Church, ScrollText, Coins, Sparkles, Shield, Target } from "lucide-react";
import { useState } from "react";

interface ServiceModalProps {
  service: ServiceMarker;
  isOpen: boolean;
  onClose: () => void;
  onAction?: (actionType: string, data?: unknown) => void;
}

export function ServiceModal({
  service,
  isOpen,
  onClose,
  onAction,
}: ServiceModalProps) {
  if (!isOpen) return null;

  // Render different content based on service type
  const renderContent = () => {
    switch (service.serviceType) {
      case "guild":
        return <GuildContent onAction={onAction} onClose={onClose} />;
      case "bank":
        return <BankContent onAction={onAction} onClose={onClose} />;
      case "temple":
        return <TempleContent onAction={onAction} onClose={onClose} />;
      default:
        return <DefaultContent service={service} onClose={onClose} />;
    }
  };

  const getHeaderConfig = () => {
    switch (service.serviceType) {
      case "guild":
        return {
          icon: Users,
          gradient: "from-indigo-600 to-purple-600",
          bgGradient: "from-indigo-900 to-purple-900",
          borderColor: "border-indigo-600",
        };
      case "bank":
        return {
          icon: Landmark,
          gradient: "from-yellow-600 to-amber-600",
          bgGradient: "from-yellow-900 to-amber-900",
          borderColor: "border-yellow-600",
        };
      case "temple":
        return {
          icon: Church,
          gradient: "from-cyan-600 to-blue-600",
          bgGradient: "from-cyan-900 to-blue-900",
          borderColor: "border-cyan-600",
        };
      default:
        return {
          icon: Sparkles,
          gradient: "from-gray-600 to-gray-700",
          bgGradient: "from-gray-800 to-gray-900",
          borderColor: "border-gray-600",
        };
    }
  };

  const config = getHeaderConfig();
  const Icon = config.icon;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[9998] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-2xl animate-in zoom-in-95 duration-200">
        <div className={`bg-gradient-to-br ${config.bgGradient} rounded-2xl shadow-2xl border-4 ${config.borderColor} overflow-hidden`}>
          {/* Header */}
          <div className={`bg-gradient-to-r ${config.gradient} px-6 py-4 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {service.name || service.serviceType}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </div>
    </>
  );
}

// Guild Content
function GuildContent({ onAction, onClose }: { onAction?: (actionType: string, data?: unknown) => void; onClose: () => void }) {
  return (
    <div className="p-6">
      <p className="text-indigo-100 mb-6 text-center">
        Welcome to the Adventurer&apos;s Guild! What can we help you with?
      </p>

      <div className="space-y-3">
        {/* Quest Board */}
        <button
          onClick={() => {
            onAction?.("quest-board");
            console.log("Opening quest board...");
          }}
          className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 p-4 rounded-lg transition-all transform hover:scale-105 border-2 border-blue-600"
        >
          <div className="flex items-center gap-3">
            <ScrollText className="w-6 h-6 text-white" />
            <div className="text-left">
              <h4 className="text-white font-bold text-lg">Quest Board</h4>
              <p className="text-blue-200 text-sm">View available quests</p>
            </div>
          </div>
        </button>

        {/* Party Formation */}
        <button
          onClick={() => {
            onAction?.("party-formation");
            console.log("Opening party formation...");
          }}
          className="w-full bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-600 hover:to-purple-700 p-4 rounded-lg transition-all transform hover:scale-105 border-2 border-purple-600"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-white" />
            <div className="text-left">
              <h4 className="text-white font-bold text-lg">Party Formation</h4>
              <p className="text-purple-200 text-sm">Manage your party</p>
            </div>
          </div>
        </button>

        {/* Bounties */}
        <button
          onClick={() => {
            onAction?.("bounties");
            console.log("Opening bounties...");
          }}
          className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 p-4 rounded-lg transition-all transform hover:scale-105 border-2 border-red-600"
        >
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-white" />
            <div className="text-left">
              <h4 className="text-white font-bold text-lg">Bounties</h4>
              <p className="text-red-200 text-sm">Hunt dangerous monsters</p>
            </div>
          </div>
        </button>
      </div>

      <button
        onClick={onClose}
        className="w-full mt-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all"
      >
        Leave Guild
      </button>
    </div>
  );
}

// Bank Content
function BankContent({ onAction, onClose }: { onAction?: (actionType: string, data?: unknown) => void; onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState<"deposit" | "withdraw" | null>(null);

  const handleTransaction = () => {
    if (!amount || !action) return;
    onAction?.(action, { amount: parseInt(amount) });
    console.log(`${action}: ${amount} gold`);
    setAmount("");
    setAction(null);
  };

  return (
    <div className="p-6">
      <p className="text-yellow-100 mb-6 text-center">
        Welcome to the Bank! Your gold is safe with us.
      </p>

      {/* Mock Balance */}
      <div className="bg-yellow-800/50 rounded-lg p-4 mb-6 text-center">
        <p className="text-yellow-200 text-sm mb-1">Current Balance</p>
        <div className="flex items-center justify-center gap-2">
          <Coins className="w-8 h-8 text-yellow-400" />
          <span className="text-3xl font-bold text-yellow-300">1,250</span>
          <span className="text-yellow-200">Gold</span>
        </div>
      </div>

      {/* Transaction Form */}
      <div className="space-y-3">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount..."
          className="w-full bg-yellow-800/30 border-2 border-yellow-600 rounded-lg px-4 py-3 text-white placeholder-yellow-300/50 focus:outline-none focus:border-yellow-400"
        />

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setAction("deposit");
              handleTransaction();
            }}
            disabled={!amount}
            className="bg-gradient-to-r from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Deposit
          </button>
          <button
            onClick={() => {
              setAction("withdraw");
              handleTransaction();
            }}
            disabled={!amount}
            className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Withdraw
          </button>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full mt-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all"
      >
        Leave Bank
      </button>
    </div>
  );
}

// Temple Content
function TempleContent({ onAction, onClose }: { onAction?: (actionType: string, data?: unknown) => void; onClose: () => void }) {
  const [selectedBlessing, setSelectedBlessing] = useState<string | null>(null);

  const blessings = [
    { id: "strength", name: "Blessing of Strength", cost: 100, effect: "+10% ATK for 1 hour" },
    { id: "protection", name: "Blessing of Protection", cost: 100, effect: "+10% DEF for 1 hour" },
    { id: "wisdom", name: "Blessing of Wisdom", cost: 150, effect: "+20% EXP for 1 hour" },
  ];

  return (
    <div className="p-6">
      <p className="text-cyan-100 mb-6 text-center">
        May the divine light guide your path, traveler.
      </p>

      <div className="space-y-3">
        {blessings.map((blessing) => (
          <button
            key={blessing.id}
            onClick={() => {
              setSelectedBlessing(blessing.id);
              onAction?.("blessing", blessing);
              console.log("Blessing received:", blessing.name);
            }}
            className="w-full bg-gradient-to-r from-cyan-700 to-cyan-800 hover:from-cyan-600 hover:to-cyan-700 p-4 rounded-lg transition-all transform hover:scale-105 border-2 border-cyan-600"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h4 className="text-white font-bold text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-300" />
                  {blessing.name}
                </h4>
                <p className="text-cyan-200 text-sm">{blessing.effect}</p>
              </div>
              <div className="flex items-center gap-2 text-yellow-400 font-bold">
                <Coins className="w-5 h-5" />
                {blessing.cost}
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedBlessing && (
        <div className="mt-4 bg-cyan-800/50 rounded-lg p-4 text-center animate-in fade-in duration-300">
          <Sparkles className="w-8 h-8 text-cyan-300 mx-auto mb-2" />
          <p className="text-cyan-100">You have been blessed!</p>
        </div>
      )}

      <button
        onClick={onClose}
        className="w-full mt-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all"
      >
        Leave Temple
      </button>
    </div>
  );
}

// Default Content for other services
function DefaultContent({ service, onClose }: { service: ServiceMarker; onClose: () => void }) {
  return (
    <div className="p-6">
      <p className="text-white mb-6 text-center">
        Welcome to {service.name || service.serviceType}!
      </p>
      <p className="text-gray-300 text-center mb-6">
        This service is not yet implemented.
      </p>
      <button
        onClick={onClose}
        className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all"
      >
        Close
      </button>
    </div>
  );
}
