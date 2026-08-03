"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image, { getImageProps } from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { useLowPowerMode } from "@/hooks/useLowPowerMode";

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

// How many screens of scroll the whole sequence spans. The extra length over the
// original 6 is spent almost entirely on the poster hold: at 8 viewports the
// 0.78→0.94 still-window is ~1.3 screens of scrolling where the poster sits
// motionless and readable, instead of being whisked away on the first flick.
const TRACK_VIEWPORTS = 8;
const POSTER_COPY =
  "Imagine being picked as a contestant on your favorite game show. The host calls your name—your face glows with studio lights. Through the theme music, you hear the opposing team trash-talking from across the stage. That’s Game Show Challenge Rooms. Instead of watching from your couch, you’re on stage, competing in mini-games that test everything from speed to strategy. There’s a live host, lights, and music. When you slam the buzzer and nail the answer, you’ll feel like a game show legend.";

// The source file is already an optimized 67 KB webp; running it through
// /_next/image at high quality re-encodes it LARGER (~104 KB) and, in dev,
// generates it on demand — the partial-paint flicker on slow loads. Serve it
// untouched, and fade in from a tiny inline preview while it downloads.
const LOGO_BLUR =
  "data:image/webp;base64,UklGRhIBAABXRUJQVlA4WAoAAAAQAAAADwAACQAAQUxQSHMAAAABcKpt25O8JCpnAHlPtWlE456V5GWnuQ6B7uocAd1tW1U7zb1t/38KETEBMDw/mB4fj8Mk8D0DaEWDruuIouN2B1ELQi9MZbKlar2cTSfDHn/+U54WNPMBTZ/TyTQOzJnkxABYkywBgE00x/vvZzNsxFkAAFZQOCB4AAAAUAIAnQEqEAAKAAOAWiWwAnQGMHam26dcAuxgAP7BVLNCRoW8rm/FO3tcHGgBdIYJCo37P6NkVha0sERLOwpto7SkMxYv3yrZ+unKpZ/s6XwKwGD6he8Oh7C3MhaPvtpU4PJtDjNlKsFf3vyAdMC7P6fdWK9mK+4A";

const posterCommonProps = {
  alt: "",
  sizes: "(max-width: 639px) 100vw, (max-width: 1519px) calc(100vw - 3rem), 1456px",
};

const {
  props: { srcSet: desktopPosterSrcSet },
} = getImageProps({
  ...posterCommonProps,
  src: "/images/what-is-game-show-poster.webp",
  width: 1456,
  height: 1080,
});

const {
  props: { srcSet: mobilePosterSrcSet, ...mobilePosterProps },
} = getImageProps({
  ...posterCommonProps,
  src: "/images/what-is-game-show-poster-mobile.webp",
  width: 941,
  height: 1672,
});

function ResponsivePoster({ className }: { className: string }) {
  return (
    <picture>
      <source media="(min-width: 640px)" srcSet={desktopPosterSrcSet} />
      <source media="(max-width: 639px)" srcSet={mobilePosterSrcSet} />
      <img {...mobilePosterProps} alt="" className={className} />
    </picture>
  );
}

