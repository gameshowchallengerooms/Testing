"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, Check } from "lucide-react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

/**
 * "One unforgettable night, your way" — a pinned, scroll-scrubbed story.
 *
 * The three shows are SEPARATE choices (a group books ONE). So instead of three
 * cramped columns, each show gets its own full-screen BEAT that draws + writes
 * itself in as you scroll — sold top-down from the flagship:
 *
 *   intro     → headline "One unforgettable night, your way" writes on
 *   PRIME TIME    → the hero: 5 rounds · 75 min, full pitch + features
 *   PRIME CLASSIC → most booked: 4 rounds · 1 hr
 *   THE CLASSIC   → quick & punchy: 3 rounds · 45 min
 *   payoff    → closing line + CTA
 *
 * Collision-proof by construction (per motion-research best practice): art and
 * copy never share space. A single ambient ink flourish lives BEHIND the text in
 * its own layer; the glowing pen-nib rides the active beat's underline only. No
 * decorative stroke ever crosses a label.
 */

const TRACK_VIEWPORTS = 7; // screens of scroll the whole story spans

/* ── Content ─────────────────────────────────────────────────────────────── */

interface Show {
  label: string;
  tag: string;
  /** rounds + duration framed as value, not spec */
  value: string;
  bestFor: string;
  pitch: string;
  features: string[];
  /** bright accent — for fills, icons, the dark-stage beats */
  accent: string;
  /** darker, WCAG-safe variant of the accent for TEXT/CTA on the white recap */
  ink: string;
  gradient: string;
  popular?: boolean;
}

// Sold UP — Prime Time first as the aspiration, then down. Copy from the
// conversion pass: each show is a deliberate, desirable choice; none is "cheap".
const shows: Show[] = [
  {
    label: "Prime Time",
    tag: "Go all in.",
    value: "5 huge rounds · 75 unforgettable minutes",
    bestFor: "For crews who want the full, no-limits night.",
    pitch:
      "The complete journey — lights up, buzzers blazing, every round bigger than the last, building to a finale you'll talk about for weeks. This is the one you came all this way for.",
    features: ["Buzzer face-offs", "Wheel-of-fortune spins", "Head-to-head grand finale"],
    accent: "#FC19ED",
    ink: "#B5179E",
    gradient: "linear-gradient(135deg, #7C5CFC, #FC19ED)",
  },
  {
    label: "Prime Classic",
    tag: "Most booked.",
    value: "4 packed rounds · a perfect hour",
    bestFor: "The sweet spot most groups choose.",
    pitch:
      "The crowd favourite for a reason — all the buzzers, laughs and rivalry, dialled to just the right length. Maximum fun, zero filler.",
    features: ["Buzzer face-offs", "Team rivalry rounds", "Champion crowning"],
    accent: "#FFD23F",
    ink: "#9A6A00",
    gradient: "linear-gradient(135deg, #FFD23F, #FFB020)",
    popular: true,
  },
  {
    label: "The Classic",
    tag: "Quick & electric.",
    value: "3 fast rounds · 45 electric minutes",
    bestFor: "Perfect first taste — big thrill, less time.",
    pitch:
      "Short on time, big on energy — a sharp, fast-paced taste of the studio with all the buzzers and bragging rights baked in. Walk in curious, walk out a champion.",
    features: ["Lightning buzzer rounds", "Live studio thrills", "Champion crowning"],
    accent: "#22D3A5",
    ink: "#0E7C5A",
    gradient: "linear-gradient(135deg, #22D3A5, #14B8A6)",
  },
];

/* Each beat owns a slice of the 0→1 scroll timeline:
   intro → 3 shows → RECAP (all three together) → payoff/CTA into pricing. */
const INTRO_SPAN: [number, number] = [0.0, 0.1];
const SHOW_SPANS: [number, number][] = [
  [0.12, 0.34],
  [0.36, 0.54],
  [0.56, 0.72],
];
// Mobile has no in-track recap (it's a normal section below), so the show beats
// fill the WHOLE track and the last one holds to the very end — that way you exit
// the pinned stage straight into the white recap, with no dead black scroll.
const SHOW_SPANS_MOBILE: [number, number][] = [
  [0.1, 0.34],
  [0.38, 0.62],
  [0.66, 1.0],
];
// The recap (all three shows together) is the FINAL beat — it draws in and then
// holds to the end of the track, after which the page scrolls on into pricing.
const RECAP_SPAN: [number, number] = [0.74, 1];

