"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  Bike,
  Building2,
  GraduationCap,
  Laugh,
  PartyPopper,
  Receipt,
  Rocket,
  ShieldCheck,
  Trophy,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { Cta } from "@/components/ui/cta";
import { BookingCta } from "@/components/BookingDialog";
import { SCHOOLS_VISITED, TEAMS_FROM } from "@/lib/team-building";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const FACTS = [
  "Gachibowli, Hyderabad",
  "4–15 players a show",
  "45–60 minutes",
  "Bigger team? We'll plan it",
];

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-gs-surface-black">
      <Image
        src="/images/players/champions-trophy-cheque.webp"
        alt="A winning team lifting the champions trophy and giant cheque at Game Show Challenge Rooms"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_35%] opacity-80 md:opacity-100"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,16,40,0.9)_0%,rgba(20,22,60,0.62)_45%,rgba(20,22,60,0.08)_100%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex min-h-[84svh] max-w-[1200px] flex-col justify-center px-5 pb-20 pt-32 md:px-10 md:pt-40">
        <Reveal>
          <p className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-white/80">
            <span className="block h-[2px] w-10 bg-white/50" />
            Team building
          </p>
        </Reveal>

        <Reveal delay={70}>
          <h1 className="mt-5 max-w-[960px] text-[46px] font-black leading-[0.94] tracking-[-0.05em] text-white sm:text-6xl md:text-[88px]">
            Hyderabad&apos;s <span className="bg-[linear-gradient(90deg,var(--gs-blue-bright),var(--gs-violet-bright))] bg-clip-text text-transparent">biggest</span>{" "}
            team‑building activity.
          </h1>
        </Reveal>

        <Reveal delay={130}>
          <p className="mt-6 max-w-[600px] text-lg leading-snug text-white/75 md:text-2xl">
            A live host. Two teams. Buzzers, lights, and your whole office
            laughing till the final buzzer.
          </p>
        </Reveal>

        <Reveal delay={190}>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <BookingCta size="lg" badge>
              Book your team&apos;s show
            </BookingCta>
            <Cta variant="secondary" size="lg" href="#included">
              See what&apos;s included
            </Cta>
          </div>
        </Reveal>

        <Reveal delay={250}>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
            <ShieldCheck size={16} className="text-gs-mint" />
            Didn&apos;t love it? 100% refund.
          </p>
        </Reveal>

        <Reveal delay={310}>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
            {FACTS.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Teams from                                                          */
/* ------------------------------------------------------------------ */

function TeamsFrom() {
  return (
    <section
      aria-labelledby="teams-from-heading"
      className="bg-(--gs-pink-soft) px-5 py-12 text-gs-surface-black md:px-10 md:py-16"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <h2
            id="teams-from-heading"
            className="text-center text-xs font-bold uppercase tracking-[0.28em] text-gs-surface-black/60"
          >
            Teams from these companies have played here
          </h2>
        </Reveal>
        <ul className="mt-9 grid grid-cols-2 items-center justify-items-center gap-x-8 gap-y-10 md:grid-cols-4 md:gap-x-14">
          {TEAMS_FROM.map((company, i) => (
            <Reveal
              key={company.name}
              as="li"
              delay={i * 80}
              className="flex items-center justify-center"
            >
              <Image
                src={company.src}
                alt={company.name}
                width={company.width}
                height={company.height}
                unoptimized
                className={cn(
                  "w-auto opacity-90 transition-opacity hover:opacity-100",
                  company.sizeClass
                )}
              />
            </Reveal>
          ))}
        </ul>
        <Reveal delay={200}>
          <p className="mt-9 text-center text-sm text-gs-surface-black/55">
            Plus startups and offices across Gachibowli, HITEC City and the
            Financial District.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Promises + what's included                                          */
/* ------------------------------------------------------------------ */

interface Promise {
  icon: LucideIcon;
  title: string;
  text: string;
}

const PROMISES: Promise[] = [
  {
    icon: Laugh,
    title: "Laugh till the final buzzer.",
    text: "Sixty minutes. Two teams. One host who won't let anyone sit quiet.",
  },
  {
    icon: UtensilsCrossed,
    title: "Food? Sorted.",
    text: "Snacks to a full meal, arranged for your headcount. Just tell us.",
  },
  {
    icon: Receipt,
    title: "GST invoice, every booking.",
    text: "A proper bill copy for your team budget. Claim it, expense it, done.",
  },
  {
    icon: ShieldCheck,
    title: "Didn't love it? Full refund.",
    text: "That's how sure we are. No fine print.",
  },
];

const INCLUDED = [
  "Live host",
  "Buzzers & studio lights",
  "Your own team names & tags",
  "3 rounds: trivia · puzzle · speed · physical",
  "Champions trophy & giant-cheque photo",
  "Celebration Room for cake",
  "Food arranged for your group",
  "GST invoice",
];

function Promises() {
  return (
    <section
      id="included"
      aria-labelledby="promises-heading"
      className="scroll-mt-24 bg-[linear-gradient(135deg,var(--gs-blue)_0%,var(--gs-violet)_60%,var(--gs-magenta)_130%)] px-5 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <h2
            id="promises-heading"
            className="max-w-[820px] text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl"
          >
            Book it. Show up. We handle the rest.
          </h2>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map((promise, i) => {
            const Icon = promise.icon;
            return (
              <Reveal
                key={promise.title}
                as="li"
                delay={i * 90}
                className="h-full"
              >
                <div className="flex h-full flex-col gap-5 rounded-3xl border border-white/25 bg-white/12 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/50 hover:bg-white/20 md:p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gs-violet">
                    <Icon size={22} strokeWidth={2.4} />
                  </span>
                  <h3 className="text-2xl font-black leading-[1.02] tracking-[-0.03em] text-white md:text-[28px]">
                    {promise.title}
                  </h3>
                  <p className="text-base leading-relaxed text-white/80">
                    {promise.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ul>

        <Reveal delay={120}>
          <p className="mt-14 text-xs font-bold uppercase tracking-[0.28em] text-white/70">
            Everything&apos;s in
          </p>
        </Reveal>
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {INCLUDED.map((item, i) => (
            <Reveal key={item} as="li" delay={(i % 4) * 60}>
              <span className="inline-block rounded-full border border-white/30 bg-white/12 px-4 py-2 text-sm font-semibold text-white">
                {item}
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Audiences                                                           */
/* ------------------------------------------------------------------ */

interface Audience {
  icon: LucideIcon;
  title: string;
  line: string;
  shortLabel: string;
  score: string;
  palette: string;
  glow: string;
  schools?: boolean;
}

const AUDIENCES: Audience[] = [
  {
    icon: Building2,
    title: "Corporate teams",
    line: "The offsite they'll actually remember.",
    shortLabel: "OFFSITE MODE",
    score: "08 : 07",
    palette: "from-gs-blue/35 via-gs-violet/20 to-transparent",
    glow: "bg-gs-blue",
  },
  {
    icon: Rocket,
    title: "Startups & offsites",
    line: "Whole company, one room, finally laughing at the same thing.",
    shortLabel: "ALL HANDS IN",
    score: "12 : 11",
    palette: "from-gs-violet/40 via-gs-magenta/20 to-transparent",
    glow: "bg-gs-violet-bright",
  },
  {
    icon: Bike,
    title: "Bike riders clubs",
    line: "Ride in. Buzz out. Helmets off, buzzers on.",
    shortLabel: "RIDE. PLAY. REPEAT.",
    score: "99 KM",
    palette: "from-gs-orange/35 via-gs-gold/15 to-transparent",
    glow: "bg-gs-orange",
  },
  {
    icon: GraduationCap,
    title: "Schools & colleges",
    line: "Class trips and fest gangs. Teachers play too.",
    shortLabel: "CLASS DISMISSED",
    score: "A+ GAME",
    palette: "from-gs-mint/30 via-gs-blue/15 to-transparent",
    glow: "bg-gs-mint",
    schools: true,
  },
  {
    icon: Trophy,
    title: "Sports & club groups",
    line: "Off the field, still competing.",
    shortLabel: "GAME FACE ON",
    score: "03 : 02",
    palette: "from-gs-gold/30 via-gs-orange/15 to-transparent",
    glow: "bg-gs-gold",
  },
  {
    icon: PartyPopper,
    title: "Festive & farewell parties",
    line: "Diwali, farewells, promotions. Make it a show.",
    shortLabel: "BIG NIGHT ENERGY",
    score: "PARTY!",
    palette: "from-gs-magenta/35 via-gs-pink/20 to-transparent",
    glow: "bg-gs-magenta",
  },
];

function AudienceVisual({ audience, index }: { audience: Audience; index: number }) {
  const Icon = audience.icon;

  return (
    <div className={cn("relative h-48 overflow-hidden bg-gradient-to-br", audience.palette)} aria-hidden="true">
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className={cn("absolute -right-10 -top-14 h-44 w-44 rounded-full opacity-20 blur-3xl transition-transform duration-700 group-hover:scale-150", audience.glow)} />

      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 backdrop-blur-sm">
        <span className={cn("h-1.5 w-1.5 rounded-full shadow-[0_0_10px_currentColor]", audience.glow)} />
        <span className="text-[10px] font-black tracking-[0.18em] text-white/70">{audience.shortLabel}</span>
      </div>

      <div className="absolute right-5 top-5 font-mono text-xs font-bold tracking-widest text-white/50">
        0{index + 1}
      </div>

      <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-[26px] border border-white/20 bg-white/10 text-white shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
          <div className={cn("absolute inset-2 rounded-[20px] opacity-20 blur-md", audience.glow)} />
          <Icon className="relative" size={34} strokeWidth={2.1} />
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 font-mono text-sm font-black tracking-[0.16em] text-white backdrop-blur-md">
            {audience.score}
          </div>
          <div className="flex -space-x-2">
            {[0, 1, 2, 3].map((player) => (
              <span
                key={player}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 border-gs-surface-deep text-[10px] font-black text-white shadow-lg",
                  player % 2 === 0 ? audience.glow : "bg-white/20 backdrop-blur-sm"
                )}
              >
                {String.fromCharCode(65 + ((index + player) % 8))}
              </span>
            ))}
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gs-surface-deep bg-white text-[10px] font-black text-black">
              +
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Audiences() {
  return (
    <section
      aria-labelledby="audiences-heading"
      className="bg-(--gs-pink-soft) px-5 pb-20 pt-6 md:px-10 md:pb-28 md:pt-8"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <h2
            id="audiences-heading"
            className="max-w-[820px] text-4xl font-black leading-[0.98] tracking-[-0.05em] text-gs-surface-black sm:text-5xl lg:text-6xl"
          >
            Built for every kind of gang.
          </h2>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCES.map((audience, i) => {
            const showSchools = audience.schools && SCHOOLS_VISITED.length > 0;
            return (
              <Reveal key={audience.title} as="li" delay={(i % 3) * 90}>
                <article className="group h-full overflow-hidden rounded-3xl bg-gs-surface-deep shadow-[0_18px_40px_-24px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.55)]">
                  <AudienceVisual audience={audience} index={i} />
                  <div className="p-5 md:p-6">
                    <h3 className="text-2xl font-black leading-none tracking-[-0.03em] text-white">
                      {audience.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/75">{audience.line}</p>
                    {showSchools ? (
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {SCHOOLS_VISITED.map((school) => (
                          <li
                            key={school}
                            className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white"
                          >
                            {school}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Photo strip                                                         */
/* ------------------------------------------------------------------ */

interface StripPhoto {
  src: string;
  alt: string;
  portrait: boolean;
}

const STRIP_TOP: StripPhoto[] = [
  { src: "/images/players/champions-logo-wall-cheque.webp", alt: "Champions with the trophy and cheque at the logo wall", portrait: true },
  { src: "/images/players/four-friends.webp", alt: "Four friends celebrating a win", portrait: false },
  { src: "/images/players/desk-trio-buzzer.webp", alt: "Three players at the buzzer desk", portrait: true },
  { src: "/images/players/red-wall-trophy-cheque.webp", alt: "Winners with the trophy and cheque by the red wall", portrait: false },
  { src: "/images/players/laughing-desk.webp", alt: "Players laughing at the buzzer desk", portrait: true },
  { src: "/images/players/group-logo-wall.webp", alt: "A group in front of the logo wall", portrait: false },
  { src: "/images/players/green-light-challenge.webp", alt: "Two players mid-challenge under green lights", portrait: true },
  { src: "/images/players/mic-moment.webp", alt: "A player on the mic", portrait: true },
  { src: "/images/players/champions-trophy-cheque.webp", alt: "Champions with the trophy and cheque", portrait: false },
  { src: "/images/players/three-players-blue.webp", alt: "Three players celebrating under blue lights", portrait: true },
];

const STRIP_BOTTOM: StripPhoto[] = [
  { src: "/images/players/arena-celebration-wide.webp", alt: "A team celebrating in the arena", portrait: false },
  { src: "/images/players/desk-pink-pair.webp", alt: "Two players thinking hard at the desk", portrait: true },
  { src: "/images/players/trophy-cheque-arena.webp", alt: "A team lifting the trophy and cheque", portrait: true },
  { src: "/images/players/group-wide.webp", alt: "A wide team photo", portrait: false },
  { src: "/images/players/red-wall-group-flowers.webp", alt: "A group in front of the red Game Show wall", portrait: true },
  { src: "/images/players/host-and-player.webp", alt: "The host with a player", portrait: true },
  { src: "/images/players/group-eight.webp", alt: "An office team by the red wall", portrait: false },
  { src: "/images/players/arena-group-cheque.webp", alt: "A big group with the cheque in the arena", portrait: true },
  { src: "/images/players/desk-green-light.webp", alt: "Players at the desk under green lights", portrait: true },
  { src: "/images/players/tense-desk.webp", alt: "A tense moment at the desk", portrait: true },
  { src: "/images/players/pile-up.webp", alt: "A group collapsing into a laughing pile-up", portrait: true },
  { src: "/images/players/lobby.webp", alt: "Players in the lobby", portrait: true },
];

function MarqueeRow({ photos, reverse = false }: { photos: StripPhoto[]; reverse?: boolean }) {
  const doubled = [...photos, ...photos];
  return (
    <div className="marquee-row overflow-hidden">
      <ul
        className={cn(
          "flex w-max gap-3",
          reverse ? "animate-marquee-right" : "animate-marquee-left"
        )}
      >
        {doubled.map((photo, i) => (
          <li
            key={`${photo.src}-${i}`}
            className={cn(
              "relative h-[200px] shrink-0 overflow-hidden rounded-2xl bg-gs-surface-deep md:h-[240px]",
              photo.portrait ? "w-[136px] md:w-[166px]" : "w-[300px] md:w-[370px]"
            )}
          >
            <Image
              src={photo.src}
              alt={i < photos.length ? photo.alt : ""}
              aria-hidden={i >= photos.length}
              fill
              sizes="370px"
              className="object-cover"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function PhotoStrip() {
  return (
    <section aria-label="Photos from the arena" className="bg-(--gs-pink-soft) py-8">
      <div className="flex flex-col gap-3">
        <MarqueeRow photos={STRIP_TOP} />
        <MarqueeRow photos={STRIP_BOTTOM} reverse />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Final CTA                                                           */
/* ------------------------------------------------------------------ */

function FinalCta() {
  return (
    <section
      aria-labelledby="promise-heading"
      className="bg-(--gs-pink-soft) px-5 pb-24 pt-4 md:px-10 md:pb-32"
    >
      <Reveal>
        <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,var(--gs-violet)_0%,var(--gs-blue)_100%)] px-6 py-14 text-center shadow-[0_30px_60px_-30px_rgba(79,134,216,0.6)] md:px-16 md:py-20">
          <p className="relative text-xs font-bold uppercase tracking-[0.28em] text-white/80">
            Our promise
          </p>
          <h2
            id="promise-heading"
            className="relative mt-4 text-4xl font-black leading-[0.96] tracking-[-0.05em] text-white sm:text-5xl md:text-7xl"
          >
            Not thrilled? We refund. Every rupee.
          </h2>
          <p className="relative mx-auto mt-5 max-w-[640px] text-lg text-white/85 md:text-xl">
            Hyderabad&apos;s biggest team-building activity, backed by a promise
            nobody else makes.
          </p>
          <div className="relative mt-9 flex flex-wrap justify-center gap-4">
            <BookingCta variant="primary" size="lg">
              Book your team&apos;s show
              <ArrowUpRight size={18} />
            </BookingCta>
            <BookingCta variant="light" size="lg">
              Get a GST quote
            </BookingCta>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function TeamBuildingHype() {
  return (
    <>
      <Hero />
      <TeamsFrom />
      <Promises />
      <PhotoStrip />
      <Audiences />
      <FinalCta />
    </>
  );
}
