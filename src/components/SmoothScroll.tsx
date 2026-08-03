"use client";

import { ReactLenis } from "lenis/react";
import { useSyncExternalStore, type ReactNode } from "react";

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
// Whether this is a touch device. Read as a constant snapshot rather than via
// effect-driven state: the old `useState` + `useEffect` version re-rendered the
// entire app tree once after hydration just to swap the scroll provider, which
// tore down and rebuilt every scroll-linked animation below it — a visible
// hitch on first load. The pointer type does not change mid-session, so this
// never needs to notify.
const subscribeToNothing = () => () => {};

function isTouchDevice(): boolean {
  return (
    window.matchMedia?.("(pointer: coarse)").matches ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0
  );
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  // SSR snapshot is `false` (assume desktop), so the server markup matches the
  // Lenis branch and touch devices resolve to native scroll on first client render.
  const touch = useSyncExternalStore(subscribeToNothing, isTouchDevice, () => false);

  if (touch) return <>{children}</>;

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
