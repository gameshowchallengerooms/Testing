"use client";

import {
  Briefcase,
  Cake,
  GraduationCap,
  Trophy,
  Heart,
  PartyPopper,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";

const audiences = [
  {
    icon: Briefcase,
    title: "Team Building",
    text: "Friendly competition gets coworkers talking, laughing and solving challenges together.",
    accent: "var(--gs-blue)",
  },
  {
    icon: Cake,
    title: "Birthday Parties",
    text: "Give the guest of honour a spotlight moment and a celebration everyone joins.",
    accent: "var(--gs-magenta)",
  },
  {
    icon: GraduationCap,
    title: "School & College Trips",
    text: "A structured, hosted outing that rewards teamwork, confidence and quick thinking.",
    accent: "var(--gs-gold)",
  },
  {
    icon: Trophy,
    title: "Sports & Club Groups",
    text: "Turn existing team spirit into a new kind of head-to-head competition.",
    accent: "var(--gs-mint)",
  },
  {
    icon: Heart,
    title: "Friends & Family",
    text: "An indoor plan where every age group can participate instead of sitting back.",
    accent: "var(--gs-violet)",
  },
  {
    icon: PartyPopper,
    title: "Bachelor(ette) Parties",
    text: "Start the celebration with team rivalry, big reactions and plenty of photo moments.",
    accent: "var(--gs-orange)",
  },
];

export function ForWhomSection() {
  return (
    <section id="visitors" className="w-full px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <div className="mb-4 flex items-center gap-4">
            <span className="block h-[2px] w-[60px] bg-white/50" />
            <span className="font-sans text-base font-normal text-white/80">
              For Whom?
            </span>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <h2
            className="max-w-[820px] text-3xl font-medium leading-tight tracking-tight text-white md:text-[52px] md:leading-[1.08]"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-2px" }}
          >
            Whether it&apos;s four friends or{" "}
            <span
              style={{
                background: "linear-gradient(90deg, var(--gs-blue), var(--gs-magenta))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              up to 15 people
            </span>
            , we have a show for you.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a, i) => {
            const Icon = a.icon;
            return (
              <Reveal key={a.title} delay={(i % 3) * 90} className="h-full">
                <div className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-gs-surface to-gs-surface-deep p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/25">
                  <span
                    className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(120% 60% at 50% 0%, color-mix(in srgb, ${a.accent} 12%, transparent), transparent 60%)`,
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="relative flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                    style={{
                      background: `color-mix(in srgb, ${a.accent} 15%, transparent)`,
                    }}
                  >
                    <Icon size={22} style={{ color: a.accent }} />
                  </span>
                  <h3
                    className="relative text-xl font-bold text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {a.title}
                  </h3>
                  <p className="relative text-sm leading-relaxed text-white/60">
                    {a.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
