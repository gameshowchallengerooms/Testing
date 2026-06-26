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
    text: "Break the ice and bond your team like never before.",
    accent: "#147EFF",
  },
  {
    icon: Cake,
    title: "Birthday Parties",
    text: "Make their big day genuinely unforgettable.",
    accent: "#FC19ED",
  },
  {
    icon: GraduationCap,
    title: "School & College Trips",
    text: "A safe, hosted, high-energy outing students love.",
    accent: "#FFD23F",
  },
  {
    icon: Trophy,
    title: "Sports & Club Groups",
    text: "Settle the score off the field, team vs. team.",
    accent: "#22D3A5",
  },
  {
    icon: Heart,
    title: "Friends & Family",
    text: "The perfect plan when everyone wants to have fun.",
    accent: "#7C5CFC",
  },
  {
    icon: PartyPopper,
    title: "Bachelor(ette) Parties",
    text: "Cheeky, themed rounds built for the big celebration.",
    accent: "#FF7A1A",
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
            Whether it&apos;s a couple of friends or{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #147EFF, #FC19ED)",
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
                <div className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#161618] to-[#0d0d0f] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/25">
                  <span
                    className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(120% 60% at 50% 0%, ${a.accent}1f, transparent 60%)`,
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="relative flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                    style={{ background: `${a.accent}26` }}
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
