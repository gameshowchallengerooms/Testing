"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "motion/react";
import { Star } from "lucide-react";

/**
 * The gold "echo" pill — "And we'll make the real show happen for you." — whose
 * gold border DRAWS itself around the pill as the final scroll phase of the
 * pinned hero. A star rides along the border as it draws, and only once the
 * border is complete does the pin release and the page scroll on.
 *
 * The border is an SVG rounded-rect outline sized to the pill via ResizeObserver.
 * We scrub its `pathLength` (0 → 1) with scroll, so the stroke literally grows
 * from a point all the way around — crisp at any size, GPU-cheap.
 */
export function ScrollBorderPill({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLElement | null>;
}) {
  const reduce = useReducedMotion();
  const pillRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Measure the pill so the SVG border rect matches it exactly.
  useEffect(() => {
    const node = pillRef.current;
    if (!node) return;
    const update = () =>
      setSize({ w: node.offsetWidth, h: node.offsetHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });
  // Snappy spring (matches the headline + paragraph) so the border draw tracks
  // the wheel and finishes promptly while the hero is still pinned.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 320,
    damping: 40,
    restDelta: 0.0005,
  });

  // FINAL phase (phase 3): the border draws after the headline (0–0.30) and the
  // paragraph fill (0.30–0.44). It must FINISH while the header is still pinned
  // — the sticky header unpins at scroll progress ~0.58 (240vh section, 1-vp
  // header). We finish the draw at 0.54, leaving a small pinned "hold" so the
  // completed gold border sits on screen BEFORE the page scrolls on — the page
  // only scrolls once this line's border has fully filled.
  const draw = useTransform(smooth, [0.44, 0.54], [0, 1]);

  // The star rides the border as it draws: offsetDistance 0% → 100%.
  const offsetDistance = useTransform(draw, (v) => `${v * 100}%`);
  // …and the pill's fill/glow strengthens as the border completes.
  const bgOpacity = useTransform(draw, [0, 1], [0.04, 0.16]);
  const background = useMotionTemplate`rgba(255,210,63,${bgOpacity})`;

  // Geometry for the SVG border rect (inset by half the stroke so it sits on
  // the pill edge, not clipped). r = full pill radius.
  const STROKE = 2;
  const inset = STROKE / 2;
  const r = size.h / 2;
  const rectPath =
    size.w && size.h
      ? roundedRectPath(inset, inset, size.w - STROKE, size.h - STROKE, r - inset)
      : "";

  const content = (
    <>
      <Star size={15} className="shrink-0 fill-[#FFD23F] text-[#FFD23F]" />
      <span className="text-sm font-semibold text-white md:text-base">
        And we&apos;ll make the{" "}
        <span className="text-[#FFD23F]">real show happen for you.</span>
      </span>
    </>
  );

  // Reduced motion: static finished pill (solid gold border, no draw).
  if (reduce) {
    return (
      <div className="hero-enter hero-enter-5 mt-[clamp(0.75rem,3dvh,1.5rem)] inline-flex items-center gap-2.5 rounded-full border border-[#FFD23F]/60 bg-[#FFD23F]/10 px-4 py-2 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return (
    <div
      ref={pillRef}
      className="hero-enter hero-enter-5 relative mt-[clamp(0.75rem,3dvh,1.5rem)] inline-flex items-center gap-2.5 rounded-full px-4 py-2 backdrop-blur-md"
    >
      {/* Animated translucent gold fill that strengthens as the border closes */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ background }}
      />

      {/* The drawing gold border, an SVG outline scrubbed by scroll */}
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
          {/* A star riding the stroke as it draws */}
          <motion.g style={{ offsetPath: `path('${rectPath}')`, offsetDistance }}>
            <Star
              size={12}
              className="fill-[#FFD23F] text-[#FFD23F]"
              x={-6}
              y={-6}
            />
          </motion.g>
        </svg>
      )}

      <span className="relative z-[1] inline-flex items-center gap-2.5">
        {content}
      </span>
    </div>
  );
}

/**
 * Build an SVG path for a rounded rectangle, starting at the top edge so the
 * stroke draws clockwise from the top — the most natural "draw on" direction.
 */
function roundedRectPath(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): string {
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
