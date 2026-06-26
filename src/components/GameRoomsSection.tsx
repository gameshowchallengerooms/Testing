"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Brain,
  Zap,
  Timer,
  Baby,
  Heart,
  Video,
  Truck,
  Briefcase,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

interface GameCard {
  title: string;
  tagline: string;
  icon: LucideIcon;
  tag: string;
  gradient: string;
  featured?: boolean;
}

const gameCards: GameCard[] = [
  { title: "Classic Showdowns", tagline: "Buzzer-smashing trivia where the smartest team takes the crown.", icon: Brain, tag: "Signature Show", gradient: "linear-gradient(160deg, #0d3a8c 0%, #147EFF 100%)", featured: true },
  { title: "Primetime Showdowns", tagline: "High-octane rounds packed with 60-second Time Rush challenges.", icon: Zap, tag: "Signature Show", gradient: "linear-gradient(160deg, #8a0d7a 0%, #FC19ED 100%)", featured: true },
  { title: "Time Rush Games", tagline: "Beat the clock in chaotic 60-second skill challenges.", icon: Timer, tag: "In Primetime", gradient: "linear-gradient(160deg, #7a4a0d 0%, #FFB020 100%)" },
  { title: "Kids Show", tagline: "Same thrill, kid-friendly questions for ages 10-15.", icon: Baby, tag: "Ages 10-15", gradient: "linear-gradient(160deg, #0d6e58 0%, #22D3A5 100%)" },
  { title: "Bachelor(ette) Show", tagline: "Cheeky questions themed around the big day.", icon: Heart, tag: "Special", gradient: "linear-gradient(160deg, #5a2a8c 0%, #A855F7 100%)" },
  { title: "Virtual Game Show", tagline: "Face off against anyone, anywhere, on Zoom.", icon: Video, tag: "Online", gradient: "linear-gradient(160deg, #0d3a8c 0%, #4A7DFF 100%)" },
  { title: "Roadshows", tagline: "We bring the lights, host and props to your venue.", icon: Truck, tag: "On-site", gradient: "linear-gradient(160deg, #8c3a0d 0%, #FF7A1A 100%)" },
  { title: "Team Building", tagline: "The office outing everyone will actually talk about.", icon: Briefcase, tag: "Corporate", gradient: "linear-gradient(160deg, #2a2a6e 0%, #6B5CE7 100%)" },
  { title: "Champions Wall of Fame", tagline: "Win and your team is immortalised on our wall.", icon: Trophy, tag: "Glory", gradient: "linear-gradient(160deg, #7a5a0d 0%, #FFD23F 100%)" },
];

const CARD_WIDTH_DESKTOP = 380;
const CARD_WIDTH_MOBILE = 280;
const GAP = 16;

export function GameRoomsSection() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const isMobile = window.innerWidth < 768;
    const cardWidth = isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP;
    const scrollAmount = cardWidth + GAP;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

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

      {/* Carousel Wrapper */}
      <div className="relative">
        {/* Previous Button */}
        <button
          onClick={() => scroll("left")}
          className={cn(
            "absolute left-0 top-1/2 z-10 -translate-y-1/2",
            "flex h-12 w-12 items-center justify-center rounded-full",
            "text-white transition-colors",
            "hover:cursor-pointer"
          )}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
          }}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={() => scroll("right")}
          className={cn(
            "absolute right-0 top-1/2 z-10 -translate-y-1/2",
            "flex h-12 w-12 items-center justify-center rounded-full",
            "text-white transition-colors",
            "hover:cursor-pointer"
          )}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
          }}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="game-rooms-carousel flex gap-4 overflow-x-auto"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>{`
            .game-rooms-carousel::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {gameCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className={cn(
                  "group relative flex shrink-0 flex-col justify-between overflow-hidden rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1.5",
                  "w-[280px] h-[400px] md:w-[380px] md:h-[557px]",
                  card.featured && "ring-2 ring-[#FFD23F]/80"
                )}
                style={{
                  scrollSnapAlign: "start",
                  background: card.gradient,
                }}
              >
                {/* subtle texture / glow */}
                <span
                  className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full opacity-30 blur-2xl"
                  style={{ background: "rgba(255,255,255,0.5)" }}
                  aria-hidden="true"
                />
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.18), transparent 60%)",
                  }}
                  aria-hidden="true"
                />

                {/* Top: tag + icon */}
                <div className="relative flex items-start justify-between">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide backdrop-blur",
                      card.featured
                        ? "bg-[#FFD23F] text-black"
                        : "bg-black/30 text-white"
                    )}
                  >
                    {card.tag}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur transition-transform duration-300 group-hover:scale-110">
                    <Icon size={24} />
                  </span>
                </div>

                {/* Bottom: title + tagline */}
                <div className="relative">
                  <h3
                    className="text-2xl font-bold text-white md:text-3xl"
                    style={{ fontFamily: "var(--font-display), Inter, sans-serif" }}
                  >
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm font-normal leading-relaxed text-white/85">
                    {card.tagline}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Row */}
      <div className="mt-10 flex items-center justify-between">
        <span className="font-sans text-base font-normal text-white">
          Game Show Rooms
        </span>
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
