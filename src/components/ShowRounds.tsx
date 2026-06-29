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
  cubicBezier,
  type MotionValue,
} from "motion/react";

/**
 * "One unforgettable night, your way" — a pinned, scroll-scrubbed story.
 *
 * The three shows are SEPARATE choices (a group books ONE). So instead of three
 * cramped columns, each show gets its own full-screen BEAT that draws + writes
 * itself in as you scroll — sold top-down through the line-up:
 *
 *   intro     → headline "One unforgettable night, your way" writes on
 *   THE CLASSIC   → the pure live game show: core rounds · ~45 min
 *   PRIME TIME    → most popular: the show meets the party · ~60 min
 *   ELITE EDITION → the premium celebration show for special days · ~60 min
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
// (the premium show). Each is a deliberate, desirable choice differentiated by
// VIBE, not quantity: Classic is the core game show, Prime Time the more social
// party version, Elite the premium celebration version for special occasions.
// We deliberately avoid "everything in X plus…" framing — with similar runtimes
// it makes customers count games/minutes and ask "why pay more for the same time".
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
      "The live game show with a whole layer of house-party energy on top — more group games, livelier moments and a bigger, more social format. The crowd favourite for a reason.",
    features: [
      "Live host & full game show",
      "House-party style group games",
      "More social, high-energy format",
      "Lively moments & big group fun",
      "Approx. 60 minutes of play",
    ],
    accent: "#7C5CFC",
    ink: "#5B3FD6",
    gradient: "linear-gradient(135deg, #9A7BFF, #7C5CFC)",
    popular: true,
  },
  {
    label: "Elite Edition",
    tag: "The premium show.",
    value: "An elevated celebration show for special days.",
    fromPrice: 1049,
    bestFor: "Best for birthdays & special occasions.",
    pitch:
      "The premium, more curated version of the show — a more exclusive setup, bigger celebration moments and a standout finale built for the days that matter most. The one to book when it's a special occasion.",
    features: [
      "Live host & full game show",
      "A more curated, premium setup",
      "Bigger celebration moments",
      "A standout finale to remember",
      "Best for birthdays & special occasions",
      "Approx. 60 minutes of play",
    ],
    accent: "#FF8A1E",
    ink: "#D96B00",
    gradient: "linear-gradient(135deg, #FFA94D, #FF8A1E)",
  },
];

/* Each beat owns a slice of the 0→1 scroll timeline: intro → 3 shows, the last
   holding to the end so the page scrolls straight down into pricing (no held
   recap). Each show is a book that flips open, so every span gets equal, generous
   room for the page turn + the content reveal that follows it. */
