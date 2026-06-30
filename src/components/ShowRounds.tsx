"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, Check } from "lucide-react";
import { useLenis } from "lenis/react";
import Snap from "lenis/snap";
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

// Gold-foil stamp used on the game-show book covers (emblem, rules, title).
// `GOLD` is a usable gradient (backgrounds + border-image); `GOLD_TEXT` clips
// that same gradient into the text fill for a foil-stamped look.
const GOLD =
  "linear-gradient(100deg, #f7e7a6 0%, #f3d275 22%, #fff3c4 42%, #e6bb53 62%, #f6dd86 82%, #d4a542 100%)";
const GOLD_TEXT: React.CSSProperties = {
  background: GOLD,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

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

/* Where, within a show's span, the scroll should come to REST when snapping —
   inside the open-and-fully-written hold (cover open + content done by ~0.8, beat
   fades at 0.9), so a snapped show sits open and readable. The intro rests at its
   centre. These progress values (0→1 across the track) are converted to absolute
   scroll pixels and registered with Lenis's Snap so the page settles on each
   show instead of letting it blur past on a fast flick. */
const REST_AT = 0.85;
const INTRO_REST = 0.5;

function restProgress(spans: [number, number][]): number[] {
  const introMid = INTRO_SPAN[0] + (INTRO_SPAN[1] - INTRO_SPAN[0]) * INTRO_REST;
  const showRests = spans.map(([a, b]) => a + (b - a) * REST_AT);
  return [introMid, ...showRests];
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

  // Lenis snap: settle the scroll on each show's open, readable rest point so a
  // fast flick can't blow past the content. Only runs with Lenis (desktop) — on
  // touch devices Lenis is off and native momentum scrolling stays untouched.
  // `proximity` only snaps when you come to rest NEAR a point, so it never fights
  // a deliberate scroll straight through to pricing.
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis || viewportH === null) return;
    const section = sectionRef.current;
    if (!section) return;

    const snap = new Snap(lenis, {
      type: "proximity",
      // Snap only when you settle reasonably close to a rest point (~35% of the
      // viewport); a hard scroll past a show falls outside this and isn't caught.
      distanceThreshold: "35%",
      duration: 0.9,
      debounce: 320,
    });

    const removers: Array<() => void> = [];
    const register = () => {
      removers.forEach((r) => r());
      removers.length = 0;
      const top = section.offsetTop;
      const trackPx = section.offsetHeight;
      const pinned = Math.max(1, trackPx - viewportH); // scroll range while pinned
      const spans = isMobile ? SHOW_SPANS_MOBILE : SHOW_SPANS;
      for (const prog of restProgress(spans)) {
        removers.push(snap.add(Math.round(top + prog * pinned)));
      }
    };
    register();
    // Re-register on resize: offsetTop/Height shift with layout.
    const onResize = () => register();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      removers.forEach((r) => r());
      snap.destroy();
    };
  }, [lenis, viewportH, isMobile]);

  const hintOpacity = useTransform(p, [0, 0.04], [1, 0]);

  // The stage stays the dark game-show set the whole way; the neon light-rig glows
  // bright behind the books, easing back a touch toward the end so the last held
  // show reads clean as you scroll on into pricing (kept well above the text via a
  // heavy blur + the panel's own backdrop, so it never hurts legibility).
  const inkOpacity = useTransform(p, [0, 0.06, 0.8, 0.95], [0, 0.85, 0.85, 0.5]);

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
              index={i}
              span={(isMobile ? SHOW_SPANS_MOBILE : SHOW_SPANS)[i]}
              show={show}
              p={p}
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

