"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Play } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <header
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black",
        "px-5 py-[120px] md:px-10 md:pt-[150px] md:pb-[110px]"
      )}
    >
      {/* Background media — swap this <Image> for your real venue/host photo or a
          looping <video> once the footage is ready. */}
      <Image
        src="/images/pSSINVOSMIf4PhqxNRckBByjw.webp"
        alt=""
        fill
        priority
        className="animate-ken-burns absolute inset-0 z-0 object-cover"
        sizes="100vw"
      />

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
      <div className="absolute inset-0 z-[1] overflow-hidden opacity-80" aria-hidden="true">
        <span className="beam beam-left" />
        <span className="beam beam-center" />
        <span className="beam beam-right" />
      </div>

      {/* Marquee bulb strips */}
      <BulbStrip className="absolute left-0 right-0 top-5 z-[2] hidden px-10 md:flex" />
      <BulbStrip className="absolute bottom-5 left-0 right-0 z-[2] hidden px-10 md:flex" />

      {/* Content */}
      <div className="relative z-[5] flex w-full max-w-[1040px] flex-col items-center text-center">
        {/* On-air kicker */}
        <div className="hero-enter hero-enter-1 mb-7 flex items-center gap-2.5 rounded-full border border-white/20 bg-black/40 px-4 py-2 backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF2E4D] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FF2E4D]" />
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-white">
            Now Live in Hyderabad
          </span>
        </div>

        {/* THE statement */}
        <h1 className="font-[var(--font-display)] font-black uppercase text-white">
          <span className="hero-enter hero-enter-2 block text-[20px] font-bold leading-tight tracking-[0.01em] text-white/75 md:text-[32px]">
            All your life, you watched it on TV.
          </span>
          <span
            className={cn(
              "hero-enter hero-enter-4 mt-3 block italic",
              "bg-clip-text text-transparent",
              "text-[44px] leading-none md:text-[96px] lg:text-[120px]"
            )}
            style={{
              backgroundImage:
                "linear-gradient(92deg, #1FA2FF 0%, #7C5CFC 45%, #FF35E5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 50px rgba(124,92,252,0.4))",
            }}
          >
            Tonight, you&apos;re
            <br />
            on the show.
          </span>
        </h1>

        {/* One supporting line */}
        <p
          className="hero-enter hero-enter-5 mt-7 max-w-[540px] text-base text-white/75 md:text-xl"
          style={{ textShadow: "0 2px 16px rgba(0,0,0,0.6)" }}
        >
          A real live game show — host, lights, buzzers and your crew. The one hour your
          group will be talking about for years.
        </p>

        {/* ONE primary CTA + a soft 'watch' link */}
        <div className="hero-enter hero-enter-6 mt-9 flex flex-col items-center gap-5 sm:flex-row">
          <Link
            href="#tickets"
            className="animate-shine group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-9 py-5 text-lg font-bold text-white transition-transform hover:scale-[1.04]"
            style={{
              background: "linear-gradient(135deg, #147EFF, #7C5CFC, #FC19ED)",
              boxShadow: "0 18px 50px rgba(124,92,252,0.55)",
            }}
          >
            Get On The Show
            <ArrowRight
              size={20}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="#live"
            className="inline-flex items-center gap-2.5 text-base font-semibold text-white/85 transition-colors hover:text-white"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur">
              <Play size={15} className="ml-0.5 fill-white text-white" />
            </span>
            See what it&apos;s like
          </Link>
        </div>

        {/* Proof + scarcity, right where they decide */}
        <div className="hero-enter hero-enter-7 mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/80">
          <span className="flex items-center gap-2">
            <span className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} className="fill-[#FFD23F] text-[#FFD23F]" />
              ))}
            </span>
            <span className="font-semibold text-white">4.9</span> from real guests
          </span>
          <span className="hidden h-4 w-px bg-white/20 sm:block" />
          <span>
            <span className="font-semibold text-white">10,000+</span> already played
          </span>
          <span className="hidden h-4 w-px bg-white/20 sm:block" />
          <span className="flex items-center gap-1.5 font-medium text-[#FFD23F]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FFD23F] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FFD23F]" />
            </span>
            Only a few private shows a day
          </span>
        </div>
      </div>
    </header>
  );
}
