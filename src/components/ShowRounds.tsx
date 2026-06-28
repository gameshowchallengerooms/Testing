"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useInView,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { Reveal } from "@/components/Reveal";

/** True below Tailwind's `md` breakpoint (768px). Drives which scene renders so
 *  phones get a stacked, one-format-at-a-time layout instead of the cramped
 *  three-column desktop board. Defaults to `false` on the server, then corrects
 *  on mount, so SSR markup matches the desktop branch and never mismatches. */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

/**
 * The "three show formats" chalkboard scene.
 *
 * As the section scrolls into view, an unseen hand chalks out our three ways to
 * play, one format at a time — the short-and-sharp Classic, the meatier Prime
 * Classic, and the marathon Prime Time finale-night. For each, the hand draws a
 * clock whose face fills to that format's running time, tallies up its rounds as
 * a row of chalk ticks, then writes the format's name in its own stick of
 * coloured chalk. The longer you scroll, the more of each show's story unfolds:
 * first the picture, then the rounds, then the timing, then the name.
 *
 * Every stroke self-draws via SVG `pathLength` scrubbed by the section's scroll
 * progress, so the drawing literally happens as you move through it. A glowing
 * chalk "nib" rides the tip of whichever stroke is currently being drawn.
 */

interface Format {
  /** Display name, written last in coloured chalk. */
  label: string;
  /** Coloured-chalk family for this format ("mint" | "amber" | "rose"). */
  colour: "mint" | "amber" | "rose";
  /** Number of rounds — drawn as a tally of chalk ticks. */
  rounds: number;
  /** Running time, e.g. "45 min". */
  time: string;
  /** Fraction of the clock face (0–1) the minute-hand sweeps to, illustrating
      the running time relative to the longest show. */
  clockFill: number;
  /** One-line tease of what the format is. */
  note: string;
}

/* The shared chalk roughen filter — defined once, referenced by every stroke. */
function ChalkDefs() {
  return (
    <defs>
      <filter id="chalk-rough" x="-20%" y="-20%" width="140%" height="140%">
        {/* Displace the clean vector edge with fractal noise so it crumbles
            like pressed chalk, then thin it slightly for a dry, dusty line. */}
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          seed="7"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="2.2"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  );
}

/**
 * One self-drawing chalk path. `drawn` is the section's 0→1 progress; `span`
 * is this stroke's slice of that timeline. Within its slice the path goes from
 * undrawn (pathLength 0) to fully drawn (1).
 *
 * When `nib` is true a glowing chalk dab rides the tip of the line *while it is
 * actively being drawn* (i.e. while `drawn` sits inside this stroke's span),
 * then vanishes once the stroke is complete — selling the "a hand is drawing
 * this right now" feel.
 */
function Stroke({
  d,
  drawn,
  span,
  className = "chalk-stroke",
  width = 3,
  nib = false,
}: {
  d: string;
  drawn: MotionValue<number>;
  span: [number, number];
  className?: string;
  width?: number;
  nib?: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const pathLength = useTransform(drawn, span, [0, 1], { clamp: true });

  // The nib's position along the path, recomputed whenever the draw fraction
  // changes. Kept in component state (not a MotionValue) because it derives
  // from live path geometry via getPointAtLength.
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);

  useMotionValueEvent(pathLength, "change", (frac) => {
    if (!nib) return;
    const path = pathRef.current;
    // Only show the nib mid-draw — hidden before it starts and after it lands.
    if (!path || frac <= 0.001 || frac >= 0.999) {
      setTip(null);
      return;
    }
    const pt = path.getPointAtLength(frac * path.getTotalLength());
    setTip({ x: pt.x, y: pt.y });
  });

  return (
    <>
      <motion.path
        ref={pathRef}
        d={d}
        className={className}
        strokeWidth={width}
        style={{ pathLength }}
      />
      {nib && tip && (
        <circle
          cx={tip.x}
          cy={tip.y}
          r={width + 1.5}
          className="chalk-nib"
          fill="#fdfff8"
        />
      )}
    </>
  );
}

