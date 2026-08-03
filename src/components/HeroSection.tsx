"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronUp, Mouse, Pointer, Star } from "lucide-react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { useLowPowerMode } from "@/hooks/useLowPowerMode";

// ─── Headline word reveal ────────────────────────────────────────────────────

const WORDS = ["Today,", "you're", "our", "celebrity."];

function RevealWord({
  word,
  progress,
  index,
  total,
  lowPower,
}: {
  word: string;
  progress: MotionValue<number>;
  index: number;
  total: number;
  lowPower: boolean;
}) {
  const span = 1 / total;
  const start = index * span;
  const end = Math.min(start + span * 1.6, 1);

  const opacity = useTransform(progress, [start, end], [0.08, 1]);
  const filter = useTransform(progress, [start, end], ["blur(10px)", "blur(0px)"]);
  const y = useTransform(progress, [start, end], ["100%", "0%"]);

  // Animated `blur()` on text re-rasters the glyphs every frame at these very
  // large display sizes — the single most expensive thing in the headline. The
  // slide + fade already carry the reveal, so weak GPUs get those alone.
  return (
    <span className="relative inline-block overflow-hidden align-bottom" style={{ perspective: 600 }}>
      <motion.span
        className="inline-block"
        style={
          lowPower
            ? { opacity, y, willChange: "transform, opacity" }
            : { opacity, filter, y, willChange: "transform, opacity, filter" }
        }
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
/* These stops are interpolated in JS by `hexToRgb` below, so they MUST stay
   literal hex — a `var(--gs-*)` reference can't be parsed with parseInt and
   would render the whole paragraph grey. They mirror the --gs-sky →
   --gs-pink-soft ramp in globals.css; keep the two in sync if that changes. */
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
  lowPower,
}: {
  word: string;
  emphasis: boolean;
  progress: MotionValue<number>;
  index: number;
  total: number;
  lowPower: boolean;
}) {
  const span = 1 / total;
  const start = index * span;
  const end = Math.min(start + span * 2.2, 1);
  const litColor = colorAt(index / Math.max(total - 1, 1));
  // `color` is a paint property, so each word repaints on every scroll frame —
  // ~26 words' worth of text paint per frame. On low-power devices the word
  // still lights up, but it flips at its threshold via a compositor-friendly
  // opacity crossfade between two statically-coloured copies instead.
  const color = useTransform(progress, [start, end], ["rgba(255,255,255,0.18)", litColor]);
  const opacity = useTransform(progress, [start, end], [0.5, 1]);
  // The low-power branch crossfades a second, already-coloured copy of each
  // word. It must start at zero: reusing `opacity` here made that bright copy
  // 50% visible before the paragraph's scroll phase began, so phones could
  // appear to load with the text already revealed.
  const litOpacity = useTransform(progress, [start, end], [0, 1]);

  if (lowPower) {
    return (
      <>
        <span className="relative inline-block">
          <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: emphasis ? 700 : undefined }}>
            {word}
          </span>
          <motion.span
            aria-hidden
            className="absolute inset-0 inline-block"
            style={{ color: litColor, opacity: litOpacity, fontWeight: emphasis ? 700 : undefined }}
          >
            {word}
          </motion.span>
        </span>
        <span> </span>
      </>
    );
  }

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
            stroke="var(--gs-gold)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            style={{ pathLength: draw }}
          />
          <motion.g style={{ offsetPath: `path('${rectPath}')`, offsetDistance }}>
            <Star size={12} className="fill-gs-gold text-gs-gold" x={-6} y={-6} />
          </motion.g>
        </svg>
      )}

      <span className="relative z-1 inline-flex items-center gap-2.5">
        <Star size={15} className="shrink-0 fill-gs-gold text-gs-gold" />
        <span className="text-sm font-semibold text-white md:text-base">
          And we&apos;ll make the{" "}
          <span className="text-gs-gold">real show happen for you.</span>
        </span>
      </span>
    </motion.div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

// Paparazzi entrance
const PAPARAZZI = [
  { side: "left", src: "/images/hero-paparazzi/paparazzi-left.png" },
  { side: "right", src: "/images/hero-paparazzi/paparazzi-right.png" },
] as const;

/**
 * A short celebrity-photo moment: the photographers lean in from opposite
 * wings, fire their shutters a beat apart, then clear the stage. The cutouts
 * stay behind the copy so the hero remains readable, including on phones.
 */
