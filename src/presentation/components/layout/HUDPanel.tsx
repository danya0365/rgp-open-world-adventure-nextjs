"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";
import { HUDPortal } from "./HUDPortal";

export interface HUDPanelProps {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  position?:
    | "top-left"
    | "top-right"
    | "top-center"
    | "bottom-left"
    | "bottom-right";
  closable?: boolean;
  onClose?: () => void;
  className?: string;
  maxHeight?: string;
  maxWidth?: string;
  defaultOpen?: boolean;
  layout?: "floating" | "fullscreen";
  fullscreenMaxWidth?: string;
  fullscreenMaxHeight?: string;
  showOverlay?: boolean;
  /**
   * Use portal to render at document body level
   * Prevents z-index conflicts with other UI elements
   * @default true
   */
  usePortal?: boolean;
  /**
   * z-index level when using portal
   * @default "medium"
   */
  portalZIndex?: "low" | "medium" | "high" | "modal";
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
  layout = "floating",
  fullscreenMaxWidth = "calc(100vw - 3rem)",
  fullscreenMaxHeight = "calc(100vh - 3rem)",
  showOverlay = true,
  usePortal = true,
  portalZIndex = "medium",
}: HUDPanelProps) {
  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  const isFullscreen = layout === "fullscreen";
  const containerClasses = isFullscreen
    ? `fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`
    : `absolute ${positionClasses[position]} z-50 ${className}`;

  const contentStyle = isFullscreen
    ? { width: fullscreenMaxWidth, height: fullscreenMaxHeight }
    : { maxWidth };

  const scrollStyle = isFullscreen ? undefined : { maxHeight };

  const contentClassNames = `relative bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 pointer-events-auto ${
    isFullscreen ? "flex h-full w-full flex-col shadow-2xl" : ""
  }`;

  const panelContent = (
    <>
      {isFullscreen && showOverlay && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" aria-hidden />
      )}

      <div className={containerClasses}>
        <div className={contentClassNames} style={contentStyle}>
          {/* Close Button */}
          {closable && onClose && (
            <button
              onClick={onClose}
              className={`absolute z-20 p-1 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors border border-slate-600 shadow-lg ${
                isFullscreen ? "top-4 right-4" : "-top-2 -right-2"
              }`}
            >
              <X className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>
          )}

          {/* Header */}
          {(title || icon) && (
            <div className={`flex items-center gap-2 ${isFullscreen ? "mb-4" : "mb-3"}`}>
              {icon && <div className="text-purple-400">{icon}</div>}
              {title && <h3 className="text-lg font-bold text-white">{title}</h3>}
            </div>
          )}

          {/* Content with scrollable area */}
          <div
            className={`overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50 ${
              isFullscreen ? "flex-1" : ""
            }`}
            style={scrollStyle}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );

  // Use portal to render at document body level
  if (usePortal) {
    return <HUDPortal zIndex={portalZIndex}>{panelContent}</HUDPortal>;
  }

  // Render normally without portal
  return panelContent;
}

/**
 * HUD Panel Toggle Button
 * Use this to show the panel when it's closed
 */
interface HUDPanelToggleProps {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  position?:
    | "top-left"
    | "top-right"
    | "top-center"
    | "bottom-left"
    | "bottom-right";
  className?: string;
  /**
   * Use portal to render at document body level
   * @default true
   */
  usePortal?: boolean;
  /**
   * z-index level when using portal
   * @default "low"
   */
  portalZIndex?: "low" | "medium" | "high" | "modal";
}

export function HUDPanelToggle({
  label,
  icon,
  onClick,
  position = "top-left",
  className = "",
  usePortal = true,
  portalZIndex = "low",
}: HUDPanelToggleProps) {
  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  const toggleButton = (
    <button
      onClick={onClick}
      className={`absolute ${positionClasses[position]} px-3 py-2 bg-slate-900/50 hover:bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg transition-colors text-white text-sm z-50 flex items-center gap-2 pointer-events-auto ${className}`}
    >
      {icon}
      {label}
    </button>
  );

  // Use portal to render at document body level
  if (usePortal) {
    return <HUDPortal zIndex={portalZIndex}>{toggleButton}</HUDPortal>;
  }

  // Render normally without portal
  return toggleButton;
}
