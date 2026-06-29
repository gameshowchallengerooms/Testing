import { Navbar } from "@/components/Navbar";
import { ScrollZoomIntro } from "@/components/ScrollZoomIntro";
import { HeroSection } from "@/components/HeroSection";
import { GameRoomsSection } from "@/components/GameRoomsSection";
import { ShowRounds } from "@/components/ShowRounds";
import { PricingSection } from "@/components/PricingSection";
import { StillHaveQuestions } from "@/components/FAQSection";
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
      <ScrollZoomIntro />
      <GameRoomsSection />
      <ShowRounds />
      <PricingSection />
      <StillHaveQuestions />
      <LocationSection />
      <Footer />
      <WhatsAppChat />
    </main>
  );
}
