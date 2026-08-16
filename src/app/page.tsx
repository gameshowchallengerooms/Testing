import { Navbar } from "@/components/Navbar";
import { ScrollZoomIntro } from "@/components/ScrollZoomIntro";
import { HeroSection } from "@/components/HeroSection";
import { ShowRounds } from "@/components/ShowRounds";
import { PricingSection } from "@/components/PricingSection";
import { StillHaveQuestions } from "@/components/FAQSection";
import { LocationSection } from "@/components/LocationSection";
import { Footer } from "@/components/Footer";
import { WhatsAppChat } from "@/components/WhatsAppChat";
import { ScrollNudge } from "@/components/ScrollNudge";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <ScrollZoomIntro />
      <ShowRounds />
      <PricingSection />
      <StillHaveQuestions />
      <LocationSection />
      <Footer />
      <WhatsAppChat />
      <ScrollNudge />
    </main>
  );
}
