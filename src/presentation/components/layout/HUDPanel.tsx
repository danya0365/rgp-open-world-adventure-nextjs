"use client";

import { X } from "lucide-react";
import { ReactNode, useState } from "react";

export interface HUDPanelProps {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  closable?: boolean;
  onClose?: () => void;
  className?: string;
  maxHeight?: string;
  maxWidth?: string;
  defaultOpen?: boolean;
}

export function HUDPanel({
  title,
  icon,
  children,
  position = "top-left",
  closable = true,
  onClose,
  className = "",
  maxHeight = "500px",
  maxWidth = "400px",
  defaultOpen = true,
}: HUDPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  if (!isOpen) return null;

  return (
    <div
      className={`absolute ${positionClasses[position]} z-10 ${className}`}
      style={{ maxWidth }}
    >
      <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
        {/* Close Button */}
        {closable && (
          <button
            onClick={handleClose}
            className="absolute -top-2 -right-2 z-20 p-1 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}

        {/* Header */}
        {(title || icon) && (
          <div className="flex items-center gap-2 mb-3">
            {icon && <div className="text-purple-400">{icon}</div>}
            {title && (
              <h3 className="text-lg font-bold text-white">{title}</h3>
            )}
          </div>
        )}

        {/* Content with scrollable area */}
        <div
          className="overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50"
          style={{ maxHeight }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * HUD Panel Toggle Button
 * Use this to show the panel when it's closed
 */
interface HUDPanelToggleProps {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export function HUDPanelToggle({
  label,
  icon,
  onClick,
  position = "top-left",
}: HUDPanelToggleProps) {
  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  return (
    <button
      onClick={onClick}
      className={`absolute ${positionClasses[position]} px-3 py-2 bg-slate-900/50 hover:bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg transition-colors text-white text-sm z-10 flex items-center gap-2`}
    >
      {icon}
      {label}
    </button>
  );
}
