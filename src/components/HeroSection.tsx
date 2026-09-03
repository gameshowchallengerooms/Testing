"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { ArrowDown, Star } from "lucide-react";
import { useLowPowerMode } from "@/hooks/useLowPowerMode";
import { Cta } from "@/components/ui/cta";

// ─── Copy ────────────────────────────────────────────────────────────────────

const WORDS = ["The most", "fun thing", "to do in", "Hyderabad."];

const PARA_TEXT =
  "A live, hosted challenge arena for your whole gang. Split into two teams, take on three rounds of trivia, puzzle, speed and physical challenges, and fight for the championship.";
const EMPHASIS = new Set(["live,", "three", "championship."]);

// Headline size. Four lines must fit inside one viewport together with the
// setup copy, paragraph, pill and buttons, so each line gets ~10.5dvh; the vw
// term caps it on narrow phones so the widest line ("HYDERABAD.") fits.
const HEADLINE_FONT_SIZE = "clamp(40px, min(12.5vw, 10.5dvh), 156px)";

// ─── Stage characters (one CSS-driven moment, compositor-only) ───────────────

const PAPARAZZI = [
  { side: "left", src: "/images/hero-paparazzi/paparazzi-left.png" },
  { side: "right", src: "/images/hero-paparazzi/paparazzi-right.png" },
] as const;

function PaparazziCharacter({
  side,
  src,
}: {
  side: (typeof PAPARAZZI)[number]["side"];
  src: (typeof PAPARAZZI)[number]["src"];
}) {
  return (
    <div className={cn("paparazzi", `paparazzi-${side}`)}>
      <Image
        src={src}
        alt=""
        fill
        loading="eager"
        sizes="(max-width: 767px) 48vw, 27vw"
        className="select-none object-contain"
        draggable={false}
      />
      <span className={cn("camera-flash", `camera-flash-${side}`)}>
        <span className="camera-flash-halo" />
        <span className="camera-flash-star" />
        <span className="camera-flash-ring" />
      </span>
    </div>
  );
}

/** The photographers' flash moment. Weak devices get them as a still; phones
 *  (below md) don't get the characters at all, so the headline owns the frame. */
function PaparazziScene({ still }: { still: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-4 hidden overflow-hidden md:block"
    >
      <div
        className={cn(
          "paparazzi-scene paparazzi-scene-active absolute inset-0",
          still && "paparazzi-scene-still",
        )}
      >
        {PAPARAZZI.map(({ side, src }) => (
          <PaparazziCharacter key={side} side={side} src={src} />
        ))}
      </div>
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

/**
 * One viewport, no pinning. Everything enters once with a short staggered
 * fade-up (the `hero-enter` keyframes in globals.css) and then the page is a
 * normal page: the first real content is one scroll away.
 */
export function HeroSection() {
  const lowPower = useLowPowerMode();
  const paraWords = PARA_TEXT.split(" ");

  return (
    <section className="relative w-full overflow-hidden bg-black" style={{ minHeight: "100dvh" }}>
      <div className="absolute inset-0">
        <Image
          src="/images/pSSINVOSMIf4PhqxNRckBByjw.webp"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-1"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 45%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.70) 100%), linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.85) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Stage spotlights. Weak devices get the gradient overlay alone. */}
      {!lowPower && (
        <div className="absolute inset-0 z-2 overflow-hidden opacity-70" aria-hidden="true">
          <span className="beam beam-left" />
          <span className="beam beam-center" />
          <span className="beam beam-right" />
        </div>
      )}

      <PaparazziScene still={lowPower} />

      <div className="hero-content relative z-5 flex flex-col items-center justify-center px-5 text-center md:px-10" style={{ minHeight: "100dvh" }}>
        <div className="flex w-full min-w-0 max-w-260 flex-col items-center gap-[clamp(0.5rem,2.5dvh,2.5rem)]">
          <p className="hero-setup hero-enter hero-enter-1 max-w-180 text-sm font-medium leading-relaxed text-white/80 md:text-lg">
            Birthday? Cousins in town? Office outing? Weekend plan with friends?
            Bring your gang to{" "}
            <span className="font-semibold text-white">Hyderabad&apos;s live challenge arena</span>,
            where two teams battle it out for an hour and the host runs the show.
          </p>

          <div className="flex w-full min-w-0 flex-col items-center">
            <h1
              className="w-full max-w-full font-(--font-display) uppercase text-white"
              style={{ textShadow: "0 6px 40px rgba(0,0,0,0.45)" }}
            >
              {WORDS.map((w, i) => (
                <span
                  key={w}
                  className={cn("hero-enter block font-black tracking-tight", `hero-enter-${i + 2}`)}
                  style={{ fontSize: HEADLINE_FONT_SIZE, lineHeight: 0.97 }}
                >
                  {w}
                </span>
              ))}
            </h1>

            <p className="hero-enter hero-enter-6 mt-[clamp(0.5rem,1.8dvh,1rem)] max-w-135 text-sm text-white/70 md:text-base">
              {paraWords.map((w, i) => (
                <span key={`${w}-${i}`} className={EMPHASIS.has(w) ? "font-semibold text-white" : undefined}>
                  {w}
                  {i < paraWords.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
          </div>

          <div className="hero-enter hero-enter-7 inline-flex max-w-[min(92vw,30rem)] items-center gap-2.5 rounded-full border border-white/15 bg-black/35 px-5 py-2.5 backdrop-blur-md">
            <Star size={15} className="shrink-0 fill-gs-gold text-gs-gold" />
            <span className="text-sm font-semibold text-white">
              <span className="text-gs-gold">Friends, cousins or office gang</span> · 45–60 minutes · hosted live
            </span>
          </div>

          <div className="hero-enter hero-enter-7 flex w-full max-w-[min(92vw,30rem)] flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:justify-center">
            <Cta
              href="#how-it-works"
              variant="secondary"
              size="lg"
              className="text-sm tracking-[0.02em] backdrop-blur-md"
            >
              See how it works
              <ArrowDown size={16} strokeWidth={2.5} aria-hidden="true" />
            </Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
