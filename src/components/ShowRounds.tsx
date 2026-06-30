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
  useVelocity,
  useMotionTemplate,
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

const TRACK_VIEWPORTS = 11; // screens of scroll the whole story spans — long enough
// that the shelf lingers and each show eases in/out slowly (not a fast blur-by).

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
  /** Cover MATERIAL — a rich two-tone gradient blended diagonally across the book
   *  board: `matFrom` is the luminous near-corner hue, `matTo` the deep partner hue.
   *  Gives each tier a dimensional, premium look instead of one-hue-fading-to-black. */
  matFrom: string;
  matTo: string;
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
    accent: "#2E9BFF",
    ink: "#0B5ED7",
    gradient: "linear-gradient(135deg, #4FB8FF, #1E7BFF)",
    // Electric azure → deep royal-indigo: clean, confident, "the original".
    matFrom: "#46B4FF",
    matTo: "#0A2150",
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
    accent: "#9B6BFF",
    ink: "#5B3FD6",
    gradient: "linear-gradient(135deg, #C04BFF, #7C5CFC)",
    // Hot magenta → deep indigo-violet: the vivid, electric party — most vibrant.
    matFrom: "#C152FF",
    matTo: "#241152",
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
    accent: "#FFB23E",
    ink: "#C25A00",
    gradient: "linear-gradient(135deg, #FFD66B, #FF8A1E)",
    // Luminous gold → deep wine/plum: luxe, celebratory, premium — never muddy brown.
    matFrom: "#FFC85A",
    matTo: "#3F1330",
  },
];

/* The 0→1 scroll timeline: intro headline → ESTABLISH (all three closed books
   shown together, small, in a row — the "shelf") → then the camera ZOOMS IN to
   each book in turn, opening it, before panning to the next. Each show owns a span
   where its book is centred + flips open. */
const INTRO_SPAN: [number, number] = [0.0, 0.06];
// Establish: the lineup of three closed books, seen together before any zoom-in —
// held for a good while so you can actually take in all three shows.
const ESTABLISH_SPAN: [number, number] = [0.06, 0.24];
const SHOW_SPANS: [number, number][] = [
  [0.24, 0.48],
  [0.5, 0.74],
  [0.76, 1.0],
];
// Mobile has no in-track recap (it's a normal section below), so the show beats
// fill the WHOLE track and the last one holds to the very end — that way you exit
// the pinned stage straight into the white recap, with no dead black scroll.
const SHOW_SPANS_MOBILE: [number, number][] = [
  [0.24, 0.48],
  [0.5, 0.74],
  [0.76, 1.0],
];

function slice([a, b]: [number, number], from: number, to: number): [number, number] {
  return [a + (b - a) * from, a + (b - a) * to];
}

/* Where, within a show's span, the scroll should come to REST when snapping. Each
   show gets TWO rest points: one on the CLOSED COVER (during the cover-read dwell,
   so the audience settles to read the title/edition/art before it opens) and one
   on the OPEN PAGE (inside the readable hold). The intro rests at its centre. These
   progress values (0→1 across the track) become absolute scroll pixels registered
   with Lenis's Snap so the page settles on each beat instead of blurring past. */
const COVER_AT = 0.08; // on the closed cover, early in the dwell
const REST_AT = 0.85; // on the open, fully-written page
const INTRO_REST = 0.5;

