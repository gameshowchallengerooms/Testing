"use client";

import { type RefObject, useMemo } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

/* The supporting line. We keep the emphasis words ("host", "challenges",
   "buzzer", "stars") so they can pop brightest, but the fill runs across every
   word. */
const TEXT =
  "Feel the excitement — live host, team challenges, cheers, and a buzzer in your hand. Bring your friends and compete like the stars you watched on TV.";

/* Brand gradient stops the lit words sweep through, matching the hero accent.
   Each word lands on its own slice so the finished paragraph reads as one
   continuous blue → purple → pink sweep (Apple "iPhone 14 Pro" style), while
   the per-word timing gives the Linear-style left-to-right fill. */
/* Interpolated in JS by `hexToRgb` below, so these MUST stay literal hex — a
   `var(--gs-*)` reference can't be parsed with parseInt and would render the
   whole paragraph grey. Mirrors the --gs-sky → --gs-pink-soft ramp in
   globals.css; keep the two in sync if that changes. */
const GRADIENT_STOPS = ["#9FC4FF", "#1FA2FF", "#7C5CFC", "#FF35E5", "#FFA8F0"];
const DIM = "rgba(255,255,255,0.18)";

/** Linear interpolate across the gradient stops at position t (0→1). */
function colorAt(t: number): string {
  const clamped = Math.min(Math.max(t, 0), 1);
  const seg = clamped * (GRADIENT_STOPS.length - 1);
  const i = Math.min(Math.floor(seg), GRADIENT_STOPS.length - 2);
  const f = seg - i;
  const a = hexToRgb(GRADIENT_STOPS[i]);
  const b = hexToRgb(GRADIENT_STOPS[i + 1]);
  const mix = (x: number, y: number) => Math.round(x + (y - x) * f);
  return `rgb(${mix(a[0], b[0])}, ${mix(a[1], b[1])}, ${mix(a[2], b[2])})`;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * One word that scroll-scrubs from dim → its bright gradient color, with a
 * faint upward drift, as its slice of the timeline passes. Only `color` and
 * `transform`/`opacity` animate — both GPU-friendly — so it stays smooth.
 */
function FillWord({
  word,
  emphasis,
  progress,
  index,
  total,
}: {
  word: string;
  emphasis: boolean;
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  const span = 1 / total;
  const start = index * span;
  const end = Math.min(start + span * 2.2, 1); // overlap → smooth sweep

  // The lit color for this word: its position along the gradient sweep.
  const litColor = colorAt(index / Math.max(total - 1, 1));

  const color = useTransform(progress, [start, end], [DIM, litColor]);
  const opacity = useTransform(progress, [start, end], [0.5, 1]);
  const y = useTransform(progress, [start, end], ["0.18em", "0em"]);

  // The word animates as an inline-block (needed for the y transform), but the
  // space between words is a separate normal text node so it can NEVER collapse
  // — that's what made the words run together before.
  return (
    <>
      <motion.span
        className="inline-block"
        style={{
          color,
          opacity,
          y,
          fontWeight: emphasis ? 700 : undefined,
          willChange: "color, transform, opacity",
        }}
      >
        {word}
      </motion.span>
      <span> </span>
    </>
  );
}

/**
 * The supporting paragraph that fills in word-by-word — dim → bright brand
 * gradient — as the pinned hero is scrolled. A different, complementary scroll
 * effect to the headline above it (which uses a masked 3D word reveal).
 *
 * References: Apple iPhone 14 Pro gradient-on-scroll + Linear's per-word fill.
 */
export function ScrollFillParagraph({
  scrollRef,
  className,
}: {
  scrollRef: RefObject<HTMLElement | null>;
  className?: string;
}) {
  const reduce = useReducedMotion();

  const words = useMemo(() => {
    const EMPHASIS = new Set(["host,", "challenges,", "buzzer", "stars"]);
    return TEXT.split(" ").map((w) => ({ word: w, emphasis: EMPHASIS.has(w) }));
  }, []);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  // Snappy spring so the fill tracks the wheel instead of lagging behind it.
  // (Kept identical to the headline's spring so all hero phases scrub in sync.)
  const smooth = useSpring(scrollYProgress, {
    stiffness: 320,
    damping: 40,
    restDelta: 0.0005,
  });

  // Phase 2, sequenced AFTER the headline (0–0.30) and BEFORE the gold pill
  // border (0.44–0.55). Spread across the PINNED window (header unpins at ~0.58
  // for the 240vh track) so the page never scrolls on mid-effect, and so there's
  // no dead scroll. See the note in ScrollRevealContestant for the 0.58 math.
  const progress = useTransform(smooth, [0.3, 0.44], [0, 1]);

  if (reduce) {
    // Static, fully-lit white version for reduced motion.
    return <p className={className}>{TEXT}</p>;
  }

  return (
    <p className={className} aria-label={TEXT}>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <FillWord
            key={`${w.word}-${i}`}
            word={w.word}
            emphasis={w.emphasis}
            index={i}
            total={words.length}
            progress={progress}
          />
        ))}
      </span>
    </p>
  );
}
