import { Navbar } from "@/components/Navbar";
import { ScrollZoomIntro } from "@/components/ScrollZoomIntro";
import { HeroSection } from "@/components/HeroSection";
import { ChampionsWallSection } from "@/components/ChampionsWallSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { ShowRounds } from "@/components/ShowRounds";
import { ForWhomSection } from "@/components/ForWhomSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { StillHaveQuestions } from "@/components/FAQSection";
import { LocationSection } from "@/components/LocationSection";
import { Footer } from "@/components/Footer";
import { WhatsAppChat } from "@/components/WhatsAppChat";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ChampionsWallSection />
      <ScrollZoomIntro />
      <HowItWorksSection />
      <ShowRounds />
      <ForWhomSection />
      <TestimonialsSection />
      <StillHaveQuestions />
      <LocationSection />
      <Footer />
      <WhatsAppChat />
    </main>
  );
}
