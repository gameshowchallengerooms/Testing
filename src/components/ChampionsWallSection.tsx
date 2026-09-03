import Image from "next/image";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

/**
 * Real photos of real groups, straight after the hero. No captions, no
 * badges: two endless film strips drifting in opposite directions. Each strip
 * shows the same small photo set in different crops so the wall reads as far
 * bigger than it is.
 */

interface WallTile {
  src: string;
  alt: string;
  /** Tailwind aspect class; the crop is what makes a reused photo feel new. */
  aspect: string;
  /** `object-position` tweak so faces survive the crop. */
  position?: string;
}

const P = "/images/players";

const ROW_ONE: WallTile[] = [
  { src: `${P}/champions-trophy-cheque.webp`, alt: "A winning team holding the champions trophy and the giant cheque", aspect: "aspect-[4/3]" },
  { src: `${P}/laughing-desk.webp`, alt: "Two players laughing at the team desk", aspect: "aspect-[3/4]", position: "object-[50%_45%]" },
  { src: `${P}/group-logo-wall.webp`, alt: "A group of friends in front of the Game Show logo wall", aspect: "aspect-[16/9]" },
  { src: `${P}/arena-trophy-lift.webp`, alt: "A team lifting the trophy under the arena lights", aspect: "aspect-[3/4]", position: "object-[50%_40%]" },
  { src: `${P}/group-wide.webp`, alt: "Players lined up in front of the Challenge Rooms wall", aspect: "aspect-[2/1]" },
  { src: `${P}/thumbs-up.webp`, alt: "Friends giving thumbs up in front of the logo wall", aspect: "aspect-[3/4]", position: "object-[50%_40%]" },
  { src: `${P}/four-friends.webp`, alt: "Four friends in front of the Challenge Rooms wall", aspect: "aspect-square", position: "object-[50%_40%]" },
  { src: `${P}/buzzer-desk.webp`, alt: "A team leaning over the glowing buzzer desk", aspect: "aspect-[3/4]" },
  { src: `${P}/group-eight.webp`, alt: "A group in front of the red Game Show wall", aspect: "aspect-[4/3]" },
  { src: `${P}/host-and-player.webp`, alt: "The host facing a smiling player on the arena floor", aspect: "aspect-[3/4]", position: "object-[50%_45%]" },
  { src: `${P}/live-scoreboard.webp`, alt: "The arena's live scoreboard screen", aspect: "aspect-[3/4]", position: "object-[50%_45%]" },
  { src: `${P}/lobby.webp`, alt: "Groups gathering in the lobby before a show", aspect: "aspect-[3/4]", position: "object-[50%_55%]" },
  { src: `${P}/pile-up.webp`, alt: "A team collapsing in laughter during a physical round", aspect: "aspect-[3/4]", position: "object-[50%_55%]" },
];

// Same photos, different crops and order, so the second strip never looks
// like a repeat of the first.
const ROW_TWO: WallTile[] = [
  { src: `${P}/group-wide.webp`, alt: "Players in front of the Challenge Rooms wall", aspect: "aspect-square", position: "object-[30%_50%]" },
  { src: `${P}/arena-trophy-lift.webp`, alt: "The trophy lift under blue stage lights", aspect: "aspect-square", position: "object-[50%_30%]" },
  { src: `${P}/group-eight.webp`, alt: "A group in front of the red Game Show wall", aspect: "aspect-[16/9]", position: "object-[50%_40%]" },
  { src: `${P}/thumbs-up.webp`, alt: "Friends giving thumbs up", aspect: "aspect-square", position: "object-[50%_38%]" },
  { src: `${P}/champions-trophy-cheque.webp`, alt: "Champions with the trophy and cheque", aspect: "aspect-square", position: "object-[35%_60%]" },
  { src: `${P}/lobby.webp`, alt: "The flower-lined lobby before a show", aspect: "aspect-[4/5]", position: "object-[70%_55%]" },
  { src: `${P}/group-logo-wall.webp`, alt: "A big group at the logo wall", aspect: "aspect-[4/3]", position: "object-[70%_50%]" },
  { src: `${P}/laughing-desk.webp`, alt: "Players laughing mid-round", aspect: "aspect-square", position: "object-[45%_48%]" },
  { src: `${P}/four-friends.webp`, alt: "Four friends at the arena", aspect: "aspect-[4/3]", position: "object-[50%_35%]" },
  { src: `${P}/pile-up.webp`, alt: "A team in a laughing pile-up", aspect: "aspect-square", position: "object-[50%_60%]" },
  { src: `${P}/buzzer-desk.webp`, alt: "A team at the buzzer desk", aspect: "aspect-[4/5]", position: "object-[50%_55%]" },
  { src: `${P}/host-and-player.webp`, alt: "The host on the arena floor", aspect: "aspect-square", position: "object-[50%_42%]" },
  { src: `${P}/live-scoreboard.webp`, alt: "The live scoreboard", aspect: "aspect-[4/5]", position: "object-[50%_42%]" },
];

function Strip({ tiles, reverse }: { tiles: WallTile[]; reverse?: boolean }) {
  const copy = (hidden: boolean) => (
    <div className="flex shrink-0 gap-3 pr-3" aria-hidden={hidden || undefined}>
      {tiles.map((tile, i) => (
        <div
          key={`${tile.src}-${i}`}
          className={cn(
            "relative h-44 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-gs-surface-card sm:h-56 md:h-64",
            tile.aspect,
          )}
        >
          <Image
            src={tile.src}
            alt={hidden ? "" : tile.alt}
            fill
            sizes="(min-width: 768px) 420px, 300px"
            className={cn("object-cover", tile.position)}
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
