import { ClientVirtualMapFullView } from "@/src/presentation/components/virtual-map/ClientVirtualMapFullView";
import type { Metadata } from "next";
import { getLocationById } from "@/src/data/master/locations.master";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface VirtualWorldPageProps {
  params: Promise<{
    path?: string[];
  }>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: VirtualWorldPageProps): Promise<Metadata> {
  const { path } = await params;
  const locationId = path?.[path.length - 1];
  
  if (locationId) {
    const location = getLocationById(locationId);
    if (location) {
      return {
        title: `${location.name} | Virtual World Map`,
        description: location.description || "Explore the virtual world map",
      };
    }
  }

  // Fallback metadata
  return {
    title: "Virtual World Map | RPG Open World Adventure",
    description: "Explore the vast fantasy world with grid-based virtual map",
  };
}

/**
 * Virtual World Map page - Client Component with dynamic routing
 * 
 * Routes:
 * - /virtual-world → Show default location (Silverhold)
 * - /virtual-world/[locationId] → Show specific location
 * - /virtual-world/[id]/[childId] → Hierarchical navigation
 */
export default async function VirtualWorldPage({ params }: VirtualWorldPageProps) {
  const { path } = await params;
  const locationId = path?.[path.length - 1]; // Get last segment as current location ID

  return <ClientVirtualMapFullView initialLocationId={locationId} />;
}
