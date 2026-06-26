"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Users, Sparkles, Lock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tier {
  players: string;
  weekday: number;
  weekend: number;
  highlight?: boolean;
  badge?: string;
}

const tiers: Tier[] = [
  { players: "4 Players", weekday: 900, weekend: 1000, badge: "Minimum group" },
  { players: "5 Players", weekday: 800, weekend: 900, badge: "Popular" },
  { players: "6 & more", weekday: 750, weekend: 850, highlight: true, badge: "Best Value" },
];

// Emotion-first value stack — sell the feeling, not the feature list.
const included = [
  {
    title: "Step out of the audience.",
    text: "The shows you've watched on TV your whole life — now the lights, the buzzers and the host are all pointed at YOU.",
  },
  {
    title: "Laugh till it hurts.",
    text: "Your crew, screaming, buzzing in, talking trash, losing their minds. One hour you'll relive for years.",
  },
  {
    title: "Your moment, on the big stage.",
    text: "Mid-show, the host stops everything and the whole room celebrates your birthday or special day — the spotlight on you like never before.",
  },
  {
    title: "Walk out a champion.",
    text: "Hoist the title, get your team on the Wall of Fame, and leave with a story nobody back home will believe.",
  },
];

const notes = [
  "Extra time @ ₹600 for the whole team (15 minutes).",
  "Kids aged 0-4 years get free admission.",
  "Add-on Celebration Room to cut a cake after your show.",
  "Kids prices apply with a minimum of 2 paying adults.",
];

type DayType = "weekday" | "weekend";

