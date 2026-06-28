"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState, type ReactNode } from "react";

/**
 * App-wide smooth scrolling via Lenis.
 *
 * Why: macOS trackpad/Magic-Mouse momentum scrolling delivers one huge ~950px
 * scroll event per flick. Scroll-scrubbed animations (like the hero reveal)
 * only get a single frame for that whole jump, so they lurch and feel stuck.
 * Lenis intercepts the raw wheel/touch input and re-emits it as many small,
 * evenly-interpolated scroll steps, so scroll-linked animations receive dozens
 * of frames and scrub smoothly.
 *
 * Lenis scrolls the real document, so Motion's `useScroll` picks it up with no
 * extra wiring. `autoRaf` runs Lenis's own animation loop.
 *
 * IMPORTANT — touch devices (iPad/iPhone): we deliberately do NOT run Lenis on
 * touch devices. Even with touch sync off, Lenis attaches touch listeners that
 * conflict with iOS Safari's native momentum scrolling and can freeze the page
 * entirely (the dvh-driven sticky track in ScrollZoomIntro makes this worse, as
 * the collapsing URL bar leaves Lenis's cached scroll height stale). iOS native
 * scrolling is already smooth, and Motion's `useScroll` reads the real document
 * scroll, so the scroll-scrubbed animations keep working without Lenis.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  // Start `true` so SSR/first paint matches the desktop case; flip to native
  // scroll on touch devices after mount (avoids a hydration mismatch).
  const [useLenis, setUseLenis] = useState(true);

  useEffect(() => {
    const coarse =
      window.matchMedia?.("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;
    if (coarse) setUseLenis(false);
  }, []);

  if (!useLenis) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1, // how quickly Lenis catches up to the target (0–1)
        duration: 1.1, // momentum glide length in seconds
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
