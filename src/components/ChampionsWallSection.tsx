import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { BookingCta } from "@/components/BookingDialog";

/**
 * Real photos of real groups, straight after the hero. The point of this
 * section is proof: actual players at the actual arena, not illustrations.
 *
 * The wall is a dense bento grid. Each tile declares its own column/row span
 * per breakpoint and `grid-flow-dense` packs them so no breakpoint leaves a
 * hole. Tiles that don't fit a narrow layout are hidden rather than squeezed.
 */

const INSTAGRAM_URL = "https://www.instagram.com/gameshowchallengerooms/";

interface WallPhoto {
  src: string;
  alt: string;
  /** Column/row spans per breakpoint (mobile → md → lg). */
  span: string;
  /** `object-position` tweak so faces survive the crop. */
  position?: string;
  sizes: string;
  /** Always-visible caption for the three anchor tiles. */
  caption?: string;
  badge?: string;
}

const PHOTOS: WallPhoto[] = [
  {
    src: "/images/players/champions-trophy-cheque.webp",
    alt: "A winning team of ten holding the champions trophy and the giant ten-lakh cheque in front of the red Game Show wall",
    span: "col-span-2 row-span-2 md:col-span-4 lg:col-span-6",
    sizes: "(min-width: 1024px) 640px, (min-width: 768px) 66vw, 100vw",
    caption: "Trophy, cheque and the wall photo. Every show ends here.",
    badge: "Champions",
  },
  {
    src: "/images/players/live-scoreboard.webp",
    alt: "The arena's live scoreboard on a wall-mounted screen showing team Steroids on 135 points against team Trex, under a neon 'Let's Party' sign",
    span: "col-span-1 row-span-2 md:col-span-2 lg:col-span-3",
    position: "object-[50%_45%]",
    sizes: "(min-width: 1024px) 320px, (min-width: 768px) 33vw, 50vw",
    caption: "Steroids vs Trex on the live board.",
    badge: "Live scoreboard",
  },
  {
    src: "/images/players/arena-trophy-lift.webp",
    alt: "A team lifting the champions trophy and holding the giant cheque under blue stage lights inside the arena",
    span: "col-span-1 row-span-2 md:col-span-2 lg:col-span-3",
    position: "object-[50%_40%]",
    sizes: "(min-width: 1024px) 320px, (min-width: 768px) 33vw, 50vw",
    caption: "The trophy lift under the arena lights.",
    badge: "Final round",
  },
  {
    src: "/images/players/group-logo-wall.webp",
    alt: "A group of fourteen friends posing in front of the colourful Game Show logo wall",
    span: "col-span-2 md:col-span-4 lg:col-span-4",
    sizes: "(min-width: 1024px) 430px, (min-width: 768px) 66vw, 100vw",
  },
  {
    src: "/images/players/laughing-desk.webp",
    alt: "Two players laughing at the team desk with its red LED edge, mid-round",
    span: "col-span-1 md:col-span-2 lg:col-span-2",
    position: "object-[50%_45%]",
    sizes: "(min-width: 1024px) 220px, (min-width: 768px) 33vw, 50vw",
  },
  {
    src: "/images/players/thumbs-up.webp",
    alt: "Six friends giving thumbs up in front of the Game Show logo wall",
    span: "col-span-1 md:col-span-2 lg:col-span-2",
    position: "object-[50%_40%]",
    sizes: "(min-width: 1024px) 220px, (min-width: 768px) 33vw, 50vw",
  },
  {
    src: "/images/players/buzzer-desk.webp",
    alt: "A team of five leaning over the glowing buzzer desk while the host explains a challenge",
    span: "hidden md:block md:col-span-2 lg:col-span-2",
    sizes: "(min-width: 1024px) 220px, 33vw",
  },
  {
    src: "/images/players/group-wide.webp",
    alt: "Eight players lined up in front of the Challenge Rooms wall wearing their name stickers",
    span: "hidden md:block md:col-span-4 lg:col-span-4",
    sizes: "(min-width: 1024px) 430px, 66vw",
  },
  {
    src: "/images/players/host-and-player.webp",
    alt: "The host facing a smiling player on the arena floor under the stage lights",
    span: "hidden lg:block lg:col-span-2",
    position: "object-[50%_45%]",
    sizes: "220px",
  },
  {
    src: "/images/players/group-eight.webp",
    alt: "A group of eight friends standing barefoot in front of the red Game Show wall",
    span: "hidden md:block md:col-span-2 lg:col-span-3",
    sizes: "(min-width: 1024px) 320px, 33vw",
  },
  {
    src: "/images/players/four-friends.webp",
    alt: "Four friends wearing their name stickers in front of the Challenge Rooms wall",
    span: "hidden md:block md:col-span-2 lg:col-span-3",
    position: "object-[50%_40%]",
    sizes: "(min-width: 1024px) 320px, 33vw",
  },
  {
    src: "/images/players/lobby.webp",
    alt: "Groups gathering in the flower-lined lobby before a show",
    span: "hidden md:block md:col-span-2 lg:col-span-2",
    position: "object-[50%_55%]",
    sizes: "(min-width: 1024px) 220px, 33vw",
  },
];

