"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
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
 *   0.62 – 1.00  Inside, the illustrated "About the Show" poster rises into the
 *                studio light, settles flat, and catches a moving reflection.
 */

const TRACK_VIEWPORTS = 6; // how many screens of scroll the whole sequence spans
const POSTER_COPY =
  "Imagine being picked as a contestant on your favorite game show. The host calls your name—your face glows with studio lights. Through the theme music, you hear the opposing team trash-talking from across the stage. That’s Game Show Challenge Rooms. Instead of watching from your couch, you’re on stage, competing in mini-games that test everything from speed to strategy. There’s a live host, lights, and music. When you slam the buzzer and nail the answer, you’ll feel like a game show legend.";

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

  // ── Poster scene ── the completed infographic rises out of the logo dive,
  // settles flat, and holds while its stage-light reflections drift across it.
  const sceneOpacity = useTransform(progress, [0.6, 0.68], [0, 1]);
  const sceneY = useTransform(progress, [0.6, 1], ["8%", "-2%"]);
  const posterOpacity = useTransform(progress, [0.64, 0.74], [0, 1]);
  const posterY = useTransform(progress, [0.64, 0.84], [110, 0]);
  const posterScale = useTransform(progress, [0.64, 0.86], [0.8, 1]);
  const posterRotate = useTransform(progress, [0.64, 0.86], [3.5, 0]);

  // Scroll hint fades out as soon as you start scrolling.
  const hintOpacity = useTransform(progress, [0, 0.06], [1, 0]);

  if (reduce) {
    return (
      <section ref={sectionRef} className="relative w-full">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-16 pt-24 text-center sm:px-6">
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
          <figure className="w-full overflow-hidden rounded-[1.75rem] border border-white/20 shadow-[0_32px_100px_rgba(14,8,40,0.45)] sm:rounded-[2.25rem]">
            <Image
              src="/images/what-is-game-show-poster.png"
              alt=""
              width={1456}
              height={1080}
              sizes="(max-width: 768px) 96vw, 1152px"
              className="h-auto w-full"
            />
            <figcaption className="sr-only">{POSTER_COPY}</figcaption>
          </figure>
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

        {/* ── ABOUT POSTER ── the complete infographic rises into the dark room. */}
        <motion.div
          className="absolute inset-0 z-30 flex items-center justify-center px-3 sm:px-6"
          style={{ opacity: sceneOpacity, y: sceneY, willChange: "transform, opacity" }}
        >
          {/* Slow stage-light sweeps keep the dark room alive behind the card. */}
          <motion.div
            className="pointer-events-none absolute -left-[8%] -top-[20%] h-[100%] w-[42%] origin-top bg-[linear-gradient(180deg,rgba(20,126,255,0.34),transparent_74%)] blur-2xl"
            animate={{ rotate: [-10, -3, -10], opacity: [0.28, 0.52, 0.28] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute -right-[8%] -top-[20%] h-[100%] w-[42%] origin-top bg-[linear-gradient(180deg,rgba(252,25,237,0.3),transparent_74%)] blur-2xl"
            animate={{ rotate: [10, 3, 10], opacity: [0.26, 0.48, 0.26] }}
            transition={{ duration: 7.8, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />

          <motion.figure
            className="relative w-full max-w-6xl rounded-[1.5rem] border border-white/20 bg-[#080b14] p-1.5 shadow-[0_0_0_1px_rgba(124,92,252,0.2),0_36px_120px_rgba(0,0,0,0.7),0_0_90px_rgba(20,126,255,0.2),0_0_120px_rgba(252,25,237,0.14)] sm:rounded-[2.25rem] sm:p-2"
            style={{
              opacity: posterOpacity,
              y: posterY,
              scale: posterScale,
              rotate: posterRotate,
              willChange: "transform, opacity",
            }}
          >
            <motion.div
              className="relative overflow-hidden rounded-[1.15rem] sm:rounded-[1.75rem]"
              animate={{ y: [0, -5, 0], rotate: [0, 0.2, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/images/what-is-game-show-poster.png"
                alt=""
                width={1456}
                height={1080}
                sizes="(max-width: 768px) 98vw, 1152px"
                className="h-auto max-h-[86svh] w-full object-contain"
              />

              {/* A narrow moving reflection sells the poster as a bright studio
                  screen inside the dark room without changing its artwork. */}
              <motion.span
                className="pointer-events-none absolute -inset-y-[20%] w-[20%] -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] blur-md"
                animate={{ left: ["-30%", "120%"] }}
                transition={{ duration: 4.8, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
                aria-hidden
              />
            </motion.div>

            <motion.span
              className="pointer-events-none absolute -left-3 -top-3 h-7 w-7 rounded-full bg-[#147EFF] shadow-[0_0_32px_rgba(20,126,255,0.9)] sm:h-9 sm:w-9"
              animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            />
            <motion.span
              className="pointer-events-none absolute -bottom-3 -right-3 h-7 w-7 rounded-full bg-[#FC19ED] shadow-[0_0_32px_rgba(252,25,237,0.9)] sm:h-9 sm:w-9"
              animate={{ scale: [1.15, 0.8, 1.15], opacity: [1, 0.55, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            />

            <figcaption className="sr-only">{POSTER_COPY}</figcaption>
          </motion.figure>
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
