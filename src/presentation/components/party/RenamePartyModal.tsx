"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/src/presentation/components/ui";
import { Button } from "@/src/presentation/components/ui";

interface RenamePartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => void;
  currentName: string;
}

export function RenamePartyModal({
  isOpen,
  onClose,
  onRename,
  currentName,
}: RenamePartyModalProps) {
  const [partyName, setPartyName] = useState(currentName);

  useEffect(() => {
    setPartyName(currentName);
  }, [currentName, isOpen]);

  const handleRename = () => {
    if (partyName.trim() && partyName !== currentName) {
      onRename(partyName.trim());
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="เปลี่ยนชื่อ Party"
      size="sm"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            ชื่อ Party ใหม่
          </label>
          <input
            type="text"
            value={partyName}
            onChange={(e) => setPartyName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="เช่น Boss Team, Farm Team..."
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            autoFocus
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={onClose}
          >
            ยกเลิก
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleRename}
            disabled={!partyName.trim() || partyName === currentName}
          >
            เปลี่ยนชื่อ
          </Button>
        </div>
      </div>
    </Modal>
  );
}
