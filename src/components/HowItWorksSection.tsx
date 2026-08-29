import Image from "next/image";
import { Clock3, Flag, Sparkles, Swords, UsersRound } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Cta } from "@/components/ui/cta";

const experienceFacts = [
  { value: "4–15", label: "players" },
  { value: "45–60", label: "minutes" },
  { value: "2", label: "teams" },
  { value: "1", label: "live host" },
] as const;

const steps = [
  {
    icon: Clock3,
    title: "Book your time",
    text: "Tell us your group size and preferred date. We’ll confirm the available slot, show format and exact price before you arrive.",
    accent: "var(--gs-blue-bright)",
  },
  {
    icon: UsersRound,
    title: "Choose your teams",
    text: "At the venue, your group splits into two teams, picks names and colours, and gets a quick briefing from the host.",
    accent: "var(--gs-violet-bright)",
  },
  {
    icon: Swords,
    title: "Play three rounds",
    text: "Compete in a rotating mix of strategy, trivia, speed and team challenges. Every round earns Challenge Points.",
    accent: "var(--gs-magenta-bright)",
  },
  {
    icon: Flag,
    title: "Crown the champions",
    text: "The final scores decide the winning team, complete with the victory moment, bragging rights and a place on the Champions Wall.",
    accent: "var(--gs-gold)",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden bg-gs-surface-black px-5 py-20 text-white md:px-10 md:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(20,126,255,0.15),transparent_34%),radial-gradient(circle_at_85%_72%,rgba(252,25,237,0.12),transparent_32%)]"
      />

      <div className="mx-auto max-w-[1280px]">
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <Reveal direction="right" emphasis="bold">
            <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-gs-surface-deep shadow-[0_30px_100px_-55px_rgba(69,166,255,0.8)]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/shows/elite-edition.webp"
                  alt="Illustrated game-show host presenting a trophy to a celebrating team"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gs-surface-deep via-transparent to-transparent" />
              </div>

              <div className="relative -mt-16 p-6 pt-0 sm:p-8 sm:pt-0">
                <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
                  {experienceFacts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex min-h-24 flex-col items-center justify-center bg-gs-surface-card/95 px-3 py-4 text-center backdrop-blur-md"
                    >
                      <span className="text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
                        {fact.value}
                      </span>
                      <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/48">
                        {fact.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-white/48">
                <span className="h-px w-9 bg-gradient-to-r from-gs-blue-bright to-gs-magenta-bright" />
                Your first show, explained
              </p>
            </Reveal>

            <Reveal delay={70}>
              <h2 className="mt-5 max-w-3xl text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                Walk in as a group. Leave as game-show champions.
              </h2>
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/66 sm:text-lg sm:leading-8">
                This is a private, hosted group experience—not an arcade game or an
                escape room. Everyone plays together, the host runs the show, and we
                handle every detail from the first team name to the final score.
              </p>
            </Reveal>

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <Reveal key={step.title} delay={150 + index * 60} className="h-full">
                    <article className="flex h-full gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition-colors duration-300 hover:border-white/22 hover:bg-white/[0.055]">
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10"
                        style={{
                          background: `color-mix(in srgb, ${step.accent} 12%, transparent)`,
                          color: step.accent,
                        }}
                      >
                        <Icon size={20} strokeWidth={2.3} aria-hidden="true" />
                      </span>
                      <div>
                        <p
                          className="text-[10px] font-bold uppercase tracking-[0.2em]"
                          style={{ color: step.accent }}
                        >
                          Step {index + 1}
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-white">{step.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-white/58">{step.text}</p>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={390}>
              <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-sm font-semibold text-white/72">
                  <Sparkles size={17} className="text-gs-gold" aria-hidden="true" />
                  No preparation or special knowledge needed.
                </p>
                <Cta href="#show-rounds" variant="secondary" className="uppercase tracking-[0.1em]">
                  Compare the shows
                </Cta>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
