"use client";

import { useState } from "react";
import { Modal } from "@/src/presentation/components/ui";
import { Button } from "@/src/presentation/components/ui";

interface CreatePartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function CreatePartyModal({
  isOpen,
  onClose,
  onCreate,
}: CreatePartyModalProps) {
  const [partyName, setPartyName] = useState("");

  const handleCreate = () => {
    if (partyName.trim()) {
      onCreate(partyName.trim());
      setPartyName("");
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreate();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="สร้าง Party ใหม่"
      size="sm"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            ชื่อ Party
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
            onClick={handleCreate}
            disabled={!partyName.trim()}
          >
            สร้าง
          </Button>
        </div>
      </div>
    </Modal>
  );
}
