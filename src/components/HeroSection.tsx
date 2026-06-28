"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

function BulbStrip({ className }: { className?: string }) {
  const bulbs = Array.from({ length: 28 });
  const colors = ["#FFD23F", "#FF2E4D", "#147EFF", "#22D3A5"];
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {bulbs.map((_, i) => (
        <span
          key={i}
          className="animate-bulb h-2 w-2 rounded-full"
          style={{
            color: colors[i % colors.length],
            background: colors[i % colors.length],
            animationDelay: `${(i % 7) * 0.13}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Headline word reveal ────────────────────────────────────────────────────

const WORDS = ["Tonight,", "you're", "our", "celebrity."];

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
  const span = 1 / total;
  const start = index * span;
  const end = Math.min(start + span * 1.6, 1);

  const opacity = useTransform(progress, [start, end], [0.08, 1]);
  const filter = useTransform(progress, [start, end], ["blur(10px)", "blur(0px)"]);
  const y = useTransform(progress, [start, end], ["100%", "0%"]);

  return (
    <span className="relative inline-block overflow-hidden align-bottom" style={{ perspective: 600 }}>
      <motion.span
        className="inline-block"
        style={{ opacity, filter, y, willChange: "transform, opacity, filter" }}
      >
        {word}
      </motion.span>
    </span>
  );
}

// ─── Fill paragraph ──────────────────────────────────────────────────────────

const PARA_TEXT =
  "Feel the excitement — live host, team challenges, cheers, and a buzzer in your hand. Bring your friends and compete like the stars you watched on TV.";
const EMPHASIS = new Set(["host,", "challenges,", "buzzer", "stars"]);
const GRADIENT = ["#9FC4FF", "#1FA2FF", "#7C5CFC", "#FF35E5", "#FFA8F0"];

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function colorAt(t: number) {
  const clamped = Math.min(Math.max(t, 0), 1);
  const seg = clamped * (GRADIENT.length - 1);
  const i = Math.min(Math.floor(seg), GRADIENT.length - 2);
  const f = seg - i;
  const a = hexToRgb(GRADIENT[i]);
  const b = hexToRgb(GRADIENT[i + 1]);
  const mix = (x: number, y: number) => Math.round(x + (y - x) * f);
  return `rgb(${mix(a[0], b[0])},${mix(a[1], b[1])},${mix(a[2], b[2])})`;
}

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
  const end = Math.min(start + span * 2.2, 1);
  const litColor = colorAt(index / Math.max(total - 1, 1));
  const color = useTransform(progress, [start, end], ["rgba(255,255,255,0.18)", litColor]);
  const opacity = useTransform(progress, [start, end], [0.5, 1]);

  return (
    <>
      <motion.span
        className="inline-block"
        style={{ color, opacity, fontWeight: emphasis ? 700 : undefined }}
      >
        {word}
      </motion.span>
      <span> </span>
    </>
  );
}

// ─── Gold pill border draw ───────────────────────────────────────────────────

/**
 * Build an SVG path for a rounded rectangle, starting at the top-center so the
 * stroke draws clockwise from the top — the most natural "draw on" direction.
 */
function roundedRectPath(x: number, y: number, w: number, h: number, r: number): string {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  return [
    `M ${x + w / 2} ${y}`,
    `H ${x + w - radius}`,
    `A ${radius} ${radius} 0 0 1 ${x + w} ${y + radius}`,
    `V ${y + h - radius}`,
    `A ${radius} ${radius} 0 0 1 ${x + w - radius} ${y + h}`,
    `H ${x + radius}`,
    `A ${radius} ${radius} 0 0 1 ${x} ${y + h - radius}`,
    `V ${y + radius}`,
    `A ${radius} ${radius} 0 0 1 ${x + radius} ${y}`,
    `Z`,
  ].join(" ");
}

function GoldPill({ progress }: { progress: MotionValue<number> }) {
  const draw = useTransform(progress, [0, 1], [0, 1]);

  // Measure the real pill so the border path matches it exactly — no stretching,
  // so the rounded corners and stroke stay crisp at any size (phone → desktop).
  const pillRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const node = pillRef.current;
    if (!node) return;
    const update = () => setSize({ w: node.offsetWidth, h: node.offsetHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const STROKE = 2;
  const inset = STROKE / 2;
  const r = size.h / 2;
  const rectPath =
    size.w && size.h
      ? roundedRectPath(inset, inset, size.w - STROKE, size.h - STROKE, r - inset)
      : "";

  // The star rides the border as it draws, then settles at the top.
  const offsetDistance = useTransform(draw, (v) => `${v * 100}%`);
  // Fill + glow strengthen as the border closes.
  const bgOpacity = useTransform(draw, [0, 1], [0.04, 0.16]);
  const background = useMotionTemplate`rgba(255,210,63,${bgOpacity})`;
  const glow = useTransform(draw, [0, 1], [0, 0.45]);
  const boxShadow = useMotionTemplate`0 0 32px rgba(255,210,63,${glow})`;

  return (
    <motion.div
      ref={pillRef}
      className="relative inline-flex max-w-[min(92vw,30rem)] items-center gap-2.5 rounded-full px-5 py-2.5 backdrop-blur-md"
      style={{ boxShadow }}
    >
      {/* Animated translucent gold fill that strengthens as the border closes */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ background }}
      />

      {/* The drawing gold border — an SVG outline scrubbed by scroll, sized to
          the measured pill so corners and stroke never distort. */}
      {rectPath && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          width={size.w}
          height={size.h}
          fill="none"
        >
          <motion.path
            d={rectPath}
            stroke="#FFD23F"
            strokeWidth={STROKE}
            strokeLinecap="round"
            style={{ pathLength: draw }}
          />
          <motion.g style={{ offsetPath: `path('${rectPath}')`, offsetDistance }}>
            <Star size={12} className="fill-[#FFD23F] text-[#FFD23F]" x={-6} y={-6} />
          </motion.g>
        </svg>
      )}

      <span className="relative z-1 inline-flex items-center gap-2.5">
        <Star size={15} className="shrink-0 fill-[#FFD23F] text-[#FFD23F]" />
        <span className="text-sm font-semibold text-white md:text-base">
          And we&apos;ll make the{" "}
          <span className="text-[#FFD23F]">real show happen for you.</span>
        </span>
      </span>
    </motion.div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

// The three reveal phases, as slices of the 0→1 scroll progress. They finish
// by ~0.88, leaving a settle-buffer at the bottom of the track so the reveal
// always completes (pill included) before the section unpins — even when the
// smoothing spring trails slightly behind the raw scroll.
const PHASE: Record<"headline" | "para" | "pill", [number, number]> = {
  headline: [0.0, 0.36],
  para: [0.36, 0.64],
  pill: [0.64, 0.88],
};

// How many viewport-heights of scroll the whole reveal spans. The track height
// is derived from this so the feel is the same on a short laptop, a tall
// monitor, or a phone — every screen gets the same number of "screens" of
// scroll, not a fixed pixel count.
const TRACK_VIEWPORTS = 3;

/**
 * The hero section.
 *
 * Scroll-scrubbed reveal: the visual frame is `sticky` so it pins while you
 * scroll through a tall track, and a single `scrollYProgress` (0→1) drives all
 * three phases (headline → paragraph → pill) via useTransform.
 *
 * Two things keep it from feeling stuck:
 *  1. The raw scroll progress is spring-smoothed (stiff spring) so a single
 *     macOS trackpad flick — which jumps ~950px in one event — glides across
 *     the words instead of snapping past whole phases.
 *  2. Phases finish by 0.88 (see PHASE), leaving a settle-buffer so the reveal
 *     always completes before the section unpins.
 *
 * Track height is viewport-derived so it works on any screen. Reduced-motion
 * collapses the track to one screen and shows everything statically.
 */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Track height in px, derived from the viewport so the reveal spans the same
  // proportional scroll distance on every screen. Starts as a vh value for SSR
  // / first paint, then syncs to a measured pixel height from the viewport.
  const [viewportH, setViewportH] = useState<number | null>(null);
  useEffect(() => {
    const onResize = () => setViewportH(window.innerHeight);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const trackHeight =
    reduce || viewportH === null
      ? reduce
        ? "100vh" // no scrub when reduced motion — just one screen
        : `${TRACK_VIEWPORTS * 100}vh` // SSR / pre-measure fallback
      : `${Math.round(viewportH * TRACK_VIEWPORTS)}px`;

  // Raw scroll progress across the tall section.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Light spring on top of Lenis. Lenis already re-emits the macOS momentum
  // flick as many small even steps, so the raw scroll arrives smooth — this
  // spring just takes off the last bit of edge without lagging behind.
  const progress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 45,
    restDelta: 0.0005,
  });

  const headlineProgress = useTransform(progress, PHASE.headline, [0, 1]);
  const paraProgress = useTransform(progress, PHASE.para, [0, 1]);
  const pillProgress = useTransform(progress, PHASE.pill, [0, 1]);

  const paraWords = PARA_TEXT.split(" ").map((w) => ({ word: w, emphasis: EMPHASIS.has(w) }));

  return (
    // Tall track (viewport-derived height) gives the browser room to scroll
    // while the sticky frame inside stays pinned and the reveal scrubs.
    <section
      ref={sectionRef}
      className="relative w-full bg-black"
      style={{ height: trackHeight }}
    >
    {/* ── Sticky visual frame ── pins while you scroll through the track */}
    <div
      ref={stickyRef}
      className="sticky top-0 w-full overflow-hidden"
      style={{ height: "100dvh", minHeight: "600px" }}
    >
      {/* next/image fill requires a positioned ancestor — relative wrapper here */}
      <div className="absolute inset-0">
        <Image
          src="/images/pSSINVOSMIf4PhqxNRckBByjw.webp"
          alt=""
          fill
          priority
          className="animate-ken-burns object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-1"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 45%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.70) 100%), linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.85) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Spotlight beams */}
      <div className="absolute inset-0 z-2 overflow-hidden opacity-70" aria-hidden="true">
        <span className="beam beam-left" />
        <span className="beam beam-center" />
        <span className="beam beam-right" />
      </div>

      {/* Camera washes */}
      <div className="pointer-events-none absolute inset-0 z-2 overflow-hidden" aria-hidden="true">
        <span className="paparazzi-wash paparazzi-wash-left" />
        <span className="paparazzi-wash paparazzi-wash-right" />
      </div>

      {/* Bulb strips */}
      <BulbStrip className="absolute left-0 right-0 top-5 z-3 hidden px-10 md:flex" />
      <BulbStrip className="absolute bottom-5 left-0 right-0 z-3 hidden px-10 md:flex" />

      {/* Content — spread top→bottom so the setup copy sits just under the
          header, the pill sits near the bottom, and the headline gets the big
          middle space. ~20px breathing room top and bottom (plus header clear). */}
      <div
        className="absolute inset-0 z-5 flex flex-col items-center justify-between px-5 text-center md:px-10"
        style={{
          paddingTop: "max(5.5rem, calc(env(safe-area-inset-top) + 5.5rem))",
          paddingBottom: "20px",
        }}
      >
        <div className="flex w-full max-w-260 flex-1 flex-col items-center justify-center gap-[clamp(1rem,4dvh,2.5rem)]">

          {/* ── Top row: setup copy ── */}
          <p className="hero-enter hero-enter-1 max-w-180 text-sm font-medium leading-relaxed text-white/80 md:text-lg">
            For years, you watched celebrities play exciting game shows on TV.{" "}
            Now,{" "}
            <span className="font-semibold text-white">
              Game Show Challenge Rooms
            </span>{" "}
            brings that experience to you — with live hosts, buzzers, big
            challenges, and your whole crew in the game.
          </p>

          {/* ── Middle row: big headline + fill paragraph, centered ── */}
          <div className="flex flex-col items-center">
            {/* Headline — big, dominates the middle space */}
            <h1
              className="font-(--font-display) uppercase text-white"
              style={{ textShadow: "0 6px 40px rgba(0,0,0,0.45)" }}
            >
              {reduce ? (
                WORDS.map((w) => (
                  <span key={w} className="block font-black tracking-tight"
                    style={{ fontSize: "clamp(50px, min(16.5vw, 14dvh), 156px)", lineHeight: 0.97 }}>
                    {w}
                  </span>
                ))
              ) : (
                WORDS.map((w, i) => (
                  <span key={w} className="block font-black tracking-tight"
                    style={{ fontSize: "clamp(50px, min(16.5vw, 14dvh), 156px)", lineHeight: 0.97 }}>
                    <RevealWord word={w} progress={headlineProgress} index={i} total={WORDS.length} />
                  </span>
                ))
              )}
            </h1>

            {/* Fill paragraph — timed reveal word colors */}
            <p
              className="mt-[clamp(0.5rem,1.8dvh,1rem)] max-w-135 text-sm md:text-base"
              aria-label={PARA_TEXT}
            >
              {reduce ? (
                <span className="text-white/70">{PARA_TEXT}</span>
              ) : (
                <span aria-hidden="true">
                  {paraWords.map((w, i) => (
                    <FillWord
                      key={`${w.word}-${i}`}
                      word={w.word}
                      emphasis={w.emphasis}
                      progress={paraProgress}
                      index={i}
                      total={paraWords.length}
                    />
                  ))}
                </span>
              )}
            </p>
          </div>

          {/* ── Bottom row: gold pill ── */}
          <div>
            {reduce ? (
              <div className="inline-flex max-w-[min(92vw,30rem)] items-center gap-2.5 rounded-full border border-[#FFD23F]/60 bg-[#FFD23F]/10 px-5 py-2.5 backdrop-blur-md">
                <Star size={15} className="shrink-0 fill-[#FFD23F] text-[#FFD23F]" />
                <span className="text-sm font-semibold text-white">
                  And we&apos;ll make the{" "}
                  <span className="text-[#FFD23F]">real show happen for you.</span>
                </span>
              </div>
            ) : (
              <GoldPill progress={pillProgress} />
            )}
          </div>

        </div>
      </div>
    </div>
    </section>
  );
}