function slice([a, b]: [number, number], from: number, to: number): [number, number] {
  return [a + (b - a) * from, a + (b - a) * to];
}

/* ── Self-drawing stroke (pathLength scrubbed by scroll) ──────────────────── */

function Stroke({
  d,
  p,
  span,
  className = "ink",
  width = 4,
  stroke,
}: {
  d: string;
  p: MotionValue<number>;
  span: [number, number];
  className?: string;
  width?: number;
  stroke?: string;
}) {
  const pathLength = useTransform(p, span, [0, 1], { clamp: true });
  return (
    <motion.path d={d} className={className} strokeWidth={width} stroke={stroke} style={{ pathLength }} />
  );
}

/* ── The scene ───────────────────────────────────────────────────────────── */

export function ShowRounds() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Measure viewport once; react only to width changes (ignore iOS URL-bar
  // height jitter — see research brief §2).
  const [viewportH, setViewportH] = useState<number | null>(null);
  // Below Tailwind's `md` the recap stacks the three shows into a tall column;
  // the white panel needs a top-anchored, internally-scrollable layout there so
  // all three stay reachable (see RecapBeat).
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const measure = () => {
      setViewportH(window.innerHeight);
      setIsMobile(window.innerWidth < 768);
    };
    measure();
    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        measure();
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Mobile packs intro + the 3 show beats across the WHOLE track (the recap is a
  // separate section below), so a slightly shorter track keeps the scroll tight
  // and avoids a long pinned stretch.
  const trackViewports = isMobile ? TRACK_VIEWPORTS * 0.7 : TRACK_VIEWPORTS;
  const trackHeight =
    reduce || viewportH === null
      ? reduce
        ? "auto"
        : `${TRACK_VIEWPORTS * 100}vh`
      : `${Math.round(viewportH * trackViewports)}px`;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // Linear-tracking scrub (light spring only to glide a flick), per research §3.
  const p = useSpring(scrollYProgress, { stiffness: 300, damping: 44, restDelta: 0.0004 });

  const hintOpacity = useTransform(p, [0, 0.04], [1, 0]);

  // As the RECAP (the three shows together) arrives, the scene transitions to an
  // Apple "system light" soft gradient — dark neon stage → calm light panel — so
  // the final comparison reads like a clean, premium Apple page before pricing.
  // (The intro + per-show beats stay dark; only the recap turns light.)
  const lightBg = useTransform(
    p,
    [RECAP_SPAN[0], RECAP_SPAN[0] + 0.08],
    [
      "linear-gradient(180deg, #0c0d10 0%, #0c0d10 100%)",
      // Apple's light comparison sections sit on #f5f5f7 with white cards above.
      "linear-gradient(180deg, #fbfbfd 0%, #f5f5f7 100%)",
    ]
  );
  // The ambient neon ink fades out as the panel goes light (it belongs to the
  // dark stage); a subtle scroll hint colour also flips.
  const inkOpacity = useTransform(p, [RECAP_SPAN[0], RECAP_SPAN[0] + 0.08], [0.18, 0]);

  if (reduce) return <StaticFallback />;

  return (
    <>
    <section ref={sectionRef} className="relative w-full bg-black" style={{ height: trackHeight }}>
      <motion.div
        className="sketchpad sticky top-0 flex w-full items-center justify-center overflow-hidden"
        // On mobile the stage stays dark (the recap is rendered light, below);
        // only desktop morphs the pinned stage to the light Apple panel.
        style={{ height: "100svh", minHeight: "560px", background: isMobile ? "#0c0d10" : lightBg }}
      >
        {/* Shared SVG defs (rough-ink filter + gradients) defined ONCE — filter
            and gradient refs resolve document-wide by id, so we avoid duplicate
            ids across the per-beat SVGs. */}
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <SketchDefs />
        </svg>

        {/* LAYER 1 (art-back): one ambient ink flourish, far behind the text and
            heavily dimmed — fades out as the panel turns light for the recap. */}
        <BackdropArt p={p} inkOpacity={inkOpacity} />

        {/* LAYER 2 (DOM text): all beats stack centred and cross-fade in place. */}
        <div className="relative z-10 mx-auto w-full max-w-[1080px] px-6">
          <IntroBeat p={p} />
          {shows.map((show, i) => (
            <ShowBeat
              key={show.label}
              show={show}
              span={(isMobile ? SHOW_SPANS_MOBILE : SHOW_SPANS)[i]}
              p={p}
              // On mobile the last show holds to the end so there's no black gap
              // before the white recap section.
              holdToEnd={isMobile && i === shows.length - 1}
            />
          ))}
          {/* Desktop pins the white recap inside the stage; mobile renders it as
              StaticRecap (normal flow) below so all three shows are reachable. */}
          {!isMobile && <RecapBeat p={p} />}
        </div>

        <motion.div
          className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-[11px] font-medium uppercase tracking-[0.3em] text-white/40"
          style={{ opacity: hintOpacity }}
        >
          Scroll
        </motion.div>
      </motion.div>
    </section>
    {isMobile && <StaticRecap />}
    </>
  );
}

/* SVG defs: rough-ink filter + accent gradients + neon glow. */
function SketchDefs() {
  return (
    <defs>
      <filter id="ink-rough" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <linearGradient id="grad-champ" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#147EFF" />
        <stop offset="1" stopColor="#FC19ED" />
      </linearGradient>
    </defs>
  );
}

/** A single, large, dim flourish that lives BEHIND everything and slowly draws
 *  across the whole scroll. Low opacity + heavy blur so it's pure ambience and
 *  can never hurt legibility (research §1: art-back layer + scrim above). */
function BackdropArt({ p, inkOpacity }: { p: MotionValue<number>; inkOpacity: MotionValue<number> }) {
  return (
    <motion.svg
      viewBox="0 0 1200 800"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      style={{ opacity: inkOpacity }}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* a sweeping ribbon, top-left to bottom-right, kept to the edges */}
      <Stroke
        d="M-40 120 q 300 -80 560 80 q 320 200 720 60"
        p={p}
        span={[0.05, 0.55]}
        className="ink ink-champ"
        width={5}
      />
      <Stroke
        d="M1240 680 q -360 120 -720 -40 q -320 -150 -600 30"
        p={p}
        span={[0.5, 0.96]}
        className="ink ink-champ"
        width={4}
      />
    </motion.svg>
  );
}

