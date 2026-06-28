"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

/**
 * Cinematic scroll-zoom intro — "zoom deep into the logo, fall inside, reveal
 * what the show is about."
 *
 * One continuous, never-reversing camera move driven by a single 0→1 scroll
 * progress across a tall track while a sticky frame stays pinned:
 *
 *   0.00         The "First time in India / Introducing" kicker + the Game Show
 *                Challenge Rooms logo are visible the moment you reach it.
 *   0.00 – 0.55  The camera flies DEEP into the logo: it scales up hard until
 *                the shield engulfs the whole screen and overflows. The kicker
 *                recedes (parallax) as we dive.
 *   0.52 – 0.66  A dark-room veil fades in once the logo fills the screen, so we
 *                "fall inside" the image. The logo fades out under the veil.
 *   0.62 – 1.00  Inside, the "About the Show" content reveals with a staggered,
 *                scroll-scrubbed animation: badge → heading (word-by-word rise &
 *                un-blur) → paragraph one → paragraph two.
 */

const TRACK_VIEWPORTS = 6; // how many screens of scroll the whole sequence spans

const HEADING_WORDS = ["What", "is", "Game", "Show", "Challenge", "Rooms"];
// Body paragraphs revealed under the heading, in order. The last line is the
// punchy closing call-to-play.
const PARAS = [
  "Game Show Challenge Rooms is a live, interactive game show experience made for you and your gang.",
  "Bring your friends, family, coworkers, teammates, or classmates and step into our custom game arenas. Compete in exciting challenges, hit the buzzer, work as a team, and enjoy the thrill of a real game show — with lights, energy, and live hosts guiding every round.",
  "It is not just a game night. It is your chance to be part of the show.",
];
const CLOSING = "Make your team. Book your slot. It’s time to play!";

/** A heading word that rises up and un-blurs across its own slice of `t` (0→1). */
function HeadingWord({
  word,
  t,
  index,
  total,
}: {
  word: string;
  t: MotionValue<number>;
  index: number;
  total: number;
}) {
  const span = 1 / total;
  const start = index * span * 0.7; // overlap so words cascade, not march
  const end = Math.min(start + span * 1.8, 1);
  const opacity = useTransform(t, [start, end], [0, 1]);
  const y = useTransform(t, [start, end], ["0.5em", "0em"]);
  const filter = useTransform(t, [start, end], ["blur(12px)", "blur(0px)"]);
  return (
    <span className="inline-block overflow-hidden align-bottom">
      <motion.span
        className="inline-block"
        style={{ opacity, y, filter, willChange: "transform, opacity, filter" }}
      >
        {word}&nbsp;
      </motion.span>
    </span>
  );
}

/** A body line that fades, rises and un-blurs across its [start, end] scroll
 *  window — the staggered reveal under the heading. */
