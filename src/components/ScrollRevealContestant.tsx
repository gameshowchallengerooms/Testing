"use client";

import { type RefObject } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

/* The headline, ONE WORD per line, stacked:
     Now,
     you're
     the
     contestant!
   Each word reveals in turn, line by line, as the pinned hero is scrolled. */
const LINES = [["Now,"], ["you're"], ["the"], ["contestant!"]];
const WORDS = LINES.flat();

/**
 * A single word, scroll-scrubbed through a cinematic reveal that layers the
 * techniques used by the best-in-class scroll sites (Linear / Apple / awards):
 *
 *  • brightness  — dim → full white as its slice of scroll passes
 *  • blur→clarity — defocused → razor sharp
 *  • masked slide-up — rises from behind a clip mask (the word is wrapped in an
 *    overflow-hidden box, so it emerges rather than just moving)
 *  • 3D settle   — a subtle rotateX flip, like a departures board, on entry
 *
 * All driven off a single shared `progress` MotionValue, so scrolling up
 * cleanly reverses every word. Only GPU-composited props (opacity, transform,
 * filter) are animated, so it stays at 60fps.
 */
function RevealWord({
  word,
  progress,
  index,
  total,
}: {
  word: string;
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  // Each word owns a slice of the 0→1 timeline, with overlap so the reveal
  // reads as a continuous sweep rather than discrete steps.
  const span = 1 / total;
  const start = index * span;
  const end = Math.min(start + span * 1.6, 1);

  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  const filter = useTransform(
    progress,
    [start, end],
    ["blur(12px)", "blur(0px)"]
  );
  const y = useTransform(progress, [start, end], ["110%", "0%"]);
  const rotateX = useTransform(progress, [start, end], [-78, 0]);

  return (
    // Mask: overflow-hidden so the word emerges from behind an invisible edge.
    <span
      className="relative inline-block overflow-hidden align-bottom"
      style={{ marginRight: "0.28em", perspective: 600 }}
    >
      <motion.span
        className="inline-block"
        style={{
          opacity,
          filter,
          y,
          rotateX,
          transformOrigin: "50% 100%",
          willChange: "transform, opacity, filter",
        }}
      >
        {word}
      </motion.span>
    </span>
  );
}

/**
 * The big white "Now, you're / the contestant!" headline that reveals
 * word-by-word as the user scrolls through the pinned hero.
 *
 * `scrollRef` is the tall outer wrapper the hero is pinned (sticky) inside of.
 * We measure scroll progress across it and smooth it with a spring so the
 * scrub feels fluid rather than locked 1:1 to the wheel.
 */
export function ScrollRevealContestant({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLElement | null>;
}) {
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  // Light spring-smoothing only. A soft spring (low stiffness) lags the wheel so
  // hard the reveal feels STUCK at the top — the first word won't move until
  // you've scrolled well past it. A stiffer, lighter-damped spring tracks the
  // scroll almost 1:1 (just enough smoothing to debounce jitter), so
  // "Today, / you're" begin revealing from the very first scroll.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 320,
    damping: 40,
    restDelta: 0.0005,
  });

  // IMPORTANT — all three hero effects must finish while the header is still
  // PINNED. The section is 240vh tall and the sticky header is 1 viewport tall,
  // so the header unpins once 140vh has scrolled, i.e. at scroll progress ~0.58
  // (= (240-100)/240). Past that the header scrolls away with the page.
  //
  // We spread the sequence ACROSS that whole pinned window (0 → ~0.55) so every
  // bit of scroll advances something — no dead zone where you scroll but the
  // text appears "stuck" / only shows up later. The headline owns the bulk of
  // it. Phase 1 (this headline): 0 → 0.30.
  const progress = useTransform(smooth, [0, 0.3], [0, 1]);

  // Bold (not italic), large and dominant. The headline is four stacked
  // single-word lines, so its total height is ~4 × font-size × line-height —
  // which on big screens overran one viewport and pushed content off-screen.
  // Size the type to the viewport HEIGHT with clamp(): it scales down on short
  // screens so all four lines + the surrounding copy always fit in one screen,
  // while clamping to a sane min/max. Tighter line-height keeps it compact.
  const lineClass =
    "block font-black text-white tracking-tight leading-[1.06] text-[clamp(40px,11vh,104px)]";
  const fontStyle = { textShadow: "0 6px 40px rgba(0,0,0,0.45)" } as const;

  // Reduced motion: render the final state, no scroll scrubbing.
  if (reduce) {
    return (
      <span
        className={cn(
          "hero-enter hero-enter-4 mt-[clamp(0.25rem,1.5dvh,0.75rem)] block",
          lineClass
        )}
        style={fontStyle}
      >
        Now,
        <br />
        you&apos;re
        <br />
        the
        <br />
        contestant!
      </span>
    );
  }

  // Running word index across all lines so each word keeps its own timeline slot.
  let wordIndex = 0;
  return (
    <span
      className="hero-enter hero-enter-4 mt-[clamp(0.25rem,1.5dvh,0.75rem)] block"
      style={fontStyle}
    >
      {LINES.map((line, li) => (
        <span key={li} className={lineClass}>
          {line.map((w) => {
            const index = wordIndex++;
            return (
              <RevealWord
                key={w}
                word={w}
                index={index}
                total={WORDS.length}
                progress={progress}
              />
            );
          })}
        </span>
      ))}
    </span>
  );
}
