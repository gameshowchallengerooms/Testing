"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
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

const TRACK_VIEWPORTS = 9; // screens of scroll the whole story spans

/* ── Content ─────────────────────────────────────────────────────────────── */

interface Show {
  label: string;
  tag: string;
  /** rounds + duration framed as value, not spec */
  value: string;
  bestFor: string;
  pitch: string;
  features: string[];
  /** accent solid + gradient identity */
  accent: string;
  gradient: string;
  popular?: boolean;
}

// Sold UP — Prime Time first as the aspiration, then down. Copy from the
// conversion pass: each show is a deliberate, desirable choice; none is "cheap".
const shows: Show[] = [
  {
    label: "Prime Time",
    tag: "The full experience",
    value: "5 huge rounds across 75 unforgettable minutes",
    bestFor: "For groups who came to go all in.",
    pitch:
      "The complete journey — lights up, buzzers blazing, every round bigger than the last, building to a finale you'll talk about for weeks. This is the one you came all this way for.",
    features: ["Buzzer face-offs", "Wheel-of-fortune spins", "Head-to-head grand finale"],
    accent: "#FC19ED",
    gradient: "linear-gradient(135deg, #7C5CFC, #FC19ED)",
  },
  {
    label: "Prime Classic",
    tag: "Most booked",
    value: "4 packed rounds across a perfect hour",
    bestFor: "For crews who want the sweet spot.",
    pitch:
      "The crowd favourite for a reason — all the buzzers, laughs and rivalry, dialled to just the right length. Maximum fun, zero filler.",
    features: ["Buzzer face-offs", "Team rivalry rounds", "Champion crowning"],
    accent: "#FFD23F",
    gradient: "linear-gradient(135deg, #FFD23F, #FFB020)",
    popular: true,
  },
  {
    label: "The Classic",
    tag: "Quick & punchy",
    value: "3 fast rounds across 45 electric minutes",
    bestFor: "For first-timers & tight schedules.",
    pitch:
      "Short on time, big on energy — a sharp, fast-paced taste of the studio with all the buzzers and bragging rights baked in. Walk in curious, walk out a champion.",
    features: ["Lightning buzzer rounds", "Live studio thrills", "Champion crowning"],
    accent: "#22D3A5",
    gradient: "linear-gradient(135deg, #22D3A5, #14B8A6)",
  },
];

