interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Main Layout Component
 * Wraps all pages with Navbar and Footer
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">{children}</main>
    </div>
  );
}
