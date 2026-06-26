"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpOptions {
  /** Target number to count to. */
  end: number;
  /** Duration of the count animation in ms. */
  duration?: number;
  /** Number of decimal places to render. */
  decimals?: number;
}

/**
 * Counts up to `end` once the returned ref scrolls into view.
 * Returns the formatted display value and the ref to attach.
 */
export function useCountUp({ end, duration = 1600, decimals = 0 }: CountUpOptions) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setValue(end));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const progress = Math.min((now - start) / duration, 1);
              // easeOutExpo for a snappy finish
              const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
              setValue(end * eased);
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [end, duration]);

  const display = value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return { ref, display };
}
