"use client";

import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useCountUp } from "@/hooks/useCountUp";

function StatItem({
  end,
  decimals,
  suffix,
  label,
}: {
  end: number;
  decimals: number;
  suffix: string;
  label: string;
}) {
  const { ref, display } = useCountUp({ end, decimals });
  return (
    <div className="flex flex-col items-center gap-1 bg-[#0d0d0f] px-4 py-6">
      <span
        ref={ref}
        className="text-3xl font-extrabold text-white md:text-4xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {display}
        {suffix}
      </span>
      <span className="text-xs font-medium uppercase tracking-wide text-white/50">
        {label}
      </span>
    </div>
  );
}

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  quote: string;
  accent: string;
}

const AVATARS = [
  "/images/pGEpsxpGy4MIjqcG471RdJ7f6Y.png",
  "/images/yty5EEX6I11lbzFXsM3fcTIx0.png",
  "/images/6XVmyesSGqTBk7i6vi9Nai70Q.png",
];

const featured: Testimonial = {
  name: "Ananya Reddy",
  role: "Birthday Group · Hyderabad",
  avatar: AVATARS[0],
  rating: 5,
  quote:
    "Went to Game Show Challenge Rooms to celebrate my birthday and had the most amazing time of my life! Our host was hilarious and kept the energy sky-high the whole way through. Our two teams, the buzzers, the lights — you genuinely feel like you're on a real TV game show. Hands down the best group outing in the city.",
  accent: "#147EFF",
};

const testimonials: Testimonial[] = [
  {
    name: "Karthik Rao",
    role: "Corporate Team Building",
    avatar: AVATARS[1],
    rating: 5,
    quote:
      "Best team-building activity we've ever done. Three different game shows, real Challenge Points, and a champion crowned at the end. The whole office is still talking about it.",
    accent: "#FC19ED",
  },
  {
    name: "Lakshmi Menon",
    role: "Family Celebration",
    avatar: AVATARS[2],
    rating: 5,
    quote:
      "Came here for my 55th birthday with the whole family and it was so much fun! You really do feel like you're in the game show. We're already planning to defend our spot on the Champions Wall of Fame.",
    accent: "#22D3A5",
  },
  {
    name: "Rohan Verma",
    role: "Friends' Night Out",
    avatar: AVATARS[0],
    rating: 5,
    quote:
      "Booked it on a whim with my college crew and it was an absolute riot. Fast rounds, hilarious host, non-stop laughing. Easily the most fun ₹800 each I've ever spent.",
    accent: "#FFB020",
  },
  {
    name: "Priya Nair",
    role: "Bachelorette Party",
    avatar: AVATARS[1],
    rating: 5,
    quote:
      "We did the bachelorette show and the bride could not stop laughing. Themed questions, a private host just for us, and so many photos. 10/10 would recommend to any squad.",
    accent: "#A855F7",
  },
  {
    name: "Aditya Sharma",
    role: "Sports Club Outing",
    avatar: AVATARS[2],
    rating: 5,
    quote:
      "Brought our cricket club here for an off-season hangout. The team battle got way more competitive than any of us expected. Pure adrenaline and a great time.",
    accent: "#147EFF",
  },
  {
    name: "Sneha Iyer",
    role: "School Trip Organizer",
    avatar: AVATARS[0],
    rating: 5,
    quote:
      "Took 40 students for an end-of-year trip and the kids show was perfect — safe, hosted, and genuinely exciting. The Challenge Points kept every single one of them engaged.",
    accent: "#FC19ED",
  },
];

const stats = [
  { end: 4.9, decimals: 1, suffix: "", label: "Average rating" },
  { end: 10, decimals: 0, suffix: "K+", label: "Players hosted" },
  { end: 1200, decimals: 0, suffix: "+", label: "Champions crowned" },
  { end: 100, decimals: 0, suffix: "%", label: "Private shows" },
];

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={className} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? "fill-[#FFB020] text-[#FFB020]" : "text-white/20"}
        />
      ))}
    </div>
  );
}