/* SVG defs: rough-ink filter + neon gradients + a strong neon-bloom filter. */
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
      {/* Neon tube gradients — bright, saturated, like lit stage tubing. */}
      <linearGradient id="neon-blue" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#36CFFF" />
        <stop offset="1" stopColor="#5B7CFF" />
      </linearGradient>
      <linearGradient id="neon-pink" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#FF4FD8" />
        <stop offset="1" stopColor="#A24BFF" />
      </linearGradient>
      <linearGradient id="neon-violet" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#9A7BFF" />
        <stop offset="1" stopColor="#36CFFF" />
      </linearGradient>
      {/* Big soft bloom so each neon line reads as a glowing tube, not a thin path. */}
      <filter id="neon-bloom" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b2" />
        <feMerge>
          <feMergeNode in="b1" />
          <feMergeNode in="b1" />
          <feMergeNode in="b2" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

/** The neon light-rig behind the books — a glowing game-show stage. Bright neon
 *  ribbons sweep on as you scroll, riding over a slow pulse so the tubes feel
 *  "lit", with soft drifting spotlight blooms. Sits in its own layer far behind
 *  the panels; a heavy blur + the panel's backdrop keep it from hurting legibility
 *  even at this much higher brightness. */
function BackdropArt({ p, inkOpacity }: { p: MotionValue<number>; inkOpacity: MotionValue<number> }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ opacity: inkOpacity }}
      aria-hidden
    >
      {/* Drifting coloured spotlight blooms — the wash of stage lights. */}
      <span
        className="bg-spot bg-spot--blue absolute h-[60vmax] w-[60vmax] rounded-full"
        style={{ top: "-20%", left: "-10%" }}
      />
      <span
        className="bg-spot bg-spot--pink absolute h-[55vmax] w-[55vmax] rounded-full"
        style={{ bottom: "-25%", right: "-10%" }}
      />
      <span
        className="bg-spot bg-spot--violet absolute left-1/2 top-1/2 h-[50vmax] w-[50vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
      />

      {/* Neon tubing — bright glowing ribbons that draw on across the scroll. */}
      <svg
        viewBox="0 0 1200 800"
        className="absolute inset-0 h-full w-full"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <g filter="url(#neon-bloom)">
          <Stroke
            d="M-60 150 q 320 -110 600 70 q 340 220 740 70"
            p={p}
            span={[0.04, 0.5]}
            className="neon-line"
            stroke="url(#neon-blue)"
            width={7}
          />
          <Stroke
            d="M1260 660 q -380 130 -760 -50 q -340 -160 -620 40"
            p={p}
            span={[0.42, 0.92]}
            className="neon-line"
            stroke="url(#neon-pink)"
            width={6}
          />
          <Stroke
            d="M-40 470 q 360 160 700 -10 q 300 -150 620 30"
            p={p}
            span={[0.2, 0.74]}
            className="neon-line"
            stroke="url(#neon-violet)"
            width={5}
          />
        </g>
      </svg>
    </motion.div>
  );
}

/* ── Beats ───────────────────────────────────────────────────────────────── */

/** A beat container that fades + rises IN over its first fifth and OUT over its
 *  last fifth, scrubbed by scroll. Used for the INTRO headline (a non-book beat
 *  that should cross-fade away). */
function useBeatStyle(p: MotionValue<number>, [a, b]: [number, number]) {
  const inEnd = a + (b - a) * 0.18;
  const outStart = a + (b - a) * 0.82;
  const opacity = useTransform(p, [a, inEnd, outStart, b], [0, 1, 1, 0]);
  const y = useTransform(p, [a, inEnd, outStart, b], [44, 0, 0, -44]);
  return { opacity, y };
}

/** A SHOW beat: like a real book it NEVER disappears once opened. It snaps to
 *  fully visible right at the start of its span (its closed cover is what's first
 *  shown) and then stays put at opacity 1 forever — the NEXT show's book simply
 *  arrives ON TOP and covers it (z-index stacking), the way turning to the next
 *  page hides the one before without it dissolving. No fade-out, no exit drift. */