export function ScrollZoomIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const lowPower = useLowPowerMode();

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
  // `restDelta` has to stay small: during the slow hold a scroll only nudges
  // progress a hair, and a coarse rest threshold would swallow that nudge
  // entirely — the poster would look frozen exactly where it must look alive.
  const progress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 44,
    restDelta: 0.00005,
  });

  // ── Logo zoom ── DEEP dive. Scales hard so the shield blows past the screen
  // edges and we plunge through it. A touch of rotation gives the dive life.
  // Stays opaque until the veil covers it.
  //
  // The scale ceiling is a HARDWARE limit, not a taste call. The compositor must
  // rasterize `logoCssWidth * scale * devicePixelRatio` px of texture, and GPUs
  // cap a single texture at 4096–8192px. Past that the browser falls back to a
  // blurry re-raster, drops the layer for a frame (a visible blink), or
  // OOM-kills the tab — the exact failure this section used to show. The old 42×
  // meant a ~65,000px surface on a 3× phone.
  //
  // DPR is the term that is easy to miss: a 3× phone triples the texture for the
  // same visual scale, so the ceiling has to be computed, not hard-coded.
  const maxZoom = useMemo(() => {
    if (typeof window === "undefined") return 10;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const logoCssWidth = Math.min(window.innerWidth * 0.6, 360);
    // Stay under 8192px of texture with headroom; never below 4× or the dive
    // stops reading as "we punched through the logo".
    const ceiling = 7600 / (logoCssWidth * dpr);
    return Math.max(4, Math.min(lowPower ? 8 : 12, ceiling));
  }, [lowPower]);

  const logoScale = useTransform(progress, [0, 0.58], [1, maxZoom]);
  const logoOpacity = useTransform(progress, [0, 0.52, 0.62], [1, 1, 0]);
  const logoRotate = useTransform(progress, [0, 0.58], [0, -4]);

  // The "we're punching through into the light" brightening at the end of the
  // dive. This used to be an animated `filter: brightness()` on the logo itself,
  // which forced a full re-raster of that (enormous) layer every frame. A white
  // overlay whose *opacity* animates reads the same but stays on the compositor.
  const flashOpacity = useTransform(progress, [0.45, 0.58], [0, 0.45]);

  // ── Intro kicker ── visible at rest, then recedes (parallax) and fades as the
  // dive into the logo begins.
  const kickerOpacity = useTransform(progress, [0, 0.12], [1, 0]);
  const kickerScale = useTransform(progress, [0, 0.18], [1, 0.78]);
  // Animated blur re-rasters the layer every frame; on weak GPUs the parallax
  // recede alone (scale + opacity) carries the same read for free.
  const kickerBlur = useTransform(progress, [0, 0.16], [0, 6]);
  const kickerFilter = useTransform(kickerBlur, (b) => `blur(${b}px)`);

  // ── Dark-room veil ── fades in once the logo fills the screen, then we "fall
  // inside" into a dark room.
  const veilOpacity = useTransform(progress, [0.52, 0.66], [0, 1]);

  // ── Poster scene ── the completed infographic rises out of the logo dive,
  // settles flat, and then CREEPS slowly upward while you read it.
  //
  // Two failure modes bracket this, and the fix is the middle path:
  //   • Too fast (the original): the poster landed at 0.86 with `sceneY` still
  //     drifting to 1.0, so the first flick after it appeared already swept it
  //     away — "my scroll deleted the image".
  //   • Frozen solid: pinning every transform flat across the hold made scrolling
  //     produce NO response at all, which reads as a stuck page, not a pause.
  //
  // So the hold is slow, not stopped. From 0.78 → 0.94 the poster still tracks
  // your scroll — it just creeps, covering a few dozen px over more than a screen
  // of scrolling. Motion stays perceptible (the page is alive and responding)
  // while the poster stays put long enough to actually read.
  const POSTER_SETTLED = 0.78; // fully landed; slow drift starts here
  const POSTER_HOLD_END = 0.94; // drift ends, the exit accelerates

  const sceneOpacity = useTransform(progress, [0.6, 0.68], [0, 1]);
  // Creeps 0% → -1.5% across the hold, then lifts away properly on exit.
  const sceneY = useTransform(
    progress,
    [0.6, POSTER_SETTLED, POSTER_HOLD_END, 1],
    ["8%", "0%", "-1.5%", "-5%"],
  );
  const posterOpacity = useTransform(progress, [0.64, 0.72], [0, 1]);
  // ~22px of travel across the entire hold — visible response on every scroll,
  // but slow enough that the poster is effectively parked while you read.
  const posterY = useTransform(
    progress,
    [0.64, POSTER_SETTLED, POSTER_HOLD_END, 1],
    [110, 0, -22, -60],
  );
  // A whisper of scale so the drift reads as depth, not just sliding.
  const posterScale = useTransform(
    progress,
    [0.64, POSTER_SETTLED, POSTER_HOLD_END, 1],
    [0.8, 1, 1.008, 0.975],
  );
  const posterRotate = useTransform(
    progress,
    [0.64, POSTER_SETTLED, POSTER_HOLD_END, 1],
    [3.5, 0, -0.15, -0.5],
  );

  // Scroll hint fades out as soon as you start scrolling.
  const hintOpacity = useTransform(progress, [0, 0.06], [1, 0]);

  if (reduce) {
    return (
      <section ref={sectionRef} className="relative w-full">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-16 pt-24 text-center sm:px-6">
          <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-gs-gold sm:text-xs">
            <span className="h-px w-6 bg-gs-gold/50" />
            First time in India
            <span className="h-px w-6 bg-gs-gold/50" />
          </span>
          <span className="mb-6 text-sm font-medium text-white/70 sm:text-base">
            Introducing
          </span>
          <Image
            src="/images/logo-transparent.webp"
            alt="Game Show Challenge Rooms"
            width={360}
            height={232}
            unoptimized
            placeholder="blur"
            blurDataURL={LOGO_BLUR}
            className="mb-12 h-auto w-64"
          />
          <figure className="w-full overflow-hidden rounded-[1.75rem] border border-white/20 shadow-[0_32px_100px_rgba(14,8,40,0.45)] sm:rounded-[2.25rem]">
            <ResponsivePoster className="h-auto w-full" />
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
            ...(lowPower ? {} : { filter: kickerFilter }),
          }}
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-gs-gold sm:text-xs">
            <span className="h-px w-6 bg-gs-gold/50" />
            First time in India
            <span className="h-px w-6 bg-gs-gold/50" />
          </span>
          <span className="mt-2 text-sm font-medium text-white/70 sm:text-base">
            Introducing
          </span>
        </motion.div>

        {/* ── THE LOGO ── the camera flies deep into this ── */}
        {/* The scaled element is the LOGO itself, not a full-viewport wrapper.
            Scaling an `inset-0` wrapper makes the rasterized surface
            `viewportWidth × scale × dpr` — at 390px/3× DPR that was a 65,000px
            texture, far past the 4096–8192px GPU cap, which is exactly the
            blink/blur/tab-kill failure this section showed. Scaling the image
            keeps it at `360 × scale × dpr` instead. */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{ opacity: logoOpacity }}
        >
          <motion.div
            style={{
              scale: logoScale,
              rotate: logoRotate,
              transformOrigin: "50% 50%",
              willChange: "transform",
            }}
          >
            <Image
              src="/images/logo-transparent.webp"
              alt="Game Show Challenge Rooms"
              width={1497}
              height={966}
              priority
              unoptimized
              placeholder="blur"
              blurDataURL={LOGO_BLUR}
              className="h-auto w-[min(60vw,360px)] drop-shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
            />
          </motion.div>
        </motion.div>

        {/* ── DIVE FLASH ── the light we punch through as the shield engulfs the
            screen. An opacity-only overlay, so it never re-rasters the logo. */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-15 bg-white"
          style={{ opacity: flashOpacity }}
          aria-hidden
        />

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
          className="absolute inset-0 z-30 flex items-center justify-center px-1 sm:px-6"
          style={{ opacity: sceneOpacity, y: sceneY, willChange: "transform, opacity" }}
        >
          {/* Slow stage-light sweeps keep the dark room alive behind the card.
              On low-power devices they render static: the blur stays (it costs
              one raster) but the never-ending transform loop does not. */}
          <motion.div
            className="pointer-events-none absolute -left-[8%] -top-[20%] h-[100%] w-[42%] origin-top bg-[linear-gradient(180deg,rgba(20,126,255,0.34),transparent_74%)] blur-2xl"
            style={lowPower ? { rotate: -6, opacity: 0.4 } : undefined}
            animate={lowPower ? undefined : { rotate: [-10, -3, -10], opacity: [0.28, 0.52, 0.28] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute -right-[8%] -top-[20%] h-[100%] w-[42%] origin-top bg-[linear-gradient(180deg,rgba(252,25,237,0.3),transparent_74%)] blur-2xl"
            style={lowPower ? { rotate: 6, opacity: 0.37 } : undefined}
            animate={lowPower ? undefined : { rotate: [10, 3, 10], opacity: [0.26, 0.48, 0.26] }}
            transition={{ duration: 7.8, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />

          <motion.figure
            className="relative w-full max-w-6xl rounded-[1.25rem] border border-white/20 bg-gs-surface-screen p-1 shadow-[0_0_0_1px_rgba(124,92,252,0.2),0_36px_120px_rgba(0,0,0,0.7),0_0_90px_rgba(20,126,255,0.2),0_0_120px_rgba(252,25,237,0.14)] sm:w-[min(calc(100vw-3rem),calc(94svh*1.348))] sm:max-w-[1456px] sm:rounded-[2.25rem] sm:p-2"
            style={{
              opacity: posterOpacity,
              y: posterY,
              scale: posterScale,
              rotate: posterRotate,
              willChange: "transform, opacity",
            }}
          >
            <motion.div
              className="relative w-full overflow-hidden rounded-[1.15rem] sm:rounded-[1.75rem]"
              animate={lowPower ? undefined : { y: [0, -5, 0], rotate: [0, 0.2, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* The frame follows each poster's real aspect ratio. On desktop its
                  width is derived from the 1456×1080 artwork and the available
                  viewport height, so the image fills the frame without black side
                  bars or cropping. Mobile remains width-driven for the tall art. */}
              <ResponsivePoster className="block h-auto w-full object-contain" />

              {/* A narrow moving reflection sells the poster as a bright studio
                  screen inside the dark room without changing its artwork.
                  Animates `x`, not `left` — `left` is a layout property, so it
                  forced a reflow of the poster subtree on every single frame. */}
              {!lowPower && (
                <motion.span
                  className="pointer-events-none absolute -inset-y-[20%] left-0 w-[20%] -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] blur-md"
                  animate={{ x: ["-150%", "600%"] }}
                  transition={{ duration: 4.8, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
                  aria-hidden
                />
              )}
            </motion.div>

            <motion.span
              className="pointer-events-none absolute -left-3 -top-3 h-7 w-7 rounded-full bg-gs-blue shadow-[0_0_32px_rgba(20,126,255,0.9)] sm:h-9 sm:w-9"
              animate={lowPower ? undefined : { scale: [0.8, 1.15, 0.8], opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            />
            <motion.span
              className="pointer-events-none absolute -bottom-3 -right-3 h-7 w-7 rounded-full bg-gs-magenta shadow-[0_0_32px_rgba(252,25,237,0.9)] sm:h-9 sm:w-9"
              animate={lowPower ? undefined : { scale: [1.15, 0.8, 1.15], opacity: [1, 0.55, 1] }}
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