const INTRO_SPAN: [number, number] = [0.0, 0.1];
const SHOW_SPANS: [number, number][] = [
  [0.1, 0.4],
  [0.42, 0.72],
  [0.74, 1.0],
];
// Mobile has no in-track recap (it's a normal section below), so the show beats
// fill the WHOLE track and the last one holds to the very end — that way you exit
// the pinned stage straight into the white recap, with no dead black scroll.
const SHOW_SPANS_MOBILE: [number, number][] = [
  [0.1, 0.34],
  [0.38, 0.62],
  [0.66, 1.0],
];

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
  // Below Tailwind's `md` the show beats use a tighter set of spans and a
  // slightly shorter track (SHOW_SPANS_MOBILE) for a more compact phone scroll.
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

  // The stage stays the dark sketch showroom the whole way; the ambient neon ink
  // dims toward the end so the last held show reads clean as you scroll on into
  // pricing.
  const inkOpacity = useTransform(p, [0.8, 0.95], [0.18, 0.05]);

  if (reduce) return <StaticFallback />;

  return (
    <section
      ref={sectionRef}
      // The Navbar watches this id to hide the floating "Book Your Show" pill on
      // mobile while the pinned "One unforgettable night" show story is on screen
      // (the pill would overlap the flipping book covers), then return after it.
      id="show-rounds"
      data-show-rounds
      className="relative w-full bg-black"
      style={{ height: trackHeight }}
    >
      <div
        className="sketchpad sticky top-0 flex w-full items-center justify-center overflow-hidden"
        style={{ height: "100svh", minHeight: "560px", background: "#0c0d10" }}
      >
        {/* Shared SVG defs (rough-ink filter + gradients) defined ONCE — filter
            and gradient refs resolve document-wide by id, so we avoid duplicate
            ids across the per-beat SVGs. */}
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <SketchDefs />
        </svg>

        {/* LAYER 1 (art-back): one ambient ink flourish, far behind the text. */}
        <BackdropArt p={p} inkOpacity={inkOpacity} />

        {/* LAYER 2 (DOM text): all beats stack centred and cross-fade in place. */}
        <div className="relative z-10 mx-auto w-full max-w-[1080px] px-6">
          <IntroBeat p={p} />
          {shows.map((show, i) => (
            <ShowBeat
              key={show.label}
              span={(isMobile ? SHOW_SPANS_MOBILE : SHOW_SPANS)[i]}
              show={show}
              p={p}
              // The last show holds to the end of the track so it stays put as you
              // simply scroll on down out of the pinned stage into pricing.
              holdToEnd={i === shows.length - 1}
            />
          ))}
        </div>

        <motion.div
          className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-[11px] font-medium uppercase tracking-[0.3em] text-white/40"
          style={{ opacity: hintOpacity }}
        >
          Scroll
        </motion.div>
      </div>
    </section>
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
 *  last fifth, scrubbed by scroll. Beats overlap so only one is ever on screen.
 *  `holdToEnd`: skip the fade-OUT (stay visible to the span end) — used for the
 *  last show so it holds as you scroll on down into pricing. */
function useBeatStyle(p: MotionValue<number>, [a, b]: [number, number], holdToEnd = false) {
  const inEnd = a + (b - a) * 0.2;
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

/** Flips a show's panel open like a REAL book page. The panel is the page
 *  beneath; a blank cover-leaf sits on top, hinged on the spine along the left
 *  edge, and turns off it (3D rotateY ~180°) as you scroll into the show —
 *  revealing the page. Realism comes from: a specular highlight that sweeps
 *  across the leaf as it catches light mid-turn, a soft page-curl shadow the
 *  lifting leaf casts on the page beneath, and a back face that darkens as it
 *  turns away. The accent-coloured spine is the book's binding throughout. */
function BookTurn({
  p,
  span,
  show,
  children,
}: {
  p: MotionValue<number>;
  span: [number, number];
  show: Show;
  children: React.ReactNode;
}) {
  const accent = show.accent;
  // The leaf turns over the first ~50% of the span, then holds open. Build the
  // start / mid / end scroll positions of that window for the 3-stop ramps below.
  const [fa, fb] = slice(span, 0.0, 0.5);
  const fmid = fa + (fb - fa) * 0.5;

  // Real paper: ease out of the lift, ease into the lay-down — a soft S so it
  // accelerates off the page then settles, never snapping. The leaf opens to just
  // past edge-on (~-95°): an absolutely-positioned leaf can't physically swing to
  // the LEFT of the column, so instead of laying it back over the page (which
  // would re-cover the content) we fade it out as it passes 90° — it reads as the
  // page swinging away and the content beneath is left cleanly visible.
  const EASE = cubicBezier(0.45, 0, 0.2, 1);
  const rotate = useTransform(p, [fa, fb], [0, -95], { clamp: true, ease: EASE });
  // Leaf opacity: solid until it nears edge-on, then fades right out by the end.
  const leafOpacity = useTransform(p, [fa, fa + (fb - fa) * 0.72, fb], [1, 1, 0], { clamp: true });

  // Specular highlight sweeps across the FRONT of the leaf as it tilts into the
  // light: dim → bright mid-turn → gone by edge-on.
  const frontGlow = useTransform(p, [fa, fmid, fb], [0, 0.28, 0], { clamp: true });
  const frontGlowBg = useTransform(
    frontGlow,
    (v) => `linear-gradient(105deg, rgba(255,255,255,0) 30%, rgba(255,255,255,${v}) 60%, rgba(255,255,255,0) 75%)`
  );

  // Page-curl shadow the lifting leaf casts on the page beneath: a soft band near
  // the spine that fades as the leaf clears, so the revealed page brightens.
  const curl = useTransform(p, [fa, fmid, fb], [0.55, 0.4, 0], { clamp: true });
  const curlBg = useTransform(
    curl,
    (v) => `linear-gradient(90deg, rgba(0,0,0,${v}) 0%, rgba(0,0,0,${v * 0.5}) 22%, rgba(0,0,0,0) 50%)`
  );

  return (
    <div className="relative mx-auto max-w-[760px]" style={{ perspective: "1800px" }}>
      {/* The page beneath = the actual spec panel, revealed as the leaf turns. */}
      <div className="relative transform-3d">
        {children}
        {/* Curl shadow cast by the lifting leaf, near the spine. */}
        <motion.span
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: curlBg }}
          aria-hidden
        />
      </div>

      {/* The turning leaf = the book COVER. It carries the show's identity (tag +
          name + accent rule) so the closed book is never blank, and that title
          stays legible right through the turn — it only goes as the whole leaf
          fades near edge-on. Hinged on the LEFT edge (the spine). */}
      <motion.div
        className="absolute inset-0 origin-left overflow-hidden bg-[#15171a] transform-3d"
        style={{ rotateY: rotate, opacity: leafOpacity, borderLeft: `3px solid ${accent}` }}
        aria-hidden
      >
        {/* faint paper grain so the closed leaf doesn't read as flat black */}
        <span
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ background: "radial-gradient(120% 80% at 70% 0%, #ffffff 0%, transparent 60%)" }}
        />

        {/* Cover title block — centred, the show's name on the front of the book. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <span
            className="text-[11px] font-bold uppercase tracking-[0.28em] sm:text-xs"
            style={{ color: accent }}
          >
            {show.tag}
          </span>
          <span
            className="mt-3 text-[40px] font-bold leading-none tracking-[-0.02em] sm:text-5xl md:text-7xl"
            style={{ fontFamily: "var(--font-inter-tight, var(--font-display))", color: accent }}
          >
            {show.label}
          </span>
          <span className="mt-4 block h-[3px] w-16 md:w-24" style={{ background: accent }} />
          <span className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40 md:text-[13px]">
            Scroll to open
          </span>
        </div>

        {/* moving specular highlight as the leaf tilts into the light */}
        <motion.span
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: frontGlowBg }}
        />
      </motion.div>

      {/* Spine — the accent binding line down the hinge edge, present throughout. */}
      <span
        className="pointer-events-none absolute inset-y-0 left-0 w-[3px]"
        style={{ background: accent, opacity: 0.9 }}
        aria-hidden
      />
    </div>
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
  // Every show is a book that flips open. Beats cross-fade normally (fade IN over
  // the first fifth, OUT over the last) so only ONE beat is ever on screen — the
  // closed leaf covers the panel during the fade-in, so it still reads as a solid
  // book arriving, and the BookTurn sequence then flips it open.
  const style = useBeatStyle(p, span, holdToEnd);

  // Content write-on timing. The leaf flips open + fades by ~50% of the span, so
  // the page content starts revealing around then and finishes well before the
  // beat's fade-out (begins at 80%), giving every line a clear visible window.
  const tagAt = slice(span, 0.44, 0.54);
  const nameAt = slice(span, 0.48, 0.6);
  const underlineAt = slice(span, 0.54, 0.64);
  const valueAt = slice(span, 0.56, 0.66);
  const pitchAt = slice(span, 0.62, 0.74);

  const tag = useWriteOn(p, tagAt);
  const name = useWriteOn(p, nameAt);
  const value = useWriteOn(p, valueAt);
  const pitch = useWriteOn(p, pitchAt);

  // BMW underline: a precise bar that WIPES in left→right (scaleX), in place of
  // the old hand-drawn rough-ink stroke. Scrubbed by the same scroll window.
  const underlineScale = useTransform(p, underlineAt, [0, 1], { clamp: true });

  // The whole panel = the inner right page of a book; the spec content writes on.
  const panel = (
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
  );

  return (
    <motion.div className="absolute inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-6" style={style}>
      {/* Every show flips open like a real book — the cover carries the show's
          name, and turns off the spine on scroll to reveal the panel beneath. */}
      <BookTurn p={p} span={span} show={show}>
        {panel}
      </BookTurn>
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

/** One BMW spec PANEL (not a boxed Apple column): squared, deep near-black, the
 *  popular tier carries a coloured top-bar. Eyebrow, tight Inter-Tight name in the
 *  tier accent, the tagline, a "from" price, then a hairline-separated spec list
 *  and the signature BMW button. Used by the reduced-motion StaticFallback. */
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
