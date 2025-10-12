"use client";

import { ReactNode, useEffect } from "react";
import { GameHeader } from "./GameHeader";

export interface GameLayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideNavigation?: boolean;
  className?: string;
}

/**
 * GameLayout - Full screen game layout with fixed header and scrollable content
 *
 * Features:
 * - Fixed full screen layout
 * - Prevents body scroll
 * - Glass morphism design
 * - Responsive header with stats
 * - Scrollable content area
 *
 * Usage:
 * ```tsx
 * <GameLayout>
 *   <YourPageContent />
 * </GameLayout>
 * ```
 */
export function GameLayout({
  children,
  hideHeader = false,
  hideNavigation = false,
  className = "",
}: GameLayoutProps) {
  // Prevent body scroll when using full screen layout
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex flex-col overflow-hidden">
      {/* Header - Fixed Top */}
      {!hideHeader && <GameHeader hideNavigation={hideNavigation} />}

      {/* Main Content Area - Scrollable */}
      <div className={`flex-1 relative overflow-hidden ${className}`}>
        {children}
      </div>
    </div>
  );
}

/**
 * GameLayoutContent - Wrapper for scrollable content
 * Use this inside GameLayout for pages that need scrolling
 */
interface GameLayoutContentProps {
  children: ReactNode;
  className?: string;
  centered?: boolean;
}

export function GameLayoutContent({
  children,
  className = "",
  centered = false,
}: GameLayoutContentProps) {
  return (
    <div
      className={`absolute inset-0 overflow-y-auto overflow-x-hidden ${
        centered ? "flex items-center justify-center" : ""
      } ${className}`}
    >
      <div className={centered ? "" : "p-4 md:p-8"}>{children}</div>
    </div>
  );
}

/**
 * GameLayoutOverlay - Container for HUD overlays
 * Use this for fixed overlays (HUD panels, notifications, etc.)
 * 
 * This component serves as the portal container for HUD components.
 * HUD panels will automatically render within this container when using portals.
 */
interface GameLayoutOverlayProps {
  children: ReactNode;
  className?: string;
}

export function GameLayoutOverlay({
  children,
  className = "",
}: GameLayoutOverlayProps) {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      data-portal-container
    >
      <div className="absolute inset-0 pointer-events-none">
        {/* Children can have pointer-events-auto on individual elements */}
        {children}
      </div>
    </div>
  );
}
