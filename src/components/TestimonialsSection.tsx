"use client";

import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
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
    <div className="flex flex-col items-center gap-1 bg-gs-surface-deep px-4 py-6">
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
  /** A real group photo from the arena (see /images/players). */
  photo: string;
  photoAlt: string;
  /** `object-position` tweak so faces survive the crop. */
  photoPosition?: string;
  rating: number;
  quote: string;
  accent: string;
}

// NOTE: sample testimonials written as placeholders. Swap the names and quotes
// for real customer reviews (Google / Instagram) before relying on them.
const featured: Testimonial = {
  name: "Ananya Reddy",
  role: "Birthday Group · Hyderabad",
  photo: "/images/players/laughing-desk.webp",
  photoAlt: "Two players laughing at the team desk mid-round",
  photoPosition: "object-[40%_42%]",
  rating: 5,
  quote:
    "Booked this for my birthday instead of the usual dinner and it was the best call. Our host had the whole room screaming within five minutes. Two teams, buzzers, puzzles, a physical round that had us crying with laughter — nobody sat out for a second. Easily the most fun thing we've done in Hyderabad.",
  accent: "var(--gs-gold)",
};

const moreTestimonials: Omit<Testimonial, "accent" | "photo" | "photoAlt" | "photoPosition">[] = [
  {
    name: "Rahul Varma",
    role: "Office Team Outing · HITEC City",
    rating: 5,
    quote:
      "We've done bowling, escape rooms, the lot. This is the first team outing where the quiet folks were the ones winning rounds. The host kept 14 of us fully engaged for an hour. Monday was all trash talk.",
  },
  {
    name: "Sneha & Karthik",
    role: "Friends Group · Kondapur",
    rating: 5,
    quote:
      "Came in expecting a quiz night, got a full-on competition. Speed rounds, puzzles, a buzzer battle at the end that came down to one point. We've already booked again.",
  },
  {
    name: "Priya Nair",
    role: "Bachelorette Party · Jubilee Hills",
    rating: 5,
    quote:
      "Perfect bachelorette plan. The themed rounds about the bride had everyone in bits, and the host made her feel like the star of the whole thing. Way more fun than another brunch.",
  },
  {
    name: "Arjun Mehta",
    role: "College Friends · Gachibowli",
    rating: 5,
    quote:
      "Eight of us, two teams, zero mercy. The physical challenges are what make it — it's not just sitting and answering questions. Great energy, great host, good value for a group.",
  },
  {
    name: "The Rao Family",
    role: "Family Outing · Banjara Hills",
    rating: 5,
    quote:
      "Three generations played together and my 11-year-old beat his uncles in the speed round. The host adjusted the questions so everyone had a shot. We'll be back for Diwali.",
  },
];

function Initials({ name, accent }: { name: string; accent: string }) {
  const initials = name
    .replace(/^The /, "")
    .split(/\s|&/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-sm font-bold text-white"
      style={{ color: accent }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

const CARD_ACCENTS = ["var(--gs-gold)"];

const stats = [
  { end: 4.9, decimals: 1, suffix: "", label: "Average rating" },
  { end: 10, decimals: 0, suffix: "K+", label: "Players hosted" },
  { end: 1200, decimals: 0, suffix: "+", label: "Champions crowned" },
  { end: 2, decimals: 0, suffix: "", label: "Formats to pick from" },
];

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={className} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? "fill-gs-star text-gs-star" : "text-white/20"}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28">
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
          Loved by groups across{" "}
          <span className="text-gs-gold">Hyderabad</span>
        </h2>

        {/* Stats bar */}
        <Reveal delay={120}>
          <div className="mx-auto mt-10 grid max-w-[900px] grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-4">
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
          <figure className="relative flex flex-col gap-6 rounded-2xl border border-white/10 bg-gs-surface-card p-8 md:flex-row md:items-center md:gap-10 md:p-12">
            <div className="flex shrink-0 flex-col items-center gap-4 md:w-[200px]">
              <span className="block h-28 w-28 rounded-full border-2 border-gs-gold/60 p-[3px] md:h-36 md:w-36">
                <span className="relative block h-full w-full overflow-hidden rounded-full">
                  <Image
                    src={featured.photo}
                    alt={featured.photoAlt}
                    fill
                    sizes="144px"
                    className={cn("object-cover", featured.photoPosition)}
                  />
                </span>
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
                className="mb-3 text-gs-gold opacity-60"
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

        {/* More voices */}
        <div className="mx-auto mt-8 grid max-w-[1200px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {moreTestimonials.map((t, i) => {
            const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
            return (
              <Reveal key={t.name} delay={i * 80} className="h-full">
                <figure className="flex h-full flex-col gap-4 rounded-xl border border-white/10 bg-gs-surface-card p-6 transition-colors duration-300 hover:border-white/20">
                  <Stars rating={t.rating} className="flex gap-1" />
                  <blockquote className="flex-1 text-[15px] leading-relaxed text-white/80">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center gap-3 border-t border-white/10 pt-4">
                    <Initials name={t.name} accent={accent} />
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-white/50">{t.role}</p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
