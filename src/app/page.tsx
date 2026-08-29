import { Navbar } from "@/components/Navbar";
import { GreatBigStyleHome } from "@/components/GreatBigStyleHome";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#021d41]">
      <Navbar />
      <GreatBigStyleHome />
      <Footer />
    </main>
  );
}