function slice([a, b]: [number, number], from: number, to: number): [number, number] {
  return [a + (b - a) * from, a + (b - a) * to];
}

const STROKE_BY_COLOUR = {
  mint: "chalk-stroke chalk-mint",
  amber: "chalk-stroke chalk-amber",
  rose: "chalk-stroke chalk-rose",
} as const;

const INK_BY_COLOUR = {
  mint: "chalk-ink-mint",
  amber: "chalk-ink-amber",
  rose: "chalk-ink-rose",
} as const;

/* ── The three show formats ─────────────────────────────────────────────────
   Ordered shortest → longest so the scroll builds toward the marathon finale. */
const formats: Format[] = [
  {
    label: "The Classic",
    colour: "mint",
    rounds: 3,
    time: "45 min",
    clockFill: 0.6,
    note: "Three rounds, in and out — our snappy starter show.",
  },
  {
    label: "Prime Classic",
    colour: "amber",
    rounds: 4,
    time: "1 hour",
    clockFill: 0.8,
    note: "Four rounds with room to breathe — the crowd favourite.",
  },
  {
    label: "Prime Time",
    colour: "rose",
    rounds: 5,
    time: "1 hr 15",
    clockFill: 1,
    note: "Five rounds, the full marathon — go big or go home.",
  },
];

/**
 * A clock doodle whose minute-hand sweeps to `fill` (0–1 of the face) to picture
 * the running time, the dial face, ticks, then a small "min" caption tying it to
 * the time. Drawn across the doodle's portion of the format slice.
 */
function ClockDoodle({
  drawn,
  span,
  colour,
  fill,
}: {
  drawn: MotionValue<number>;
  span: [number, number];
  colour: Format["colour"];
  fill: number;
}) {
  const cls = STROKE_BY_COLOUR[colour];
  // Hand sweeps clockwise from 12 o'clock by `fill` of a full turn.
  const angle = -90 + fill * 360;
  const r = 34;
  const hx = 52 + r * 0.78 * Math.cos((angle * Math.PI) / 180);
  const hy = 44 + r * 0.78 * Math.sin((angle * Math.PI) / 180);

  return (
    <>
      {/* dial */}
      <Stroke d="M52 10 a34 34 0 1 0 0.1 0" drawn={drawn} span={slice(span, 0, 0.4)} className={cls} nib />
      {/* 12 / 3 / 6 / 9 ticks */}
      <Stroke
        d="M52 14 v6 M86 44 h-6 M52 78 v-6 M18 44 h6"
        drawn={drawn}
        span={slice(span, 0.4, 0.6)}
        className="chalk-stroke chalk-stroke-dim"
        width={2}
      />
      {/* hour hand (fixed, pointing up) + minute hand (sweeps to fill) */}
      <Stroke d="M52 44 v-16" drawn={drawn} span={slice(span, 0.6, 0.75)} className={cls} width={2.5} />
      <Stroke d={`M52 44 L${hx} ${hy}`} drawn={drawn} span={slice(span, 0.75, 1)} className={cls} width={3} nib />
    </>
  );
}

/* Where each format's column sits across the board (in viewBox units, 0–1200). */
const COLS = [200, 600, 1000];

