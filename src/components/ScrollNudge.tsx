"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** How long the visitor can stay idle (no scrolling) before we nudge them. */
const IDLE_MS = 5000;
/** Distance from the page bottom (px) at which the nudge stops appearing. */
const BOTTOM_SLACK = 120;

/**
 * Idle scroll nudge.
 *
 * Whenever the visitor stops scrolling for 5 seconds, a "Scroll for more"
 * pill fades in above the bottom of the viewport. The moment they scroll
 * again it hides and the 5-second idle timer restarts, so it keeps
 * re-appearing on every pause. Suppressed once the visitor is at (or near)
 * the bottom of the page, where there is nothing left to scroll to.
 */
export function ScrollNudge() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const atPageBottom = () =>
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - BOTTOM_SLACK;

    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!atPageBottom()) setVisible(true);
      }, IDLE_MS);
    };

    const onScroll = () => {
      setVisible(false);
      arm();
    };

    arm();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center transition-all duration-500 md:bottom-8",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-md">
        <ChevronDown className="size-4 animate-bounce" aria-hidden="true" />
        <span>Scroll for more</span>
      </div>
    </div>
  );
}