function restProgress(spans: [number, number][]): number[] {
  const introMid = INTRO_SPAN[0] + (INTRO_SPAN[1] - INTRO_SPAN[0]) * INTRO_REST;
  // A rest on the ESTABLISH "shelf" so the lineup of three closed books can settle
  // and be taken in before you zoom into the first one.
  const shelfMid = ESTABLISH_SPAN[0] + (ESTABLISH_SPAN[1] - ESTABLISH_SPAN[0]) * 0.55;
  const points: number[] = [introMid, shelfMid];
  for (const [a, b] of spans) {
    points.push(a + (b - a) * COVER_AT); // closed-cover read stop
    points.push(a + (b - a) * REST_AT); // open-page stop
  }
  return points;
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
  // separate section below); keep it nearly as long as desktop so the shelf + each
  // show still ease by slowly enough to read (a too-short track scrolls too fast).
  const trackViewports = isMobile ? TRACK_VIEWPORTS * 0.88 : TRACK_VIEWPORTS;
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

  // SWIPE FEEDBACK SIGNAL — a 0→1 "energy" value that spikes the instant you swipe
  // and decays back to rest, so the stage visibly reacts to EVERY gesture (the old
  // neon tubes drew on over such wide scroll spans that a single swipe barely moved
  // them, and they pulsed on a timer regardless of scroll — so it read as "stuck").
  // We take the scroll velocity, rectify + normalise it, and ease it with a fast
  // spring: scroll → beams flare and swing; stop → it settles. Drives BackdropArt
  // and the progress rail's glowing head.
  const rawVelocity = useVelocity(scrollYProgress);
  const energyTarget = useTransform(rawVelocity, (v) => Math.min(1, Math.abs(v) * 9));
  const energy = useSpring(energyTarget, { stiffness: 170, damping: 26, restDelta: 0.001 });

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

  // CAMERA FOCUS — the three books sit in a ROW; the camera travels left→right
  // across them. `focus` is a continuous book index (0 = Classic centred, 1 =
  // Prime Time, 2 = Elite). It HOLDS on each book through that show's span (so the
  // book opens + is read while centred), then PANS to the next between spans. Each
  // book reads its own offset from `focus` to slide + zoom itself in/out of frame.
  const spansForFocus = isMobile ? SHOW_SPANS_MOBILE : SHOW_SPANS;
  // Build strictly-increasing keyframes: the camera HOLDS on book i from that
  // show's span start (a) to its end (b), then PANS i → i+1 across the gap to the
  // next show's start. (Output repeats i across [a,b] = hold, then steps to i+1.)
  const focusInput: number[] = [0];
  const focusOutput: number[] = [0];
  spansForFocus.forEach(([a, b], i) => {
    focusInput.push(a, b);
    focusOutput.push(i, i);
  });
  const focus = useTransform(p, focusInput, focusOutput, { clamp: true });

  // CAMERA ZOOM — 0 through the first half of the ESTABLISH phase (the three closed
  // books shown small together, a shelf you take in at a glance), then ramps to 1
  // across the back half of establish into the first book's cover-read point, where
  // the camera has fully "zoomed in" and travels book to book. Each book blends
  // between its shelf slot (zoom 0) and its focused, centred position (zoom 1), and
  // stays zoomed in from then on.
  const zoomStart = ESTABLISH_SPAN[0] + (ESTABLISH_SPAN[1] - ESTABLISH_SPAN[0]) * 0.55;
  const zoomEnd = spansForFocus[0][0] + (spansForFocus[0][1] - spansForFocus[0][0]) * COVER_AT;
  const zoom = useTransform(p, [zoomStart, zoomEnd], [0, 1], { clamp: true });

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

        {/* LAYER 1 (art-back): the stage light-rig — a soft glow that glides + shifts
            hue per show with the scroll, so the scene visibly changes as you swipe. */}
        <BackdropArt p={p} inkOpacity={inkOpacity} />

        {/* "Shows Available" heading over the shelf — visible while the three books
            are lined up (establish), fading away as you zoom into a book to read it. */}
        <ShelfHeading zoom={zoom} />

        {/* LAYER 2 — the books in a ROW the camera travels across. The intro headline
            still lives centred; each book slides + zooms by its offset from `focus`,
            so the active one is centred & large and the others wait off to the sides
            (already open if you've passed them — they stay open in place). */}
        <div className="relative z-10 h-full w-full" style={{ perspective: "1600px" }}>
          <IntroBeat p={p} />
          {shows.map((show, i) => (
            <ShowBeat
              key={show.label}
              index={i}
              span={(isMobile ? SHOW_SPANS_MOBILE : SHOW_SPANS)[i]}
              show={show}
              p={p}
              focus={focus}
              zoom={zoom}
              isMobile={isMobile}
            />
          ))}
        </div>

        {/* PROGRESS RAIL — a slim line-up tracker that fills as you move through the
            three shows, with a glowing head that flares brighter the faster you
            swipe. This is the unambiguous "your swipe is doing something" signal:
            even a tiny scroll visibly advances the fill + lights the head. */}
        <ProgressRail p={p} energy={energy} />

        <motion.div
          className="pointer-events-none absolute bottom-10 left-1/2 z-20 -translate-x-1/2 text-[11px] font-medium uppercase tracking-[0.3em] text-white/40"
          style={{ opacity: hintOpacity }}
        >
          Scroll
        </motion.div>
      </div>
    </section>
  );
}

/** The line-up progress tracker pinned to the bottom of the stage. The fill + its
 *  head glide with scroll position 0→1 (the main "your swipe is doing something"
 *  cue, visible even when the books are mid-hold); the head's glow gently lifts
 *  while swiping. Three tick marks flag the shows so you see which one you're on. */
