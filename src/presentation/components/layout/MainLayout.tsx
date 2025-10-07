import { GameNavbar } from "./GameNavbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Main Layout Component
 * Wraps all pages with GameNavbar
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
      <GameNavbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