function PaparazziCharacter({
  side,
  src,
}: {
  side: (typeof PAPARAZZI)[number]["side"];
  src: (typeof PAPARAZZI)[number]["src"];
}) {
  return (
    <div className={cn("paparazzi", `paparazzi-${side}`)}>
      <Image
        src={src}
        alt=""
        fill
        loading="eager"
        sizes="(max-width: 767px) 48vw, 27vw"
        className="select-none object-contain"
        draggable={false}
      />

      {/* Pinned to the generated camera lens, so the light travels with the
          photographer instead of floating at a viewport coordinate. */}
      <span className={cn("camera-flash", `camera-flash-${side}`)}>
        <span className="camera-flash-halo" />
        <span className="camera-flash-star" />
        <span className="camera-flash-ring" />
      </span>
    </div>
  );
}

function PaparazziMoment({
  progress,
  reduceMotion,
}: {
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const [active, setActive] = useState(() => reduceMotion || progress.get() >= 0.96);

  useEffect(() => {
    if (reduceMotion) return;

    // Hysteresis keeps the routine stable around the threshold: reaching the
    // completed final word starts it, while reverse-scrolling past the point
    // where "celebrity" disappears stops it.
    return progress.on("change", (value) => {
      setActive((wasActive) => {
        if (value >= 0.96) return true;
        if (value <= 0.75) return false;
        return wasActive;
      });
    });
  }, [progress, reduceMotion]);

  const visible = reduceMotion || active;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "paparazzi-scene pointer-events-none absolute inset-0 z-4 overflow-hidden",
        visible && "paparazzi-scene-active",
        reduceMotion && visible && "paparazzi-scene-still",
      )}
    >
      {PAPARAZZI.map(({ side, src }) => (
        <PaparazziCharacter
          key={side}
          side={side}
          src={src}
        />
      ))}
    </div>
  );
}

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

// Headline size. The height budget is what keeps the hero fully on-screen:
// the headline is WORDS.length lines tall, so its per-line size must be a
// fraction of the viewport height that leaves room for everything else in the
// column (header clearance, setup copy, fill paragraph, pill, and the gaps).
//
// Budgeting ~46dvh for the whole headline across 4 lines gives ~11.5dvh per
// line. The earlier 14dvh/line spent ~56dvh on the headline alone, which
// overflowed the bottom of short-wide screens (1280x720, 1440x800) and clipped
// the gold pill. The vw term still caps it on narrow phones, where the words
// are width-bound rather than height-bound.
const HEADLINE_FONT_SIZE = "clamp(44px, min(16.5vw, 11.5dvh), 156px)";

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
  const lowPower = useLowPowerMode();

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
      style={{ height: "100dvh" }}
    >
      {/* next/image fill requires a positioned ancestor — relative wrapper here */}
      <div className="absolute inset-0">
        <Image
          src="/images/pSSINVOSMIf4PhqxNRckBByjw.webp"
          alt=""
          fill
          priority
          className={cn(
            "object-cover object-center",
            // A permanent 18s scale on a full-viewport image keeps the whole
            // hero re-compositing forever, even at rest. Static on weak GPUs.
            !lowPower && "animate-ken-burns",
          )}
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

      {/* Moving stage spotlights. Weak devices get the gradient overlay alone. */}
      {!lowPower && (
        <div className="absolute inset-0 z-2 overflow-hidden opacity-70" aria-hidden="true">
          <span className="beam beam-left" />
          <span className="beam beam-center" />
          <span className="beam beam-right" />
        </div>
      )}

      <PaparazziMoment progress={headlineProgress} reduceMotion={reduce === true} />

      {/* Content — spread top→bottom so the setup copy sits just under the
          header, the pill sits near the bottom, and the headline gets the big
          middle space. ~20px breathing room top and bottom (plus header clear). */}
      <div
        className="hero-content absolute inset-0 z-5 flex flex-col items-center justify-between px-5 text-center md:px-10"
      >
        <div className="flex min-h-0 w-full max-w-260 flex-1 flex-col items-center justify-center gap-[clamp(0.5rem,2.5dvh,2.5rem)]">

          {/* ── Top row: setup copy ── */}
          <p className="hero-setup hero-enter hero-enter-1 max-w-180 shrink-0 text-sm font-medium leading-relaxed text-white/80 md:text-lg">
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
                    style={{ fontSize: HEADLINE_FONT_SIZE, lineHeight: 0.97 }}>
                    {w}
                  </span>
                ))
              ) : (
                WORDS.map((w, i) => (
                  <span key={w} className="block font-black tracking-tight"
                    style={{ fontSize: HEADLINE_FONT_SIZE, lineHeight: 0.97 }}>
                    <RevealWord word={w} progress={headlineProgress} index={i} total={WORDS.length} lowPower={lowPower} />
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
                      lowPower={lowPower}
                    />
                  ))}
                </span>
              )}
            </p>
          </div>

          {/* ── Bottom row: gold pill ── */}
          <div>
            {reduce ? (
              <div className="inline-flex max-w-[min(92vw,30rem)] items-center gap-2.5 rounded-full border border-gs-gold/60 bg-gs-gold/10 px-5 py-2.5 backdrop-blur-md">
                <Star size={15} className="shrink-0 fill-gs-gold text-gs-gold" />
                <span className="text-sm font-semibold text-white">
                  And we&apos;ll make the{" "}
                  <span className="text-gs-gold">real show happen for you.</span>
                </span>
              </div>
            ) : (
              <GoldPill progress={pillProgress} />
            )}
          </div>

        </div>
      </div>

      {/* Scroll cue — invites the first scroll, then fades out as the reveal
          takes over. Absolutely positioned over the frame (not in the flex
          column) so it can never push the content out of the viewport. */}
      <ScrollCue reduceMotion={reduce === true} />
    </div>
    </section>
  );
}

