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
 *   THE CLASSIC   → the pure live game show: core rounds · ~45 min
 *   PRIME TIME    → most popular: the show meets the party · ~60 min
 *   ELITE EDITION → the flagship: biggest & most unforgettable · ~75 min
 *   payoff    → closing line + CTA
 *
 * Collision-proof by construction (per motion-research best practice): art and
 * copy never share space. A single ambient ink flourish lives BEHIND the text in
 * its own layer; the glowing pen-nib rides the active beat's underline only. No
 * decorative stroke ever crosses a label.
 */

const TRACK_VIEWPORTS = 7; // screens of scroll the whole story spans

// BMW design accent — the signature blue used across the showroom UI.
const BMW_BLUE = "#0066B1";

/* ── Content ─────────────────────────────────────────────────────────────── */

interface Show {
  label: string;
  tag: string;
  /** rounds + duration framed as value, not spec */
  value: string;
  /** lowest per-person weekday price (6+ players) — shown as the "from" line */
  fromPrice: number;
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

// Sold UP the line-up — The Classic → Prime Time (most popular) → Elite Edition
// (the flagship). Each is a deliberate, desirable choice; none is "cheap". Copy
// and feature lists mirror the official brochure: Prime Time builds on The
// Classic, Elite Edition builds on Prime Time.
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
    accent: "#147EFF",
    ink: "#0B5ED7",
    gradient: "linear-gradient(135deg, #1FA2FF, #147EFF)",
  },
  {
    label: "Prime Time",
    tag: "Most popular.",
    value: "Where the game show meets the party.",
    fromPrice: 899,
    bestFor: "The sweet spot most groups choose.",
    pitch:
      "Everything in The Classic, plus a whole layer of house-party energy — extra games, more group interaction and bigger chances to win. The crowd favourite for a reason.",
    features: [
      "Everything in The Classic, plus…",
      "Extra house-party style games",
      "More group interaction & challenges",
      "Bigger energy & more chances to win",
      "Approx. 60 minutes of play",
    ],
    accent: "#7C5CFC",
    ink: "#5B3FD6",
    gradient: "linear-gradient(135deg, #9A7BFF, #7C5CFC)",
    popular: true,
  },
  {
    label: "Elite Edition",
    tag: "Go all in.",
    value: "The biggest and most unforgettable version.",
    fromPrice: 1049,
    bestFor: "For crews who want the full, no-limits night.",
    pitch:
      "Everything in Prime Time, dialled all the way up — more party games, bonus challenges, extended playtime and a finale built for a celebration nobody forgets. The flagship.",
    features: [
      "Everything in Prime Time, plus…",
      "More party games & bonus challenges",
      "Extended playtime",
      "Bigger finale & winner celebration",
      "Premium group experience",
      "Approx. 75 minutes of play",
    ],
    accent: "#FF8A1E",
    ink: "#D96B00",
    gradient: "linear-gradient(135deg, #FFA94D, #FF8A1E)",
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

  // As the RECAP (the three shows together) arrives, the neon sketch stage
  // settles into the BMW "showroom" gradient — the same deep, structured
  // near-black the pricing section uses (#0a0b0c → #161819) — so the final
  // comparison reads as one continuous BMW spec sheet straight into pricing.
  // (The intro + per-show beats keep the brighter sketch stage; the recap calms.)
  const lightBg = useTransform(
    p,
    [RECAP_SPAN[0], RECAP_SPAN[0] + 0.08],
    [
      "linear-gradient(180deg, #0c0d10 0%, #0c0d10 100%)",
      "linear-gradient(180deg, #0a0b0c 0%, #161819 100%)",
    ]
  );
  // The ambient neon ink fades right down as the BMW panel arrives (it belongs
  // to the sketch stage, not the structured showroom).
  const inkOpacity = useTransform(p, [RECAP_SPAN[0], RECAP_SPAN[0] + 0.08], [0.18, 0.04]);

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

  // BMW underline: a precise bar that WIPES in left→right (scaleX), in place of
  // the old hand-drawn rough-ink stroke. Scrubbed by the same scroll window.
  const underlineScale = useTransform(p, underlineAt, [0, 1], { clamp: true });

  return (
    <motion.div className="absolute inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-6" style={style}>
      {/* BMW spec panel — squared (no radius), structured near-black with a thin
          accent left-edge and hairline border. Replaces the soft rounded scrim. */}
      <div
        className="mx-auto max-w-[760px] border border-white/10 bg-[#101213]/85 px-6 py-8 text-center backdrop-blur-sm sm:px-8 md:px-12 md:py-11"
        style={{ borderLeft: `3px solid ${show.accent}` }}
      >
        {/* tag — squared BMW eyebrow. Popular = solid accent block; others a
            hairline-outlined accent label. */}
        <motion.span
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] sm:text-xs"
          style={
            show.popular
              ? { background: show.accent, color: "#0b0b0d", ...tag }
              : { border: `1px solid ${show.accent}66`, color: show.accent, background: `${show.accent}14`, ...tag }
          }
        >
          {show.popular && <span aria-hidden>★</span>}
          {show.tag}
        </motion.span>

        {/* name + its clean BMW underline (wipes in within the name's own lane) */}
        <motion.h3
          className="mt-4 text-[40px] font-bold leading-none tracking-[-0.02em] sm:text-5xl md:text-7xl"
          style={{ fontFamily: "var(--font-inter-tight, var(--font-display))", color: show.accent, ...name }}
        >
          {show.label}
        </motion.h3>
        <div className="mx-auto mt-3 h-[3px] w-[clamp(120px,40%,220px)] overflow-hidden">
          <motion.span
            className="block h-full w-full origin-left"
            style={{ background: show.accent, scaleX: underlineScale }}
            aria-hidden
          />
        </div>

        {/* value line */}
        <motion.p className="read-strong mt-5 text-lg font-semibold md:text-2xl" style={value}>
          {show.value}
        </motion.p>
        <motion.p
          className="mt-1.5 text-[13px] font-semibold uppercase tracking-[0.16em] sm:text-sm md:text-base"
          style={{ color: show.accent, ...value }}
        >
          {show.bestFor}
        </motion.p>

        {/* pitch */}
        <motion.p className="read-body mx-auto mt-5 max-w-[52ch] text-[15px] leading-relaxed sm:text-base md:text-lg" style={pitch}>
          {show.pitch}
        </motion.p>

        {/* features — BMW square ticks, hairline-topped on a left-aligned grid for
            calm scanning (centred would wrap raggedly with longer feature lines). */}
        <motion.ul
          className="mx-auto mt-7 grid max-w-[600px] gap-x-7 gap-y-3 border-t border-white/10 pt-6 text-left sm:grid-cols-2"
          style={pitch}
        >
          {show.features.map((f) => (
            <li key={f} className="read-body flex items-start gap-2.5 text-[14px] sm:text-[15px]">
              <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0" style={{ color: show.accent }} />
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
      className="absolute inset-x-4 top-1/2 max-h-[94svh] -translate-y-1/2 overflow-y-auto py-6 text-white md:inset-x-6"
      style={{ ...style, fontFamily: "var(--font-sans)" }}
    >
      <div className="mx-auto max-w-[1180px] px-2">
        {/* BMW eyebrow — uppercase, blue tick, tracked. */}
        <motion.span
          className="mb-5 flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-white/55"
          style={heading}
        >
          <span className="block h-[2px] w-9" style={{ background: BMW_BLUE }} />
          The line-up
        </motion.span>
        {/* BMW headline — tight, bold, Inter-Tight. */}
        <motion.h2
          className="text-[34px] font-bold leading-[1.04] tracking-[-0.02em] md:text-[58px]"
          style={{ fontFamily: "var(--font-inter-tight, var(--font-display))", ...heading }}
        >
          Which show is yours?
        </motion.h2>
        <motion.p
          className="mt-5 max-w-[58ch] text-[16px] leading-relaxed text-white/60 md:text-[19px]"
          style={heading}
        >
          Three unforgettable shows. Pick yours, gather your crew, and walk out a champion.
        </motion.p>

        {/* BMW comparison grid: squared spec panels separated by hairline gaps,
            the popular tier carries an accent top-bar — identical language to the
            pricing line-up below. */}
        <div className="mt-10 grid gap-px md:mt-12 md:grid-cols-3" style={{ background: "rgba(255,255,255,0.08)" }}>
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
      </div>
    </motion.div>
  );
}

/** Scroll-scrubbed wrapper (desktop): drives the card's write-on from `p`. */
function RecapCardScrubbed({ show, at, p }: { show: Show; at: [number, number]; p: MotionValue<number> }) {
  const reveal = useWriteOn(p, at);
  return <RecapCard show={show} reveal={reveal} />;
}

/** One BMW spec PANEL (not a boxed Apple column): squared, deep near-black, the
 *  popular tier carries a coloured top-bar. Eyebrow, tight Inter-Tight name in the
 *  tier accent, the tagline, a "from" price, then a hairline-separated spec list
 *  and the signature BMW button. With no `reveal` style it renders statically
 *  (the mobile StaticRecap path). */
function RecapCard({ show, reveal }: { show: Show; reveal?: WriteOnStyle }) {
  return (
    <motion.div
      className="relative flex flex-col px-7 pb-8 pt-9"
      style={{ background: show.popular ? "#1b1e20" : "#101213", ...reveal }}
    >
      {/* Accent top-bar marks the recommended build, in the tier's colour. */}
      <span
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: show.popular ? show.accent : "transparent" }}
        aria-hidden
      />

      {/* Eyebrow — the tag, uppercase tracked. */}
      <span
        className="text-[11px] font-bold uppercase tracking-[0.16em]"
        style={{ color: show.popular ? show.accent : "rgba(255,255,255,0.45)" }}
      >
        {show.tag}
      </span>

      {/* Name — tight, bold, in the tier accent. */}
      <h3
        className="mt-2 text-[26px] font-bold tracking-[-0.01em] md:text-[30px]"
        style={{ fontFamily: "var(--font-inter-tight, var(--font-display))", color: show.accent }}
      >
        {show.label}
      </h3>
      <p className="mt-2 text-[14px] leading-snug text-white/55">{show.value}</p>

      {/* "From" price block — BMW spec framing. */}
      <div className="mt-6">
        <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-white/45">From</span>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span
            className="text-[38px] font-bold leading-none tracking-[-0.02em] md:text-[42px]"
            style={{ fontFamily: "var(--font-inter-tight, var(--font-display))" }}
          >
            ₹{show.fromPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-[13px] text-white/50">/ person</span>
        </div>
        <p className="mt-2 text-[12px] text-white/40">{show.bestFor}</p>
      </div>

      {/* Spec list — BMW hairline-separated. */}
      <ul className="mt-7 space-y-3 border-t border-white/10 pt-6">
        {show.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[14px] text-white/70">
            <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0" style={{ color: show.accent }} />
            {f}
          </li>
        ))}
      </ul>

      {/* BMW CTA — outlined, fills blue on hover; the popular tier is filled. */}
      <Link
        href="#tickets"
        className={
          "bmw-btn group/btn mt-8 inline-flex w-full items-center justify-center gap-2 px-7 py-3.5 text-[14px] font-semibold uppercase tracking-[0.06em] text-white transition-colors duration-200 " +
          (show.popular ? "bmw-btn--filled" : "bmw-btn--outline")
        }
      >
        Book {show.label}
        <ArrowDown
          size={16}
          strokeWidth={2.5}
          className="-rotate-90 transition-transform duration-200 group-hover/btn:translate-x-1"
        />
      </Link>
    </motion.div>
  );
}

