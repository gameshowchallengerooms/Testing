"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// BMW design accents.
const BMW_BLUE = "#0066B1";
const BMW_LIGHT = "#1c69d4";

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

// What every ticket includes — framed as the experience.
const included = [
  {
    title: "Step out of the audience.",
    text: "The shows you've watched on TV your whole life — now the lights, the buzzers and the host are all pointed at you.",
  },
  {
    title: "Laugh till it hurts.",
    text: "Your crew, screaming, buzzing in, talking trash, losing their minds. One hour you'll relive for years.",
  },
  {
    title: "Your moment, on the big stage.",
    text: "Mid-show, the host stops everything and the whole room celebrates your birthday or special day.",
  },
  {
    title: "Walk out a champion.",
    text: "Hoist the title, get your team on the Wall of Fame, and leave with a story nobody will believe.",
  },
];

const features = [
  "Real host, studio lights & buzzers",
  "Three live game-show rounds",
  "Champion crowning & Wall of Fame",
  "Taxes included · no hidden costs",
];

const notes = [
  "Extra time @ ₹600 for the whole team (15 minutes).",
  "Kids aged 0–4 years get free admission.",
  "Add-on Celebration Room to cut a cake after your show.",
  "Kids prices apply with a minimum of 2 paying adults.",
];

type DayType = "weekday" | "weekend";

/** Outlined CTA that fills BMW-blue on hover — the signature BMW button. The
 *  filled variant is solid blue from the start (used for the recommended tier). */
function BmwButton({
  href,
  children,
  filled = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  filled?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "bmw-btn group/btn inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[14px] font-semibold uppercase tracking-[0.06em] text-white transition-colors duration-200",
        filled ? "bmw-btn--filled" : "bmw-btn--outline",
        className
      )}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {children}
      <ChevronRight
        size={16}
        strokeWidth={2.5}
        className="transition-transform duration-200 group-hover/btn:translate-x-1"
      />
    </Link>
  );
}

