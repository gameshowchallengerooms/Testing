"use client";

import { MapPin, Mic2, Users, Sparkles } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const reasons = [
  {
    icon: Mic2,
    chapter: "The format",
    title: "A real hosted show",
    text: "Not an arcade, not an escape room — an actual live game show with a host, lights and music. The only one of its kind in Hyderabad.",
    glow: "#147EFF",
  },
  {
    icon: Users,
    chapter: "The crew",
    title: "Made for groups",
    text: "Built for groups of 4 to 15 people. Whatever the occasion, your whole crew plays together — nobody sits on the sidelines.",
    glow: "#FC19ED",
  },
  {
    icon: Sparkles,
    chapter: "The feeling",
    title: "Everyone plays, nobody watches",
    text: "Unlike a movie, a meal or bowling, every single person is in the spotlight and part of the action from start to finish.",
    glow: "#FF2E4D",
  },
];

export function WhyHyderabadSection() {
  return (
    <section className="relative overflow-hidden bg-black px-5 py-20 md:px-10 md:py-28">
      {/* Stage glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% -5%, rgba(124,92,252,0.20), transparent 62%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1080px]">
        {/* Header */}
        <div className="mx-auto max-w-[820px] text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
              <MapPin size={14} className="text-[#FF2E4D]" />
              Proudly in Hyderabad
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h2
              className="mx-auto mt-6 text-3xl font-medium leading-tight tracking-tight text-white md:text-[56px] md:leading-[1.05]"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-2px" }}
            >
              Make a memory your group{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #147EFF, #FC19ED)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                never forgets
              </span>
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="mx-auto mt-4 max-w-[640px] text-base text-white/60 md:text-lg">
              Dinners, malls and movies are forgettable. Stepping under the lights as the
              star of your own live game show is the story your group will be telling for
              months.
            </p>
          </Reveal>
        </div>

        {/* Alternating editorial bands — one reason per full-width row,
            zig-zagging left/right with a giant ghost numeral. */}
        <div className="mt-16 flex flex-col gap-4 md:mt-24 md:gap-6">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            const flip = i % 2 === 1;
            return (
              <Reveal key={r.title} delay={i * 90} direction={flip ? "left" : "right"}>
                <article
                  className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#141416] to-[#0a0a0c] transition-colors duration-500 hover:border-white/25 ${
                    flip ? "md:flex-row-reverse" : ""
                  } flex flex-col md:flex-row md:items-stretch`}
                >
                  {/* Number / icon panel */}
                  <div
                    className={`relative flex shrink-0 items-center justify-center overflow-hidden p-8 md:w-[260px] ${
                      flip ? "md:rounded-r-[28px]" : "md:rounded-l-[28px]"
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${r.glow}26, transparent 70%)`,
                    }}
                  >
                    {/* Big ghost numeral */}
                    <span
                      className="select-none text-[120px] font-bold leading-none text-white/[0.06] md:text-[150px]"
                      style={{ fontFamily: "var(--font-display)" }}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    {/* Icon medallion centered over the numeral */}
                    <span
                      className="absolute flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-xl ring-1 ring-white/20 transition-transform duration-500 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${r.glow}, rgba(255,255,255,0.08))`,
                      }}
                    >
                      <Icon size={28} />
                    </span>
                  </div>

                  {/* Copy */}
                  <div className="flex flex-1 flex-col justify-center gap-2 p-7 md:p-10">
                    <p
                      className="text-[11px] font-semibold uppercase tracking-[0.24em]"
                      style={{ color: r.glow }}
                    >
                      {r.chapter}
                    </p>
                    <h3
                      className="text-2xl font-bold leading-[1.1] text-white md:text-[32px]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {r.title}
                    </h3>
                    <p className="mt-1 max-w-[640px] text-[15px] leading-relaxed text-white/60 md:text-base">
                      {r.text}
                    </p>
                  </div>

                  {/* Accent line that sweeps in on hover */}
                  <span
                    className={`pointer-events-none absolute bottom-0 h-px w-0 transition-all duration-500 group-hover:w-full ${
                      flip ? "right-0" : "left-0"
                    }`}
                    style={{
                      background: `linear-gradient(90deg, ${r.glow}, transparent)`,
                    }}
                    aria-hidden="true"
                  />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
