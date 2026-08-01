"use client";

import { useState } from "react";
import { ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Cta } from "@/components/ui/cta";

// Selection accent for the segmented pickers — brand blue, from the token set.
const SELECT_ACCENT = "var(--gs-blue)";

const BOOKING_URL = "https://gameshowchallengerooms.com/";

type DayType = "weekday" | "weekend";

/** One show tier (a configurable "model" in the BMW line-up). The price grid is
 *  keyed by player count → [weekday, weekend] so picking a group size + day
 *  reveals exactly that build's per-person price — no spreadsheet, just your
 *  number. 6, 7 and 8 share the best price, so they collapse to a single "6+"
 *  entry the configurator surfaces as "best price, locked in". */
interface ShowTier {
  label: string;
  /** TWO-tone label: dim eyebrow + bold name (matches the brochure). */
  eyebrow: string;
  tagline: string;
  accent: string;
  /** WCAG-safe text variant of the accent for the price + name. */
  ink: string;
  features: string[];
  popular?: boolean;
  /** price[playerKey] = [weekday, weekend], per person. */
  price: Record<PlayerKey, [number, number]>;
}

// Player-count options. 6, 7 and 8 all land on the same (lowest) price, so they
// collapse into one "6+" build — the BMW configurator never shows a redundant
// grid; it just tells you you've hit the best price.
type PlayerKey = "4" | "5" | "6+";

// Minimum group size is 4 — the selector never offers fewer.
const playerOptions: { key: PlayerKey; label: string; sub: string }[] = [
  { key: "4", label: "4", sub: "players" },
  { key: "5", label: "5", sub: "players" },
  { key: "6+", label: "6+", sub: "best price" },
];

const tiers: ShowTier[] = [
  {
    label: "The Classic",
    eyebrow: "The original",
    tagline: "The pure live game show experience.",
    accent: "var(--gs-blue)",
    ink: "var(--gs-blue-bright)",
    features: [
      "Live game show host",
      "Core buzzer & challenge rounds",
      "Team-based competition",
      "Scores, fun twists & winner moments",
      "Approx. 45 minutes of play",
    ],
    price: {
      "4": [900, 1000],
      "5": [800, 900],
      "6+": [750, 850],
    },
  },
  {
    label: "Prime Time",
    eyebrow: "Most popular",
    tagline: "Where the game show meets the party.",
    accent: "var(--gs-violet)",
    ink: "var(--gs-violet-bright)",
    popular: true,
    features: [
      "Live host & full game show",
      "House-party style group games",
      "More social, high-energy format",
      "Lively moments & big group fun",
      "Approx. 60 minutes of play",
    ],
    price: {
      "4": [1049, 1149],
      "5": [949, 1049],
      "6+": [899, 999],
    },
  },
];

// Fine print — the conditions strip from the brochure, plus the real add-on
// and kids notes carried over from the original section.
const notes = [
  "Minimum 4 players required.",
  "Weekend pricing applies Fri, Sat, Sun & public holidays.",
  "Arrive 15 minutes before your slot.",
  "Prices may vary for special dates, corporate events & large groups.",
  "Extra time @ ₹600 for the whole team (15 minutes).",
  "Add-on Celebration Room to cut a cake after your show.",
];

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
    <Cta
      href={href}
      variant={filled ? "primary" : "secondary"}
      className={cn("uppercase tracking-[0.06em]", className)}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {children}
      <ChevronRight
        size={16}
        strokeWidth={2.5}
        className="transition-transform duration-200 group-hover/cta:translate-x-1"
      />
    </Cta>
  );
}

