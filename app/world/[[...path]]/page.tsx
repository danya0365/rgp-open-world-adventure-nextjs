import { WorldMapView } from "@/src/presentation/components/world/WorldMapView";
import { WorldPresenterFactory } from "@/src/presentation/presenters/world/WorldPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface WorldPageProps {
  params: Promise<{
    path?: string[];
  }>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: WorldPageProps): Promise<Metadata> {
  const { path } = await params;
  const locationId = path?.[path.length - 1];
  
  const presenter = await WorldPresenterFactory.createServer();

  try {
    return presenter.generateMetadata(locationId);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "แผนที่โลก | RPG Open World Adventure",
      description: "สำรวจโลกแฟนตาซีกว้างใหญ่",
    };
  }
}

/**
 * World Map page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 * 
 * Routes:
 * - /world → Show root locations
 * - /world/[id] → Show location with id and its children
 * - /world/[id]/[childId] → Hierarchical navigation
 */
export default async function WorldPage({ params }: WorldPageProps) {
  const { path } = await params;
  const locationId = path?.[path.length - 1]; // Get last segment as current location ID
  
  const presenter = await WorldPresenterFactory.createServer();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(locationId);

    return <WorldMapView initialViewModel={viewModel} currentLocationId={locationId} />;
  } catch (error) {
    console.error("Error fetching world data:", error);

    // Fallback UI
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-gray-400 mb-4">ไม่สามารถโหลดข้อมูลแผนที่ได้</p>
          <Link
            href="/"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-block"
          >
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    );
  }
}
