"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

function WordReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const setupObserver = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const words = container.querySelectorAll<HTMLSpanElement>("[data-word]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
          }
        });
      },
      { threshold: 0.5, rootMargin: "0px 0px -10% 0px" }
    );

    words.forEach((word) => observer.observe(word));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cleanup = setupObserver();
    return cleanup;
  }, [setupObserver]);

  const words = text.split(" ");

  return (
    <h3
      ref={containerRef}
      className={className}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          data-word
          style={{
            opacity: 0.15,
            transition: `opacity 0.5s ease`,
            transitionDelay: `${i * 0.03}s`,
          }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </h3>
  );
}

export function AboutSection() {
  return (
    <section
      id="about"
      className={cn(
        "w-full flex flex-col items-center",
        "px-5 pb-10 pt-0 md:px-10 md:pb-20 md:pt-0"
      )}
    >
      <div className="w-full max-w-[1200px]">
        <div className="mb-6 flex items-center gap-4">
          <span className="block h-[2px] w-[60px] bg-white/50" />
          <span className="font-sans text-base font-normal text-white/80">
            About the Show
          </span>
        </div>
        <h2
          className={cn(
            "font-[var(--font-display,var(--font-sans))] font-bold text-white uppercase",
            "text-[24px] md:text-[60px]",
            "tracking-[-2px] mb-10 md:mb-[60px]"
          )}
        >
          What is Game Show Challenge Rooms
        </h2>

        <WordReveal
          text="Game Show Challenge Rooms is the #1 new game show experience for everyone to enjoy! Get ready for one of the most fun and unforgettable events your crew has ever experienced!"
          className={cn(
            "font-[var(--font-display,var(--font-sans))] font-medium text-white",
            "text-[24px] md:text-[38px]",
            "leading-[1.3] md:leading-[49.4px]",
            "tracking-[-1.52px] mb-10"
          )}
        />

        <WordReveal
          text="Face-off against your friends, family, coworkers, teammates or schoolmates in our custom arenas – all facilitated by our live game show hosts. It’s time to play!"
          className={cn(
            "font-[var(--font-display,var(--font-sans))] font-medium text-white",
            "text-[24px] md:text-[38px]",
            "leading-[1.3] md:leading-[49.4px]",
            "tracking-[-1.52px] mb-10 md:mb-[60px]"
          )}
        />

      </div>
    </section>
  );
}
