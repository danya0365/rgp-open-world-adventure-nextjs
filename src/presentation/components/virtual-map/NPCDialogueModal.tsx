"use client";

import { NPCMarker } from "@/src/domain/types/location.types";
import { X, MessageCircle, Scroll } from "lucide-react";

interface NPCDialogueModalProps {
  npc: NPCMarker;
  isOpen: boolean;
  onClose: () => void;
  onAcceptQuest?: (questId: string) => void;
}

export function NPCDialogueModal({
  npc,
  isOpen,
  onClose,
  onAcceptQuest,
}: NPCDialogueModalProps) {
  if (!isOpen) return null;

  // Mock dialogue data (TODO: Replace with actual quest/dialogue data)
  const dialogue = npc.hasQuest
    ? `Greetings, traveler! I am ${npc.name || "an NPC"}.\n\nI have an important quest for you. The kingdom is in danger and we need brave adventurers like yourself to help us!\n\nWill you accept this quest?`
    : `Hello there! I am ${npc.name || "an NPC"}.\n\nWelcome to our town. Feel free to explore and talk to other townsfolk. They might have tasks for you!`;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[9998] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-2xl animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border-4 border-slate-600 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {npc.name || "NPC"}
                </h2>
                {npc.hasQuest && (
                  <div className="flex items-center gap-1 text-yellow-300 text-sm">
                    <Scroll className="w-4 h-4" />
                    <span>Quest Available</span>
                  </div>
                )}
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
            {/* NPC Portrait Placeholder */}
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-4 border-white/20">
              <MessageCircle className="w-12 h-12 text-white" />
            </div>

            {/* Dialogue Text */}
            <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
              <p className="text-white text-lg leading-relaxed whitespace-pre-line">
                {dialogue}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {npc.hasQuest && npc.questId ? (
                <>
                  <button
                    onClick={() => {
                      onAcceptQuest?.(npc.questId!);
                      onClose();
                    }}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Scroll className="w-5 h-5" />
                    Accept Quest
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all"
                  >
                    Decline
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                >
                  Goodbye
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
