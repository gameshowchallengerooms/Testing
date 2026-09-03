"use client";

import Image, { getImageProps } from "next/image";

/**
 * "Introducing" — a plain section: kicker, logo, the paragraph that says what
 * this is, and the poster. No pinning, no scroll-scrubbing; it reads top to
 * bottom like the rest of the page.
 */
const POSTER_COPY =
  "Picture this: your group walks into a neon-lit arena, splits into two teams, and a live host calls the first challenge. Buzzers, puzzles, speed rounds and physical challenges, with the scores climbing on the board and the other team trash-talking across the floor. That’s Game Show Challenge Rooms—an immersive, hosted challenge experience in Hyderabad where nobody watches from the sidelines. Everyone plays, everyone competes, and one team walks out as champions.";

// The source file is already an optimized 67 KB webp; running it through
// /_next/image at high quality re-encodes it LARGER (~104 KB) and, in dev,
// generates it on demand — the partial-paint flicker on slow loads. Serve it
// untouched, and fade in from a tiny inline preview while it downloads.
const LOGO_BLUR =
  "data:image/webp;base64,UklGRhIBAABXRUJQVlA4WAoAAAAQAAAADwAACQAAQUxQSHMAAAABcKpt25O8JCpnAHlPtWlE456V5GWnuQ6B7uocAd1tW1U7zb1t/38KETEBMDw/mB4fj8Mk8D0DaEWDruuIouN2B1ELQi9MZbKlar2cTSfDHn/+U54WNPMBTZ/TyTQOzJnkxABYkywBgE00x/vvZzNsxFkAAFZQOCB4AAAAUAIAnQEqEAAKAAOAWiWwAnQGMHam26dcAuxgAP7BVLNCRoW8rm/FO3tcHGgBdIYJCo37P6NkVha0sERLOwpto7SkMxYv3yrZ+unKpZ/s6XwKwGD6he8Oh7C3MhaPvtpU4PJtDjNlKsFf3vyAdMC7P6fdWK9mK+4A";

const posterCommonProps = {
  alt: "",
  sizes: "(max-width: 639px) 100vw, (max-width: 1519px) calc(100vw - 3rem), 1456px",
};

const {
  props: { srcSet: desktopPosterSrcSet },
} = getImageProps({
  ...posterCommonProps,
  src: "/images/what-is-game-show-poster.webp",
  width: 1456,
  height: 1080,
});

const {
  props: { srcSet: mobilePosterSrcSet, ...mobilePosterProps },
} = getImageProps({
  ...posterCommonProps,
  src: "/images/what-is-game-show-poster-mobile.webp",
  width: 941,
  height: 1672,
});

function ResponsivePoster({ className }: { className: string }) {
  return (
    <picture>
      <source media="(min-width: 640px)" srcSet={desktopPosterSrcSet} />
      <source media="(max-width: 639px)" srcSet={mobilePosterSrcSet} />
      <img {...mobilePosterProps} alt="" className={className} />
    </picture>
  );
}

export function ScrollZoomIntro() {
  return (
    <section className="relative w-full bg-black">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-16 pt-20 text-center sm:px-6 md:pt-24">
        <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-gs-gold sm:text-xs">
          <span className="h-px w-6 bg-gs-gold/50" />
          New in Hyderabad
          <span className="h-px w-6 bg-gs-gold/50" />
        </span>
        <span className="mb-6 text-sm font-medium text-white/70 sm:text-base">Introducing</span>
        <Image
          src="/images/logo-transparent.webp"
          alt="Game Show Challenge Rooms"
          width={360}
          height={232}
          unoptimized
          placeholder="blur"
          blurDataURL={LOGO_BLUR}
          className="mb-8 h-auto w-56 sm:w-64"
        />
        <p className="mb-10 max-w-3xl text-base leading-relaxed text-white/75 sm:text-lg sm:leading-8">
          {POSTER_COPY}
        </p>
        <figure className="w-full overflow-hidden rounded-[1.75rem] border border-white/20 shadow-[0_32px_100px_rgba(14,8,40,0.45)] sm:rounded-[2.25rem]">
          <ResponsivePoster className="h-auto w-full" />
          <figcaption className="sr-only">{POSTER_COPY}</figcaption>
        </figure>
      </div>
    </section>
  );
}