export function PricingSection() {
  const [day, setDay] = useState<DayType>("weekday");

  const priceOf = (t: Tier) => (day === "weekday" ? t.weekday : t.weekend);
  const lowest = Math.min(...tiers.map(priceOf));

  return (
    <section
      id="tickets"
      // BMW: deep near-black stage, structured and cinematic.
      className="w-full px-5 py-24 text-white md:px-10 md:py-32"
      style={{ background: "linear-gradient(180deg, #0a0b0c 0%, #161819 100%)", fontFamily: "var(--font-sans)" }}
    >
      <div className="mx-auto max-w-[1180px]">
        {/* Header — uppercase eyebrow with the BMW-blue tick, tight bold title. */}
        <div className="flex flex-col items-start">
          <span
            className="mb-5 flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            <span className="block h-[2px] w-9" style={{ background: BMW_BLUE }} />
            Pricing
          </span>
          <h2
            className="max-w-[20ch] text-[34px] font-bold leading-[1.04] tracking-[-0.02em] md:text-[58px]"
            style={{ fontFamily: "var(--font-inter-tight, var(--font-display))" }}
          >
            One ticket. The whole experience.
          </h2>
          <p className="mt-5 max-w-[58ch] text-[16px] leading-relaxed text-white/60 md:text-[19px]">
            You&apos;re not buying a ticket — you&apos;re buying the best hour your group will
            have all year. The bigger your group, the less each person pays.
          </p>

          {/* BMW segmented selector — squared, hairline, blue active block. */}
          <div
            className="relative mt-9 grid grid-cols-2"
            style={{ border: "1px solid rgba(255,255,255,0.18)" }}
            role="tablist"
            aria-label="Choose a day"
          >
            <span
              className="absolute top-0 bottom-0 left-0 w-1/2 transition-transform duration-300 ease-out"
              style={{
                background: BMW_BLUE,
                transform: day === "weekday" ? "translateX(0)" : "translateX(100%)",
              }}
              aria-hidden="true"
            />
            <button
              type="button"
              role="tab"
              aria-selected={day === "weekday"}
              onClick={() => setDay("weekday")}
              className={cn(
                "relative z-10 px-7 py-3 text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors",
                day === "weekday" ? "text-white" : "text-white/55 hover:text-white"
              )}
            >
              Mon–Thu
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={day === "weekend"}
              onClick={() => setDay("weekend")}
              className={cn(
                "relative z-10 px-7 py-3 text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors",
                day === "weekend" ? "text-white" : "text-white/55 hover:text-white"
              )}
            >
              Fri–Sun &amp; Holidays
            </button>
          </div>
        </div>

        {/* Model line-up: angular spec panels, recommended one gets a blue top bar. */}
        <div className="mt-14 grid gap-px md:grid-cols-3" style={{ background: "rgba(255,255,255,0.08)" }}>
          {tiers.map((tier) => {
            const price = priceOf(tier);
            const other = day === "weekday" ? tier.weekend : tier.weekday;
            return (
              <div
                key={tier.players}
                className="relative flex flex-col px-7 pb-8 pt-9"
                style={{ background: tier.highlight ? "#1b1e20" : "#101213" }}
              >
                {/* Blue accent bar marks the recommended build. */}
                {tier.highlight && (
                  <span
                    className="absolute inset-x-0 top-0 h-[3px]"
                    style={{ background: BMW_BLUE }}
                    aria-hidden
                  />
                )}

                {/* Eyebrow / badge. */}
                {tier.badge && (
                  <span
                    className="text-[11px] font-bold uppercase tracking-[0.16em]"
                    style={{ color: tier.highlight ? BMW_LIGHT : "rgba(255,255,255,0.45)" }}
                  >
                    {tier.badge}
                  </span>
                )}

                {/* Model name = group size. */}
                <h3
                  className="mt-3 text-[26px] font-bold tracking-[-0.01em] md:text-[28px]"
                  style={{ fontFamily: "var(--font-inter-tight, var(--font-display))" }}
                >
                  {tier.players}
                </h3>

                {/* Price block. */}
                <div className="mt-6">
                  <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-white/45">
                    From
                  </span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span
                      className="text-[42px] font-bold leading-none tracking-[-0.02em] md:text-[46px]"
                      style={{ fontFamily: "var(--font-inter-tight, var(--font-display))" }}
                    >
                      ₹{price}
                    </span>
                    <span className="text-[13px] text-white/50">/ person</span>
                  </div>
                  <p className="mt-2 text-[12px] text-white/40">
                    {day === "weekday" ? "Fri–Sun & Holidays" : "Mon–Thu"}: ₹{other}/person
                  </p>
                </div>

                {/* Spec list, BMW hairline-separated. */}
                <ul className="mt-7 space-y-3 border-t border-white/10 pt-6">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[14px] text-white/70">
                      <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0" style={{ color: BMW_LIGHT }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <BmwButton
                  href="https://gameshowchallengerooms.com/"
                  filled={tier.highlight}
                  className="mt-8 w-full"
                >
                  Build Your Show
                </BmwButton>
              </div>
            );
          })}
        </div>

        {/* From-line, BMW spec note. */}
        <p className="mt-6 text-[13px] uppercase tracking-[0.1em] text-white/45">
          From <span className="font-bold text-white">₹{lowest}</span> per person with 6 or more.
        </p>

        {/* "Standard equipment" — BMW frames inclusions like a feature spec sheet. */}
        <div className="mt-24 border-t border-white/10 pt-14">
          <span className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-white/55">
            <span className="block h-[2px] w-9" style={{ background: BMW_BLUE }} />
            Standard equipment
          </span>
          <h3
            className="mt-5 max-w-[24ch] text-[28px] font-bold tracking-[-0.02em] md:text-[40px]"
            style={{ fontFamily: "var(--font-inter-tight, var(--font-display))" }}
          >
            What&apos;s in every ticket.
          </h3>
          <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {included.map((item, idx) => (
              <div key={item.title} className="flex gap-5 border-t border-white/10 pt-6">
                <span
                  className="text-[14px] font-bold tabular-nums"
                  style={{ color: BMW_LIGHT, fontFamily: "var(--font-inter-tight, var(--font-display))" }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4
                    className="text-[18px] font-bold tracking-[-0.01em] md:text-[20px]"
                    style={{ fontFamily: "var(--font-inter-tight, var(--font-display))" }}
                  >
                    {item.title}
                  </h4>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/60">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kids Play — angular accessory panel. */}
        <div
          className="mt-16 flex flex-col gap-6 px-8 py-9 md:flex-row md:items-center md:justify-between"
          style={{ background: "#101213", borderLeft: `3px solid ${BMW_BLUE}` }}
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: BMW_LIGHT }}>
              Just for the little champions
            </span>
            <h3
              className="mt-2 text-[28px] font-bold tracking-[-0.01em] md:text-[34px]"
              style={{ fontFamily: "var(--font-inter-tight, var(--font-display))" }}
            >
              Kids Play · ₹500
            </h3>
            <p className="mt-1 text-[14px] text-white/55">For ages 5–8 years · ID cards mandatory</p>
          </div>
          <BmwButton href="https://gameshowchallengerooms.com/" className="shrink-0">
            Build Your Show
          </BmwButton>
        </div>

        {/* Notes — fine print, BMW spec-sheet style. */}
        <ul className="mt-12 grid gap-x-10 gap-y-3 border-t border-white/10 pt-8 sm:grid-cols-2">
          {notes.map((note) => (
            <li key={note} className="flex items-start gap-2.5 text-[12px] leading-relaxed text-white/40">
              <span aria-hidden className="mt-1.5 block h-1 w-1 shrink-0" style={{ background: BMW_BLUE }} />
              {note}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
