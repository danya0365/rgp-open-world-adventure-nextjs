import { LandingView } from "@/src/presentation/components/landing/LandingView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RPG Open World Adventure - เกม RPG โลกเปิดกว้างแฟนตาซี",
  description:
    "ผจญภัยในโลกแฟนตาซีกว้างใหญ่ พร้อมระบบต่อสู้แบบ Tactical Grid เนื้อเรื่องหลายจบ และโหมด Co-op Multiplayer",
  keywords:
    "RPG, Open World, Tactical Grid, Fantasy, Multiplayer, Co-op, Thai Game",
  openGraph: {
    title: "RPG Open World Adventure",
    description:
      "เกม RPG โลกเปิดกว้างแฟนตาซี พร้อมระบบต่อสู้แบบ Tactical Grid",
    type: "website",
  },
};

/**
 * Landing Page - Server Component for SEO optimization
 */
export default function Home() {
  return <LandingView />;
}
