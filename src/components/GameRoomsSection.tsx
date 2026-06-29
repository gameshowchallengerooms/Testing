import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

export function GameRoomsSection() {
  return (
    <section
      id="games"
      className={cn(
        "relative w-full overflow-hidden",
        "rounded-3xl",
        "px-5 py-15 md:px-10 md:py-25"
      )}
      style={{
        background:
          "linear-gradient(135deg, #2a2a2e 0%, #1a1a1d 55%, #232326 100%)",
      }}
    >
      {/* Section Label */}
      <Reveal>
        <div className="mb-6 flex items-center gap-4">
          <span
            className="block h-0.5 w-15"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
          />
          <span className="font-sans text-base font-normal text-white">
            Game Show Rooms
          </span>
        </div>
      </Reveal>

      {/* Heading */}
      <Reveal delay={60}>
      <h2
        className={cn(
          "mb-10 md:mb-15 text-white font-medium",
          "text-4xl leading-tight md:text-[60px] md:leading-[72px]"
        )}
        style={{
          fontFamily: "var(--font-display), Inter, sans-serif",
          letterSpacing: "-2.4px",
        }}
      >
        Live, hosted game shows for groups of up to 15 players.
      </h2>
      </Reveal>

      {/* Footer Row */}
      <div className="mt-12 flex justify-center md:justify-end">
        <Link
          href="#tickets"
          className="flex items-center gap-2 font-sans text-base font-normal text-white transition-opacity hover:opacity-80"
        >
          Book Your Show
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
