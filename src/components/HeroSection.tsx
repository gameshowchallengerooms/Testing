"use client";

import { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ScrollRevealContestant } from "@/components/ScrollRevealContestant";
import { ScrollFillParagraph } from "@/components/ScrollFillParagraph";
import { ScrollBorderPill } from "@/components/ScrollBorderPill";

/** A single clean strip of marquee bulbs that chase across (top & bottom). */
function BulbStrip({ className }: { className?: string }) {
  const bulbs = Array.from({ length: 28 });
  const colors = ["#FFD23F", "#FF2E4D", "#147EFF", "#22D3A5"];
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {bulbs.map((_, i) => (
        <span
          key={i}
          className="animate-bulb h-2 w-2 rounded-full"
          style={{
            color: colors[i % colors.length],
            background: colors[i % colors.length],
            animationDelay: `${(i % 7) * 0.13}s`,
          }}
        />
      ))}
    </div>
  );
}

export function HeroSection() {
  // Tall scroll track: the hero pins (sticky) inside this while the white
  // headline reveals word-by-word, then releases and the page scrolls on.
  const scrollRef = useRef<HTMLElement>(null);

  return (
    <section ref={scrollRef} className="relative h-[240vh] w-full bg-black">
      <header
        className={cn(
          // Pin the header to EXACTLY one viewport so `position: sticky` stays
          // pinned through the whole scroll track. We size to the *dynamic*
          // viewport (`100dvh`) so mobile browser chrome growing/shrinking can't
          // make the header taller than the screen and break the pin. Top
          // padding clears the fixed navbar; vertical centering does the rest.
          "sticky top-0 flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-black",
          "px-5 pt-[max(5rem,9dvh)] pb-[max(2rem,5dvh)] md:px-10"
        )}
      >
        {/* Background media — swap this <Image> for your real venue/host photo or
            a looping <video> once the footage is ready. The <Image fill> needs a
            positioned ancestor that is relative/absolute/fixed — the header is
            `sticky`, which next/image rejects — so we wrap it in an absolute
            inset-0 box (which also covers the whole pinned header). */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/pSSINVOSMIf4PhqxNRckBByjw.webp"
            alt=""
            fill
            priority
            className="animate-ken-burns object-cover"
            sizes="100vw"
          />
        </div>

        {/* Cinematic darkening so the headline always wins */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 45%, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.74) 100%), linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.4) 32%, rgba(0,0,0,0.92) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Sweeping stage spotlight beams (subtle, behind text) */}
        <div
          className="absolute inset-0 z-[1] overflow-hidden opacity-80"
          aria-hidden="true"
        >
          <span className="beam beam-left" />
          <span className="beam beam-center" />
          <span className="beam beam-right" />
        </div>

        {/* Broad premiere-style camera washes. These illuminate the stage from
            different directions rather than drawing visible dots on the screen. */}
        <div
          className="pointer-events-none absolute inset-0 z-[3] overflow-hidden"
          aria-hidden="true"
        >
          <span className="paparazzi-wash paparazzi-wash-left" />
          <span className="paparazzi-wash paparazzi-wash-right" />
        </div>

        {/* Marquee bulb strips */}
        <BulbStrip className="absolute left-0 right-0 top-5 z-[2] hidden px-10 md:flex" />
        <BulbStrip className="absolute bottom-5 left-0 right-0 z-[2] hidden px-10 md:flex" />

        {/* Content */}
        <div className="relative z-[5] flex w-full max-w-[1040px] flex-col items-center text-center">
          {/* Setup copy — kept OUT of the <h1> so it isn't force-uppercased. */}
          <p className="hero-enter hero-enter-2 mb-[clamp(0.75rem,3dvh,2.25rem)] max-w-[720px] text-base font-medium leading-relaxed text-white/80 md:text-xl">
            For years, you watched celebrities play exciting game shows on TV.
            <br className="hidden sm:block" />
            <span className="mt-2 inline-block">
              Now,{" "}
              <span className="font-semibold text-white">
                Game Show Challenge Rooms
              </span>{" "}
              brings that experience to you — with live hosts, buzzers, big
              challenges, and your whole crew in the game.
            </span>
          </p>

          {/* THE statement */}
          <h1 className="font-(--font-display) uppercase text-white">
            <ScrollRevealContestant scrollRef={scrollRef} />
          </h1>

          {/* One supporting line — fills in word-by-word into the brand gradient
              as you scroll the pinned hero (distinct from the headline reveal). */}
          <ScrollFillParagraph
            scrollRef={scrollRef}
            className="hero-enter hero-enter-5 mt-[clamp(0.5rem,2.5dvh,1.25rem)] max-w-[540px] text-sm md:text-lg"
          />

          {/* Echo line — its gold border draws around the pill as the final
              scroll phase, then the hero unpins and the page scrolls on. The
              gold pill is the closer; no CTA button competes with the headline. */}
          <ScrollBorderPill scrollRef={scrollRef} />
        </div>
      </header>
    </section>
  );
}
