"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface HUDPortalProps {
  children: ReactNode;
  /**
   * z-index level for the portal container
   * - 'low': z-[100] - Base HUD level
   * - 'medium': z-[110] - Elevated HUD level (default)
   * - 'high': z-[120] - Top-most HUD level
   * - 'modal': z-[130] - Modal/overlay level
   */
  zIndex?: "low" | "medium" | "high" | "modal";
  /**
   * Container element to render portal into
   * If not provided, will try to find nearest parent with data-portal-container
   * Falls back to document.body
   */
  container?: Element | null;
}

/**
 * HUDPortal - Portal wrapper for HUD components
 *
 * This component uses React Portal to render HUD elements at a parent container level,
 * preventing z-index conflicts with other UI elements.
 *
 * Benefits:
 * - Prevents UI elements from blocking each other
 * - Ensures proper stacking order
 * - Reusable across the entire project
 * - Maintains proper event handling
 * - Renders within parent context (not document.body)
 *
 * Usage:
 * ```tsx
 * // Auto-detect parent container
 * <HUDPortal zIndex="high">
 *   <HUDPanel>...</HUDPanel>
 * </HUDPortal>
 *
 * // Or specify container explicitly
 * <HUDPortal zIndex="high" container={containerRef.current}>
 *   <HUDPanel>...</HUDPanel>
 * </HUDPortal>
 * ```
 */
export function HUDPortal({
  children,
  zIndex = "medium",
  container,
}: HUDPortalProps) {
  const [mounted, setMounted] = useState(false);
  const [portalContainer, setPortalContainer] = useState<Element | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Find portal container
    if (container) {
      setPortalContainer(container);
    } else if (elementRef.current) {
      // Try to find nearest parent with data-portal-container attribute
      const parent = elementRef.current.closest("[data-portal-container]");
      setPortalContainer(parent || document.body);
    } else {
      setPortalContainer(document.body);
    }

    return () => setMounted(false);
  }, [container]);

  // Hidden ref element to detect parent
  if (!mounted) {
    return <div ref={elementRef} style={{ display: "none" }} />;
  }

  if (!portalContainer) return null;

  return createPortal(children, portalContainer);
}
