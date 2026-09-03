import Image from "next/image";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

/**
 * Real photos of real groups, straight after the hero. No captions, no
 * badges: two endless film strips drifting in opposite directions. Each strip
 * shows the same small photo set in different crops so the wall reads as far
 * bigger than it is.
 */

interface Crop {
  /** Tailwind aspect class; the crop is what makes a reused photo feel new. */
  aspect: string;
  /** `object-position` tweak so faces survive the crop. */
  position?: string;
}

interface WallPhoto {
  src: string;
  alt: string;
  /** Two different crops of the same photo. */
  crops: [Crop, Crop];
}

interface WallTile extends Crop {
  src: string;
  alt: string;
}

const P = "/images/players";

// The two strips share NO photos, so the same picture can never sit above
// itself. Within a strip each photo appears twice in different crops, placed
// exactly half a loop apart so both are never on screen together.
const ROW_ONE_PHOTOS: WallPhoto[] = [
  { src: `${P}/champions-trophy-cheque.webp`, alt: "A winning team holding the champions trophy and the giant cheque", crops: [{ aspect: "aspect-[4/3]" }, { aspect: "aspect-square", position: "object-[35%_60%]" }] },
  { src: `${P}/laughing-desk.webp`, alt: "Two players laughing at the team desk", crops: [{ aspect: "aspect-[3/4]", position: "object-[50%_45%]" }, { aspect: "aspect-square", position: "object-[45%_48%]" }] },
  { src: `${P}/group-logo-wall.webp`, alt: "A group of friends in front of the Game Show logo wall", crops: [{ aspect: "aspect-[16/9]" }, { aspect: "aspect-[4/3]", position: "object-[70%_50%]" }] },
  { src: `${P}/thumbs-up.webp`, alt: "Friends giving thumbs up in front of the logo wall", crops: [{ aspect: "aspect-[3/4]", position: "object-[50%_40%]" }, { aspect: "aspect-square", position: "object-[50%_38%]" }] },
  { src: `${P}/mic-moment.webp`, alt: "A player laughing into the mic while the host asks a question", crops: [{ aspect: "aspect-[3/4]", position: "object-[50%_50%]" }, { aspect: "aspect-[4/5]", position: "object-[40%_45%]" }] },
  { src: `${P}/group-wide.webp`, alt: "Players lined up in front of the Challenge Rooms wall", crops: [{ aspect: "aspect-[2/1]" }, { aspect: "aspect-square", position: "object-[30%_50%]" }] },
  { src: `${P}/buzzer-desk.webp`, alt: "A team leaning over the glowing buzzer desk", crops: [{ aspect: "aspect-[3/4]" }, { aspect: "aspect-[4/5]", position: "object-[50%_55%]" }] },
  { src: `${P}/live-scoreboard.webp`, alt: "The arena's live scoreboard screen", crops: [{ aspect: "aspect-[3/4]", position: "object-[50%_45%]" }, { aspect: "aspect-[4/5]", position: "object-[50%_42%]" }] },
];

const ROW_TWO_PHOTOS: WallPhoto[] = [
  { src: `${P}/arena-trophy-lift.webp`, alt: "A team lifting the trophy under the arena lights", crops: [{ aspect: "aspect-[3/4]", position: "object-[50%_40%]" }, { aspect: "aspect-square", position: "object-[50%_30%]" }] },
  { src: `${P}/group-eight.webp`, alt: "A group in front of the red Game Show wall", crops: [{ aspect: "aspect-[16/9]", position: "object-[50%_40%]" }, { aspect: "aspect-[4/3]" }] },
  { src: `${P}/tense-desk.webp`, alt: "A team watching the board nervously from the red-lit desk", crops: [{ aspect: "aspect-[3/4]", position: "object-[55%_55%]" }, { aspect: "aspect-square", position: "object-[60%_58%]" }] },
  { src: `${P}/four-friends.webp`, alt: "Four friends in front of the Challenge Rooms wall", crops: [{ aspect: "aspect-square", position: "object-[50%_40%]" }, { aspect: "aspect-[4/3]", position: "object-[50%_35%]" }] },
  { src: `${P}/lobby.webp`, alt: "Groups gathering in the lobby before a show", crops: [{ aspect: "aspect-[4/5]", position: "object-[70%_55%]" }, { aspect: "aspect-[3/4]", position: "object-[50%_55%]" }] },
  { src: `${P}/host-and-player.webp`, alt: "The host facing a smiling player on the arena floor", crops: [{ aspect: "aspect-[3/4]", position: "object-[50%_45%]" }, { aspect: "aspect-square", position: "object-[50%_42%]" }] },
  { src: `${P}/pile-up.webp`, alt: "A team collapsing in laughter during a physical round", crops: [{ aspect: "aspect-[3/4]", position: "object-[50%_55%]" }, { aspect: "aspect-square", position: "object-[50%_60%]" }] },
];

/** First crop of every photo, then the second crop of every photo. */
function buildRow(photos: WallPhoto[]): WallTile[] {
  return [0, 1].flatMap((pass) =>
    photos.map(({ src, alt, crops }) => ({ src, alt, ...crops[pass] })),
  );
}

const ROW_ONE = buildRow(ROW_ONE_PHOTOS);
const ROW_TWO = buildRow(ROW_TWO_PHOTOS);

function Strip({ tiles, reverse }: { tiles: WallTile[]; reverse?: boolean }) {
  const copy = (hidden: boolean) => (
    <div className="flex shrink-0 gap-3 pr-3" aria-hidden={hidden || undefined}>
      {tiles.map((tile, i) => (
        <div
          key={`${tile.src}-${i}`}
          className={cn(
            "relative h-44 shrink-0 select-none overflow-hidden rounded-xl border border-white/10 bg-gs-surface-card [-webkit-touch-callout:none] sm:h-56 md:h-64",
            tile.aspect,
          )}
        >
          {/* Not a link, and not a target for right-click / long-press
              "open image" menus or drag-outs. */}
          <Image
            src={tile.src}
            alt={hidden ? "" : tile.alt}
            fill
            sizes="(min-width: 768px) 420px, 300px"
            draggable={false}
            className={cn("pointer-events-none select-none object-cover", tile.position)}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="wall-marquee w-full overflow-hidden">
      <div className={cn("wall-track flex w-max", reverse && "wall-track-reverse")}>
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  );
}

export function ChampionsWallSection() {
  return (
    <section
      id="champions-wall"
      className="relative isolate overflow-hidden bg-background pb-16 pt-16 text-white md:pb-24 md:pt-24"
    >
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <Reveal>
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-white/48">
            <span className="h-px w-9 bg-gs-gold" />
            Straight from the arena
          </p>
        </Reveal>

        <Reveal delay={70}>
          <h2 className="mt-5 max-w-3xl text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
            <span className="inline-block">Birthday gangs.</span>{" "}
            <span className="inline-block">Cousin squads.</span>{" "}
            <span className="inline-block">Office teams.</span>
          </h2>
        </Reveal>
      </div>

      <Reveal delay={140} distance={18}>
        <div className="mt-10 flex flex-col gap-3 md:mt-14">
          <Strip tiles={ROW_ONE} />
          <Strip tiles={ROW_TWO} reverse />
        </div>
      </Reveal>
    </section>
  );
}