/** MOBILE recap — the same BMW comparison panel, but in normal page flow (not
 *  pinned/scrubbed). Pinning the recap inside the sticky stage works on desktop,
 *  but on phones the three shows stack taller than the viewport and the page
 *  scroll (not the panel) wins, so shows 2 & 3 are unreachable. Rendering it as
 *  an ordinary BMW-dark section lets all three stack and scroll naturally. */
function StaticRecap() {
  return (
    <section
      // The Navbar watches this id to hide the floating "Book Your Show" pill
      // while the recap panel is on screen (it has its own per-show CTAs).
      id="show-recap"
      data-recap
      className="w-full px-5 py-20 text-white"
      style={{
        background: "linear-gradient(180deg, #0a0b0c 0%, #161819 100%)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div className="mx-auto max-w-[1180px]">
        <span className="mb-5 flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-white/55">
          <span className="block h-[2px] w-9" style={{ background: BMW_BLUE }} />
          The line-up
        </span>
        <h2
          className="text-[34px] font-bold leading-[1.04] tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-inter-tight, var(--font-display))" }}
        >
          Which show is yours?
        </h2>
        <p className="mt-5 max-w-[58ch] text-[16px] leading-relaxed text-white/60">
          Three unforgettable shows. Pick yours, gather your crew, and walk out a champion.
        </p>
        <div className="mt-10 grid gap-px" style={{ background: "rgba(255,255,255,0.08)" }}>
          {shows.map((s) => (
            <RecapCard key={s.label} show={s} />
          ))}
        </div>
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
/* Same BMW showroom layout as the recap, rendered statically (no scroll scrub)
 * so reduced-motion users get the identical structured spec-sheet comparison. */
function StaticFallback() {
  return (
    <section
      className="relative w-full overflow-hidden px-5 py-20 text-white md:px-10 md:py-28"
      style={{
        background: "linear-gradient(180deg, #0a0b0c 0%, #161819 100%)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div className="mx-auto max-w-[1180px]">
        <span className="mb-5 flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-white/55">
          <span className="block h-[2px] w-9" style={{ background: BMW_BLUE }} />
          The line-up
        </span>
        <h2
          className="text-[34px] font-bold leading-[1.04] tracking-[-0.02em] md:text-[58px]"
          style={{ fontFamily: "var(--font-inter-tight, var(--font-display))" }}
        >
          Which show is yours?
        </h2>
        <p className="mt-5 max-w-[58ch] text-[16px] leading-relaxed text-white/60 md:text-[19px]">
          Three separate live shows — pick the one that fits your crew. Each builds to
          one champion and one night you&apos;ll never forget.
        </p>

        <div className="mt-12 grid gap-px md:grid-cols-3" style={{ background: "rgba(255,255,255,0.08)" }}>
          {shows.map((s) => (
            <RecapCard key={s.label} show={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
