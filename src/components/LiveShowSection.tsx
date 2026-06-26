"use client";

import {
  Mic,
  Lightbulb,
  Gauge,
  Bell,
  Users,
  Trophy,
  Sparkles,
  ArrowUpRight,
  Volume2,
  Zap,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import Link from "next/link";

const features = [
  { icon: Mic, label: "A host runs the room", text: "No awkward instructions—your host keeps every round moving." },
  { icon: Lightbulb, label: "A proper studio setup", text: "Lights, music and a stage built to make your group feel on-air." },
  { icon: Gauge, label: "Your score is live", text: "Every answer changes the board. Everyone knows who is ahead." },
  { icon: Bell, label: "Everyone gets a moment", text: "Fast buzzers, team choices and games designed for the full group." },
];

const steps = [
  { icon: Users, title: "Split into teams", text: "Your group forms teams, picks any team name and colour, and grabs name tags." },
  { icon: Sparkles, title: "Play three shows", text: "Battle through three live game shows for Challenge Points." },
  { icon: Trophy, title: "Crown a champion", text: "Top team wins a spot on our Champions Wall of Fame." },
];

/** A simulated on-air broadcast frame to plant the 'live TV' feeling. */
function BroadcastFrame() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      {/* glow */}
      <div
        className="animate-spotlight-pulse absolute -inset-6 -z-10 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,46,77,0.25), rgba(20,126,255,0.2) 50%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#0b0b0d] shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        {/* Top bar: LIVE + timer */}
        <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-5 py-3">
          <span className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF2E4D] opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#FF2E4D]" />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              ● Live
            </span>
          </span>
          <span className="font-mono text-sm font-semibold text-[#FFD23F]">
            ROUND 2 · 00:42
          </span>
        </div>

        {/* Stage area */}
        <div
          className="game-show-stage relative overflow-hidden px-6 py-9"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(124,92,252,0.25), transparent 60%), linear-gradient(180deg, #141417, #0b0b0d)",
          }}
        >
          {/* overhead light beams */}
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "conic-gradient(from 210deg at 30% -20%, transparent 0deg, rgba(255,210,63,0.12) 18deg, transparent 36deg), conic-gradient(from 150deg at 70% -20%, transparent 0deg, rgba(20,126,255,0.12) 18deg, transparent 36deg)",
            }}
            aria-hidden="true"
          />

          <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22D3A5]" /> Studio Cam 01
          </div>
          <div className="pointer-events-none absolute right-5 top-5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
            <Volume2 size={12} /> Applause 92%
          </div>

          {/* Scoreboard — teams pick their own name & colour */}
          <div className="relative grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#FFD23F]/40 bg-[#FFD23F]/10 p-4 text-center">
              <p className="text-xs font-bold uppercase tracking-wide text-[#FFD23F]">
                Team Tigers
              </p>
              <p
                className="mt-1 text-4xl font-extrabold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                820
              </p>
            </div>
            <div className="rounded-2xl border border-[#22D3A5]/40 bg-[#22D3A5]/10 p-4 text-center">
              <p className="text-xs font-bold uppercase tracking-wide text-[#22D3A5]">
                Team Cobras
              </p>
              <p
                className="mt-1 text-4xl font-extrabold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                760
              </p>
            </div>
          </div>

          <div className="relative mt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-white/45">
            <span>Live scoreboard</span>
            <span className="flex items-center gap-1.5 text-[#FF8B9C]"><span className="h-1.5 w-1.5 rounded-full bg-[#FF2E4D]" /> Neck and neck</span>
          </div>

          <div className="relative mt-3 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
              <span className="score-race score-race-gold block h-full w-[82%] rounded-full" />
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/45 text-[10px] font-black italic text-white">VS</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
              <span className="score-race score-race-mint block h-full w-[76%] rounded-full" />
            </div>
          </div>

          {/* Buzzer prompt */}
          <div className="relative mt-5 flex items-center justify-center">
            <span className="studio-buzzer animate-shine relative overflow-hidden rounded-full bg-[#FFD23F] px-7 py-3 text-sm font-extrabold uppercase tracking-wide text-black">
              Buzz in now!
            </span>
          </div>

          <div className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
            <span className="flex items-center gap-1.5"><Zap size={12} className="text-[#FFD23F]" /> Double points live</span>
            <span>Question 07 of 10</span>
          </div>
        </div>

        {/* Lower-third caption */}
        <div className="flex items-center gap-3 border-t border-white/10 bg-black/50 px-5 py-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-white"
            style={{ background: "linear-gradient(135deg,#147EFF,#FC19ED)" }}
          >
            <Mic size={16} />
          </span>
          <span className="text-sm text-white/85">
            <span className="font-bold text-white">Your Host:</span> &ldquo;Fingers on
            buzzers… here&rsquo;s the question!&rdquo;
          </span>
        </div>
        <div className="broadcast-ticker overflow-hidden border-t border-white/10 bg-white/[0.03] py-2">
          <p className="ticker-track whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
            Live from Hyderabad &nbsp;•&nbsp; Team Tigers take the lead &nbsp;•&nbsp; Double points in play &nbsp;•&nbsp; Who will make the champions wall? &nbsp;•&nbsp;
          </p>
        </div>
      </div>
    </div>
  );
}

