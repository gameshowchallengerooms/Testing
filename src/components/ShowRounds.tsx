"use client";

import Image from "next/image";
import { ArrowUpRight, Check, Mic, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Cta } from "@/components/ui/cta";
import { useBooking } from "@/components/BookingDialog";

interface Show {
  label: string;
  tag: string;
  value: string;
  fromPrice: number;
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
  popular?: boolean;
}

const shows: Show[] = [
  {
    label: "The Classic",
    tag: "The original.",
    value: "The pure live game show experience.",
    fromPrice: 750,
    bestFor: "Everything that makes a game show a game show.",
    pitch:
      "A real host, the studio lights, the buzzers and your crew going head to head — the core live game show, start to finish, with all the rivalry and bragging rights baked in.",
    features: [
      "Live game show host",
      "Core buzzer & challenge rounds",
      "Team-based competition",
      "Scores, fun twists & winner moments",
      "Approx. 45 minutes of play",
    ],
    image: "/images/shows/the-classic.webp",
    imageAlt:
      "A live host leading two teams in a fast-paced buzzer challenge under blue studio lights",
    accentText: "text-gs-show-classic",
    accentBorder: "border-gs-show-classic-base/45",
    accentSurface: "bg-gs-show-classic-base/10",
    accentGlow: "shadow-[0_24px_100px_-48px_rgba(46,155,255,0.85)]",
    imageWash: "from-gs-wash-classic/95 via-gs-wash-classic-deep/32 to-transparent",
  },
  {
    label: "Prime Time",
    tag: "Most popular.",
    value: "Where the game show meets the party.",
    fromPrice: 899,
    bestFor: "The sweet spot most groups choose.",
    pitch:
      "The live game show with a whole layer of house-party energy on top — more group games, livelier moments and a bigger, more social format. The crowd favourite for a reason.",
    features: [
      "Live host & full game show",
      "House-party style group games",
      "More social, high-energy format",
      "Lively moments & big group fun",
      "Approx. 60 minutes of play",
    ],
    image: "/images/shows/prime-time.webp",
    imageAlt:
      "A lively group laughing and playing party-style game show challenges under purple lights",
    accentText: "text-gs-show-prime",
    accentBorder: "border-gs-show-prime-base/50",
    accentSurface: "bg-gs-show-prime-base/10",
    accentGlow: "shadow-[0_24px_100px_-48px_rgba(155,107,255,0.95)]",
    imageWash: "from-gs-wash-prime/95 via-gs-wash-prime-deep/32 to-transparent",
    popular: true,
  },
];

function HostBadge() {
  return (
    <div className="flex items-center gap-3">
      {/* Mic glyph rather than a photo: there is no real host portrait asset in
          the repo (the old `host-face.png` path 404'd on every page load), and a
          stand-in face would misrepresent a real person. */}
      <div
        className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/75 bg-[linear-gradient(140deg,var(--gs-avatar-from),var(--gs-avatar-to))] shadow-[0_0_0_4px_rgba(255,255,255,0.08)] md:h-14 md:w-14"
        aria-hidden="true"
      >
        <Mic className="h-5 w-5 text-gs-gold md:h-6 md:w-6" strokeWidth={2.2} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
          Hosted live
        </p>
        <p className="mt-0.5 text-sm font-semibold text-white md:text-base">
          Your host. Your spotlight.
        </p>
      </div>
    </div>
  );
}

function ShowPanel({ show, index }: { show: Show; index: number }) {
  const reduceMotion = useReducedMotion();
  const { openBooking } = useBooking();
  const reversed = index % 2 === 1;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 34 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-[28px] border bg-gs-surface-deep ${show.accentBorder} ${show.accentGlow}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.045),transparent_34%,transparent_70%,rgba(255,255,255,0.025))]" />

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
            {show.popular ? (
              <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md sm:text-xs">
                <Sparkles size={13} aria-hidden="true" />
                Crowd favourite
              </span>
            ) : null}
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

          <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/42">
                Weekday price from
              </p>
              <p className="mt-1 text-3xl font-black tracking-[-0.04em] text-white">
                ₹{show.fromPrice.toLocaleString("en-IN")}
                <span className="ml-1.5 text-sm font-medium tracking-normal text-white/45">
                  / player
                </span>
              </p>
            </div>

            {/* Tinted with this show's accent, but the shape/motion come from
                the shared CTA so it matches every other button on the site. */}
            <Cta
              onClick={() => openBooking(show.label)}
              variant="secondary"
              className={`min-h-12 uppercase tracking-[0.08em] hover:bg-white hover:text-black ${show.accentBorder} ${show.accentSurface}`}
            >
              Book Your Show
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
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_10%,rgba(46,155,255,0.12),transparent_31%),radial-gradient(circle_at_88%_45%,rgba(155,107,255,0.11),transparent_30%),radial-gradient(circle_at_35%_92%,rgba(255,178,62,0.08),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />

      <div className="mx-auto max-w-[1280px]">
        <div className="grid items-end gap-8 border-b border-white/10 pb-10 lg:grid-cols-[1fr_auto] lg:pb-12">
          <div>
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-white/45">
              <span className="h-px w-9 bg-gradient-to-r from-gs-show-classic-base via-gs-show-prime-base to-gs-gold-deep" />
              Choose your experience
            </p>
            <h2 className="mt-5 max-w-4xl text-5xl font-black tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
              Shows Available
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/62 sm:text-lg sm:leading-8">
              Three different ways to take the stage. Pick your energy, bring your people, and let your live host turn it into a show worth remembering.
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