function WallTile({ photo, index }: { photo: WallPhoto; index: number }) {
  return (
    <Reveal
      delay={80 + index * 45}
      distance={18}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/10 bg-gs-surface-card",
        photo.span,
      )}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={photo.sizes}
        className={cn(
          "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]",
          photo.position,
        )}
      />

      {/* Soft base vignette so the edges read as one surface, not a photo dump. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
      />

      {photo.badge && (
        <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
          {photo.badge}
        </span>
      )}

      {photo.caption && (
        <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-4 pb-4 pt-14 text-sm font-semibold leading-snug text-white sm:text-[15px]">
          {photo.caption}
        </p>
      )}
    </Reveal>
  );
}

export function ChampionsWallSection() {
  return (
    <section
      id="champions-wall"
      className="relative isolate overflow-hidden bg-background px-5 pb-20 pt-16 text-white md:px-10 md:pb-28 md:pt-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-white/48">
                <span className="h-px w-9 bg-gs-gold" />
                Straight from the arena
              </p>
            </Reveal>

            <Reveal delay={70}>
              <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                <span className="inline-block">Birthday gangs.</span>{" "}
                <span className="inline-block">Cousin squads.</span>{" "}
                <span className="inline-block">Office teams.</span>
              </h2>
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-6 text-base leading-7 text-white/66 sm:text-lg sm:leading-8">
                A birthday crew that booked one show and stayed talking about it for a
                week. Cousins who hadn&apos;t been in the same room since the last
                wedding. A whole floor from the office that finally found out who the
                real competitor is. Every group on this wall walked in as a gang and
                walked out fighting over who gets to hold the trophy in the photo.
              </p>
            </Reveal>
          </div>

          <Reveal delay={160} className="shrink-0">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group/ig inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/4 px-4 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:border-white/25 hover:text-white"
            >
              <span className="text-gs-gold">#GameShowChallengeRoomsHyderabad</span>
              <span className="hidden sm:inline">on Instagram</span>
              <ArrowUpRight
                size={16}
                strokeWidth={2.5}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover/ig:-translate-y-0.5 group-hover/ig:translate-x-0.5"
              />
            </a>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-flow-dense grid-cols-2 auto-rows-[10.5rem] gap-2 sm:gap-3 md:mt-14 md:grid-cols-6 md:auto-rows-[12rem] lg:grid-cols-12 lg:auto-rows-[13.5rem]">
          {PHOTOS.map((photo, index) => (
            <WallTile key={photo.src} photo={photo} index={index} />
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-white/72">
              Win your show and your gang&apos;s photo goes up on the Champions Wall too.
            </p>
            <BookingCta badge>Book your show</BookingCta>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
