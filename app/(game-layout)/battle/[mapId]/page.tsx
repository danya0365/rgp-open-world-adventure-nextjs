import ClientBattleView from "@/src/presentation/components/battle/ClientBattleView";
import { BattlePresenterFactory } from "@/src/presentation/presenters/battle/BattlePresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface BattlePageProps {
  params: Promise<{ mapId: string }>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({
  params,
}: BattlePageProps): Promise<Metadata> {
  const { mapId } = await params;
  const presenter = await BattlePresenterFactory.createServer();

  try {
    return presenter.generateMetadata(mapId);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "Battle | RPG Open World Adventure",
      description: "Tactical grid-based battle system",
    };
  }
}

/**
 * Battle page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function BattlePage({ params }: BattlePageProps) {
  const { mapId } = await params;
  const presenter = await BattlePresenterFactory.createServer();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(mapId);

    return <ClientBattleView mapId={mapId} initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error fetching battle data:", error);

    // Fallback UI
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">เกิดข้อผิดพลาด</h1>
          <p className="text-gray-400 mb-4">ไม่สามารถโหลดข้อมูลสนามรบได้</p>
          <Link
            href="/world"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-block"
          >
            กลับแผนที่โลก
          </Link>
        </div>
      </div>
    );
  }
}