// `ChalkScene` only mounts when motion is allowed AND the section is in view
// (see <ShowRounds/>), so here `drawn` is always a live scroll MotionValue and
// no reduced-motion branching is needed inside it.
//
// The scene is PINNED: the board lives in a sticky, full-height frame that
// stays centred on screen while you scroll through a much taller outer "track"
// (the parent). Scroll distance through that track is the drawing timeline, so
// every doodle, tally, time and title each gets real screen-time — the drawing
// literally unfolds as the big story it is, instead of flashing past.
function ChalkScene() {
  // The tall outer track we scrub against. Progress is 0 when its top reaches
  // the top of the viewport (board snaps into pin) and 1 when its bottom does
  // (board releases) — the entire scroll-through becomes 0→1.
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: rawProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  // Leave a short lead-in (board settles into place) and a short hold at the
  // end (finale lingers before release), drawing across the middle 92%.
  const drawn = useTransform(rawProgress, [0.04, 0.96], [0, 1], { clamp: true });

  // Each format owns a generous slice of the timeline so its whole story —
  // clock, round tally, time and title — has room to unfold as you scroll.
  const formatSpans: [number, number][] = [
    [0.0, 0.3],
    [0.32, 0.62],
    [0.64, 0.94],
  ];

  return (
    // Pin track: a tall region (≈360vh) that scrolls past while the board
    // inside it stays stuck to the viewport. Its height sets how much scroll
    // the drawing takes — the longer it is, the slower and more deliberate the
    // chalk story plays out. Bumped vs. the old scene because there's now more
    // story per column to read.
    <div ref={trackRef} className="relative h-[360vh]">
      {/* Sticky frame — holds the board centred in the viewport for the whole
          pinned stretch. */}
      <div className="sticky top-0 flex h-screen items-center">
        <div className="chalkboard relative max-h-full w-full overflow-hidden rounded-[2rem] border border-white/10 px-4 py-8 md:px-10 md:py-12">
      {/* Chalk tray along the bottom — a wooden ledge with stubs of coloured chalk. */}
      <div className="pointer-events-none absolute inset-x-6 bottom-3 h-2 rounded-full bg-linear-to-b from-[#5a4631] to-[#2e2417] opacity-80" />
      <div className="pointer-events-none absolute bottom-4 left-12 h-1.5 w-7 rounded-full bg-[#8ff0c4] opacity-80 shadow-[0_0_8px_rgba(110,230,180,0.6)]" />
      <div className="pointer-events-none absolute bottom-4 left-24 h-1.5 w-7 rounded-full bg-[#ffc46b] opacity-80 shadow-[0_0_8px_rgba(255,175,60,0.6)]" />
      <div className="pointer-events-none absolute bottom-4 left-36 h-1.5 w-7 rounded-full bg-[#ff8fb0] opacity-80 shadow-[0_0_8px_rgba(255,110,150,0.6)]" />

      {/* Section eyebrow, handwritten on the board */}
      <p className="chalk-ink chalk-flicker mb-1 text-center text-2xl md:text-3xl" style={{ opacity: 0.8 }}>
        pick your show…
      </p>
      <h3 className="chalk-ink mb-8 text-center text-4xl leading-none md:mb-10 md:text-6xl">
        three formats,{" "}
        <span className="chalk-ink-gold">one champion</span>
      </h3>

      {/* The drawing surface */}
      <div className="relative mx-auto w-full max-w-275">
        <svg
          viewBox="0 0 1200 560"
          className="w-full"
          fill="none"
          aria-hidden="true"
        >
          <ChalkDefs />

          {formats.map((fmt, i) => {
            const cx = COLS[i];
            const span = formatSpans[i];
            return (
              <g key={fmt.label} transform={`translate(${cx - 52}, 50)`}>
                {/* the clock doodle picturing this format's running time */}
                <ClockDoodle drawn={drawn} span={slice(span, 0, 0.55)} colour={fmt.colour} fill={fmt.clockFill} />

                {/* round tally — a row of chalk ticks, one per round, drawn one
                    after another so the rounds literally count up as you scroll */}
                <g transform="translate(0, 108)">
                  {Array.from({ length: fmt.rounds }).map((_, r) => {
                    const x = 16 + r * 18;
                    return (
                      <Stroke
                        key={r}
                        d={`M${x} 0 v22`}
                        drawn={drawn}
                        span={slice(span, 0.55 + (r / fmt.rounds) * 0.25, 0.55 + ((r + 1) / fmt.rounds) * 0.25)}
                        className={STROKE_BY_COLOUR[fmt.colour]}
                        width={3}
                      />
                    );
                  })}
                </g>
              </g>
            );
          })}

          {/* Chalk arrows: from each clock down to its title row. */}
          {formats.map((fmt, i) => {
            const cx = COLS[i];
            const span = formatSpans[i];
            return (
              <g key={`arrow-${fmt.label}`}>
                <Stroke
                  d={`M${cx} 240 q ${i === 1 ? 0 : i === 0 ? 18 : -18} 70 0 150`}
                  drawn={drawn}
                  span={slice(span, 0.82, 0.95)}
                  className="chalk-stroke chalk-stroke-dim"
                  width={2.5}
                />
                {/* arrowhead */}
                <Stroke
                  d={`M${cx - 9} 378 l9 16 l9 -16`}
                  drawn={drawn}
                  span={slice(span, 0.93, 1)}
                  className="chalk-stroke chalk-stroke-dim"
                  width={2.5}
                />
              </g>
            );
          })}

          {/* The final golden connector: from the longest show, sweeping along
              the bottom into the closing line of writing on the left. */}
          <Stroke
            d="M1000 250 q 40 240 -360 270 q -360 24 -560 -40"
            drawn={drawn}
            span={[0.9, 1]}
            className="chalk-stroke chalk-gold"
            width={2.5}
            nib
          />
        </svg>

        {/* Handwritten titles + details under each arrow, positioned over the SVG. */}
        <div className="pointer-events-none absolute inset-0">
          {formats.map((fmt, i) => (
            <FormatLabel key={fmt.label} fmt={fmt} col={i} drawn={drawn} span={formatSpans[i]} />
          ))}
        </div>
      </div>

      {/* Closing line of writing the gold stroke connects into. */}
      <ClosingLine drawn={drawn} />
        </div>
      </div>
    </div>
  );
}

