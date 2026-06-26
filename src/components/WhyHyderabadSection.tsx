"use client";

import { MapPin, Users, Mic2, Star } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const reasons = [
  {
    icon: Mic2,
    title: "A real hosted show",
    text: "Not an arcade, not an escape room — an actual live game show with a host, lights and music. The only one of its kind in Hyderabad.",
  },
  {
    icon: Users,
    title: "Made for groups",
    text: "Built for groups of 4 to 15 people. Whatever the occasion, your whole crew plays together — nobody sits on the sidelines.",
  },
  {
    icon: Star,
    title: "Everyone plays, nobody watches",
    text: "Unlike a movie, a meal or bowling, every single person is in the spotlight and part of the action from start to finish.",
  },
];

export function WhyHyderabadSection() {
  return (
    <section className="relative overflow-hidden bg-black px-5 py-16 md:px-10 md:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(124,92,252,0.18), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1100px] text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
            <MapPin size={14} className="text-[#FF2E4D]" />
            Proudly in Hyderabad
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h2
            className="mx-auto mt-6 max-w-[900px] text-3xl font-medium leading-tight tracking-tight text-white md:text-[56px] md:leading-[1.05]"
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

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <Reveal key={r.title} delay={i * 110} className="h-full">
                <div className="group relative flex h-full flex-col items-center gap-4 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#161618] to-[#0d0d0f] p-7 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-white/25">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                    style={{ background: "linear-gradient(135deg,#147EFF,#FC19ED)" }}
                  >
                    <Icon size={22} />
                  </span>
                  <h3
                    className="text-xl font-bold text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {r.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/60">{r.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
