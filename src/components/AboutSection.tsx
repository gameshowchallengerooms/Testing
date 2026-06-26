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
        "px-5 py-10 md:px-10 md:py-20"
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

        {/* Two signature formats */}
        <div className="grid gap-5 md:grid-cols-2">
          {[
            {
              name: "Classic Showdowns",
              desc: "Buzzer-smashing trivia and brain-teasers where the smartest, fastest team is crowned champion.",
              accent: "#147EFF",
            },
            {
              name: "Primetime Showdowns",
              desc: "Our highest-energy format — quick-fire rounds plus 60-second Time Rush skill challenges that get everyone off their seats.",
              accent: "#FC19ED",
            },
          ].map((f) => (
            <div
              key={f.name}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#161618] to-[#0e0e10] p-7 transition-colors hover:border-white/25"
            >
              <span
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(120% 60% at 50% 0%, ${f.accent}22, transparent 60%)`,
                }}
                aria-hidden="true"
              />
              <span
                className="relative mb-4 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-black"
                style={{ background: f.accent }}
              >
                Signature Format
              </span>
              <h3
                className="relative mb-2 text-2xl font-bold text-white md:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {f.name}
              </h3>
              <p className="relative text-base leading-relaxed text-white/65">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