/* ── Mobile scene ───────────────────────────────────────────────────────────
   On phones the three-column board is unreadable, so we tell the story one
   format at a time. As you scroll, each card takes centre stage BIG (clock,
   counting rounds, time, title), then shrinks and slides home into a staggered
   row — Classic to the left, Prime Classic centre, Prime Time right — so by the
   end all three sit together, easy to read. */

/* The three formats' resting slots once they've shrunk into the bottom row.
   x is a percentage offset of the board width; the staggered y lifts the centre
   card so the row reads as a little podium. */
const MOBILE_HOME = [
  { x: "-32%", y: 6 }, // The Classic → left
  { x: "0%", y: -6 }, // Prime Classic → centre (raised)
  { x: "32%", y: 6 }, // Prime Time → right
] as const;

function MobileScene() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rawProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const drawn = useTransform(rawProgress, [0.04, 0.96], [0, 1], { clamp: true });

  return (
    // Slightly shorter track than desktop — three reveals, no fine SVG drawing.
    <div ref={trackRef} className="relative h-[320vh]">
      {/* One shared chalk filter for all three card SVGs (filter refs resolve
          document-wide by id, so we define it once and avoid duplicate ids). */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <ChalkDefs />
      </svg>
      <div className="sticky top-0 flex h-screen items-center">
        <div className="chalkboard relative flex max-h-full w-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 px-5 py-8">
          {/* eyebrow + heading */}
          <p className="chalk-ink chalk-flicker mb-1 text-center text-xl" style={{ opacity: 0.8 }}>
            pick your show…
          </p>
          <h3 className="chalk-ink mb-2 text-center text-3xl leading-tight">
            three formats,{" "}
            <span className="chalk-ink-gold">one champion</span>
          </h3>

          {/* Stage where the cards live, centred then settling into a row. */}
          <div className="relative flex-1">
            {formats.map((fmt, i) => (
              <MobileCard key={fmt.label} fmt={fmt} index={i} drawn={drawn} />
            ))}
          </div>

          {/* Closing line fades in at the very end. */}
          <ClosingLine drawn={drawn} />
        </div>
      </div>
    </div>
  );
}

