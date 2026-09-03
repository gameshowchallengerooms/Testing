"use client";

import Image from "next/image";
import { ArrowUpRight, Check, Mic } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Cta } from "@/components/ui/cta";

interface Show {
  label: string;
  tag: string;
  value: string;
  bestFor: string;
  pitch: string;
  features: string[];
  image: string;
  imageAlt: string;
  accentText: string;
  accentBorder: string;
  accentSurface: string;
  accentGlow: string;
  imageWash: string;
}

const shows: Show[] = [
  {
    label: "The Classic",
    tag: "The original.",
    value: "The essential challenge experience.",
    bestFor: "Best for first-timers, families and friendly rivalry.",
    pitch:
      "Your group splits into two teams and plays a focused 45-minute session: buzzer trivia, puzzle rounds and speed challenges, with live scoring and a host driving every moment.",
    features: [
      "Live host from start to finish",
      "Three hosted challenge rounds",
      "Trivia, puzzle & speed challenges",
      "Live scores & winner moments",
      "Approx. 45 minutes of play",
    ],
    image: "/images/shows/the-classic.webp",
    imageAlt:
      "A live host leading two teams in a fast-paced buzzer challenge under blue studio lights",
    accentText: "text-gs-show-classic",
    accentBorder: "border-white/10",
    accentSurface: "bg-gs-show-classic-base/10",
    accentGlow: "shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]",
    imageWash: "from-gs-wash-classic/95 via-gs-wash-classic-deep/32 to-transparent",
  },
  {
    label: "Prime Time",
    tag: "Most popular.",
    value: "Where the challenge meets the party.",
    bestFor: "Best for birthdays, celebrations and high-energy groups.",
    pitch:
      "Everything in The Classic, expanded into a 60-minute session with extra physical and team challenges, bigger crowd moments and more time in the arena.",
    features: [
      "Live host & the full challenge line-up",
      "Extra physical & team challenges",
      "Party-style group games",
      "Bigger moments, more rivalry",
      "Approx. 60 minutes of play",
    ],
    image: "/images/shows/prime-time.webp",
    imageAlt:
      "A lively group laughing and playing party-style game show challenges under purple lights",
    accentText: "text-gs-show-prime",
    accentBorder: "border-white/10",
    accentSurface: "bg-gs-show-prime-base/10",
    accentGlow: "shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]",
    imageWash: "from-gs-wash-prime/95 via-gs-wash-prime-deep/32 to-transparent",
  },
];

function HostBadge() {
  return (
    <div className="flex items-center gap-3">
      {/* Mic glyph rather than a photo: there is no real host portrait asset in
          the repo (the old `host-face.png` path 404'd on every page load), and a
          stand-in face would misrepresent a real person. */}
      <div
        className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/75 bg-[linear-gradient(140deg,var(--gs-avatar-from),var(--gs-avatar-to))] md:h-14 md:w-14"
        aria-hidden="true"
      >
        <Mic className="h-5 w-5 text-gs-gold md:h-6 md:w-6" strokeWidth={2.2} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
          Hosted live
        </p>
        <p className="mt-0.5 text-sm font-semibold text-white md:text-base">
          Your host runs the show.
        </p>
      </div>
    </div>
  );
}

function ShowPanel({ show, index }: { show: Show; index: number }) {
  const reduceMotion = useReducedMotion();
  const reversed = index % 2 === 1;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 34 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl border bg-gs-surface-deep ${show.accentBorder} ${show.accentGlow}`}
    >
      <div className="relative grid lg:min-h-[650px] lg:grid-cols-2">
        <div
          className={`relative min-h-[360px] overflow-hidden sm:min-h-[470px] lg:min-h-full ${
            reversed ? "lg:order-2" : ""
          }`}
        >
          <Image
            src={show.image}
            alt={show.imageAlt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${show.imageWash} lg:bg-gradient-to-r`} />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gs-surface-deep to-transparent lg:hidden" />

          <div className="absolute left-5 top-5 flex items-center gap-2 sm:left-7 sm:top-7">
            <span
              className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md sm:text-xs ${show.accentBorder} ${show.accentSurface} ${show.accentText}`}
            >
              {show.tag}
            </span>
          </div>

          <div className="absolute bottom-7 left-5 right-5 sm:bottom-9 sm:left-8 sm:right-8 lg:hidden">
            <p className={`text-xs font-bold uppercase tracking-[0.24em] ${show.accentText}`}>
              Show {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl">
              {show.label}
            </h3>
          </div>
        </div>

        <div className={`relative flex flex-col p-6 sm:p-9 lg:p-12 xl:p-14 ${reversed ? "lg:order-1" : ""}`}>
          <div className="hidden lg:block">
            <p className={`text-xs font-bold uppercase tracking-[0.28em] ${show.accentText}`}>
              Show {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-4 text-5xl font-black tracking-[-0.05em] text-white xl:text-6xl">
              {show.label}
            </h3>
          </div>

          <p className="mt-2 text-2xl font-bold leading-tight tracking-[-0.025em] text-white sm:text-3xl lg:mt-8">
            {show.value}
          </p>
          <p className={`mt-5 text-xs font-bold uppercase leading-relaxed tracking-[0.2em] ${show.accentText}`}>
            {show.bestFor}
          </p>
          <p className="mt-5 text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
            {show.pitch}
          </p>

          <div className="my-7 h-px bg-white/10" />

          <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {show.features.map((feature) => (
              <li key={feature} className="flex gap-3 text-sm leading-6 text-white/78 sm:text-[15px]">
                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${show.accentSurface} ${show.accentText}`}>
                  <Check size={13} strokeWidth={3} aria-hidden="true" />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-end sm:justify-end">
            {/* Tinted with this show's accent, but the shape/motion come from
                the shared CTA so it matches every other button on the site. */}
            <Cta
              href="#tickets"
              variant="primary"
              className="min-h-12"
            >
              Book Your Slot
              <ArrowUpRight size={18} strokeWidth={2.5} aria-hidden="true" />
            </Cta>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function ShowRounds() {
  return (
    <section
      id="show-rounds"
      data-show-rounds
      className="relative isolate overflow-hidden bg-gs-surface-black px-4 py-24 text-white sm:px-6 md:py-32 lg:px-10"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="grid items-end gap-8 border-b border-white/10 pb-10 lg:grid-cols-[1fr_auto] lg:pb-12">
          <div>
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-white/45">
              <span className="h-px w-9 bg-gs-gold" />
              Pick your format
            </p>
            <h2 className="mt-5 max-w-4xl text-5xl font-black tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
              Two ways to play
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/62 sm:text-lg sm:leading-8">
              Both formats are hosted live and built for your whole gang.
              Choose The Classic for the essential 45-minute experience, or Prime
              Time for a longer, more social 60-minute session.
            </p>
          </div>
          <HostBadge />
        </div>

        <div className="mt-10 space-y-8 md:mt-14 md:space-y-12">
          {shows.map((show, index) => (
            <ShowPanel key={show.label} show={show} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