/* Each beat owns a slice of the 0→1 scroll timeline. Intro + 3 shows + payoff. */
const INTRO_SPAN: [number, number] = [0.0, 0.12];
const SHOW_SPANS: [number, number][] = [
  [0.14, 0.4],
  [0.42, 0.62],
  [0.64, 0.84],
];
const PAYOFF_SPAN: [number, number] = [0.86, 1];

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
  useEffect(() => {
    const measure = () => setViewportH(window.innerHeight);
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

  const trackHeight =
    reduce || viewportH === null
      ? reduce
        ? "auto"
        : `${TRACK_VIEWPORTS * 100}vh`
      : `${Math.round(viewportH * TRACK_VIEWPORTS)}px`;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // Linear-tracking scrub (light spring only to glide a flick), per research §3.
  const p = useSpring(scrollYProgress, { stiffness: 300, damping: 44, restDelta: 0.0004 });

  const hintOpacity = useTransform(p, [0, 0.04], [1, 0]);

  if (reduce) return <StaticFallback />;

  return (
    <section ref={sectionRef} className="relative w-full bg-black" style={{ height: trackHeight }}>
      <div
        className="sketchpad sticky top-0 flex w-full items-center justify-center overflow-hidden"
        style={{ height: "100svh", minHeight: "560px" }}
      >
        {/* Shared SVG defs (rough-ink filter + gradients) defined ONCE — filter
            and gradient refs resolve document-wide by id, so we avoid duplicate
            ids across the per-beat SVGs. */}
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <SketchDefs />
        </svg>

        {/* LAYER 1 (art-back): one ambient ink flourish, far behind the text and
            heavily dimmed — it never crosses a label because the copy sits on its
            own scrim above it. */}
        <BackdropArt p={p} />

        {/* LAYER 2 (DOM text): all beats stack centred and cross-fade in place. */}
        <div className="relative z-10 mx-auto w-full max-w-[1080px] px-6">
          <IntroBeat p={p} />
          {shows.map((show, i) => (
            <ShowBeat key={show.label} show={show} span={SHOW_SPANS[i]} p={p} />
          ))}
          <PayoffBeat p={p} />
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
function BackdropArt({ p }: { p: MotionValue<number> }) {
  return (
    <svg
      viewBox="0 0 1200 800"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.18]"
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
    </svg>
  );
}

/* ── Beats ───────────────────────────────────────────────────────────────── */

/** A beat container that fades + rises IN over its first fifth and OUT over its
 *  last fifth, scrubbed by scroll. Beats overlap so one is always present. */
function useBeatStyle(p: MotionValue<number>, [a, b]: [number, number]) {
  const inEnd = a + (b - a) * 0.2;
  const outStart = a + (b - a) * 0.8;
  const opacity = useTransform(p, [a, inEnd, outStart, b], [0, 1, 1, 0]);
  const y = useTransform(p, [a, inEnd, outStart, b], [44, 0, 0, -44]);
  return { opacity, y };
}

function IntroBeat({ p }: { p: MotionValue<number> }) {
  const style = useBeatStyle(p, INTRO_SPAN);
  return (
    <motion.div className="absolute inset-x-6 top-1/2 -translate-y-1/2 text-center" style={style}>
      <p className="text-sm font-semibold uppercase tracking-[0.32em] text-white/55">Choose your show</p>
      <h2
        className="mx-auto mt-4 max-w-[16ch] text-4xl font-medium leading-[1.05] tracking-tight text-white md:text-7xl"
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
      <p className="mx-auto mt-5 max-w-[42ch] text-base text-white/65 md:text-lg">
        Three separate live shows — pick the one that fits your crew. Each builds
        to the same big finish: one champion, one night you&apos;ll never forget.
      </p>
    </motion.div>
  );
}

/** One show beat: number + clock-free clean layout, big name, value line, pitch,
 *  feature ticks, and a self-drawing underline (the only stroke near text, and
 *  it sits in the name's own keep-out lane). */
function ShowBeat({ show, span, p }: { show: Show; span: [number, number]; p: MotionValue<number> }) {
  const style = useBeatStyle(p, span);

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
      {/* scrim pad behind copy so any ambient backdrop ink stays readable */}
      <div className="mx-auto max-w-[760px] rounded-[2rem] bg-black/55 px-6 py-8 text-center backdrop-blur-sm md:px-10 md:py-10">
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
        <motion.p className="mt-4 text-lg font-semibold text-white md:text-2xl" style={value}>
          {show.value}
        </motion.p>
        <motion.p className="mt-1 text-sm uppercase tracking-[0.18em] md:text-base" style={{ color: show.accent, ...value }}>
          {show.bestFor}
        </motion.p>

        {/* pitch */}
        <motion.p className="mx-auto mt-5 max-w-[52ch] text-base leading-relaxed text-white/75 md:text-lg" style={pitch}>
          {show.pitch}
        </motion.p>

        {/* features */}
        <motion.ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3" style={pitch}>
          {show.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-white/80 md:text-base">
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

function PayoffBeat({ p }: { p: MotionValue<number> }) {
  const style = useBeatStyleEnd(p, PAYOFF_SPAN);
  const line = useWriteOn(p, slice(PAYOFF_SPAN, 0.0, 0.4));
  const ctaOpacity = useTransform(p, slice(PAYOFF_SPAN, 0.4, 0.7), [0, 1], { clamp: true });
  const ctaY = useTransform(p, slice(PAYOFF_SPAN, 0.4, 0.7), [20, 0], { clamp: true });

  return (
    <motion.div className="absolute inset-x-6 top-1/2 -translate-y-1/2 text-center" style={style}>
      <motion.h2
        className="mx-auto max-w-[20ch] text-3xl font-medium leading-tight tracking-tight text-white md:text-5xl"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-1.5px", ...line }}
      >
        Whichever show you choose, you walk out with one{" "}
        <span
          style={{
            background: "linear-gradient(90deg,#FFD23F,#FC19ED)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          champion
        </span>{" "}
        — and a night your group will never forget.
      </motion.h2>
      <motion.div className="mt-8 flex flex-col items-center" style={{ opacity: ctaOpacity, y: ctaY }}>
        <Link
          href="https://gameshowchallengerooms.com/"
          className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white transition-transform hover:scale-[1.04]"
          style={{ background: "linear-gradient(135deg, #7C5CFC, #FC19ED)" }}
        >
          Book your show
          <ArrowUpRight size={18} />
        </Link>
        <p className="mt-3 text-sm text-white/55">
          From <span className="font-semibold text-white">₹750</span>/head, taxes in — shows book out fast.
        </p>
      </motion.div>
    </motion.div>
  );
}

/* Payoff beat only needs to fade IN (it's the end), so a dedicated style. */
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
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-white/55">Choose your show</p>
          <h2
            className="mx-auto mt-4 max-w-[18ch] text-3xl font-medium leading-tight tracking-tight text-white md:text-5xl"
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
          <p className="mx-auto mt-4 max-w-[46ch] text-base text-white/65 md:text-lg">
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
              <p className="mt-2 text-base font-semibold text-white">{s.value}</p>
              <p className="mt-1 text-sm uppercase tracking-[0.16em]" style={{ color: s.accent }}>{s.bestFor}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{s.pitch}</p>
              <ul className="mt-4 space-y-2">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/80">
                    <Check size={14} strokeWidth={3} style={{ color: s.accent }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p
            className="mx-auto max-w-[24ch] text-2xl font-medium tracking-tight text-white md:text-3xl"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-1px" }}
          >
            Whichever you choose, you walk out with one{" "}
            <span
              style={{
                background: "linear-gradient(90deg,#FFD23F,#FC19ED)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              champion
            </span>
            .
          </p>
          <Link
            href="https://gameshowchallengerooms.com/"
            className="mt-7 inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white"
            style={{ background: "linear-gradient(135deg, #7C5CFC, #FC19ED)" }}
          >
            Book your show
            <ArrowUpRight size={18} />
          </Link>
          <p className="mt-3 text-sm text-white/55">
            From <span className="font-semibold text-white">₹750</span>/head, taxes in.
          </p>
        </div>
      </div>
    </section>
  );
}