function MobileCard({
  fmt,
  index,
  drawn,
}: {
  fmt: Format;
  index: number;
  drawn: MotionValue<number>;
}) {
  // Each format owns a third of the timeline as its "spotlight". Inside that
  // window the card is big and centred; once its window ends it shrinks and
  // slides to its home slot, where it stays for the rest of the scroll.
  const start = index * 0.31;
  const enter = start + 0.04; // fade/scale in
  const settleStart = start + 0.24; // begin shrinking + sliding home
  const settled = start + 0.31; // landed in its slot

  // Visible from the moment it enters; never leaves once shown.
  const opacity = useTransform(drawn, [start, enter], [0, 1], { clamp: true });

  // Big (1) while spotlit, then down to a compact tile in the row.
  const scale = useTransform(drawn, [settleStart, settled], [1, 0.52], { clamp: true });

  // Centre stage (0%, 0) → its home slot in the bottom row.
  const x = useTransform(drawn, [settleStart, settled], ["0%", MOBILE_HOME[index].x], {
    clamp: true,
  });
  const y = useTransform(drawn, [settleStart, settled], [0, MOBILE_HOME[index].y], {
    clamp: true,
  });

  // The clock/round artwork is for the spotlight only — fade it out as the card
  // shrinks so the little tile stays clean and legible.
  const artOpacity = useTransform(drawn, [settleStart, settled], [1, 0], { clamp: true });
  // Details (rounds·time + note) only while spotlit; tile keeps just the title.
  const noteOpacity = useTransform(drawn, [settleStart, settled], [0.7, 0], { clamp: true });

  return (
    <motion.div
      className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center text-center"
      style={{ opacity, scale, x, y }}
    >
      {/* Spotlight artwork — a readable, single clock for this format. */}
      <motion.svg
        viewBox="0 0 104 130"
        className="mb-3 w-32"
        fill="none"
        aria-hidden="true"
        style={{ opacity: artOpacity }}
      >
        <ClockDoodle
          drawn={drawn}
          span={[enter, settleStart]}
          colour={fmt.colour}
          fill={fmt.clockFill}
        />
        {/* round tally beneath the clock */}
        <g transform="translate(2, 100)">
          {Array.from({ length: fmt.rounds }).map((_, r) => {
            const x = 16 + r * 16;
            const from = enter + (settleStart - enter) * (0.55 + (r / fmt.rounds) * 0.4);
            const to = enter + (settleStart - enter) * (0.55 + ((r + 1) / fmt.rounds) * 0.4);
            return (
              <Stroke
                key={r}
                d={`M${x} 0 v22`}
                drawn={drawn}
                span={[from, to]}
                className={STROKE_BY_COLOUR[fmt.colour]}
                width={3}
              />
            );
          })}
        </g>
      </motion.svg>

      <span className={`${INK_BY_COLOUR[fmt.colour]} block text-4xl leading-none`}>
        {fmt.label}
      </span>
      <span className="chalk-ink mt-2 block text-xl">
        {fmt.rounds} rounds · {fmt.time}
      </span>
      <motion.span
        className="chalk-ink mt-2 block max-w-[24ch] text-base leading-snug opacity-70"
        style={{ opacity: noteOpacity }}
      >
        {fmt.note}
      </motion.span>
    </motion.div>
  );
}

function FormatLabel({
  fmt,
  col,
  drawn,
  span,
}: {
  fmt: Format;
  col: number;
  drawn: MotionValue<number>;
  span: [number, number];
}) {
  // Title appears once its arrow finishes (≈95% of the format slice); the
  // rounds + time line follows just after, so reading the column top-to-bottom
  // mirrors the draw order: picture → tally → name → the facts.
  const titleAt = slice(span, 0.93, 0.98);
  const detailAt = slice(span, 0.97, 1);

  const titleOpacity = useTransform(drawn, [titleAt[0], titleAt[1]], [0, 1], { clamp: true });
  const titleY = useTransform(drawn, [titleAt[0], titleAt[1]], [10, 0], { clamp: true });
  const detailOpacity = useTransform(drawn, [detailAt[0], detailAt[1]], [0, 1], { clamp: true });

  const leftPct = [16.7, 50, 83.3][col];

  return (
    <motion.div
      className="absolute -translate-x-1/2 text-center"
      style={{ left: `${leftPct}%`, top: "72%" }}
    >
      <motion.span
        className={`${INK_BY_COLOUR[fmt.colour]} block text-2xl md:text-4xl`}
        style={{ opacity: titleOpacity, y: titleY }}
      >
        {fmt.label}
      </motion.span>
      <motion.span
        className="chalk-ink mt-1 block text-base md:text-xl"
        style={{ opacity: detailOpacity }}
      >
        {fmt.rounds} rounds · {fmt.time}
      </motion.span>
      <motion.span
        className="chalk-ink mt-1 block max-w-[18ch] text-sm leading-tight opacity-70 md:text-base"
        style={{ opacity: detailOpacity }}
      >
        {fmt.note}
      </motion.span>
    </motion.div>
  );
}

