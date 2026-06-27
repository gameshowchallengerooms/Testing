"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Zap, Disc3, Trophy, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";

interface Show {
  name: string;
  accent: string;
  accent2: string;
  icon: typeof Zap;
  rounds: string[];
  finale: string;
}

const shows: Show[] = [
  {
    name: "Primetime Showdowns",
    accent: "#FC19ED",
    accent2: "#7C5CFC",
    icon: Zap,
    rounds: ["Buzzer Pressure", "Speed"],
    finale: "Jackpot Finale",
  },
  {
    name: "Classic Showdowns",
    accent: "#147EFF",
    accent2: "#22D3A5",
    icon: Disc3,
    rounds: ["Spinner Twists", "Household Challenges", "Quiz Battles"],
    finale: "The Drop",
  },
  {
    name: "Challenge Arena",
    accent: "#7C5CFC",
    accent2: "#FC19ED",
    icon: Trophy,
    rounds: ["Teamwork", "Memory", "Speed", "Chaos"],
    finale: "Drop Finale",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const POP = [0.34, 1.4, 0.64, 1] as const;

function ShowCard({ show, index }: { show: Show; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();
  const Icon = show.icon;
  const total = show.rounds.length + 1;

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: EASE }}
      whileHover={reduce ? undefined : { y: -6 }}
      className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0c0c0e]"
    >
      {/* Header band — flooded with the show's colour */}
      <div
        className="relative overflow-hidden px-6 pb-7 pt-6"
        style={{
          background: `linear-gradient(135deg, ${show.accent}, ${show.accent2})`,
        }}
      >
        {/* shine sweep */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(120% 80% at 100% 0%, rgba(255,255,255,0.35), transparent 55%)",
          }}
        />
        <div className="relative flex items-center justify-between">
          <span className="rounded-full bg-black/25 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-sm">
            {total} Rounds
          </span>
          <motion.span
            animate={reduce ? undefined : { rotate: [0, -8, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur"
          >
            <Icon size={22} strokeWidth={2.4} />
          </motion.span>
        </div>
        <h3
          className="relative mt-7 text-[26px] font-extrabold leading-[0.98] text-white md:text-[30px]"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-1px" }}
        >
          {show.name}
        </h3>
      </div>

      {/* Rounds list */}
      <div className="flex flex-1 flex-col gap-2.5 px-5 pb-5 pt-5">
        {show.rounds.map((round, i) => (
          <motion.div
            key={round}
            initial={reduce ? false : { opacity: 0, x: -18 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45, delay: index * 0.12 + 0.25 + i * 0.1, ease: EASE }}
            className="flex items-center gap-3.5 rounded-xl bg-white/[0.04] px-3.5 py-3 ring-1 ring-white/[0.06]"
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[14px] font-black text-white"
              style={{ background: `linear-gradient(140deg, ${show.accent}, ${show.accent2})` }}
            >
              {i + 1}
            </span>
            <span className="text-[15px] font-semibold text-white">{round}</span>
          </motion.div>
        ))}

        {/* Finale banner — the payoff (pinned to the card bottom so all three align) */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.12 + 0.25 + show.rounds.length * 0.1, ease: POP }}
          className="relative mt-auto flex items-center gap-3.5 overflow-hidden rounded-xl px-3.5 py-3.5"
          style={{
            background: "linear-gradient(110deg, rgba(255,210,63,0.16), rgba(255,210,63,0.04))",
            boxShadow: "inset 0 0 0 1px rgba(255,210,63,0.45)",
          }}
        >
          <span className="studio-buzzer flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFD23F] text-black">
            <Trophy size={16} strokeWidth={2.6} />
          </span>
          <span className="flex flex-1 items-center justify-between">
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFD23F]/70">
                Finale
              </span>
              <span className="block text-[15px] font-extrabold text-[#FFD23F]">
                {show.finale}
              </span>
            </span>
            <ChevronRight size={18} className="text-[#FFD23F]/60" />
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function ShowRounds() {
  return (
    <div className="relative mt-16 md:mt-24">
      <Reveal>
        <div className="mb-2 flex items-center gap-4">
          <span className="block h-0.5 w-15" style={{ backgroundColor: "rgba(255,255,255,0.5)" }} />
          <span className="font-sans text-base text-white">Inside Each Show</span>
        </div>
      </Reveal>

      <Reveal delay={60}>
        <h3
          className="max-w-3xl text-3xl font-medium leading-[1.08] text-white md:text-[44px]"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-1.6px" }}
        >
          Every show is a run of rounds, building to one{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #FFD23F, #FC19ED)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            explosive finale.
          </span>
        </h3>
      </Reveal>

      <div className="mt-10 grid items-stretch gap-5 md:mt-12 md:grid-cols-3 md:gap-6">
        {shows.map((show, i) => (
          <ShowCard key={show.name} show={show} index={i} />
        ))}
      </div>
    </div>
  );
}