export function PricingSection() {
  // The two configurator axes: how many of you, and which day.
  const [players, setPlayers] = useState<PlayerKey>("6+");
  const [day, setDay] = useState<DayType>("weekday");

  const dayIndex = day === "weekday" ? 0 : 1;
  const priceOf = (t: ShowTier) => t.price[players][dayIndex];
  const lowest = Math.min(...tiers.map(priceOf));

  return (
    <section
      id="tickets"
      // BMW: deep near-black stage, structured and cinematic.
      className="w-full px-5 py-24 text-white md:px-10 md:py-32"
      style={{ background: "linear-gradient(180deg, var(--gs-surface-deeper) 0%, var(--gs-surface-sunken) 100%)", fontFamily: "var(--font-sans)" }}
    >
      <div className="mx-auto max-w-[1180px]">
        {/* Header — uppercase eyebrow with the BMW-blue tick, tight bold title. */}
        <div className="flex flex-col items-start">
          <span
            className="mb-5 flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            <span className="block h-[2px] w-9" style={{ background: SELECT_ACCENT }} />
            Pricing
          </span>
          <h2
            className="max-w-[20ch] text-[34px] font-bold leading-[1.04] tracking-[-0.02em] md:text-[58px]"
            style={{ fontFamily: "var(--font-inter-tight, var(--font-display))" }}
          >
            Build your show. See your price.
          </h2>
          <p className="mt-5 max-w-[58ch] text-[16px] leading-relaxed text-white/60 md:text-[19px]">
            Pick your group size and your day — the per-person price for every show
            updates instantly. The bigger your group, the less each person pays.
          </p>
        </div>

        {/* ── BMW configurator: two axes (group size + day) ─────────────────── */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          {/* Axis 1 — group size, as squared BMW spec chips. */}
          <div>
            <span className="mb-3 block text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45">
              Your group
            </span>
            <div
              className="grid grid-cols-3"
              style={{ border: "1px solid rgba(255,255,255,0.18)" }}
              role="group"
              aria-label="Choose your group size"
            >
              {playerOptions.map((opt, i) => {
                const active = players === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setPlayers(opt.key)}
                    className={cn(
                      "flex flex-col items-center gap-0.5 py-3.5 transition-colors",
                      i > 0 && "border-l border-white/15",
                      active ? "text-white" : "text-white/55 hover:text-white"
                    )}
                    style={active ? { background: SELECT_ACCENT } : undefined}
                  >
                    <span
                      className="text-[20px] font-bold leading-none tabular-nums"
                      style={{ fontFamily: "var(--font-inter-tight, var(--font-display))" }}
                    >
                      {opt.label}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.08em] opacity-70">
                      {opt.sub}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2.5 text-[12px] text-white/45">
              {players === "6+"
                ? "6, 7 or 8 players — you're at the best per-person price. It won't drop further."
                : "Add more players to bring the per-person price down — it bottoms out at 6+."}
            </p>
          </div>

          {/* Axis 2 — day, the existing squared BMW segmented selector. */}
          <div>
            <span className="mb-3 block text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45">
              Your day
            </span>
            <div
              className="relative grid grid-cols-2"
              style={{ border: "1px solid rgba(255,255,255,0.18)" }}
              role="tablist"
              aria-label="Choose a day"
            >
              <span
                className="absolute top-0 bottom-0 left-0 w-1/2 transition-transform duration-300 ease-out"
                style={{
                  background: SELECT_ACCENT,
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
                  "relative z-10 px-5 py-[18px] text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors",
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
                  "relative z-10 px-5 py-[18px] text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors",
                  day === "weekend" ? "text-white" : "text-white/55 hover:text-white"
                )}
              >
                Fri–Sun &amp; Holidays
              </button>
            </div>
            <p className="mt-2.5 text-[12px] text-white/45">
              Weekend pricing applies Fri, Sat, Sun &amp; public holidays.
            </p>
          </div>
        </div>

        {/* ── The three show tiers — prices react to the configurator ───────── */}
        <div className="mt-12 grid gap-px md:grid-cols-2" style={{ background: "rgba(255,255,255,0.08)" }}>
          {tiers.map((tier) => {
            const price = priceOf(tier);
            const other = tier.price[players][day === "weekday" ? 1 : 0];
            return (
              <div
                key={tier.label}
                className="relative flex flex-col px-7 pb-8 pt-9"
                style={{ background: tier.popular ? "var(--gs-surface-raised)" : "var(--gs-surface-deep)" }}
              >
                {/* Accent bar marks the recommended build, in the tier's colour. */}
                <span
                  className="absolute inset-x-0 top-0 h-[3px]"
                  style={{ background: tier.popular ? tier.accent : "transparent" }}
                  aria-hidden
                />

                {/* Eyebrow / badge. */}
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.16em]"
                  style={{ color: tier.popular ? tier.ink : "rgba(255,255,255,0.45)" }}
                >
                  {tier.eyebrow}
                </span>

                {/* Model name = show tier. */}
                <h3
                  className="mt-2 text-[26px] font-bold tracking-[-0.01em] md:text-[30px]"
                  style={{ fontFamily: "var(--font-inter-tight, var(--font-display))", color: tier.ink }}
                >
                  {tier.label}
                </h3>
                <p className="mt-2 text-[14px] leading-snug text-white/55">{tier.tagline}</p>

                {/* Price block — driven by the configurator. */}
                <div className="mt-6">
                  <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-white/45">
                    {players === "6+" ? "From" : `For ${players} players`}
                  </span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span
                      className="text-[42px] font-bold leading-none tracking-[-0.02em] md:text-[46px]"
                      style={{ fontFamily: "var(--font-inter-tight, var(--font-display))" }}
                    >
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[13px] text-white/50">/ person</span>
                  </div>
                  <p className="mt-2 text-[12px] text-white/40">
                    {day === "weekday" ? "Fri–Sun & Holidays" : "Mon–Thu"}: ₹
                    {other.toLocaleString("en-IN")}/person
                  </p>
                </div>

                {/* Spec list, BMW hairline-separated. */}
                <ul className="mt-7 space-y-3 border-t border-white/10 pt-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[14px] text-white/70">
                      <Check
                        size={16}
                        strokeWidth={2.5}
                        className="mt-0.5 shrink-0"
                        style={{ color: tier.ink }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <BmwButton href={BOOKING_URL} filled={tier.popular} className="mt-8 w-full">
                  Book {tier.label}
                </BmwButton>
              </div>
            );
          })}
        </div>

        {/* From-line, BMW spec note — reflects the current configuration. */}
        <p className="mt-6 text-[13px] uppercase tracking-[0.1em] text-white/45">
          From <span className="font-bold text-white">₹{lowest.toLocaleString("en-IN")}</span> per person
          {players === "6+" ? " with 6 or more" : ` for ${players} players`} on{" "}
          {day === "weekday" ? "weekdays" : "weekends"}.
        </p>

        {/* Notes — fine print, BMW spec-sheet style. */}
        <ul className="mt-12 grid gap-x-10 gap-y-3 border-t border-white/10 pt-8 sm:grid-cols-2">
          {notes.map((note) => (
            <li key={note} className="flex items-start gap-2.5 text-[12px] leading-relaxed text-white/40">
              <span aria-hidden className="mt-1.5 block h-1 w-1 shrink-0" style={{ background: SELECT_ACCENT }} />
              {note}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
