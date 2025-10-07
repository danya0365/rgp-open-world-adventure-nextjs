"use client";

import { useState } from "react";
import { useSpring, animated, config } from "react-spring";
import { ChevronLeft, ChevronRight, Plus, Edit2, Copy, Trash2 } from "lucide-react";
import { Party } from "@/src/stores/gameStore";

interface PartySliderProps {
  parties: Party[];
  activePartyId: string | null;
  onPartyChange: (partyId: string) => void;
  onCreateParty: () => void;
  onRenameParty: (partyId: string, currentName: string) => void;
  onCopyParty: (partyId: string, currentName: string) => void;
  onDeleteParty: (partyId: string) => void;
}

export function PartySlider({
  parties,
  activePartyId,
  onPartyChange,
  onCreateParty,
  onRenameParty,
  onCopyParty,
  onDeleteParty,
}: PartySliderProps) {
  const activeIndex = parties.findIndex((p) => p.id === activePartyId);
  const [currentIndex, setCurrentIndex] = useState(activeIndex >= 0 ? activeIndex : 0);

  // Slide animation
  const slideProps = useSpring({
    transform: `translateX(-${currentIndex * 100}%)`,
    config: config.gentle,
  });

  const handlePrevious = () => {
    // Loop: if at first, go to last
    const newIndex = currentIndex === 0 ? parties.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    onPartyChange(parties[newIndex].id);
  };

  const handleNext = () => {
    // Loop: if at last, go to first
    const newIndex = currentIndex === parties.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    onPartyChange(parties[newIndex].id);
  };

  if (parties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 mb-4">ยังไม่มี Party</p>
        <button
          onClick={onCreateParty}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          สร้าง Party แรก
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Party Slider */}
      <div className="overflow-hidden">
        <animated.div
          style={slideProps}
          className="flex"
        >
          {parties.map((party) => (
            <div
              key={party.id}
              className="min-w-full px-2"
            >
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">{party.name}</h3>
                  {party.id === activePartyId && (
                    <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-gray-400 mb-4">
                  <p>Members: {party.members.length}/4</p>
                  <p className="text-sm">Formation: {party.formation}</p>
                </div>
                
                {/* Party Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onRenameParty(party.id, party.name)}
                    className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Rename
                  </button>
                  <button
                    onClick={() => onCopyParty(party.id, party.name)}
                    className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={() => onDeleteParty(party.id)}
                    disabled={parties.length <= 1}
                    className="flex-1 px-3 py-2 bg-red-900/50 hover:bg-red-800/50 disabled:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </animated.div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={handlePrevious}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Indicators */}
        <div className="flex gap-2">
          {parties.map((party, index) => (
            <button
              key={party.id}
              onClick={() => {
                setCurrentIndex(index);
                onPartyChange(party.id);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-purple-600 w-8"
                  : "bg-slate-600 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Create New Party Button */}
      <div className="mt-4 text-center">
        <button
          onClick={onCreateParty}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          สร้าง Party ใหม่
        </button>
      </div>
    </div>
  );
}
