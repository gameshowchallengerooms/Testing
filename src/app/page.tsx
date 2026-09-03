import { Navbar } from "@/components/Navbar";
import { ScrollZoomIntro } from "@/components/ScrollZoomIntro";
import { HeroSection } from "@/components/HeroSection";
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
    <main className="relative min-h-screen bg-black">
      <Navbar />
      <HeroSection />
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
