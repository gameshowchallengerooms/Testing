import {
  Lightbulb,
  MessageCircleMore,
  Sparkles,
  Trophy,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

interface Benefit {
  number: string;
  title: string;
  outcome: string;
  icon: LucideIcon;
}

const benefits: Benefit[] = [
  {
    number: "01",
    title: "Communication",
    outcome: "Fast rounds get everyone talking, listening and calling the play.",
    icon: MessageCircleMore,
  },
  {
    number: "02",
    title: "Collaboration",
    outcome: "Different strengths become the fastest route to the buzzer.",
    icon: UsersRound,
  },
  {
    number: "03",
    title: "Creative thinking",
    outcome: "Unexpected challenges reward ideas nobody saw coming.",
    icon: Lightbulb,
  },
  {
    number: "04",
    title: "Friendly competition",
    outcome: "A scoreboard gives the room energy without office hierarchy.",
    icon: Trophy,
  },
  {
    number: "05",
    title: "Shared memories",
    outcome: "Your team leaves with stories that outlast another team lunch.",
    icon: Sparkles,
  },
];

export function TeamBenefitsSection() {
  return (
    <section
      aria-labelledby="team-benefits-heading"
      className="relative isolate overflow-hidden bg-gs-surface-black px-5 py-20 text-white md:px-10 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-12 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-gs-gold/10 blur-[120px] md:h-96 md:w-96"
      />

      <div className="mx-auto max-w-[1200px]">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-gs-gold sm:text-sm">
            What Monday gets back
          </p>
          <h2
            id="team-benefits-heading"
            className="mt-4 font-(--font-display) text-[40px] font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl"
          >
            More than a fun hour out.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl">
            The laughs happen here. The better team dynamic follows you back to work.
          </p>
        </Reveal>

        <div className="relative mt-12 lg:mt-16">
          <div
            aria-hidden="true"
            className="absolute left-[10%] right-[10%] top-8 hidden h-px bg-linear-to-r from-transparent via-gs-gold/40 to-transparent lg:block"
          />

          <ul className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <Reveal
                  as="li"
                  key={benefit.title}
                  delay={index * 80}
                  className="h-full"
                >
                  <article
                    className={cn(
                      "group relative flex h-full items-center gap-4 overflow-hidden rounded-3xl border border-white/10 bg-gs-surface-deep p-5",
                      "transition-all duration-300 hover:-translate-y-1.5 hover:border-gs-gold/45 hover:shadow-[0_24px_60px_-28px_rgba(233,185,73,0.45)]",
                      "sm:min-h-64 sm:flex-col sm:items-start sm:gap-5 sm:p-6"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-1 top-0 font-(--font-display) text-7xl font-black leading-none text-white/[0.035] transition-colors duration-300 group-hover:text-gs-gold/[0.08] sm:right-2 sm:text-8xl"
                    >
                      {benefit.number}
                    </span>

                    <span
                      aria-hidden="true"
                      className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-(image:--gs-gradient-brand) text-gs-surface-black shadow-[0_12px_32px_-14px_rgba(233,185,73,0.8)] sm:h-16 sm:w-16"
                    >
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} />
                    </span>

                    <div className="relative z-10 min-w-0">
                      <h3 className="font-(--font-display) text-lg font-bold leading-tight text-white sm:text-xl">
                        {benefit.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">
                        {benefit.outcome}
                      </p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
