import { CharactersView } from "@/src/presentation/components/characters/CharactersView";
import { CharactersPresenterFactory } from "@/src/presentation/presenters/characters/CharactersPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = await CharactersPresenterFactory.createServer();

  try {
    return presenter.generateMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "ตัวละคร | RPG Open World Adventure",
      description: "เลือกและจัดการทีมนักผจญภัยของคุณ",
    };
  }
}

/**
 * Characters Management page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function CharactersPage() {
  const presenter = await CharactersPresenterFactory.createServer();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel();

    return <CharactersView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error fetching characters data:", error);

    // Fallback UI
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-gray-400 mb-4">ไม่สามารถโหลดข้อมูลตัวละครได้</p>
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
