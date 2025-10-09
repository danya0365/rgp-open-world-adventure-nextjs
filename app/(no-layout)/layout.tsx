import { GameLayout } from "@/src/presentation/components/layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <GameLayout>{children}</GameLayout>;
}