function useShowBeatStyle(p: MotionValue<number>, [a, b]: [number, number]) {
  // Fade the closed cover IN quickly over the first ~6% of the span (a soft arrive
  // rather than a hard pop), then HOLD at full opacity for the rest — and beyond,
  // since later spans clamp it. It never fades out; the next book covers it.
  const inEnd = a + (b - a) * 0.06;
  const opacity = useTransform(p, [a, inEnd], [0, 1], { clamp: true });
  return { opacity };
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

/** Celebratory, dimensional foil art for the ELITE (special-occasion) cover —
 *  gold balloons with shaded bodies + highlights, a wrapped gift with a bow,
 *  drifting confetti and sparkles. Pure SVG (crisp at any size, no assets), tinted
 *  to the gold-foil cover, with a gentle float so the closed book feels alive and
 *  celebratory. Sits behind the title block (low opacity) so it never fights copy. */
function CelebrationArt({ accent }: { accent: string }) {
  const uid = "celeb";
  return (
    <svg
      className="celebration-art pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 400 280"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        {/* shaded gold body for balloons + gift — light top-left, deep bottom-right */}
        <radialGradient id={`${uid}-gold`} cx="38%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset="42%" stopColor="#f0cf6e" />
          <stop offset="100%" stopColor="#b9852a" />
        </radialGradient>
        <radialGradient id={`${uid}-accent`} cx="38%" cy="30%" r="75%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="30%" stopColor={accent} />
          <stop offset="100%" stopColor={accent} stopOpacity="0.65" />
        </radialGradient>
        <linearGradient id={`${uid}-ribbon`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7e7a6" />
          <stop offset="1" stopColor="#c79a3a" />
        </linearGradient>
      </defs>

      {/* ── balloons cluster (top-left) ─────────────────────────────────────── */}
      <g className="celeb-float celeb-float--a">
        {/* strings */}
        <path d="M58 92 q 6 34 -2 70" stroke="url(#celeb-ribbon)" strokeWidth="1.4" />
        <path d="M92 84 q -4 38 6 74" stroke="url(#celeb-ribbon)" strokeWidth="1.4" />
        {/* balloon 1 (gold) */}
        <ellipse cx="58" cy="62" rx="26" ry="32" fill={`url(#${uid}-gold)`} />
        <path d="M58 94 l -5 8 l 10 0 z" fill="#b9852a" />
        <ellipse cx="49" cy="50" rx="7" ry="11" fill="#fff" opacity="0.5" />
        {/* balloon 2 (accent) */}
        <ellipse cx="92" cy="54" rx="24" ry="30" fill={`url(#${uid}-accent)`} />
        <path d="M92 84 l -5 8 l 10 0 z" fill={accent} />
        <ellipse cx="84" cy="42" rx="6" ry="10" fill="#fff" opacity="0.55" />
      </g>

      {/* ── balloon (top-right) ─────────────────────────────────────────────── */}
      <g className="celeb-float celeb-float--b">
        <path d="M338 96 q 8 30 0 66" stroke="url(#celeb-ribbon)" strokeWidth="1.4" />
        <ellipse cx="338" cy="64" rx="25" ry="31" fill={`url(#${uid}-gold)`} />
        <path d="M338 95 l -5 8 l 10 0 z" fill="#b9852a" />
        <ellipse cx="330" cy="51" rx="6" ry="10" fill="#fff" opacity="0.5" />
      </g>

      {/* ── wrapped gift (bottom-centre) ────────────────────────────────────── */}
      <g className="celeb-float celeb-float--c">
        {/* box body */}
        <rect x="170" y="206" width="60" height="48" rx="4" fill={`url(#${uid}-accent)`} />
        {/* lid */}
        <rect x="164" y="194" width="72" height="18" rx="4" fill={`url(#${uid}-gold)`} />
        {/* vertical ribbon */}
        <rect x="194" y="194" width="12" height="60" fill="url(#celeb-ribbon)" opacity="0.92" />
        {/* bow */}
        <path d="M200 194 q -20 -16 -26 -2 q -2 10 26 6 z" fill={`url(#${uid}-gold)`} />
        <path d="M200 194 q 20 -16 26 -2 q 2 10 -26 6 z" fill={`url(#${uid}-gold)`} />
        <circle cx="200" cy="195" r="5" fill="#f7e7a6" />
      </g>

      {/* ── confetti + sparkles drifting across ─────────────────────────────── */}
      <g className="celeb-twinkle">
        <rect x="140" y="70" width="7" height="7" rx="1" fill={accent} transform="rotate(20 143 73)" />
        <rect x="270" y="120" width="6" height="6" rx="1" fill="#f0cf6e" transform="rotate(-15 273 123)" />
        <rect x="120" y="170" width="6" height="6" rx="1" fill="#f0cf6e" transform="rotate(30 123 173)" />
        <rect x="300" y="190" width="7" height="7" rx="1" fill={accent} transform="rotate(-25 303 193)" />
        <path d="M250 60 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" fill="#fff3c4" />
        <path d="M160 130 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 z" fill="#fff3c4" />
        <path d="M320 140 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" fill="#f7e7a6" />
      </g>
    </svg>
  );
}

/** Flips a show open like a REAL hardback book. Built as a physical object, not
 *  a flat card:
 *
 *   • a STACK of pages with real thickness — a striated fore-edge on the right
 *     and a tail edge along the bottom, so the closed book is a block, not a sheet
 *   • a sculpted SPINE (the binding) down the left: rounded with a highlight and
 *     a shadow, raised head/tail bands, casting a gutter shadow into the page
 *   • a hard COVER that overhangs the page block (the "square"), wrapped in a
 *     cloth/leather-grained accent material with an embossed inner keep-line and
 *     a debossed title, plus a beveled lit edge
 *   • a soft CONTACT shadow under the whole thing so it sits on a surface
 *
 *  On scroll the cover swings off the spine (3D rotateY): a specular highlight
 *  sweeps the grain mid-turn, the lifting cover throws a curved gutter shadow on
 *  the revealed page, its underside (a dark endpaper) shows as it passes edge-on,
 *  then it fades — leaving the open right-hand page cleanly readable. */
const ROMAN = ["I", "II", "III", "IV", "V"];

function BookTurn({
  p,
  span,
  show,
  index,
  children,
}: {
  p: MotionValue<number>;
  span: [number, number];
  show: Show;
  index: number;
  children: React.ReactNode;
}) {
  const accent = show.accent;
  // The cover opens SLOWLY across a wide window (~58% of the span) so it tracks
  // the scroll the whole way — every bit of scroll swings the board a little more,
  // like easing a real hardback open by hand. The rest of the span is the open,
  // readable hold. Build the start/mid/end scroll positions of that turn window.
  const [fa, fb] = slice(span, 0.0, 0.58);
  const fmid = fa + (fb - fa) * 0.5;

  // Gentle, continuous easing (soft in and out) so the swing reads as a smooth,
  // hand-controlled opening rather than a snap. It opens to ~-90° (edge-on): an
  // absolutely-positioned cover can't swing LEFT of the column, so rather than
  // laying it back over the page we fully fade it out as it APPROACHES edge-on —
  // it reads as the cover swinging away, leaving the page cleanly visible with NO
  // leftover sliver/ghost lingering at the rest point.
  const EASE = cubicBezier(0.33, 0, 0.3, 1);
  const rotate = useTransform(p, [fa, fb], [0, -90], { clamp: true, ease: EASE });
  // Cover opacity: solid through most of the swing, then fades COMPLETELY by ~78%
  // of the turn window — gone well before the page settles, so nothing of the
  // cover remains visible at the open/rest state.
  const leafOpacity = useTransform(
    p,
    [fa, fa + (fb - fa) * 0.55, fa + (fb - fa) * 0.78],
    [1, 1, 0],
    { clamp: true }
  );

  // Specular highlight sweeps across the FRONT of the cover as it tilts into the
  // light: dim → bright mid-turn → gone by edge-on.
  const frontGlow = useTransform(p, [fa, fmid, fb], [0, 0.3, 0], { clamp: true });
  const frontGlowBg = useTransform(
    frontGlow,
    (v) => `linear-gradient(105deg, rgba(255,255,255,0) 30%, rgba(255,255,255,${v}) 58%, rgba(255,255,255,0) 74%)`
  );

  // Gutter shadow the lifting cover casts on the revealed page: a soft curved band
  // near the spine, deepest mid-lift, fading as the cover clears so the page reads.
  const curl = useTransform(p, [fa, fmid, fb], [0.6, 0.45, 0], { clamp: true });
  const curlBg = useTransform(
    curl,
    (v) => `linear-gradient(90deg, rgba(0,0,0,${v}) 0%, rgba(0,0,0,${v * 0.55}) 18%, rgba(0,0,0,0) 46%)`
  );

  // The page block has real depth; PAGES = px of stacked-paper edge shown. Kept
  // modest so, viewed head-on, the fore-edge reads as a slim warm stack of leaves
  // rather than a heavy slab.
  const PAGES = 9;
  // Warm, finely-striated cream paper for the stacked-page edges (fore + tail).
  const pageStripes =
    "repeating-linear-gradient(180deg, #f4eedd 0px, #f4eedd 1px, #d9cfb6 1px, #d9cfb6 2px)";
  const tailStripes =
    "repeating-linear-gradient(90deg, #f4eedd 0px, #f4eedd 1px, #d9cfb6 1px, #d9cfb6 2px)";

  // Darken the accent for the cover's shaded material gradient and bevels.
  const coverDark = `color-mix(in srgb, ${accent} 38%, #000)`;
  const coverDeep = `color-mix(in srgb, ${accent} 22%, #000)`;

  return (
    <div
      className="relative mx-auto max-w-[760px]"
      // Centred, long perspective: the CLOSED book faces the viewer flat (no
      // tilt) — only the cover swings in 3D as it opens. A long focal length keeps
      // the depth gentle and realistic instead of a hard, card-like skew.
      style={{ perspective: "2600px", perspectiveOrigin: "50% 45%" }}
    >
      {/* Contact shadow — grounds the book on a surface (sits just under it). */}
      <span
        className="pointer-events-none absolute -bottom-5 left-1/2 -z-10 h-10 w-[88%] -translate-x-1/2 rounded-[50%] blur-2xl"
        style={{ background: "rgba(0,0,0,0.55)" }}
        aria-hidden
      />

      {/* PAGE-STACK EDGES — the visible block of pages, giving the book thickness.
          The block sits behind the page, offset down/right, so its fore-edge
          (right) and tail (bottom) read as a real stack of leaves. The right slab
          runs the full height + offset and the bottom slab the full width, so they
          meet cleanly at the corner and read as one extruded block. */}
      <span className="pointer-events-none absolute inset-0" aria-hidden>
        {/* fore-edge (right side) — stacked-paper striations, lit at front */}
        <span
          className="absolute top-0 block"
          style={{
            right: `-${PAGES}px`,
            height: `calc(100% + ${PAGES}px)`,
            width: `${PAGES}px`,
            backgroundImage: pageStripes,
            boxShadow: "inset -2px 0 3px rgba(0,0,0,0.4), inset 1px 0 0 rgba(255,255,255,0.4)",
          }}
        />
        {/* tail edge (bottom) */}
        <span
          className="absolute left-0 block"
          style={{
            bottom: `-${PAGES}px`,
            width: `calc(100% + ${PAGES}px)`,
            height: `${PAGES}px`,
            backgroundImage: tailStripes,
            boxShadow: "inset 0 -2px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.4)",
          }}
        />
      </span>

      {/* The page beneath = the actual spec panel = the open RIGHT-hand page. */}
      <div className="relative transform-3d">
        {children}
        {/* Gutter valley shadow cast by the lifting cover, near the spine. */}
        <motion.span
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: curlBg }}
          aria-hidden
        />
        {/* Permanent soft page-curve near the spine, so the open page bows like a
            real book even after the cover has gone. */}
        <span
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.08) 35%, rgba(0,0,0,0) 70%)",
          }}
          aria-hidden
        />
      </div>

      {/* The turning COVER. A hard board hinged on the spine, carrying the show's
          identity so the closed book is never blank; the title stays legible right
          through the turn and only goes as the cover fades near edge-on. */}
      <motion.div
        className="absolute inset-0 origin-left transform-3d"
        style={{ rotateY: rotate, opacity: leafOpacity }}
        aria-hidden
      >
        {/* FRONT face of the cover — a clothbound, foil-stamped game-show volume.
            Rounded board corners, a deep accent material, a gold-foil emblem,
            title and edition line, a gilt double-rule frame, and a sheen sweep. */}
        <span
          className="absolute inset-0 overflow-hidden rounded-[3px] backface-hidden"
          style={{
            background: `radial-gradient(130% 100% at 50% 0%, ${accent} 0%, ${coverDark} 58%, ${coverDeep} 100%)`,
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.2), inset 0 0 70px rgba(0,0,0,0.4), inset 7px 0 16px rgba(0,0,0,0.45)",
          }}
        >
          {/* woven cloth grain — a fine cross-hatch + soft top sheen */}
          <span
            className="pointer-events-none absolute inset-0 opacity-[0.13]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.5) 0 1px, transparent 1px 3px)",
            }}
          />
          <span
            className="pointer-events-none absolute inset-0 opacity-35"
            style={{ background: "radial-gradient(120% 90% at 26% 8%, rgba(255,255,255,0.5) 0%, transparent 52%)" }}
          />

          {/* Elite (special-occasion) volume gets celebratory foil art — balloons,
              a gift, confetti — floating behind the title to feel like a party. */}
          {isElite && (
            <span className="pointer-events-none absolute inset-0 opacity-[0.55]">
              <CelebrationArt accent={accent} />
            </span>
          )}

          {/* gilt double-rule frame — debossed dark line + a thin GOLD-foil keyline */}
          <span
            className="pointer-events-none absolute inset-4 rounded-[2px] sm:inset-6"
            style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.4)" }}
          />
          <span
            className="pointer-events-none absolute inset-[18px] rounded-[2px] sm:inset-[26px]"
            style={{
              border: "1.5px solid transparent",
              borderImage: `${GOLD} 1`,
              opacity: 0.85,
              filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.45))",
            }}
          />

          {/* Cover face — foil emblem, tag, title, edition line. */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
            {/* foil emblem medallion: a gold ring + the show's mark (★ for the
                crowd favourite, the volume numeral otherwise) — game-show energy */}
            <span
              className="mb-5 flex h-12 w-12 items-center justify-center rounded-full text-[18px] font-bold sm:h-14 sm:w-14 sm:text-xl"
              style={{
                background: GOLD,
                color: coverDeep,
                boxShadow:
                  "inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -2px 3px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.45)",
              }}
            >
              {show.popular ? "★" : ROMAN[index] ?? index + 1}
            </span>

            <span
              className="text-[11px] font-bold uppercase tracking-[0.32em] sm:text-xs"
              style={{ ...GOLD_TEXT, opacity: 0.95 }}
            >
              {show.tag}
            </span>
            <span
              className="mt-3 text-[40px] font-bold leading-none tracking-[-0.02em] sm:text-5xl md:text-7xl"
              style={{
                fontFamily: "var(--font-inter-tight, var(--font-display))",
                ...GOLD_TEXT,
                filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.5)) drop-shadow(0 2px 5px rgba(0,0,0,0.4))",
              }}
            >
              {show.label}
            </span>
            <span
              className="mt-4 block h-[2px] w-16 md:w-24"
              style={{ background: GOLD, boxShadow: "0 1px 0 rgba(0,0,0,0.4)" }}
            />
            <span
              className="mt-5 text-[10px] font-semibold uppercase tracking-[0.3em] sm:text-[11px]"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              The Game Show · Vol. {ROMAN[index] ?? index + 1}
            </span>
            <span className="mt-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45 sm:text-[11px]">
              Scroll to open
            </span>
          </div>

          {/* moving specular sheen as the cover tilts into the light */}
          <motion.span className="pointer-events-none absolute inset-0" style={{ backgroundImage: frontGlowBg }} />
        </span>
      </motion.div>

      {/* SPINE — the sculpted binding down the hinge edge: rounded accent board
          with a lit edge, a shadowed valley into the gutter, and raised head/tail
          bands. Present throughout (it doesn't turn). */}
      <span className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[14px]" aria-hidden>
        <span
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${coverDeep} 0%, ${accent} 35%, ${coverDark} 78%, rgba(0,0,0,0.55) 100%)`,
            boxShadow: "inset 1px 0 0 rgba(255,255,255,0.22), inset -2px 0 6px rgba(0,0,0,0.5)",
          }}
        />
        {/* raised binding bands near head and tail */}
        <span className="absolute inset-x-0 top-[12%] h-[3px]" style={{ background: "rgba(0,0,0,0.45)", boxShadow: "0 1px 0 rgba(255,255,255,0.15)" }} />
        <span className="absolute inset-x-0 bottom-[12%] h-[3px]" style={{ background: "rgba(0,0,0,0.45)", boxShadow: "0 1px 0 rgba(255,255,255,0.15)" }} />
      </span>
    </div>
  );
}

/** One show beat: number + clock-free clean layout, big name, value line, pitch,
 *  feature ticks, and a self-drawing underline (the only stroke near text, and
 *  it sits in the name's own keep-out lane). */
function ShowBeat({
  show,
  index,
  span,
  p,
}: {
  show: Show;
  index: number;
  span: [number, number];
  p: MotionValue<number>;
}) {
  // Every show is a book that flips open — and, like a real book, NEVER fades away
  // once opened. The closed cover arrives, flips open, and the page then holds put.
  // The next show's book simply arrives ON TOP (higher z-index) and covers it.
  const style = useShowBeatStyle(p, span);

  // Content write-on timing. Like a real book the page is ALREADY printed under
  // the cover — so the content writes on EARLY, while the slowly-opening cover
  // (0→58% of span) still hides most of the page, and is FULLY there by ~46% (just
  // as the cover passes edge-on and fades). The cover therefore lifts to reveal a
  // page that's already written, never a blank black page. The open page then
  // holds put for the rest of the span; the snap rests inside that hold.
  const tagAt = slice(span, 0.12, 0.22);
  const nameAt = slice(span, 0.16, 0.28);
  const underlineAt = slice(span, 0.24, 0.34);
  const valueAt = slice(span, 0.28, 0.38);
  const pitchAt = slice(span, 0.34, 0.46);

  const tag = useWriteOn(p, tagAt);
  const name = useWriteOn(p, nameAt);
  const value = useWriteOn(p, valueAt);
  const pitch = useWriteOn(p, pitchAt);

  // BMW underline: a precise bar that WIPES in left→right (scaleX), in place of
  // the old hand-drawn rough-ink stroke. Scrubbed by the same scroll window.
  const underlineScale = useTransform(p, underlineAt, [0, 1], { clamp: true });

  // The whole panel = the inner right page of a book; the spec content writes on.
  // The page is FULLY OPAQUE (not translucent) so that, when the next show's book
  // arrives on top, it cleanly covers the page beneath — like turning a real page.
  const panel = (
    <div
      className="mx-auto max-w-[760px] border border-white/10 bg-[#101213] px-6 py-8 text-center sm:px-8 md:px-12 md:py-11"
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
    <motion.div
      className="absolute inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-6"
      // Later shows stack ABOVE earlier ones, so each arriving book covers the
      // open page before it (a real page-turn) instead of cross-fading.
      style={{ ...style, zIndex: 10 + index }}
    >
      {/* Every show flips open like a real book — the cover carries the show's
          name, and turns off the spine on scroll to reveal the panel beneath. */}
      <BookTurn p={p} span={span} show={show} index={index}>
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