export function PricingSection() {
  const [day, setDay] = useState<DayType>("weekday");

  const lowest = Math.min(...tiers.map((t) => (day === "weekday" ? t.weekday : t.weekend)));

  return (
    <section
      id="tickets"
      className="relative overflow-hidden bg-black px-5 py-20 md:px-10 md:py-28"
    >
      {/* Ambient stage glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-10 h-[420px] w-[820px] -translate-x-1/2 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(124,92,252,0.18) 0%, rgba(231,160,191,0.12) 50%, transparent 72%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FFD23F]/40 bg-[#FFD23F]/10 px-4 py-1.5 text-xs font-semibold text-[#FFD23F]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FFD23F] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FFD23F]" />
            </span>
            The only live game show in Hyderabad
          </span>
          <h2
            className="max-w-[820px] text-3xl font-medium leading-tight tracking-tight text-white md:text-[56px] md:leading-[1.05]"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-2px" }}
          >
            One ticket. The whole{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #147EFF, #FC19ED)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              experience
            </span>
            .
          </h2>
          <p className="mt-4 max-w-[560px] text-base text-white/65 md:text-lg">
            You&apos;re not buying a ticket. You&apos;re buying the best hour your group
            will have all year — and the bigger your group, the less each person pays.
          </p>

          {/* Day toggle */}
          <div className="relative mt-8 grid w-full max-w-md grid-cols-2 rounded-full border border-white/15 bg-white/5 p-1 backdrop-blur">
            <span
              className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full transition-transform duration-300 ease-out"
              style={{
                background: "linear-gradient(135deg, #7C5CFC, #C77DBA)",
                transform: day === "weekday" ? "translateX(0)" : "translateX(100%)",
              }}
              aria-hidden="true"
            />
            <button
              onClick={() => setDay("weekday")}
              className={cn(
                "relative z-10 rounded-full px-4 py-2.5 text-center text-sm font-semibold transition-colors",
                day === "weekday" ? "text-white" : "text-white/60 hover:text-white"
              )}
            >
              Mon–Thu
            </button>
            <button
              onClick={() => setDay("weekend")}
              className={cn(
                "relative z-10 rounded-full px-4 py-2.5 text-center text-sm font-semibold transition-colors",
                day === "weekend" ? "text-white" : "text-white/60 hover:text-white"
              )}
            >
              Fri–Sun & Holidays
            </button>
          </div>
        </div>

        {/* Two-column: value stack (left) + price tiers (right) */}
        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-stretch">
          {/* Value stack — makes the price feel like a steal */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#161618] to-[#0d0d0f] p-8">
            <span
              className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-25 blur-2xl"
              style={{ background: "linear-gradient(135deg,#147EFF,#FC19ED)" }}
              aria-hidden="true"
            />
            <p className="relative text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
              What you&apos;re really paying for
            </p>
            <ul className="relative mt-7 space-y-7">
              {included.map((item, idx) => (
                <li key={item.title} className="flex items-start gap-4">
                  <span
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
                    style={{
                      background: "linear-gradient(135deg,#147EFF,#FC19ED)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span>
                    <span
                      className="block text-lg font-bold text-white md:text-xl"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.title}
                    </span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-white/65">
                      {item.text}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            {/* Enjoyment guarantee + risk reversal */}
            <div className="relative mt-8 border-t border-white/10 pt-6">
              <p
                className="text-lg font-bold md:text-xl"
                style={{
                  background: "linear-gradient(90deg,#FFD23F,#FC19ED)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "var(--font-display)",
                }}
              >
                You will have the time of your life. Guaranteed.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/70">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#22D3A5]" /> Taxes included
                </span>
                <span className="flex items-center gap-2">
                  <Lock size={16} className="text-[#22D3A5]" /> No hidden costs
                </span>
              </div>
            </div>
          </div>

          {/* Price tiers */}
          <div className="flex flex-col gap-4">
            {tiers.map((tier, i) => {
              const price = day === "weekday" ? tier.weekday : tier.weekend;
              const other = day === "weekday" ? tier.weekend : tier.weekday;
              return (
                <div
                  key={tier.players}
                  className={cn(
                    "animate-fade-in-up group relative flex items-center justify-between overflow-hidden rounded-3xl p-6 opacity-0 transition-all duration-300 hover:-translate-y-1",
                    tier.highlight
                      ? "border border-transparent"
                      : "border border-white/10 bg-gradient-to-b from-[#17171a] to-[#0f0f11] hover:border-white/25"
                  )}
                  style={{
                    animationDelay: `${i * 90}ms`,
                    ...(tier.highlight
                      ? {
                          background:
                            "linear-gradient(120deg, #7C5CFC 0%, #9d6bd6 45%, #C77DBA 100%)",
                          boxShadow: "0 24px 60px rgba(124,92,252,0.35)",
                        }
                      : {}),
                  }}
                >
                  {/* Left: group size + badge */}
                  <div className="relative flex flex-col gap-2">
                    {tier.badge && (
                      <span
                        className={cn(
                          "inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide",
                          tier.highlight
                            ? "bg-white text-[#7C5CFC]"
                            : "bg-white/10 text-white/80"
                        )}
                      >
                        {tier.highlight && <Sparkles size={12} />}
                        {tier.badge}
                      </span>
                    )}
                    <span
                      className={cn(
                        "flex items-center gap-2 text-lg font-bold",
                        tier.highlight ? "text-white" : "text-white"
                      )}
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      <Users size={18} />
                      {tier.players}
                    </span>
                    <span
                      className={cn(
                        "text-xs",
                        tier.highlight ? "text-white/70" : "text-white/40"
                      )}
                    >
                      {day === "weekday" ? "Weekend" : "Weekday"}: ₹{other}/person
                    </span>
                  </div>

                  {/* Right: price + CTA */}
                  <div className="relative flex flex-col items-end gap-2">
                    <div className="flex items-baseline gap-1">
                      <span
                        className="text-4xl font-extrabold text-white md:text-5xl"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        ₹{price}
                      </span>
                      <span
                        className={cn(
                          "text-xs",
                          tier.highlight ? "text-white/70" : "text-white/40"
                        )}
                      >
                        /person
                      </span>
                    </div>
                    <Link
                      href="https://gameshowchallengerooms.com/"
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition-colors",
                        tier.highlight
                          ? "bg-white text-[#7C5CFC] hover:bg-white/90"
                          : "bg-white/10 text-white hover:bg-white/20"
                      )}
                    >
                      Book Your Show
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* Reassurance under tiers */}
            <p className="mt-1 text-center text-sm text-white/50">
              From{" "}
              <span className="font-semibold text-white">₹{lowest}</span> per person when
              you bring 6 or more.
            </p>
          </div>
        </div>

        {/* Kids + Notes */}
        <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,360px)_1fr]">
          {/* Kids play card */}
          <div
            className="relative flex flex-col justify-center overflow-hidden rounded-3xl p-7"
            style={{ background: "linear-gradient(135deg, #FFD400, #FFB020)" }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-black/60">
              Just for the little champions
            </span>
            <span
              className="mt-2 text-4xl font-extrabold tracking-tight text-black md:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Kids Play @ ₹500
            </span>
            <span className="mt-2 text-sm font-semibold text-black/70">
              For ages 5–8 years · ID cards mandatory
            </span>
          </div>

          {/* Notes */}
          <ul className="grid content-center gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:grid-cols-2">
            {notes.map((note) => (
              <li key={note} className="flex items-start gap-3">
                <span className="mt-1.5 h-[6px] w-[6px] shrink-0 rotate-45 bg-gradient-to-br from-[#147EFF] to-[#FC19ED]" />
                <span className="text-sm text-white/70">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
