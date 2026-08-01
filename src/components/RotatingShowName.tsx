"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Real game & comedy shows India grew up watching — these cycle through the
 * hero headline. We mix the big national quiz/comedy hits with regional-language
 * game shows so every audience sees a familiar name.
 */
const SHOWS = [
  // National — quiz & comedy
  "KBC", // Hindi — quiz
  "The Kapil Sharma Show", // Hindi — comedy
  "Cash", // Hindi — quiz
  "Comedy Nights", // Hindi — comedy
  // Regional-language game shows (official KBC adaptations)
  "Meelo Evaru Koteeswarudu", // Telugu — KBC (quiz)
  "Kannadada Kotyadhipati", // Kannada — KBC (quiz)
  "Ningalkkum Aakaam Kodeeshwaran", // Malayalam — KBC (quiz)
];

const INTERVAL_MS = 3000;
const EASE = [0.22, 1, 0.36, 1] as const;

const GRADIENT = {
  backgroundImage:
    "linear-gradient(92deg, var(--gs-sky-bright) 0%, var(--gs-violet) 45%, var(--gs-magenta-soft) 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
} as const;

/**
 * A single word in the hero headline that "magically" swaps to a real game
 * show name every few seconds. The current name rolls up out of view like a
 * slot reel while the next one rolls up into place; the wrapper width tweens so
 * the surrounding line ("…on TV.") glides instead of snapping.
 *
 * Implementation note: there is exactly ONE visible animated word at a time
 * (re-mounted via `key`), so there's never a blank frame. A hidden sizer keeps
 * the wrapper sized to the current word, and the wrapper width is animated.
 */
export function RotatingShowName() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SHOWS.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduce]);

  // Reduced motion: just show the first name, no animation.
  if (reduce) {
    return (
      <span className="bg-clip-text text-transparent" style={GRADIENT}>
        {SHOWS[0]}
      </span>
    );
  }

  return (
    <motion.span
      layout
      transition={{ layout: { duration: 0.5, ease: EASE } }}
      className="relative inline-grid overflow-hidden align-baseline leading-tight"
    >
      {/* Invisible sizer (cell 1,1): keeps the wrapper exactly as wide & tall as
          the current word so `layout` can tween the width as words change. */}
      <span
        aria-hidden
        className="col-start-1 row-start-1 whitespace-nowrap"
        style={{ visibility: "hidden" }}
      >
        {SHOWS[index]}
      </span>

      {/* The one visible word (cell 1,1). Re-mounting on `key` change makes it
          roll up from below each cycle. Always exactly one — never blank. */}
      <motion.span
        key={index}
        initial={{ y: "115%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.5, ease: EASE }}
        className="col-start-1 row-start-1 whitespace-nowrap bg-clip-text text-transparent"
        style={GRADIENT}
      >
        {SHOWS[index]}
      </motion.span>
    </motion.span>
  );
}