function MiniCard({ t }: { t: Testimonial }) {
  return (
    <figure
      className="group relative flex w-[300px] shrink-0 flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-b from-[#1c1c1f] to-[#141416] p-6 transition-colors duration-300 hover:border-white/25 md:w-[360px]"
      style={{ boxShadow: "0 16px 40px rgba(0,0,0,0.35)" }}
    >
      {/* accent glow on hover */}
      <span
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(120% 80% at 50% 0%, ${t.accent}22 0%, transparent 60%)`,
        }}
        aria-hidden="true"
      />
      <div className="relative flex items-center justify-between">
        <Stars rating={t.rating} className="flex gap-0.5" />
        <Quote size={26} style={{ color: t.accent }} className="opacity-60" />
      </div>
      <blockquote className="relative text-[15px] leading-relaxed text-white/85">
        {t.quote}
      </blockquote>
      <figcaption className="relative mt-auto flex items-center gap-3 pt-2">
        <span
          className="block h-11 w-11 shrink-0 overflow-hidden rounded-full p-[2px]"
          style={{ background: `linear-gradient(135deg, ${t.accent}, transparent)` }}
        >
          <Image
            src={t.avatar}
            alt={t.name}
            width={44}
            height={44}
            className="h-full w-full rounded-full object-cover"
          />
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-semibold text-white">{t.name}</span>
          <span className="text-xs text-white/50">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

function MarqueeRow({
  items,
  direction,
}: {
  items: Testimonial[];
  direction: "left" | "right";
}) {
  // Duplicate the list so the loop is seamless (translate -50%).
  const loop = [...items, ...items];
  return (
    <div className="marquee-row relative overflow-hidden">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-black to-transparent md:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-black to-transparent md:w-28" />
      <div
        className={
          "flex w-max gap-5 " +
          (direction === "left" ? "animate-marquee-left" : "animate-marquee-right")
        }
      >
        {loop.map((t, i) => (
          <MiniCard key={`${t.name}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const activeAccent = featured.accent;
  const firstRow = testimonials.slice(0, 3);
  const secondRow = testimonials.slice(3, 6);

  return (
    <section className="relative overflow-hidden bg-black py-20 md:py-28">
      {/* Ambient stage glow */}
      <div
        className="animate-spotlight-pulse pointer-events-none absolute left-1/2 top-0 -z-0 h-[500px] w-[900px] -translate-x-1/2 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(20,126,255,0.18) 0%, rgba(252,25,237,0.12) 45%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        {/* Header */}
        <Reveal>
          <div className="mx-auto mb-4 flex items-center justify-center gap-4">
            <span className="block h-[2px] w-[40px] bg-white/40" />
            <span className="font-sans text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
              Wall of Praise
            </span>
            <span className="block h-[2px] w-[40px] bg-white/40" />
          </div>
        </Reveal>
        <h2
          className="mx-auto max-w-[820px] text-center text-3xl font-medium leading-tight tracking-tight text-white md:text-[56px] md:leading-[1.05]"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-2px" }}
        >
          Loved by thousands of{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #147EFF, #FC19ED)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            champions
          </span>
        </h2>

        {/* Stats bar */}
        <Reveal delay={120}>
          <div className="mx-auto mt-10 grid max-w-[900px] grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-4">
            {stats.map((s) => (
              <StatItem
                key={s.label}
                end={s.end}
                decimals={s.decimals}
                suffix={s.suffix}
                label={s.label}
              />
            ))}
          </div>
        </Reveal>

        {/* Featured spotlight testimonial */}
        <div className="relative mx-auto mt-14 max-w-[900px]">
          {/* glowing gradient ring */}
          <div
            className="absolute -inset-[1.5px] rounded-[2rem] opacity-80"
            style={{
              background: `linear-gradient(120deg, ${activeAccent}, #FC19ED, transparent)`,
            }}
            aria-hidden="true"
          />
          <figure className="relative flex flex-col gap-6 rounded-[2rem] bg-[#0e0e10] p-8 md:flex-row md:items-center md:gap-10 md:p-12">
            <div className="flex shrink-0 flex-col items-center gap-4 md:w-[200px]">
              <span
                className="block h-28 w-28 overflow-hidden rounded-full p-[3px] md:h-36 md:w-36"
                style={{
                  background: `linear-gradient(135deg, ${activeAccent}, #FC19ED)`,
                }}
              >
                <Image
                  src={featured.avatar}
                  alt={featured.name}
                  width={144}
                  height={144}
                  className="h-full w-full rounded-full object-cover"
                />
              </span>
              <div className="text-center">
                <p className="text-base font-semibold text-white">
                  {featured.name}
                </p>
                <p className="text-xs text-white/50">{featured.role}</p>
              </div>
              <Stars rating={featured.rating} className="flex gap-1" />
            </div>

            <div className="relative flex-1">
              <Quote
                size={48}
                className="mb-3 opacity-30"
                style={{ color: activeAccent }}
              />
              <blockquote
                className="text-lg font-medium leading-relaxed text-white md:text-2xl md:leading-[1.5]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {featured.quote}
              </blockquote>
            </div>
          </figure>
        </div>

        {/* Marquee wall */}
        <div className="mt-14 flex flex-col gap-5">
          <MarqueeRow items={firstRow} direction="left" />
          <MarqueeRow items={secondRow} direction="right" />
        </div>
      </div>
    </section>
  );
}