/**
 * Responsive "Scroll to play" prompt.
 *
 * Mobile gets a compact swipe pill, while desktop gets a glass mouse control.
 * Both appear in the centre of the stage, where the visitor's attention is
 * already focused, without returning to the oversized modal-style box.
 * Both variants share the same timed show/hide cycle and disappear permanently
 * after the visitor starts scrolling.
 */
const CUE_INTERVAL = 5000; // one appearance starts every five seconds
const CUE_SHOW_FOR = 2200; // visible long enough to read without lingering
const CUE_REST_FOR = CUE_INTERVAL - CUE_SHOW_FOR;

function ScrollCue({ reduceMotion }: { reduceMotion: boolean }) {
  const [phase, setPhase] = useState<"waiting" | "showing" | "done">("waiting");

  useEffect(() => {
    let done = false;
    let timer: ReturnType<typeof setTimeout>;
    // Start a new appearance every five seconds until the first real scroll.
    const show = () => {
      if (done) return;
      setPhase("showing");
      timer = setTimeout(hide, CUE_SHOW_FOR);
    };
    const hide = () => {
      if (done) return;
      setPhase("waiting");
      timer = setTimeout(show, CUE_REST_FOR);
    };
    // The hero is the top of the page, so "the page has been open 5s with no
    // scroll" is simply a timer from mount.
    timer = setTimeout(show, CUE_INTERVAL);
    // Listen for genuine user input instead of scroll-progress changes. Motion's
    // progress can shift slightly while viewport measurements settle, which was
    // incorrectly dismissing the cue before it ever became visible.
    const dismiss = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      setPhase("done");
    };
    const scrollKeys = new Set([
      "ArrowDown",
      "ArrowUp",
      "PageDown",
      "PageUp",
      "Home",
      "End",
      " ",
    ]);
    const onKeyDown = (event: KeyboardEvent) => {
      if (scrollKeys.has(event.key)) dismiss();
    };
    const onScroll = () => {
      if (window.scrollY > 2) dismiss();
    };

    window.addEventListener("wheel", dismiss, { passive: true });
    window.addEventListener("touchmove", dismiss, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchmove", dismiss);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const showing = phase === "showing";

  return (
    <div
      aria-hidden="true"
      className="scroll-cue pointer-events-none absolute inset-0 z-6"
    >
      {/* Mobile: a compact swipe pill in the centre of the stage. */}
      <div className="absolute inset-0 flex items-center justify-center px-4 md:hidden">
        <motion.div
          className="relative flex w-full max-w-[22.5rem] items-center gap-3.5 overflow-hidden rounded-full border border-white/15 bg-gs-surface-black/85 p-2.5 pr-5 shadow-[0_16px_50px_rgba(0,0,0,0.65),0_0_32px_rgba(124,92,252,0.22)] backdrop-blur-xl"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.94 }}
          animate={
            reduceMotion
              ? { opacity: showing ? 1 : 0 }
              : showing
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 16, scale: 0.96 }
          }
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            aria-hidden
            className="absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--gs-blue-bright),var(--gs-magenta-bright),transparent)]"
          />
          <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,var(--gs-blue),var(--gs-violet),var(--gs-magenta))] text-white shadow-[0_0_28px_rgba(124,92,252,0.5)]">
            <SwipeUpGesture active={showing && !reduceMotion} />
          </span>

          <span className="min-w-0 flex-1 text-left">
            <span className="block text-xs font-bold uppercase tracking-[0.18em] text-white">
              Swipe up to play
            </span>
            <span className="mt-1 block truncate text-[11px] font-medium text-white/50">
              Your spotlight is waiting
            </span>
          </span>

          <span className="flex shrink-0 items-center gap-1" aria-hidden>
            {[0, 1, 2].map((index) => (
              <motion.span
                key={index}
                className="h-1 w-1 rounded-full bg-gs-gold"
                animate={showing && !reduceMotion ? { opacity: [0.25, 1, 0.25] } : { opacity: 0.7 }}
                transition={{ duration: 1.2, repeat: Infinity, delay: index * 0.16 }}
              />
            ))}
          </span>
        </motion.div>
      </div>

      {/* Desktop/tablet: a centred glass mouse control. */}
      <div className="absolute inset-0 hidden items-center justify-center px-6 md:flex">
        <motion.div
          className="relative flex min-w-[19rem] items-center gap-3.5 overflow-hidden rounded-2xl border border-white/15 bg-gs-surface-black/85 p-3 pr-6 shadow-[0_22px_70px_rgba(0,0,0,0.72),0_0_42px_rgba(20,126,255,0.2),0_0_56px_rgba(252,25,237,0.12)] backdrop-blur-xl"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.92 }}
          animate={
            reduceMotion
              ? { opacity: showing ? 1 : 0 }
              : showing
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 14, scale: 0.95 }
          }
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-px bg-[linear-gradient(180deg,transparent,var(--gs-blue-bright),var(--gs-magenta-bright),transparent)]"
          />

          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white">
            <Mouse size={23} strokeWidth={1.8} />
            <motion.span
              className="absolute left-1/2 top-3 h-1.5 w-1 -translate-x-1/2 rounded-full bg-gs-gold shadow-[0_0_8px_var(--gs-gold)]"
              animate={showing && !reduceMotion ? { y: [0, 7, 0], opacity: [0, 1, 0] } : { y: 0, opacity: 0.6 }}
              transition={{ duration: 1.45, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>

          <span className="text-left">
            <span className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                Scroll to play
              </span>
              <span className="rounded-full bg-gs-gold/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-gs-gold">
                Live
              </span>
            </span>
            <span className="mt-1 block text-[11px] font-medium text-white/45">
              The show begins with your scroll
            </span>
          </span>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * The industry-standard swipe-up gesture cue: a pointing finger presses down
 * (a touch ripple marks the contact), drags upward, then lifts off — while the
 * chevrons above light up bottom-to-top along its path. One ~2s cycle, looping
 * while active; a static pointer when inactive (reduced motion or hidden).
 */
function SwipeUpGesture({ active }: { active: boolean }) {
  // Shared cycle so every layer stays in phase: press → drag → lift → rest.
  const cycle = { duration: 1.7, repeat: Infinity, repeatDelay: 0.4 } as const;
  return (
    <span aria-hidden className="relative flex h-full w-full items-center justify-center">
      {/* chevrons — light up bottom-to-top as the finger travels */}
      <span className="absolute inset-x-0 top-1 flex flex-col items-center">
        <motion.span
          animate={active ? { opacity: [0.2, 0.2, 1, 0.2] } : { opacity: 0.9 }}
          transition={{ ...cycle, times: [0, 0.6, 0.78, 1], ease: "easeInOut" }}
        >
          <ChevronUp size={14} strokeWidth={3} />
        </motion.span>
        <motion.span
          className="-mt-2.5"
          animate={active ? { opacity: [0.2, 0.2, 1, 0.2] } : { opacity: 0.5 }}
          transition={{ ...cycle, times: [0, 0.48, 0.66, 1], ease: "easeInOut" }}
        >
          <ChevronUp size={14} strokeWidth={3} />
        </motion.span>
      </span>

      {/* touch ripple — expands from the press point as the finger lands */}
      <motion.span
        className="absolute h-7 w-7 rounded-full border-2 border-white/90"
        style={{ left: "50%", top: "50%", marginLeft: -14, marginTop: -6 }}
        animate={
          active
            ? { opacity: [0, 0.85, 0, 0], scale: [0.35, 0.8, 1.4, 1.4] }
            : { opacity: 0, scale: 0.35 }
        }
        transition={{ ...cycle, times: [0, 0.18, 0.42, 1], ease: "easeOut" }}
      />

      {/* the finger — press (slight squash), drag up, lift off */}
      <motion.span
        className="relative z-1 mt-2"
        animate={
          active
            ? { y: [10, 9, -11, -13], opacity: [0, 1, 1, 0], scale: [1, 0.92, 1, 1] }
            : { y: 0, opacity: 1, scale: 1 }
        }
        transition={
          active
            ? { ...cycle, times: [0, 0.2, 0.72, 1], ease: [0.33, 0, 0.2, 1] }
            : { duration: 0.2 }
        }
      >
        <Pointer size={28} strokeWidth={2.2} />
      </motion.span>
    </span>
  );
}
