"use client";

import { Camera } from "lucide-react";
import { Reveal } from "@/components/Reveal";

/**
 * Real-moments gallery. The single highest-converting image type for an
 * experience business is real people having fun — faces + emotion = "people
 * like me did this".
 *
 * TODO(assets): replace each placeholder tile's background with a real photo,
 * e.g. <Image src="/images/moments/win.jpg" fill ... />. Keep the captions —
 * captions on real photos lift conversions.
 */
const tiles = [
  { caption: "The winning buzzer moment", span: "md:col-span-2 md:row-span-2", accent: "#147EFF" },
  { caption: "Red-hot rivalry", span: "", accent: "#FF2E4D" },
  { caption: "Champions on the wall", span: "", accent: "#FFD23F" },
  { caption: "The whole crew, all in", span: "md:col-span-2", accent: "#22D3A5" },
  { caption: "Cake in the Celebration Room", span: "", accent: "#FC19ED" },
];

export function MomentsGallery() {
  return (
    <section className="relative overflow-hidden bg-black px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <div className="mb-3 flex items-center gap-4">
            <span className="block h-[2px] w-[60px] bg-white/50" />
            <span className="font-sans text-base font-normal text-white/80">
              Real moments
            </span>
          </div>
        </Reveal>
        <Reveal delay={70}>
          <h2
            className="max-w-[760px] text-3xl font-medium leading-tight tracking-tight text-white md:text-[48px] md:leading-[1.08]"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-1.5px" }}
          >
            This is what your group&apos;s night looks like.
          </h2>
        </Reveal>

        <div className="mt-10 grid auto-rows-[160px] grid-cols-2 gap-3 md:auto-rows-[200px] md:grid-cols-4">
          {tiles.map((tile, i) => (
            <Reveal
              key={tile.caption}
              delay={(i % 4) * 70}
              className={tile.span}
            >
              <figure
                className="group relative flex h-full w-full items-end overflow-hidden rounded-2xl border border-white/10"
                style={{
                  background: `linear-gradient(150deg, ${tile.accent}22 0%, #111114 60%)`,
                }}
              >
                {/* Placeholder marker — replace with a real <Image fill /> */}
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-white/15">
                  <Camera size={34} />
                </span>
                <span
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)",
                  }}
                  aria-hidden="true"
                />
                <figcaption className="relative z-10 p-4 text-sm font-semibold text-white">
                  {tile.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-white/30">
          Photos from real shows coming soon.
        </p>
      </div>
    </section>
  );
}
