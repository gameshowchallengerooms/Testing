import Image from "next/image";
import {
  Blocks,
  Brain,
  CircleDotDashed,
  Gauge,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Cta } from "@/components/ui/cta";

const gameStyles = [
  {
    icon: Brain,
    title: "Trivia & brain teasers",
    description:
      "Think fast, trust your team and hit the buzzer before the other side locks in the answer.",
    accent: "var(--gs-blue-bright)",
  },
  {
    icon: Gauge,
    title: "Speed challenges",
    description:
      "Quick reactions and faster decisions turn simple tasks into loud, last-second finishes.",
    accent: "var(--gs-violet-bright)",
  },
  {
    icon: Blocks,
    title: "Strategy rounds",
    description:
      "Plan together, spot the pattern and choose your move before the clock changes everything.",
    accent: "var(--gs-magenta-bright)",
  },
  {
    icon: CircleDotDashed,
    title: "Buzzer battles",
    description:
      "Head-to-head moments put one player in the spotlight while the rest of the team cheers them on.",
    accent: "var(--gs-gold)",
  },
  {
    icon: UsersRound,
    title: "Team tasks",
    description:
      "Communication matters more than expertise, so quieter players and big personalities both contribute.",
    accent: "var(--gs-mint)",
  },
  {
    icon: Sparkles,
    title: "Surprise finales",
    description:
      "Scores can swing right to the end, keeping both teams involved until the champion is announced.",
    accent: "var(--gs-orange)",
  },
] as const;

export function MiniGamesSection() {
  return (
    <section
      id="mini-games"
      className="relative isolate overflow-hidden bg-black px-5 py-20 text-white md:px-10 md:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70%] bg-[radial-gradient(ellipse_at_top,rgba(124,92,252,0.2),transparent_62%)]"
      />

      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[1fr_0.72fr] lg:items-end lg:pb-12">
          <div>
            <Reveal>
              <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-white/48">
                <span className="h-px w-9 bg-gradient-to-r from-gs-blue-bright via-gs-violet-bright to-gs-magenta-bright" />
                What you&apos;ll play
              </p>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-5 max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl lg:text-7xl">
                Three rounds. Different gameplay every time.
              </h2>
            </Reveal>
          </div>

          <Reveal delay={110} direction="left">
            <p className="max-w-2xl text-base leading-7 text-white/64 sm:text-lg sm:leading-8 lg:ml-auto">
              Your exact line-up can rotate, but every show mixes different skills—so
              nobody needs to be a trivia expert or the fastest person in the room to
              help their team win.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gameStyles.map((game, index) => {
            const Icon = game.icon;

            return (
              <Reveal key={game.title} delay={(index % 3) * 70} className="h-full">
                <article className="group relative flex h-full min-h-64 flex-col overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-b from-gs-surface-panel to-gs-surface-deeper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 sm:p-7">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-20 blur-3xl transition-opacity duration-300 group-hover:opacity-35"
                    style={{ background: game.accent }}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10"
                      style={{
                        color: game.accent,
                        background: `color-mix(in srgb, ${game.accent} 13%, transparent)`,
                      }}
                    >
                      <Icon size={23} strokeWidth={2.2} aria-hidden="true" />
                    </span>
                    <span className="text-5xl font-black leading-none text-white/[0.055]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-8 text-2xl font-bold tracking-[-0.025em] text-white">
                    {game.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/58 sm:text-[15px]">
                    {game.description}
                  </p>

                  <span
                    aria-hidden="true"
                    className="mt-auto block h-px w-12 pt-7 transition-all duration-300 group-hover:w-full"
                    style={{ borderBottom: `1px solid ${game.accent}` }}
                  />
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120}>
          <div className="relative mt-10 overflow-hidden rounded-[24px] border border-white/10 bg-gs-surface-deep px-6 py-8 sm:px-9 md:py-10">
            <Image
              src="/images/gameshowItems.png"
              alt=""
              aria-hidden="true"
              width={2172}
              height={724}
              className="pointer-events-none absolute inset-x-0 bottom-0 h-full w-full object-cover object-center opacity-[0.12]"
            />
            <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xl font-bold text-white sm:text-2xl">
                  Easy rules. A live host. Everyone in the game.
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/58 sm:text-base">
                  We explain every challenge before it begins and adapt the energy to
                  your group, so first-timers can start playing immediately.
                </p>
              </div>
              <Cta href="#show-rounds" badge className="min-h-12 uppercase tracking-[0.08em]">
                Choose your show
              </Cta>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
