import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { TeamBuildingSection } from "@/components/TeamBuildingSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { WhatsAppChat } from "@/components/WhatsAppChat";

export const metadata: Metadata = {
  title: "Team Building & Celebrations",
  description:
    "Hyderabad's most unforgettable team building event and celebration experience — a live game show for corporate teams, startups, birthdays, festive parties and more.",
  alternates: { canonical: "/team-building" },
};

export default function TeamBuildingPage() {
  return (
    <main className="relative min-h-screen bg-black">
      <ScrollProgress />
      <Navbar />
      {/* Header clearance — the navbar is fixed/overlaid on the home hero, so on
          this standalone page we add top padding to clear it. */}
      <div className="pt-24 md:pt-28">
        <TeamBuildingSection />
        <TestimonialsSection />
      </div>
      <Footer />
      <WhatsAppChat />
    </main>
  );
}