function ProgressRail({ p, energy }: { p: MotionValue<number>; energy: MotionValue<number> }) {
  const fill = useTransform(p, (v) => `${Math.max(0, Math.min(1, v)) * 100}%`);
  // The head GLIDES along the rail with scroll position (the main "I'm moving" cue),
  // and gently lifts its glow while swiping — a soft, restrained confirmation, NOT
  // the big strobing flare we removed from the background.
  const headOpacity = useTransform(energy, [0, 1], [0.6, 1]);
  const headScale = useTransform(energy, [0, 1], [1, 1.35]);
  const headShadow = "0 0 10px rgba(124,180,255,0.85)";

  return (
    <div className="pointer-events-none absolute bottom-[26px] left-1/2 z-20 w-[min(78vw,420px)] -translate-x-1/2">
      <div className="relative h-[3px] w-full overflow-visible rounded-full bg-white/12">
        {/* filled portion */}
        <motion.span
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: fill,
            background: "linear-gradient(90deg, #36CFFF, #7C5CFC 55%, #FF8A1E)",
          }}
        />
        {/* glowing head at the leading edge of the fill */}
        <motion.span
          className="absolute top-1/2 h-[10px] w-[10px] rounded-full bg-white"
          style={{
            left: fill,
            x: "-50%",
            y: "-50%",
            opacity: headOpacity,
            scale: headScale,
            boxShadow: headShadow,
          }}
        />
        {/* show tick marks at each beat's rough centre */}
        {[0.25, 0.57, 0.87].map((t) => (
          <span
            key={t}
            className="absolute top-1/2 h-[7px] w-[1.5px] -translate-y-1/2 rounded-full bg-white/30"
            style={{ left: `${t * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/* SVG defs — the rough-ink filter + champ gradient kept for the cover/recap art. */
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

/** The stage light-rig behind the books — a glowing game-show stage. Driven purely
 *  by scroll POSITION (never velocity), so it GLIDES with your swipe and never
 *  strobes/flickers:
 *
 *   • a big soft GLOW that travels smoothly across the stage as you move through
 *     the line-up, and
 *   • the whole wash shifts HUE per show — blue (Classic) → violet (Prime Time) →
 *     warm orange (Elite) — so each swipe visibly changes the colour of the room.
 *
 *  Because everything tracks the spring-smoothed scroll position, motion is silky
 *  and continuous; there's no velocity-reactive flare to cause the jittery
 *  "heart-attack" strobing. Sits far behind the panels; the heavy blur + the panel
 *  backdrop keep it from hurting legibility. */
function BackdropArt({ p, inkOpacity }: { p: MotionValue<number>; inkOpacity: MotionValue<number> }) {
  // The active show's accent, interpolated smoothly across the scroll: blue →
  // violet → orange. Two glow layers cross-blend so the colour shift reads as the
  // room re-lighting around the book you're on.
  const hueStops = [0, 0.25, 0.55, 0.85, 1];
  const glowA = useTransform(p, hueStops, ["#1FA2FF", "#1FA2FF", "#7C5CFC", "#FF8A1E", "#FF8A1E"]);
  const glowB = useTransform(p, hueStops, ["#36CFFF", "#36CFFF", "#9A7BFF", "#FFA94D", "#FFA94D"]);
  // The glow GLIDES across the stage with scroll position — a gentle pan so a swipe
  // visibly moves the light, with no jitter (position is spring-smoothed upstream).
  const glowX = useTransform(p, [0, 1], ["28%", "72%"]);
  const glowY = useTransform(p, [0, 1], ["34%", "60%"]);
  const wash = useMotionTemplate`radial-gradient(60vmax 60vmax at ${glowX} ${glowY}, ${glowA} 0%, transparent 60%)`;
  const washB = useMotionTemplate`radial-gradient(46vmax 46vmax at ${glowY} ${glowX}, ${glowB} 0%, transparent 58%)`;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ opacity: inkOpacity }}
      aria-hidden
    >
      {/* Ambient drifting blooms — the base wash of stage lights (slow, calm). */}
      <span
        className="bg-spot bg-spot--blue absolute h-[60vmax] w-[60vmax] rounded-full"
        style={{ top: "-20%", left: "-10%" }}
      />
      <span className="bg-spot bg-spot--violet absolute left-1/2 top-1/2 h-[50vmax] w-[50vmax] -translate-x-1/2 -translate-y-1/2 rounded-full" />

      {/* Scroll-driven colour wash — travels + shifts hue per show. Screen-blended
          and heavily soft so it re-lights the room around the active book. */}
      <motion.span
        className="absolute inset-0 blur-3xl"
        style={{ backgroundImage: wash, opacity: 0.5, mixBlendMode: "screen" }}
      />
      <motion.span
        className="absolute inset-0 blur-3xl"
        style={{ backgroundImage: washB, opacity: 0.38, mixBlendMode: "screen" }}
      />
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

/** "Shows Available" heading sitting above the shelf of three books. It's tied to
 *  the camera zoom: fully shown while the books are lined up (zoom→0), fading out
 *  as you zoom into a book to read it (zoom→1). */
function ShelfHeading({ zoom }: { zoom: MotionValue<number> }) {
  const opacity = useTransform(zoom, [0, 0.6], [1, 0]);
  const y = useTransform(zoom, [0, 0.6], [0, -16]);
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 top-[3%] z-20 flex flex-col items-center text-center md:top-[8%]"
      style={{ opacity, y }}
    >
      <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-white/45 sm:text-xs">
        The Line-up
      </span>
      <h2
        className="read-strong mt-2 text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-1px" }}
      >
        Shows Available
      </h2>
      <span className="mt-3 h-[2px] w-14 rounded-full bg-gradient-to-r from-[#36CFFF] via-[#7C5CFC] to-[#FF8A1E]" />
    </motion.div>
  );
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

/** Foil cover art per tier, tuned to PURCHASE PSYCHOLOGY so desirability climbs
 *  Classic → Prime Time → Elite (the ladder we want people to prefer):
 *
 *   • CLASSIC ("the original" — trust/foundation): a single, clean gold mic. Calm,
 *     confident, minimal — reads solid and dependable, but the plainest cover, so
 *     the eye is naturally pulled toward the richer tiers (anchors the bottom).
 *   • PRIME TIME ("most popular" — fun / social proof / FOMO): a lively radiating
 *     star-burst + confetti + stars. Energetic and inviting — the crowd-pleaser —
 *     clearly more exciting than Classic, but not lavish, so Elite still wins.
 *   • ELITE (special occasion — aspiration / status): the lavish celebration —
 *     a CROWN above balloons, a wrapped gift, confetti and sparkles. The richest,
 *     most rewarding cover, signalling the premium "treat yourself" choice.
 *
 *  All pure SVG (crisp, no assets), tinted to the gold-foil cover, gently floating
 *  so the closed book feels alive. Sits behind the title block at low opacity so it
 *  never fights the copy. */
function CoverArt({ variant, accent }: { variant: "classic" | "prime" | "elite"; accent: string }) {
  const uid = `art-${variant}`;
  return (
    <svg
      className="cover-art pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 400 280"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
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
        {/* Cylindrical foil shading for the mic body/stem — light left, shade right. */}
        <linearGradient id={`${uid}-chrome`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a9781f" />
          <stop offset="0.18" stopColor="#e9c870" />
          <stop offset="0.4" stopColor="#fff6d6" />
          <stop offset="0.6" stopColor="#edc869" />
          <stop offset="0.82" stopColor="#c69835" />
          <stop offset="1" stopColor="#8a611a" />
        </linearGradient>
        {/* Spherical grille shading — top-left key light falling to a warm shadow. */}
        <radialGradient id={`${uid}-grille`} cx="36%" cy="28%" r="78%">
          <stop offset="0" stopColor="#fff7da" />
          <stop offset="34%" stopColor="#f3d57f" />
          <stop offset="72%" stopColor="#cf9d3c" />
          <stop offset="100%" stopColor="#7c560f" />
        </radialGradient>
        {/* Soft glow so the emblem reads as lit foil on the dark cover. */}
        <radialGradient id={`${uid}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.5" />
          <stop offset="55%" stopColor="#ffe9a8" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffe9a8" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${uid}-headclip`}>
          <ellipse cx="200" cy="80" rx="30" ry="34" />
        </clipPath>
      </defs>

      {variant === "classic" && (
        // One sculpted gold STUDIO MICROPHONE, centred — the original game show.
        // Minimal in count, but rendered as a real lit object: a spherical wire
        // grille, a chrome collar, a tapered handle and a weighted base.
        <g className="cover-float cover-float--c">
          {/* lit halo so the foil reads as glowing on the dark cover */}
          <circle cx="200" cy="120" r="118" fill={`url(#${uid}-halo)`} />

          {/* ── stand: yoke arms cradling the head, stem and weighted base ── */}
          {/* yoke (the U-mount the head pivots in) */}
          <path
            d="M171 92 q-6 26 8 42 M229 92 q6 26 -8 42"
            stroke={`url(#${uid}-chrome)`}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* pivot knobs where the head meets the yoke */}
          <circle cx="172" cy="92" r="4.5" fill={`url(#${uid}-gold)`} />
          <circle cx="228" cy="92" r="4.5" fill={`url(#${uid}-gold)`} />
          {/* stem */}
          <rect x="194" y="128" width="12" height="36" rx="3" fill={`url(#${uid}-chrome)`} />
          {/* collar joining stem to base */}
          <rect x="188" y="160" width="24" height="7" rx="3" fill={`url(#${uid}-gold)`} />
          {/* weighted disc base with an elliptical top face for solidity */}
          <ellipse cx="200" cy="172" rx="34" ry="9" fill={`url(#${uid}-chrome)`} />
          <ellipse cx="200" cy="170" rx="34" ry="8" fill={`url(#${uid}-gold)`} />
          <ellipse cx="200" cy="168" rx="22" ry="4" fill="#fff7da" opacity="0.5" />

          {/* ── head: spherical grille with curved mesh + collar ── */}
          {/* chrome collar/band beneath the grille */}
          <rect x="184" y="106" width="32" height="12" rx="4" fill={`url(#${uid}-chrome)`} />
          <rect x="184" y="106" width="32" height="3" rx="1.5" fill="#fff7da" opacity="0.6" />
          {/* grille sphere */}
          <ellipse cx="200" cy="80" rx="30" ry="34" fill={`url(#${uid}-grille)`} />
          {/* curved wire mesh, clipped to the sphere so lines wrap its surface */}
          <g clipPath={`url(#${uid}-headclip)`} stroke="#7c560f" strokeWidth="1.4" opacity="0.5" fill="none">
            {/* latitudes */}
            <path d="M170 64 q30 -12 60 0" />
            <path d="M170 74 q30 -10 60 0" />
            <path d="M170 84 q30 -8 60 0" />
            <path d="M170 94 q30 8 60 0" />
            <path d="M170 104 q30 12 60 0" />
            {/* longitudes */}
            <path d="M186 48 q-10 32 0 64" />
            <path d="M200 46 v68" />
            <path d="M214 48 q10 32 0 64" />
          </g>
          {/* rim shade to round the sphere off, and a crisp specular hotspot */}
          <ellipse
            cx="200"
            cy="80"
            rx="30"
            ry="34"
            fill="none"
            stroke="#8a611a"
            strokeWidth="2"
            opacity="0.45"
          />
          <ellipse cx="189" cy="66" rx="7" ry="11" fill="#fffdf2" opacity="0.7" />
          <circle cx="186" cy="60" r="2.5" fill="#ffffff" opacity="0.85" />
        </g>
      )}

      {variant === "prime" && (
        // A radiating STAR-BURST (party energy) + confetti + stars — the lively,
        // most-popular crowd-pleaser. More motion + colour than Classic.
        <>
          <g className="cover-spin" style={{ transformOrigin: "200px 96px" }}>
            {/* burst rays */}
            {Array.from({ length: 12 }).map((_, i) => (
              <rect
                key={i}
                x="197"
                y="34"
                width="6"
                height="34"
                rx="3"
                fill={i % 2 ? `url(#${uid}-gold)` : `url(#${uid}-accent)`}
                transform={`rotate(${i * 30} 200 96)`}
                opacity="0.9"
              />
            ))}
            {/* centre star */}
            <path
              d="M200 70 l8 18 19 2 -14 13 4 19 -17 -10 -17 10 4 -19 -14 -13 19 -2 z"
              fill={`url(#${uid}-gold)`}
            />
          </g>
          <g className="cover-twinkle">
            <path d="M96 120 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4 z" fill="#fff3c4" />
            <path d="M306 116 l3.5 8 8 3.5 -8 3.5 -3.5 8 -3.5 -8 -8 -3.5 8 -3.5 z" fill="#f7e7a6" />
            <rect x="120" y="200" width="8" height="8" rx="1" fill={accent} transform="rotate(20 124 204)" />
            <rect x="276" y="206" width="8" height="8" rx="1" fill="#f0cf6e" transform="rotate(-22 280 210)" />
            <rect x="200" y="216" width="7" height="7" rx="1" fill={accent} transform="rotate(12 203 219)" />
          </g>
        </>
      )}

      {variant === "elite" && (
        <>
          {/* CROWN above — the premium status mark, topping the celebration. */}
          <g className="cover-float cover-float--b">
            <path
              d="M168 56 l10 22 22 -30 22 30 10 -22 -6 40 -52 0 z"
              fill={`url(#${uid}-gold)`}
            />
            <rect x="172" y="92" width="56" height="9" rx="3" fill={`url(#${uid}-ribbon)`} />
            <circle cx="168" cy="54" r="4" fill="#f7e7a6" />
            <circle cx="200" cy="46" r="4.5" fill="#f7e7a6" />
            <circle cx="232" cy="54" r="4" fill="#f7e7a6" />
          </g>

          {/* balloons */}
          <g className="cover-float cover-float--a">
            <path d="M64 132 q 6 26 -2 54" stroke={`url(#${uid}-ribbon)`} strokeWidth="1.4" />
            <ellipse cx="64" cy="108" rx="22" ry="27" fill={`url(#${uid}-gold)`} />
            <path d="M64 134 l -4 7 l 8 0 z" fill="#b9852a" />
            <ellipse cx="56" cy="98" rx="6" ry="9" fill="#fff" opacity="0.5" />
          </g>
          <g className="cover-float cover-float--b">
            <path d="M338 134 q 8 24 0 52" stroke={`url(#${uid}-ribbon)`} strokeWidth="1.4" />
            <ellipse cx="338" cy="110" rx="21" ry="26" fill={`url(#${uid}-accent)`} />
            <path d="M338 134 l -4 7 l 8 0 z" fill={accent} />
            <ellipse cx="330" cy="100" rx="5" ry="9" fill="#fff" opacity="0.55" />
          </g>

          {/* wrapped gift (bottom-centre) */}
          <g className="cover-float cover-float--c">
            <rect x="172" y="214" width="56" height="44" rx="4" fill={`url(#${uid}-accent)`} />
            <rect x="166" y="202" width="68" height="17" rx="4" fill={`url(#${uid}-gold)`} />
            <rect x="194" y="202" width="12" height="56" fill={`url(#${uid}-ribbon)`} opacity="0.92" />
            <path d="M200 202 q -19 -15 -25 -2 q -2 10 25 6 z" fill={`url(#${uid}-gold)`} />
            <path d="M200 202 q 19 -15 25 -2 q 2 10 -25 6 z" fill={`url(#${uid}-gold)`} />
            <circle cx="200" cy="203" r="5" fill="#f7e7a6" />
          </g>

          {/* confetti + sparkles */}
          <g className="cover-twinkle">
            <rect x="120" y="80" width="7" height="7" rx="1" fill={accent} transform="rotate(20 123 83)" />
            <rect x="284" y="78" width="6" height="6" rx="1" fill="#f0cf6e" transform="rotate(-15 287 81)" />
            <path d="M250 150 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" fill="#fff3c4" />
            <path d="M150 160 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 z" fill="#fff3c4" />
          </g>
        </>
      )}
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
  tileMaxH,
}: {
  p: MotionValue<number>;
  span: [number, number];
  show: Show;
  index: number;
  children: React.ReactNode;
  /** MOBILE shelf clamp: short max-height (px string) that crops the closed cover to
   *  a compact tile and releases to full height on focus. "none" on desktop. */
  tileMaxH?: MotionValue<string>;
}) {
  const accent = show.accent;
  // Each tier's cover gets its own foil art, with richness + presence climbing
  // Classic → Prime Time → Elite, so the eye is drawn UP the ladder (the order we
  // want people to prefer). Elite is the premium special-occasion volume.
  const isElite = show.label === "Elite Edition";
  const coverVariant: "classic" | "prime" | "elite" = isElite
    ? "elite"
    : show.popular
      ? "prime"
      : "classic";
  // Art opacity escalates with tier: Classic faint & restrained, Prime Time more
  // present, Elite the boldest — visual weight reinforces the desirability order.
  const artOpacity = isElite ? 0.38 : show.popular ? 0.28 : 0.18;
  // COVER-READ DWELL: the closed cover holds fully shut for the first part of the
  // span so the audience can READ the cover (title, edition, and the cover art)
  // before anything moves. Elite has the most on its cover, so it dwells longer.
  // Only AFTER the dwell does the cover begin to swing open.
  const dwell = isElite ? 0.34 : 0.18;
  // The cover then opens SLOWLY (over the next chunk of the span), tracking the
  // scroll the whole way — every bit of scroll swings the board a little more, like
  // easing a real hardback open by hand. The rest of the span is the readable hold.
  const [fa, fb] = slice(span, dwell, dwell + 0.4);
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

  // Rich two-tone cover material. `matFrom` (luminous) and `matTo` (deep) come from
  // the show; we derive mid + deep shades for bevels/spine and the foil emblem ink.
  const matFrom = show.matFrom;
  const matTo = show.matTo;
  const coverDark = `color-mix(in srgb, ${matTo} 78%, ${accent})`; // mid shade for spine/bevel
  const coverDeep = `color-mix(in srgb, ${matTo} 88%, #000)`; // deepest — foil emblem ink bg
  const funBadge = index === 0 ? "Fun" : index === 1 ? "More Fun" : "Fun Like Crazy";

  return (
    <motion.div
      className="relative mx-auto max-w-[860px]"
      // Centred, long perspective: the CLOSED book faces the viewer flat (no
      // tilt) — only the cover swings in 3D as it opens. A long focal length keeps
      // the depth gentle and realistic instead of a hard, card-like skew.
      // `maxHeight` (mobile only) crops the closed cover into a short, readable tile
      // on the shelf and releases to full height on focus; overflow hidden keeps the
      // cropped tile clean (decorative page-edges are hidden in the compact state).
      style={{
        perspective: "2600px",
        perspectiveOrigin: "50% 45%",
        maxHeight: tileMaxH,
        overflow: tileMaxH ? "hidden" : undefined,
      }}
    >
      {/* Contact shadow — grounds the book on a surface (sits just under it). */}
      <span
        className="pointer-events-none absolute -bottom-5 left-1/2 -z-10 h-10 w-[88%] -translate-x-1/2 rounded-[50%] blur-2xl"
        style={{ background: "rgba(0,0,0,0.55)" }}
        aria-hidden
      />

      {/* PAGE-STACK EDGES — the visible block of pages, giving the book thickness.
          The block sits behind the page, offset down/right, so its head (top),
          fore-edge (right) and tail (bottom) read as a real stack of leaves whose
          outer corners are ROUNDED — like a real book block, not a hard slab. */}
      <span className="pointer-events-none absolute inset-0" aria-hidden>
        {/* head edge (top) — a slim page-stack sliver running along the top, so the
            book's top corners round off too instead of ending in a hard edge. */}
        <span
          className="absolute left-0 block"
          style={{
            top: `-${Math.round(PAGES * 0.45)}px`,
            right: `-${PAGES}px`,
            height: `${Math.round(PAGES * 0.45)}px`,
            backgroundImage: tailStripes,
            borderRadius: "10px 12px 0 0",
            boxShadow: "inset 0 2px 3px rgba(0,0,0,0.32), inset 0 -1px 0 rgba(255,255,255,0.45)",
          }}
        />
        {/* fore-edge (right side) — stacked-paper striations, lit at front. The
            outer corners are rounded so the page block curves like a real book. */}
        <span
          className="absolute block"
          style={{
            top: `-${Math.round(PAGES * 0.45)}px`,
            right: `-${PAGES}px`,
            height: `calc(100% + ${PAGES + Math.round(PAGES * 0.45)}px)`,
            width: `${PAGES}px`,
            backgroundImage: pageStripes,
            borderRadius: "0 12px 12px 0",
            boxShadow: "inset -2px 0 3px rgba(0,0,0,0.4), inset 1px 0 0 rgba(255,255,255,0.45)",
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
            borderRadius: "3px 12px 12px 4px",
            boxShadow: "inset 0 -2px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.45)",
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
            Naturally rounded board corners (square spine edge, rounder fore-edge
            corners like a real hardback), a deep accent material, a gold-foil
            emblem, title and edition line, a gilt double-rule frame, and a sheen. */}
        <span
          className="absolute inset-0 overflow-hidden backface-hidden"
          style={{
            // tighter radius on the spine (left) side, rounder on the fore-edge
            // (right) corners — the way a bound board curves away from the binding
            borderRadius: "3px 12px 12px 3px",
            // Rich, dimensional MATERIAL: a luminous top-left glow (a stage light
            // catching the board) over a diagonal matFrom→matTo blend, finished with
            // a deep bottom-right vignette. Layered gradients read far more premium
            // than a single hue fading to black.
            background: `
              radial-gradient(115% 85% at 22% 8%, color-mix(in srgb, ${matFrom} 72%, #fff) 0%, transparent 46%),
              radial-gradient(120% 120% at 92% 100%, ${matTo} 0%, transparent 60%),
              linear-gradient(135deg, ${matFrom} 0%, color-mix(in srgb, ${matFrom} 45%, ${matTo}) 42%, ${matTo} 100%)
            `,
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.28), inset 0 0 80px rgba(0,0,0,0.34), inset 7px 0 16px rgba(0,0,0,0.4)",
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

          {/* Per-tier foil cover art, floating behind the title. Richness +
              opacity climb Classic → Prime Time → Elite to lead the eye up the
              desirability ladder (a clean mic → a party star-burst → a crowned
              celebration). */}
          <span className="pointer-events-none absolute inset-0" style={{ opacity: artOpacity }}>
            <CoverArt variant={coverVariant} accent={accent} />
          </span>
          <span
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 74% 62% at 50% 56%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.48) 48%, rgba(0,0,0,0.08) 78%)",
            }}
            aria-hidden
          />
          <span
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "conic-gradient(from 210deg at 50% 18%, transparent 0deg, rgba(255,255,255,0.18) 18deg, transparent 36deg, transparent 70deg, rgba(255,255,255,0.14) 92deg, transparent 116deg, transparent 245deg, rgba(255,255,255,0.12) 268deg, transparent 292deg)",
              mixBlendMode: "screen",
            }}
            aria-hidden
          />

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
          <span
            className="pointer-events-none absolute inset-[12px] sm:inset-[18px]"
            style={{
              border: "2px solid rgba(255,232,158,0.72)",
              boxShadow:
                "inset 0 0 0 8px rgba(0,0,0,0.16), inset 0 0 34px rgba(255,210,63,0.1), 0 0 18px rgba(255,210,63,0.42)",
            }}
            aria-hidden
          />

          {/* Cover face — clear, glanceable choice copy. */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
            <span
              className="mb-5 inline-flex items-center gap-2 border border-[#f7e7a6]/50 bg-black/70 px-4 py-2 text-[12px] font-black uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur-sm md:text-sm"
              style={{ boxShadow: `0 0 22px color-mix(in srgb, ${accent} 50%, transparent)` }}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
              {funBadge}
            </span>
            {/* foil emblem medallion: a gold ring + the show's mark (★ for the
                crowd favourite, the volume numeral otherwise) — game-show energy */}
            <span
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-full text-[18px] font-black sm:h-14 sm:w-14 sm:text-xl"
              style={{
                background: GOLD,
                color: coverDeep,
                boxShadow:
                  "inset 0 1px 1px rgba(255,255,255,0.75), inset 0 -2px 3px rgba(0,0,0,0.35), 0 0 0 5px rgba(0,0,0,0.28), 0 0 26px rgba(255,210,63,0.62)",
              }}
            >
              {show.popular ? "★" : ROMAN[index] ?? index + 1}
            </span>

            <span
              className="text-[12px] font-bold uppercase tracking-[0.18em] sm:text-[13px]"
              style={{ ...GOLD_TEXT, opacity: 0.95 }}
            >
              {show.tag}
            </span>
            <span
              className="mt-3 text-[46px] font-bold leading-none tracking-[-0.02em] sm:text-[62px] md:text-[72px]"
              style={{
                fontFamily: "var(--font-inter-tight, var(--font-display))",
                ...GOLD_TEXT,
                filter: "drop-shadow(0 2px 0 rgba(0,0,0,0.75)) drop-shadow(0 8px 18px rgba(0,0,0,0.72))",
              }}
            >
              {show.label}
            </span>
            <span
              className="mt-4 block h-[2px] w-20 md:w-28"
              style={{ background: GOLD, boxShadow: "0 1px 0 rgba(0,0,0,0.4)" }}
            />
            {/* Value + price. On DESKTOP the book sits small in the shelf, so these
                are sized LARGE (md:) to stay readable at a glance before scrolling.
                On MOBILE the book is nearly full-size in a SHORT tile, so they stay
                modest (base) to fit without clipping the name. */}
            <span className="mt-3 max-w-[26ch] text-[15px] font-bold leading-snug text-white md:mt-4 md:text-[28px] [text-shadow:0_3px_12px_rgba(0,0,0,0.8)]">
              {show.value}
            </span>
            <span
              className="mt-3 inline-flex items-baseline gap-1.5 border border-[#f7e7a6]/55 bg-black/60 px-4 py-2 text-[15px] font-black text-white shadow-lg backdrop-blur-sm md:mt-7 md:px-6 md:py-3 md:text-[30px]"
              style={{
                boxShadow:
                  "inset 0 0 18px rgba(255,210,63,0.12), 0 0 24px rgba(0,0,0,0.45), 0 0 18px rgba(255,210,63,0.18)",
              }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/65 md:text-[16px]">From</span>
              ₹{show.fromPrice.toLocaleString("en-IN")}
              <span className="text-[11px] font-semibold text-white/65 md:text-[17px]">/ person</span>
            </span>
            <span className="mt-5 text-[11px] font-black uppercase tracking-[0.2em] text-white/75 md:text-xs">
              {index === 0 ? "Easy Crowd Win" : index === 1 ? "Party Favourite" : "All-Out Celebration"}
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
    </motion.div>
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
  focus,
  zoom,
  isMobile,
}: {
  show: Show;
  index: number;
  span: [number, number];
  p: MotionValue<number>;
  /** continuous camera position (0=Classic, 1=Prime, 2=Elite) */
  focus: MotionValue<number>;
  /** 0 = the three-book "shelf" view (zoomed out); 1 = zoomed-in travel mode */
  zoom: MotionValue<number>;
  isMobile: boolean;
}) {
  // CAMERA — every book has ONE uniform "shelf" home (small, fixed slot, same size
  // for all three). Only the book currently being FOCUSED lifts OUT of the shelf to
  // centre + full size; the instant it stops being focused it returns to that exact
  // uniform shelf state. So at any rest the non-focused books are all the SAME size,
  // neatly in the row — never odd in-between scales floating around. A book's lift
  // is driven by `proximity` (1 when it's the focused book, 0 once it's ≥1 step
  // away), and the whole thing is gated by `zoom` so the establish "shelf" reads
  // first. Zoom-in and zoom-out trace the same path (proximity rises then falls).
  // Shelf layout is RESPONSIVE:
  //  • Desktop: the three books sit side by side (horizontal row), fairly big and
  //    not too far apart so the cover text is readable; step capped at 31vw so the
  //    3-book row always fits.
  //  • Mobile: a row of three would be illegible, so it's a one-card-at-a-time
  //    horizontal CAROUSEL — each book near full width (88vw), the focused one
  //    centred and the others stepped off-screen left/right (112vw apart) and
  //    faded out, so only one big readable cover shows at a time.
  // Desktop uses portrait show cards: narrower, taller, and nearly full shelf
  // scale so the lineup reads like three premium posters instead of thumbnails.
  const SHELF_SCALE = isMobile ? 0.98 : 0.9;
  const stepX = "31vw";
  // Vertical step between stacked mobile shelf books (vh). 23vh × 2 slots = 46vh
  // total span, centred — keeps the three SHORT covers evenly grouped under the
  // heading with clear gaps and no big dead space at the bottom.
  const SHELF_Y = 0;
  // Mobile shelf tile height (px): short so three stack with gaps, showing the big
  // centred NAME at full size. Grows past any page's height once focused (lift→1) so
  // the full reading page shows. (Wrapper keeps overflow hidden the whole time; the
  // large focused height simply reveals everything — no JS state needed.)
  const SHELF_TILE_H = 620;
  const FOCUS_TILE_H = 2400; // safely taller than any open mobile page
  const offset = useTransform(focus, (f) => index - f);
  // proximity: 1 only when this is the focused book, easing to 0 by one step away.
  const proximity = useTransform(offset, (o) => Math.max(0, 1 - Math.min(Math.abs(o), 1)));
  const slot = index - 1; // -1 / 0 / +1
  // On mobile, nudge the whole trio DOWN a little (the wrapper centres on 50%, but
  // the heading sits above) so the three tiles read as vertically balanced in the
  // space below the heading rather than leaving a big empty band at the bottom.
  const SHELF_Y_BASE = isMobile ? 5 : 0; // vh
  const shelfY = SHELF_Y_BASE + slot * SHELF_Y; // vh

  // Lift = how much this book is out of the shelf toward centre-focus, gated by the
  // establish zoom-in. (At rest, only the focused book has lift > 0.)
  const lift = useTransform([proximity, zoom], ([pr, z]: number[]) => pr * z);

  // Horizontal shelf slot in px (8px gaps); on mobile books stack so x stays 0.
  const desktopX = useTransform(lift, (l) => `calc(${slot} * ${stepX} * ${1 - l})`);
  const mobileX = useTransform(offset, (o) => `${o * 112}vw`);
  const x = isMobile ? mobileX : desktopX;
  const y = useTransform(lift, (l) => `${shelfY * (1 - l)}vh`); // shelf slot → centre
  const scale = useTransform(lift, (l) => SHELF_SCALE + (1 - SHELF_SCALE) * l); // shelf size → full
  // MOBILE: closed shelf tile is SHORT (crops the tall page beneath to a compact
  // landscape cover with the big readable name), expanding to full height as the
  // book is focused. Quick ramp (l*2) so the page is fully revealed early in focus.
  const maxHeight = useTransform(lift, (l) =>
    isMobile
      ? `${SHELF_TILE_H + (FOCUS_TILE_H - SHELF_TILE_H) * Math.min(1, l * 2)}px`
      : "none"
  );
  // Receded (non-focused) books sit slightly back in depth; the focused one comes
  // fully forward. Uniform because every shelf book shares the same resting z.
  const z3d = useTransform(lift, (l) => -260 * (1 - l));
  const opacity = useTransform([lift, zoom, p], ([l, z, prog]: number[]) => {
    // During the ESTABLISH shelf (zoom→0) all three are visible together. Once
    // zoomed in to read (zoom→1), the non-focused books fade WAY back (to a faint
    // hint) so they never distract the focused page; the focused book is full
    // strength. So: shelf floor when establishing, near-invisible when reading.
    const shelfFloor = isMobile ? 0 : 0.85; // mobile shows one big card at a time
    const readFloor = 0; // fully gone while reading another book — no distraction
    const floor = shelfFloor + (readFloor - shelfFloor) * z;
    const base = floor + (1 - floor) * l;
    // Entrance gate: the books fade IN as the intro headline leaves, so they don't
    // clutter behind the intro copy.
    const enter = Math.max(0, Math.min(1, (prog - INTRO_SPAN[1] * 0.7) / (ESTABLISH_SPAN[0] - INTRO_SPAN[1] * 0.7 + 0.02)));
    return base * enter;
  });

  // The "fun ladder" carries onto the OPEN PAGE too: a faint tier motif sits behind
  // the copy, escalating Classic → Prime Time → Elite (fun → more fun → extra fun),
  // so swiping through visibly ramps the energy. Kept very low-opacity so it adds
  // atmosphere without ever competing with the readable spec content.
  const isEliteShow = show.label === "Elite Edition";
  const pageVariant: "classic" | "prime" | "elite" = isEliteShow
    ? "elite"
    : show.popular
      ? "prime"
      : "classic";
  const pageArtOpacity = isEliteShow ? 0.16 : show.popular ? 0.11 : 0.06;

  // Content write-on timing. Like a real book the page is ALREADY printed under
  // the cover — so the content writes on while the closed cover (which dwells, then
  // swings open) still hides the page, and is FULLY there by ~46%, before any cover
  // finishes clearing. The cover therefore lifts to reveal a page that's already
  // written, never a blank black page. The open page then holds put for the rest of
  // the span; the snap rests inside that hold.
  const tagAt = slice(span, 0.14, 0.24);
  const nameAt = slice(span, 0.18, 0.3);
  const underlineAt = slice(span, 0.26, 0.36);
  const valueAt = slice(span, 0.3, 0.4);
  const pitchAt = slice(span, 0.36, 0.46);

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
      className="relative mx-auto min-h-[620px] max-w-[390px] overflow-hidden border border-white/10 px-6 py-8 text-center sm:px-8 md:min-h-[700px] md:max-w-[560px] md:px-10 md:py-12"
      // Square at the spine (left), rounded at the fore-edge (right) so the open
      // page curves to match the rounded cover + page-block corners.
      style={{ borderLeft: `3px solid ${show.accent}`, borderRadius: "2px 12px 12px 2px" }}
    >
        {/* Page background on its OWN layer (z -20) so the tier motif can sit ABOVE
            it but BELOW the copy. */}
        <span className="pointer-events-none absolute inset-0 -z-20 bg-[#101213]" aria-hidden />
        {/* Faint tier motif behind the copy — the escalating "fun" carried onto the
            open page (Classic → Prime Time → Elite): fun → more fun → extra fun.
            z -10 keeps it above the page bg but under the text; very low opacity so
            it never fights the spec content. */}
        <span className="pointer-events-none absolute inset-0 -z-10" style={{ opacity: pageArtOpacity }} aria-hidden>
          <CoverArt variant={pageVariant} accent={show.accent} />
        </span>
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
      // Each book is centred in the stage; the camera transforms move it into /
      // out of frame. As focus leaves, the book ZOOMS BACK OUT (recedes in depth
      // via z + shrinks) — the mirror of how it zoomed in. Books nearer the focus
      // paint above the rest.
      className="absolute left-1/2 top-1/2 w-[min(88vw,390px)] -translate-x-1/2 -translate-y-1/2 md:w-[min(32vw,560px)]"
      style={{
        x,
        y,
        z: z3d,
        scale,
        opacity,
        maxHeight,
        overflow: "hidden",
        transformStyle: "preserve-3d",
        zIndex: 10 + index,
      }}
    >
      {/* Every show flips open like a real book — the cover carries the show's
          name, and turns off the spine on scroll to reveal the panel beneath.
          On mobile the closed cover is cropped to a short readable tile (tileMaxH). */}
      <BookTurn p={p} span={span} show={show} index={index} tileMaxH={isMobile ? maxHeight : undefined}>
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
