"use client";

import { useSyncExternalStore } from "react";

/**
 * Detects devices that cannot afford the full motion treatment.
 *
 * `prefers-reduced-motion` only catches users who deliberately enabled the OS
 * setting — most people on budget phones never do. This hook is the missing
 * *capability*-based downgrade: it looks at what the hardware can actually
 * sustain, so the expensive layers (huge scaled textures, screen-blended blurs,
 * per-word filters) can be dropped for people who would otherwise see a 20fps
 * page.
 *
 * Signals, cheapest first:
 *  - `deviceMemory` ≤ 4GB — the standard low-RAM Android tell (Chromium only).
 *  - `hardwareConcurrency` ≤ 4 — few cores means main-thread work hurts more.
 *  - `Save-Data` — the user explicitly asked for a lighter page.
 *  - Coarse pointer + narrow viewport — a phone, where the GPU is the ceiling.
 *
 * The verdict is fixed for the lifetime of the page (hardware does not change
 * mid-session), so this reads as a constant snapshot via `useSyncExternalStore`
 * rather than as effect-driven state — no post-hydration re-render, and the
 * server snapshot is `false` so capable machines hydrate the full experience.
 */

let cached: boolean | null = null;

function detect(): boolean {
  if (cached !== null) return cached;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  const memory = nav.deviceMemory;
  const cores = nav.hardwareConcurrency;

  const lowMemory = typeof memory === "number" && memory <= 4;
  const lowCores = typeof cores === "number" && cores <= 4;
  const saveData = nav.connection?.saveData === true;
  const smallTouchScreen =
    window.matchMedia("(pointer: coarse)").matches && window.innerWidth < 900;

  cached = lowMemory || lowCores || saveData || smallTouchScreen;
  return cached;
}

// Hardware capability never changes mid-session, so the store never notifies.
const subscribe = () => () => {};

export function useLowPowerMode(): boolean {
  return useSyncExternalStore(
    subscribe,
    detect,
    () => false, // SSR: assume capable, downgrade on the client if not
  );
}
