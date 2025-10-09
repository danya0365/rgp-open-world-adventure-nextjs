import { ClientVirtualMapFullView } from "@/src/presentation/components/virtual-map/ClientVirtualMapFullView";
import type { Metadata } from "next";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Virtual World Map | RPG Open World Adventure",
  description: "Explore the vast fantasy world with grid-based virtual map",
};

/**
 * Virtual World Map Page
 * Grid-based rendering with player position tracking
 * Uses useVirtualMapStore for state management
 */
export default function VirtualWorldPage() {
  return <ClientVirtualMapFullView />;
}
