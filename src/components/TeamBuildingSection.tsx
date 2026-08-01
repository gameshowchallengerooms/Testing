"use client";

import {
  PartyPopper,
  Building2,
  CalendarClock,
  Volleyball,
  GraduationCap,
  HeartHandshake,
  Network,
  Mountain,
  Cake,
  Sparkles,
  Music,
  ArrowUpRight,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Cta } from "@/components/ui/cta";

const eventTypes = [
  { icon: PartyPopper, label: "Festive & Diwali Parties" },
  { icon: Building2, label: "Corporate Events" },
  { icon: CalendarClock, label: "Quarterly Meetings" },
  { icon: Volleyball, label: "Sports Team Outings" },
  { icon: GraduationCap, label: "School & College Trips" },
  { icon: HeartHandshake, label: "Charity Fundraisers" },
  { icon: Network, label: "Networking Mixers" },
  { icon: Mountain, label: "Leadership Retreats" },
];

const addOns = [
  {
    icon: Sparkles,
    title: "Your moment, mid-show",
    text: "The host hits pause and the whole room turns to celebrate your birthday or special day — a spotlight moment you've never had anywhere else.",
  },
  {
    icon: Cake,
    title: "Add the Celebration Room",
    text: "Add the Celebration Room to cut a cake and keep the party going after the final buzzer.",
  },
  {
    icon: Music,
    title: "Any occasion, levelled up",
    text: "Birthdays, anniversaries, farewells, promotions — turn the day into a story they'll never stop telling.",
  },
];

export function TeamBuildingSection() {
  return (
    <section
      id="team-building"
      className="relative overflow-hidden bg-gs-surface-deeper px-5 py-20 md:px-10 md:py-28"
    >
      {/* ambient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 85% 10%, rgba(124,92,252,0.14), transparent 60%), radial-gradient(ellipse 50% 40% at 10% 90%, rgba(20,126,255,0.12), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="max-w-[760px]">
          <Reveal>
            <div className="mb-4 flex items-center gap-4">
              <span className="block h-[2px] w-[60px] bg-white/50" />
              <span className="font-sans text-base font-normal text-white/80">
                Team Building
              </span>
            </div>
          </Reveal>

          <Reveal delay={70}>
            <h2
              className="text-3xl font-medium leading-tight tracking-tight text-white md:text-[52px] md:leading-[1.06]"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-2px" }}
            >
              Hyderabad&apos;s most{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, var(--gs-blue), var(--gs-magenta))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                unforgettable
              </span>{" "}
              team building event
            </h2>
          </Reveal>

          <Reveal delay={130}>
            <p className="mt-5 text-base leading-relaxed text-white/65 md:text-lg">
              Game Show Challenge Rooms is an{" "}
              <span className="font-semibold text-white">
                exciting, engaging, immersive
              </span>{" "}
              live game show that turns any work crew into one team. We&apos;ve hosted
              corporate teams, startups, non-profits, sports clubs and college groups —
              and every single one walks out buzzing.
            </p>
          </Reveal>
        </div>

        {/* Perfect for */}
        <div className="mt-14">
          <Reveal>
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
              Perfect for
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {eventTypes.map((e, i) => {
              const Icon = e.icon;
              return (
                <Reveal key={e.label} delay={(i % 4) * 70}>
                  <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition-colors hover:border-white/25 hover:bg-white/[0.06]">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: "rgba(124,92,252,0.18)" }}
                    >
                      <Icon size={17} className="text-gs-violet-bright" />
                    </span>
                    <span className="text-sm font-medium text-white/85">
                      {e.label}
                    </span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Add-ons */}
        <div className="mt-16 grid gap-5 lg:grid-cols-[1.1fr_2fr] lg:items-center">
          <Reveal>
            <div>
              <h3
                className="text-2xl font-bold text-white md:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Celebrated like never before
              </h3>
              <p className="mt-3 text-base text-white/60">
                Mid-show, the host stops the game and the entire room celebrates{" "}
                <span className="font-semibold text-white">your</span> special moment —
                then add our{" "}
                <span className="font-semibold text-white">Celebration Room</span> to cut a
                cake after the final buzzer.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-3">
            {addOns.map((a, i) => {
              const Icon = a.icon;
              return (
                <Reveal key={a.title} delay={i * 100} className="h-full">
                  <div className="group flex h-full flex-col gap-3 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-gs-surface to-gs-surface-deep p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/25">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
                      style={{ background: "linear-gradient(135deg, var(--gs-blue), var(--gs-magenta))" }}
                    >
                      <Icon size={20} />
                    </span>
                    <h4
                      className="text-lg font-bold text-white"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {a.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-white/55">{a.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* CTA banner */}
        <Reveal delay={100}>
          <div
            className="mt-16 flex flex-col items-center gap-5 overflow-hidden rounded-3xl p-8 text-center md:flex-row md:justify-between md:p-10 md:text-left"
            style={{
              background:
                "var(--gs-gradient-brand)",
            }}
          >
            <div>
              <h3
                className="text-2xl font-bold text-white md:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Planning an office outing?
              </h3>
              <p className="mt-1 text-sm text-white/85 md:text-base">
                Tell us your group size and date — we&apos;ll build the perfect show for
                your team.
              </p>
            </div>
            <Cta href="#tickets" variant="contrast" size="lg">
              Book Your Show
              <ArrowUpRight size={18} />
            </Cta>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