function RevealParagraph({
  progress,
  start,
  end,
  className,
  children,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  className?: string;
  children: React.ReactNode;
}) {
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [40, 0]);
  const blur = useTransform(progress, [start, end], [8, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  return (
    <motion.p
      className={className}
      style={{ opacity, y, filter, willChange: "transform, opacity, filter" }}
    >
      {children}
    </motion.p>
  );
}

export function ScrollZoomIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // iOS Safari changes `window.innerHeight` as the URL bar collapses/expands
  // while scrolling. If we recompute the track height on every resize, `useScroll`
  // recalculates its bounds mid-scroll and progress snaps back to 0 — so the
  // scrubbed text reveal never advances ("text not coming" on iPad/iPhone).
  //
  // Fix: measure the viewport ONCE on mount and only react to width changes
  // (orientation / window resize), never to height-only changes from the toolbar.
  const [viewportH, setViewportH] = useState<number | null>(null);
  useEffect(() => {
    const measure = () => setViewportH(window.innerHeight);
    measure();
    let lastWidth = window.innerWidth;
    const onResize = () => {
      // Ignore height-only resizes (iOS URL-bar show/hide); only re-measure when
      // the width actually changes (rotation, real window resize).
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
        ? "100vh"
        : `${TRACK_VIEWPORTS * 100}vh`
      : `${Math.round(viewportH * TRACK_VIEWPORTS)}px`;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Light spring smoothing on top of Lenis so a single trackpad flick glides
  // across the zoom instead of jumping phases.
  const progress = useSpring(scrollYProgress, {
    stiffness: 380,
    damping: 46,
    restDelta: 0.0004,
  });

  // ── Logo zoom ── DEEP dive. Scales hard (1 → 42×) so the shield blows past the
  // screen edges and we plunge through it. A touch of rotation + brightening
  // gives the dive some life. Stays opaque until the veil covers it.
  const logoScale = useTransform(progress, [0, 0.58], [1, 42]);
  const logoOpacity = useTransform(progress, [0, 0.52, 0.62], [1, 1, 0]);
  const logoRotate = useTransform(progress, [0, 0.58], [0, -4]);
  const logoBrightness = useTransform(progress, [0, 0.45, 0.58], [1, 1, 1.4]);
  const logoFilter = useTransform(logoBrightness, (b) => `brightness(${b})`);

  // ── Intro kicker ── visible at rest, then recedes (parallax) and fades as the
  // dive into the logo begins.
  const kickerOpacity = useTransform(progress, [0, 0.12], [1, 0]);
  const kickerScale = useTransform(progress, [0, 0.18], [1, 0.78]);
  const kickerBlur = useTransform(progress, [0, 0.16], [0, 6]);
  const kickerFilter = useTransform(kickerBlur, (b) => `blur(${b}px)`);

  // ── Dark-room veil ── fades in once the logo fills the screen, then we "fall
  // inside" into a dark room.
  const veilOpacity = useTransform(progress, [0.52, 0.66], [0, 1]);

  // ── About scene ── the container drifts up gently across the whole reveal so
  // the block has continuous parallax under the staggered word/para animations.
  const sceneOpacity = useTransform(progress, [0.6, 0.68], [0, 1]);
  const sceneY = useTransform(progress, [0.6, 1], ["8%", "-4%"]);

  // Each element animates across its own slice of progress (scrubbed).
  const eyebrowOpacity = useTransform(progress, [0.6, 0.66], [0, 1]);
  const eyebrowX = useTransform(progress, [0.6, 0.68], [-24, 0]);

  // Heading words cascade over 0.62 → 0.76. We remap progress into that window
  // and feed the local 0→1 to each word.
  const headingT = useTransform(progress, [0.62, 0.76], [0, 1]);

  // Scroll hint fades out as soon as you start scrolling.
  const hintOpacity = useTransform(progress, [0, 0.06], [1, 0]);

  if (reduce) {
    return (
      <section ref={sectionRef} className="relative w-full">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-12 pt-24 text-center">
          <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#FFD23F] sm:text-xs">
            <span className="h-px w-6 bg-[#FFD23F]/50" />
            First time in India
            <span className="h-px w-6 bg-[#FFD23F]/50" />
          </span>
          <span className="mb-6 text-sm font-medium text-white/70 sm:text-base">
            Introducing
          </span>
          <Image
            src="/images/logo-transparent.png"
            alt="Game Show Challenge Rooms"
            width={360}
            height={232}
            className="mb-12 h-auto w-64"
          />
          <div className="w-full max-w-2xl text-left">
            <span className="mb-4 inline-block text-sm font-normal text-white/80">
              — About the Show
            </span>
            <h2
              className="mb-6 text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              What is Game Show Challenge Rooms
            </h2>
            {PARAS.map((para, i) => (
              <p key={i} className="mb-4 text-base leading-snug text-white/90 sm:text-lg">
                {para}
              </p>
            ))}
            <p className="mt-2 text-lg font-bold leading-snug text-[#FFD23F] sm:text-xl">
              {CLOSING}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: trackHeight }}
    >
      <motion.div
        className="sticky top-0 flex w-full items-center justify-center overflow-hidden"
        // 100svh (small viewport height) is the STABLE value that ignores iOS's
        // collapsing URL bar — unlike 100dvh, which changes mid-scroll and
        // destabilizes the scroll-scrubbed reveal on iPad/iPhone.
        style={{ height: "100svh", minHeight: "600px" }}
      >
        {/* Ambient backdrop behind the logo, so the start isn't flat black */}
        <div
          className="absolute inset-0 z-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(40,30,70,0.5) 0%, rgba(0,0,0,0) 60%), radial-gradient(circle at 50% 0%, rgba(255,210,63,0.10) 0%, rgba(0,0,0,0) 45%)",
          }}
        />

        {/* ── INTRO KICKER ── recedes with parallax as the dive begins ── */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 z-15 flex flex-col items-center px-6 text-center"
          style={{
            top: "calc(50% - min(34vw,210px))",
            opacity: kickerOpacity,
            scale: kickerScale,
            filter: kickerFilter,
          }}
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#FFD23F] sm:text-xs">
            <span className="h-px w-6 bg-[#FFD23F]/50" />
            First time in India
            <span className="h-px w-6 bg-[#FFD23F]/50" />
          </span>
          <span className="mt-2 text-sm font-medium text-white/70 sm:text-base">
            Introducing
          </span>
        </motion.div>

        {/* ── THE LOGO ── the camera flies deep into this ── */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{
            scale: logoScale,
            opacity: logoOpacity,
            rotate: logoRotate,
            filter: logoFilter,
            transformOrigin: "50% 50%",
            willChange: "transform, opacity, filter",
          }}
        >
          <Image
            src="/images/logo-transparent.png"
            alt="Game Show Challenge Rooms"
            width={1497}
            height={966}
            priority
            quality={100}
            sizes="(max-width: 640px) 60vw, 360px"
            className="h-auto w-[min(60vw,360px)] drop-shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
          />
        </motion.div>

        {/* ── DARK-ROOM VEIL ── we fall inside the logo into a dark room ── */}
        <motion.div
          className="absolute inset-0 z-20"
          style={{
            opacity: veilOpacity,
            background:
              "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(20,16,34,1) 0%, rgba(6,6,10,1) 70%)",
          }}
          aria-hidden
        />

        {/* ── ABOUT SCENE ── staggered, scroll-scrubbed reveal of what the show
            is about, inside the image. ── */}
        <motion.div
          className="absolute inset-0 z-30 flex items-center justify-center px-6"
          style={{ opacity: sceneOpacity, y: sceneY, willChange: "transform, opacity" }}
        >
          <div className="w-full max-w-3xl">
            {/* Eyebrow */}
            <motion.div
              className="mb-6 flex items-center gap-4"
              style={{ opacity: eyebrowOpacity, x: eyebrowX }}
            >
              <span className="block h-px w-15 bg-white/50" />
              <span className="text-sm font-normal text-white/80 sm:text-base">
                About the Show
              </span>
            </motion.div>

            {/* Heading — words cascade up & un-blur */}
            <h2
              className="mb-8 text-[28px] font-black uppercase leading-[1.04] tracking-tight text-white sm:text-5xl md:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {HEADING_WORDS.map((w, i) => (
                <HeadingWord
                  key={`${w}-${i}`}
                  word={w}
                  t={headingT}
                  index={i}
                  total={HEADING_WORDS.length}
                />
              ))}
            </h2>

            {/* Body paragraphs — fade/rise/un-blur, staggered in sequence */}
            {PARAS.map((para, i) => {
              const start = 0.76 + i * 0.05;
              return (
                <RevealParagraph
                  key={i}
                  progress={progress}
                  start={start}
                  end={start + 0.08}
                  className="mb-4 text-sm font-medium leading-snug text-white/90 sm:text-lg md:text-xl"
                >
                  {para}
                </RevealParagraph>
              );
            })}

            {/* Closing call-to-play line */}
            <RevealParagraph
              progress={progress}
              start={0.92}
              end={1}
              className="mt-2 text-base font-bold leading-snug text-[#FFD23F] sm:text-xl md:text-2xl"
            >
              {CLOSING}
            </RevealParagraph>
          </div>
        </motion.div>

        {/* Scroll hint, only while at the very top */}
        <motion.div
          className="absolute bottom-8 left-1/2 z-40 -translate-x-1/2"
          style={{ opacity: hintOpacity }}
          aria-hidden
        >
          <span className="flex flex-col items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-white/50">
            Scroll
            <span className="block h-8 w-px animate-pulse bg-white/40" />
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
