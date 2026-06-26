"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  children: ReactNode;
  /** Direction the element travels in from. */
  direction?: Direction;
  /** Delay in ms before the reveal starts. */
  delay?: number;
  /** Travel distance in px. */
  distance?: number;
  /** Render as a specific element. Defaults to div. */
  as?: "div" | "section" | "li" | "span";
  className?: string;
  /** Re-trigger every time it enters the viewport. */
  once?: boolean;
  /** Adds a little depth to the entrance without changing the layout. */
  emphasis?: "soft" | "bold";
}

const offset = (direction: Direction, distance: number) => {
  switch (direction) {
    case "up":
      return `translate3d(0, ${distance}px, 0)`;
    case "down":
      return `translate3d(0, -${distance}px, 0)`;
    case "left":
      return `translate3d(${distance}px, 0, 0)`;
    case "right":
      return `translate3d(-${distance}px, 0, 0)`;
    default:
      return "translate3d(0, 0, 0)";
  }
};

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  distance = 28,
  as = "div",
  className,
  once = true,
  emphasis = "soft",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect reduced motion: show immediately (deferred to avoid a sync
    // setState inside the effect body).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  const Tag = as as "div";

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translate3d(0,0,0) scale(1)"
          : `${offset(direction, distance)} scale(${emphasis === "bold" ? 0.94 : 0.98})`,
        filter: visible ? "blur(0)" : `blur(${emphasis === "bold" ? 10 : 5}px)`,
        transition:
          "opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1), filter 0.7s cubic-bezier(0.22,1,0.36,1)",
        transitionDelay: `${delay}ms`,
        willChange: "opacity, transform, filter",
      }}
    >
      {children}
    </Tag>
  );
}
