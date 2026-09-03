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
    text: "The office outing people actually talk about on Monday.",
    accent: "var(--gs-gold)",
  },
  {
    icon: Cake,
    title: "Birthday Parties",
    text: "A birthday where the whole group plays, not just watches.",
    accent: "var(--gs-gold)",
  },
  {
    icon: GraduationCap,
    title: "School & College Trips",
    text: "A safe, hosted, high-energy outing students love.",
    accent: "var(--gs-gold)",
  },
  {
    icon: Trophy,
    title: "Sports & Club Groups",
    text: "Settle the score off the field, team versus team.",
    accent: "var(--gs-gold)",
  },
  {
    icon: Heart,
    title: "Friends & Family",
    text: "The weekend plan when everyone wants to actually do something.",
    accent: "var(--gs-gold)",
  },
  {
    icon: PartyPopper,
    title: "Bachelor(ette) Parties",
    text: "Cheeky, themed rounds built for the big celebration.",
    accent: "var(--gs-gold)",
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
              Perfect for
            </span>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <h2
            className="max-w-[820px] text-3xl font-medium leading-tight tracking-tight text-white md:text-[52px] md:leading-[1.08]"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-2px" }}
          >
            Best with{" "}
            <span className="text-gs-gold">6 or more</span>
            . From a group of friends to the whole office, there&apos;s a format for you.
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <p className="mt-4 max-w-[640px] text-base text-white/60 md:text-lg">
            The bigger the group, the bigger the rivalry. Bring 6 or more and the arena
            really comes alive. Smaller group? Message us and we&apos;ll sort it out.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a, i) => {
            const Icon = a.icon;
            return (
              <Reveal key={a.title} delay={(i % 3) * 90} className="h-full">
                <div className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-xl border border-white/10 bg-gs-surface-card p-7 transition-colors duration-300 hover:border-white/20">
                  <span
                    className="relative flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]"
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
