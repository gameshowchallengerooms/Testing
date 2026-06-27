import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { GameRoomsSection } from "@/components/GameRoomsSection";
import { LiveShowSection } from "@/components/LiveShowSection";
import { TeamBuildingSection } from "@/components/TeamBuildingSection";
import { FAQSection } from "@/components/FAQSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PricingSection } from "@/components/PricingSection";
import { LocationSection } from "@/components/LocationSection";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { WhatsAppChat } from "@/components/WhatsAppChat";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black">
      <ScrollProgress />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <LiveShowSection />
      <GameRoomsSection />
      <TeamBuildingSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <LocationSection />
      <Footer />
      <WhatsAppChat />
    </main>
  );
}
