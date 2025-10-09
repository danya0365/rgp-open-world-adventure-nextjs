import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "../public/styles/index.css";

export const metadata: Metadata = {
  title: "RGPOpenWorldAdventure",
  description: "",
  keywords: "",
  openGraph: {
    title: "RGPOpenWorldAdventure",
    description: "",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