export function LiveShowSection() {
  return (
    <section
      id="live"
      className="relative overflow-hidden bg-[#08080a] px-5 py-20 md:px-10 md:py-28"
    >
      {/* ambient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 12% 20%, rgba(255,46,77,0.10), transparent 60%), radial-gradient(ellipse 50% 40% at 88% 80%, rgba(20,126,255,0.10), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-2">
        {/* Copy */}
        <div>
          <Reveal>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FF2E4D]/40 bg-[#FF2E4D]/10 px-4 py-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF2E4D] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FF2E4D]" />
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                On Air
              </span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h2
              className="text-3xl font-medium leading-tight tracking-tight text-white md:text-[52px] md:leading-[1.05]"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-2px" }}
            >
              You don&apos;t watch a game show.{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #FF2E4D, #FFD23F)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                You ARE the game show.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-4 max-w-[520px] text-base text-white/65 md:text-lg">
              This is a fully hosted live game show for your group—not an arcade and not
              a screen you stand around watching. Arrive with your people; we put you in
              teams, run the rounds, light the stage and crown the winners.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/75">4–15 players</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/75">3 live games</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/75">One champion team</span>
            </div>
          </Reveal>

          {/* Feature pills */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.label} delay={(i % 2) * 90}>
                  <div className="flex items-start gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                      style={{ background: "linear-gradient(135deg,#147EFF,#FC19ED)" }}
                    >
                      <Icon size={18} />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-white">
                        {f.label}
                      </span>
                      <span className="block text-xs leading-relaxed text-white/55">
                        {f.text}
                      </span>
                    </span>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={180}>
            <Link
              href="#tickets"
              className="animate-shine group relative mt-9 inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-black transition-transform hover:scale-[1.03]"
            >
              Put your team on the scoreboard
              <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-5 max-w-[520px] rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm font-bold text-white">Your ticket gets your group the full show.</p>
              <p className="mt-1 text-sm leading-relaxed text-white/60">Bring the people you want to celebrate with. We handle the host, games, scorekeeping and big finish—you show up ready to play.</p>
            </div>
          </Reveal>
        </div>

        {/* Broadcast frame */}
        <Reveal direction="left">
          <BroadcastFrame />
        </Reveal>
      </div>

      {/* How the night runs */}
      <div className="relative mx-auto mt-20 max-w-[1100px]">
        <Reveal>
          <p className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
            How your show runs
          </p>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={i * 120} className="h-full">
                <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#141416] to-[#0c0c0e] p-7 transition-colors hover:border-white/25">
                  <span
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                    style={{ background: "linear-gradient(135deg, #147EFF, #FC19ED)" }}
                  >
                    <Icon size={22} />
                  </span>
                  <span
                    className="animate-step-glow absolute right-6 top-5 bg-clip-text text-5xl font-extrabold text-transparent"
                    style={{
                      fontFamily: "var(--font-display)",
                      backgroundImage:
                        "linear-gradient(135deg, #1FA2FF, #7C5CFC, #FF35E5)",
                      WebkitBackgroundClip: "text",
                      animationDelay: `${i * 1}s`,
                    }}
                  >
                    {i + 1}
                  </span>
                  <h3
                    className="mb-2 text-xl font-bold text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/60">{step.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