function ClosingLine({ drawn }: { drawn: MotionValue<number> }) {
  const opacity = useTransform(drawn, [0.95, 1], [0, 1], { clamp: true });
  return (
    <motion.p
      className="chalk-ink chalk-flicker mx-auto mt-6 max-w-[28ch] text-center text-2xl leading-snug md:mt-8 md:text-4xl"
      style={{ opacity }}
    >
      …whichever you pick, it builds to one{" "}
      <span className="chalk-ink-gold">explosive finale.</span>
    </motion.p>
  );
}

/* Reduced-motion / no-scroll fallback keeps the same layout, fully drawn. */
function StaticFallback() {
  return (
    <div className="chalkboard relative overflow-hidden rounded-[2rem] border border-white/10 px-6 py-12 text-center">
      <h3 className="chalk-ink mb-8 text-4xl md:text-6xl">
        three formats, <span className="chalk-ink-gold">one champion</span>
      </h3>
      <div className="grid gap-8 md:grid-cols-3">
        {formats.map((fmt) => (
          <div key={fmt.label}>
            <span className={`${INK_BY_COLOUR[fmt.colour]} block text-3xl`}>{fmt.label}</span>
            <span className="chalk-ink mt-1 block text-lg">
              {fmt.rounds} rounds · {fmt.time}
            </span>
            <span className="chalk-ink mt-1 block text-base opacity-70">{fmt.note}</span>
          </div>
        ))}
      </div>
      <p className="chalk-ink mt-8 text-2xl">
        …whichever you pick, it builds to one{" "}
        <span className="chalk-ink-gold">explosive finale.</span>
      </p>
    </div>
  );
}

export function ShowRounds() {
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const wrapRef = useRef<HTMLDivElement>(null);
  // Mount the scene EARLY — well before it scrolls into view — using a generous
  // bottom root margin. If we waited until it was already 20% visible, the
  // scroll-driven draw would initialise mid-window and snap to a half-drawn
  // state. Mounting ahead of time lets the draw start cleanly from zero.
  const inView = useInView(wrapRef, { once: true, margin: "0px 0px 600px 0px" });

  // Pick the scene + placeholder height per viewport: phones get the stacked,
  // spotlight-then-settle MobileScene; tablets/desktop keep the wide board.
  const Scene = isMobile ? MobileScene : ChalkScene;
  const trackClass = isMobile ? "h-[320vh]" : "h-[360vh]";

  return (
    // Standalone full-width section. It MUST NOT live inside an `overflow-hidden`
    // (or transformed) ancestor — that would break the board's sticky pin and
    // the board would scroll away into the dark page. So the pinned scene lives
    // here at the top level rather than inside the clipped #games card.
    <section ref={wrapRef} className="relative w-full px-5 pt-12 md:px-10 md:pt-20">
      <Reveal>
        <div className="mb-6 flex items-center gap-4">
          <span className="block h-0.5 w-15" style={{ backgroundColor: "rgba(255,255,255,0.5)" }} />
          <span className="font-sans text-base text-white">Pick Your Show</span>
        </div>
      </Reveal>

      {/* Placeholder matches the pinned scene's track height so the page doesn't
          jump when the scene swaps in just before it's reached. */}
      {reduce ? <StaticFallback /> : inView ? <Scene /> : <div className={trackClass} />}
    </section>
  );
}