/* ── Beats ───────────────────────────────────────────────────────────────── */

/** A beat container that fades + rises IN over its first fifth and OUT over its
 *  last fifth, scrubbed by scroll. Beats overlap so one is always present. */
function useBeatStyle(p: MotionValue<number>, [a, b]: [number, number], holdToEnd = false) {
  const inEnd = a + (b - a) * 0.2;
  // `holdToEnd`: fade in, then stay fully visible to the end of the span (no
  // fade-out). Used for the last mobile show beat so it's still on screen as you
  // scroll out of the pinned stage into the white recap — no blank gap.
  const outStart = a + (b - a) * (holdToEnd ? 1 : 0.8);
  const opacity = useTransform(p, [a, inEnd, outStart, b], [0, 1, 1, holdToEnd ? 1 : 0]);
  const y = useTransform(p, [a, inEnd, outStart, b], [44, 0, 0, holdToEnd ? 0 : -44]);
  return { opacity, y };
}

function IntroBeat({ p }: { p: MotionValue<number> }) {
  const style = useBeatStyle(p, INTRO_SPAN);
  return (
    <motion.div className="absolute inset-x-6 top-1/2 -translate-y-1/2 text-center" style={style}>
      <p className="text-sm font-semibold uppercase tracking-[0.32em] read-muted">Choose your show</p>
      <h2
        className="read-strong mx-auto mt-4 max-w-[16ch] text-4xl font-medium leading-[1.05] tracking-tight md:text-7xl"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-2px" }}
      >
        One unforgettable night,{" "}
        <span
          style={{
            background: "linear-gradient(90deg,#147EFF,#FC19ED)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          your way.
        </span>
      </h2>
      <p className="read-body mx-auto mt-5 max-w-[42ch] text-base md:text-lg">
        Three separate live shows — pick the one that fits your crew. Each builds
        to the same big finish: one champion, one night you&apos;ll never forget.
      </p>
    </motion.div>
  );
}

/** One show beat: number + clock-free clean layout, big name, value line, pitch,
 *  feature ticks, and a self-drawing underline (the only stroke near text, and
 *  it sits in the name's own keep-out lane). */
function ShowBeat({
  show,
  span,
  p,
  holdToEnd = false,
}: {
  show: Show;
  span: [number, number];
  p: MotionValue<number>;
  holdToEnd?: boolean;
}) {
  const style = useBeatStyle(p, span, holdToEnd);

  // per-element write-on timing inside the beat
  const tagAt = slice(span, 0.08, 0.2);
  const nameAt = slice(span, 0.14, 0.32);
  const underlineAt = slice(span, 0.3, 0.46);
  const valueAt = slice(span, 0.34, 0.5);
  const pitchAt = slice(span, 0.44, 0.62);

  const tag = useWriteOn(p, tagAt);
  const name = useWriteOn(p, nameAt);
  const value = useWriteOn(p, valueAt);
  const pitch = useWriteOn(p, pitchAt);

  return (
    <motion.div className="absolute inset-x-6 top-1/2 -translate-y-1/2" style={style}>
      {/* scrim pad behind copy so any ambient backdrop ink stays readable —
          soft-dark (not pure black) at high opacity for a calm reading surface */}
      <div className="mx-auto max-w-[760px] rounded-[2rem] bg-[#121316]/75 px-6 py-8 text-center backdrop-blur-sm md:px-10 md:py-10">
        {/* tag */}
        <motion.span
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide"
          style={
            show.popular
              ? { background: show.accent, color: "#0b0b0d", ...tag }
              : { border: `1px solid ${show.accent}66`, color: show.accent, background: `${show.accent}14`, ...tag }
          }
        >
          {show.popular && <span aria-hidden>★</span>}
          {show.tag}
        </motion.span>

        {/* name + its underline (the underline draws in its own lane below it) */}
        <motion.h3
          className="mt-4 text-5xl font-bold leading-none tracking-tight md:text-7xl"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-2px", color: show.accent, ...name }}
        >
          {show.label}
        </motion.h3>
        <svg viewBox="0 0 400 24" className="mx-auto mt-2 h-4 w-[min(340px,70%)]" fill="none" aria-hidden="true">
          <Stroke d="M12 12 q 188 14 376 2" p={p} span={underlineAt} className="ink" width={5} stroke={show.accent} />
        </svg>

        {/* value line */}
        <motion.p className="read-strong mt-4 text-lg font-semibold md:text-2xl" style={value}>
          {show.value}
        </motion.p>
        <motion.p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] md:text-base" style={{ color: show.accent, ...value }}>
          {show.bestFor}
        </motion.p>

        {/* pitch */}
        <motion.p className="read-body mx-auto mt-5 max-w-[52ch] text-base md:text-lg" style={pitch}>
          {show.pitch}
        </motion.p>

        {/* features */}
        <motion.ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3" style={pitch}>
          {show.features.map((f) => (
            <li key={f} className="read-body flex items-center gap-2 text-sm md:text-base">
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full"
                style={{ background: `${show.accent}22`, color: show.accent }}
              >
                <Check size={13} strokeWidth={3} />
              </span>
              {f}
            </li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
}

/** Word/line write-on: fade + rise + un-blur across a window. */
function useWriteOn(p: MotionValue<number>, [a, b]: [number, number]) {
  const opacity = useTransform(p, [a, b], [0, 1], { clamp: true });
  const y = useTransform(p, [a, b], [16, 0], { clamp: true });
  const blur = useTransform(p, [a, b], [8, 0], { clamp: true });
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  return { opacity, y, filter };
}
/** Motion style returned by useWriteOn (undefined ⇒ statically visible). */
type WriteOnStyle = ReturnType<typeof useWriteOn>;

/** RECAP — after walking through each show, bring ALL THREE back together so the
 *  group can compare at a glance and make the call, then nudge down to pricing.
 *  The three mini-cards stagger in (Prime Time first / highlighted). */
function RecapBeat({ p }: { p: MotionValue<number> }) {
  // Final beat: fade IN and HOLD (no fade-out) so it stays put as you scroll on
  // into the pricing section right below. (Desktop only — on mobile the recap is
  // rendered as a normal-flow StaticRecap so all three shows scroll naturally.)
  const style = useBeatStyleEnd(p, RECAP_SPAN);
  const heading = useWriteOn(p, slice(RECAP_SPAN, 0.04, 0.2));

  return (
    <motion.div
      className="apple-light absolute inset-x-4 top-1/2 max-h-[94svh] -translate-y-1/2 overflow-y-auto py-6 text-center md:inset-x-6"
      style={style}
    >
      {/* Apple large title: near-black ink, heavy weight, tight tracking. */}
      <motion.h2
        className="apple-title px-4 text-[34px] leading-[1.05] md:text-[72px]"
        style={{ letterSpacing: "-0.02em", ...heading }}
      >
        Which show is yours?
      </motion.h2>
      <motion.p
        className="apple-subtle mx-auto mt-4 max-w-[46ch] px-4 text-[19px] md:text-[30px]"
        style={{ fontFamily: "var(--font-apple)", letterSpacing: "-0.012em", lineHeight: 1.25, ...heading }}
      >
        Three unforgettable shows. Pick yours, gather your crew, and walk out a champion.
      </motion.p>

      {/* Apple comparison grid: borderless, shadowless, centred columns that
          share the panel — separated by whitespace, not card chrome. On mobile
          they stack with a hairline between each. */}
      <div className="mx-auto mt-10 grid max-w-[1000px] gap-x-6 gap-y-10 px-2 md:mt-16 md:grid-cols-3">
        {shows.map((s, i) => (
          // Stagger the three in early in the span, then hold for the rest.
          <RecapCardScrubbed
            key={s.label}
            show={s}
            at={slice(RECAP_SPAN, 0.16 + i * 0.08, 0.3 + i * 0.08)}
            p={p}
          />
        ))}
      </div>
    </motion.div>
  );
}

/** Scroll-scrubbed wrapper (desktop): drives the card's write-on from `p`. */
function RecapCardScrubbed({ show, at, p }: { show: Show; at: [number, number]; p: MotionValue<number> }) {
  const reveal = useWriteOn(p, at);
  return <RecapCard show={show} reveal={reveal} />;
}

/** One Apple comparison COLUMN (not a boxed card): borderless and shadowless,
 *  centred text, a small colour dot, the name, a one-line summary, a hairline
 *  divider, then the spec list — exactly Apple's product line-up grid. With no
 *  `reveal` style it renders statically (the mobile StaticRecap path). */
function RecapCard({ show, reveal }: { show: Show; reveal?: WriteOnStyle }) {
  return (
    <motion.div className="apple-light flex flex-col items-center text-center" style={reveal}>
      {/* Colour dot — Apple's tiny finish swatch above the name. */}
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ background: show.accent, boxShadow: `0 0 0 1px ${show.ink}44` }}
        aria-hidden
      />

      {/* Name — Apple bold title. */}
      <h3 className="apple-title mt-5 text-[32px] md:text-[40px]">{show.label}</h3>

      {/* One-line summary (the "tag"), secondary ink — like Apple's tagline. */}
      <p className="apple-subtle mt-2 text-[19px] md:text-[21px]" style={{ lineHeight: 1.3 }}>
        {show.tag}
      </p>

      {/* "From / value" block — Apple puts a price-style line here. */}
      <p className="mt-7 text-[17px] font-semibold md:text-[19px]" style={{ color: "#1d1d1f", letterSpacing: "-0.01em" }}>
        {show.value}
      </p>

      {/* Hairline divider, full column width — Apple's signature separator. */}
      <span className="mt-8 block h-px w-full" style={{ background: "#d2d2d7" }} aria-hidden />

      {/* "Best for" caption, then the spec list — centred, calm secondary ink. */}
      <p className="apple-tertiary mt-8 text-[15px]">{show.bestFor}</p>
      <ul className="mt-4 space-y-3">
        {show.features.map((f) => (
          <li key={f} className="apple-subtle text-[18px]" style={{ lineHeight: 1.45 }}>
            {f}
          </li>
        ))}
      </ul>

      {/* Apple CTA: blue text link, first-person + action verb (research: first-
          person phrasing lifts CTR ~94%) with a genuine-urgency micro-line. */}
      <Link href="#tickets" className="apple-link mt-8 inline-flex items-center gap-1 font-normal text-[19px]!">
        Book this show
        <span aria-hidden className="text-[21px] leading-none">›</span>
      </Link>
      <span className="apple-tertiary mt-2 text-[13px]">From ₹750/head · slots fill fast</span>
    </motion.div>
  );
}

/** MOBILE recap — the same white Apple comparison panel, but in normal page flow
 *  (not pinned/scrubbed). Pinning the recap inside the sticky stage works on
 *  desktop, but on phones the three shows stack taller than the viewport and the
 *  page scroll (not the panel) wins, so shows 2 & 3 are unreachable. Rendering it
 *  as an ordinary light section lets all three stack and scroll naturally. */
function StaticRecap() {
  return (
    <section
      // The Navbar watches this id to hide the floating "Book Your Show" pill
      // while the light Apple panel is on screen (it has its own CTAs + the dark
      // pill clashes with the white background on mobile).
      id="show-recap"
      data-recap
      className="apple-light w-full px-5 py-20"
      style={{ background: "linear-gradient(180deg, #fbfbfd 0%, #f5f5f7 100%)" }}
    >
      <h2 className="apple-title px-4 text-center text-[34px] leading-[1.05]" style={{ letterSpacing: "-0.02em" }}>
        Which show is yours?
      </h2>
      <p
        className="apple-subtle mx-auto mt-4 max-w-[46ch] px-4 text-center text-[19px]"
        style={{ fontFamily: "var(--font-apple)", letterSpacing: "-0.012em", lineHeight: 1.25 }}
      >
        Three unforgettable shows. Pick yours, gather your crew, and walk out a champion.
      </p>
      <div className="mx-auto mt-12 grid max-w-[1000px] gap-y-12 px-2">
        {shows.map((s) => (
          <RecapCard key={s.label} show={s} />
        ))}
      </div>
    </section>
  );
}

/* The final beat fades IN and holds (no fade-out), so a dedicated style. */
function useBeatStyleEnd(p: MotionValue<number>, [a, b]: [number, number]) {
  const opacity = useTransform(p, [a, a + (b - a) * 0.25], [0, 1], { clamp: true });
  const y = useTransform(p, [a, a + (b - a) * 0.3], [44, 0], { clamp: true });
  return { opacity, y };
}

/* ── Reduced-motion / no-scroll fallback ─────────────────────────────────── */
function StaticFallback() {
  return (
    <section className="relative w-full overflow-hidden bg-black px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1080px]">
        <div className="text-center">
          <p className="read-muted text-sm font-semibold uppercase tracking-[0.32em]">Choose your show</p>
          <h2
            className="read-strong mx-auto mt-4 max-w-[18ch] text-3xl font-medium leading-tight tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-1.5px" }}
          >
            One unforgettable night,{" "}
            <span
              style={{
                background: "linear-gradient(90deg,#147EFF,#FC19ED)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              your way.
            </span>
          </h2>
          <p className="read-body mx-auto mt-4 max-w-[46ch] text-base md:text-lg">
            Three separate live shows — pick the one that fits your crew. Each builds
            to one champion and one night you&apos;ll never forget.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {shows.map((s) => (
            <div
              key={s.label}
              className="relative flex flex-col rounded-3xl border p-7"
              style={{
                borderColor: s.popular ? s.accent : `${s.accent}55`,
                background: `linear-gradient(160deg,${s.accent}1f,#0d0d0f 65%)`,
                boxShadow: s.popular ? `0 22px 55px ${s.accent}26` : undefined,
              }}
            >
              <span
                className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
                style={
                  s.popular
                    ? { background: s.accent, color: "#0b0b0d" }
                    : { border: `1px solid ${s.accent}66`, color: s.accent, background: `${s.accent}14` }
                }
              >
                {s.popular && <span aria-hidden>★</span>}
                {s.tag}
              </span>
              <h3 className="mt-4 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: s.accent }}>
                {s.label}
              </h3>
              <p className="read-strong mt-2 text-[15px] font-semibold">{s.value}</p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: s.accent }}>{s.bestFor}</p>
              <p className="read-body mt-3 text-[15px]">{s.pitch}</p>
              <ul className="mt-4 space-y-2.5 border-t border-white/10 pt-4">
                {s.features.map((f) => (
                  <li key={f} className="read-body flex items-center gap-2 text-[15px]">
                    <Check size={15} strokeWidth={3} style={{ color: s.accent }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="#tickets"
                className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold transition-transform hover:scale-[1.03]"
                style={
                  s.popular
                    ? { background: s.accent, color: "#0b0b0d" }
                    : { border: `1px solid ${s.accent}66`, color: s.accent }
                }
              >
                See prices
                <ArrowDown size={15} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
