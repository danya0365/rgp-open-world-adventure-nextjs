"use client";

import { ServiceMarker } from "@/src/domain/types/location.types";
import { X, Hotel, Heart, Sparkles, Coins } from "lucide-react";
import { useState } from "react";

interface InnModalProps {
  service: ServiceMarker;
  isOpen: boolean;
  onClose: () => void;
  onRest?: (cost: number) => void;
}

// Mock inn data (TODO: Replace with actual data)
const INN_SERVICES = {
  basicRest: { name: "Basic Rest", cost: 50, hpRestore: 50, mpRestore: 30 },
  comfortRest: { name: "Comfort Rest", cost: 100, hpRestore: 100, mpRestore: 100 },
  luxuryRest: { name: "Luxury Suite", cost: 200, hpRestore: 100, mpRestore: 100, bonus: "Full restore + Buff" },
};

export function InnModal({
  service,
  isOpen,
  onClose,
  onRest,
}: InnModalProps) {
  const [selectedService, setSelectedService] = useState<keyof typeof INN_SERVICES | null>(null);
  const [isResting, setIsResting] = useState(false);

  if (!isOpen) return null;

  const handleRest = (serviceKey: keyof typeof INN_SERVICES) => {
    setSelectedService(serviceKey);
    setIsResting(true);
    
    setTimeout(() => {
      const service = INN_SERVICES[serviceKey];
      onRest?.(service.cost);
      setIsResting(false);
      
      // Auto close after showing success
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[9998] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-2xl animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-br from-amber-900 to-orange-900 rounded-2xl shadow-2xl border-4 border-amber-600 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Hotel className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {service.name || "Inn"}
                </h2>
                <p className="text-amber-100 text-sm">Rest and recover your strength</p>
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
          <div className="p-6">
            {isResting ? (
              /* Resting Animation */
              <div className="text-center py-12 animate-in fade-in duration-500">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-4 border-blue-300 animate-pulse">
                  <Sparkles className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Resting...</h3>
                <p className="text-amber-200">You feel your strength returning</p>
                
                {/* Healing particles */}
                <div className="mt-6 flex justify-center gap-2">
                  <Heart className="w-6 h-6 text-red-400 animate-bounce" />
                  <Sparkles className="w-6 h-6 text-blue-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <Heart className="w-6 h-6 text-red-400 animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            ) : selectedService ? (
              /* Success Message */
              <div className="text-center py-12 animate-in zoom-in duration-500">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center border-4 border-green-300">
                  <Heart className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-green-300 mb-2">Fully Rested!</h3>
                <p className="text-white text-lg mb-4">
                  HP & MP restored
                </p>
                {selectedService === "luxuryRest" && (
                  <p className="text-amber-300 text-sm">
                    ✨ {INN_SERVICES.luxuryRest.bonus}
                  </p>
                )}
              </div>
            ) : (
              /* Service Selection */
              <div>
                <p className="text-amber-100 mb-6 text-center">
                  Welcome, weary traveler! Choose your accommodation:
                </p>

                <div className="space-y-3">
                  {/* Basic Rest */}
                  <button
                    onClick={() => handleRest("basicRest")}
                    className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 p-4 rounded-lg transition-all transform hover:scale-105 border-2 border-gray-600"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <h4 className="text-white font-bold text-lg">
                          {INN_SERVICES.basicRest.name}
                        </h4>
                        <p className="text-gray-300 text-sm">
                          Restore {INN_SERVICES.basicRest.hpRestore}% HP, {INN_SERVICES.basicRest.mpRestore}% MP
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-yellow-400 font-bold">
                        <Coins className="w-5 h-5" />
                        {INN_SERVICES.basicRest.cost}
                      </div>
                    </div>
                  </button>

                  {/* Comfort Rest */}
                  <button
                    onClick={() => handleRest("comfortRest")}
                    className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 p-4 rounded-lg transition-all transform hover:scale-105 border-2 border-blue-600"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <h4 className="text-white font-bold text-lg">
                          {INN_SERVICES.comfortRest.name}
                        </h4>
                        <p className="text-blue-200 text-sm">
                          Full HP & MP restore
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-yellow-400 font-bold">
                        <Coins className="w-5 h-5" />
                        {INN_SERVICES.comfortRest.cost}
                      </div>
                    </div>
                  </button>

                  {/* Luxury Suite */}
                  <button
                    onClick={() => handleRest("luxuryRest")}
                    className="w-full bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-600 hover:to-purple-700 p-4 rounded-lg transition-all transform hover:scale-105 border-2 border-purple-600"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <h4 className="text-white font-bold text-lg flex items-center gap-2">
                          {INN_SERVICES.luxuryRest.name}
                          <Sparkles className="w-4 h-4 text-yellow-300" />
                        </h4>
                        <p className="text-purple-200 text-sm">
                          {INN_SERVICES.luxuryRest.bonus}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-yellow-400 font-bold">
                        <Coins className="w-5 h-5" />
                        {INN_SERVICES.luxuryRest.cost}
                      </div>
                    </div>
                  </button>
                </div>

                {/* Cancel Button */}
                <button
                  onClick={onClose}
                  className="w-full mt-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  Leave Inn
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
