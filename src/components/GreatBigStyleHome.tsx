import Link from "next/link";
import {
  Brain,
  Building2,
  Cake,
  Clock3,
  Flag,
  Gauge,
  GraduationCap,
  MapPin,
  MessageCircle,
  PartyPopper,
  Sparkles,
  Swords,
  Trophy,
  UsersRound,
} from "lucide-react";

const gameTypes = [
  {
    icon: Brain,
    title: "Trivia",
    text: "Quick questions, clever clues and buzzer-first answers.",
    color: "bg-[#cae2ff]",
  },
  {
    icon: Gauge,
    title: "Speed tests",
    text: "Fast reactions and last-second finishes against the clock.",
    color: "bg-[#ffd37b]",
  },
  {
    icon: Swords,
    title: "Head-to-head",
    text: "One player from each team steps up while everyone cheers.",
    color: "bg-[#ffbdca]",
  },
  {
    icon: UsersRound,
    title: "Team tasks",
    text: "Communicate, coordinate and solve the challenge together.",
    color: "bg-[#c9f7cd]",
  },
  {
    icon: Sparkles,
    title: "Surprise rounds",
    text: "Unexpected twists can change the scores right to the end.",
    color: "bg-[#ebd2f7]",
  },
  {
    icon: Trophy,
    title: "The finale",
    text: "One last chance to win points and claim the championship.",
    color: "bg-[#f7935c]",
  },
] as const;

const audiences = [
  {
    icon: Building2,
    title: "Team building",
    text: "Friendly competition that gets coworkers talking, laughing and working together.",
    color: "bg-[#2424e9] text-white",
  },
  {
    icon: Cake,
    title: "Birthdays",
    text: "A full-group celebration where the guest of honour gets a real spotlight moment.",
    color: "bg-[#f93a5a] text-white",
  },
  {
    icon: PartyPopper,
    title: "Friends & family",
    text: "An easy indoor plan where everyone participates instead of watching from the side.",
    color: "bg-[#ffbd17] text-[#021d41]",
  },
  {
    icon: GraduationCap,
    title: "Schools & colleges",
    text: "A hosted outing built around confidence, teamwork and quick thinking.",
    color: "bg-[#9728d1] text-white",
  },
] as const;

const steps = [
  {
    number: "01",
    title: "Book your show",
    text: "Share your group size and preferred date. We’ll confirm the format, slot and exact price.",
  },
  {
    number: "02",
    title: "Pick your teams",
    text: "Arrive 15 minutes early, split into two teams and choose your team names and colours.",
  },
  {
    number: "03",
    title: "Play three rounds",
    text: "Your live host explains every game, keeps score and brings the game-show energy.",
  },
  {
    number: "04",
    title: "Crown the champions",
    text: "The team with the most Challenge Points wins the final spotlight and the bragging rights.",
  },
] as const;

const faqItems = [
  {
    question: "What exactly is Game Show Challenge Rooms?",
    answer:
      "It is a private, live-hosted game show experience in Hyderabad. Your group becomes the contestants, splits into two teams and competes across three different rounds using real buzzers.",
  },
  {
    question: "How many people can play?",
    answer:
      "Shows are designed for groups of 4 to 15 players. Everyone participates and the group competes as two teams.",
  },
  {
    question: "How long is the experience?",
    answer:
      "The Classic includes approximately 45 minutes of gameplay. Prime Time runs for approximately 60 minutes. Please arrive 15 minutes before your slot.",
  },
  {
    question: "Do we need to prepare?",
    answer:
      "No. The host explains every challenge before it begins. You do not need special knowledge, equipment or game-show experience.",
  },
  {
    question: "How do we get the price?",
    answer:
      "Pricing depends on your group size, chosen format and date. Send those details on WhatsApp or call us and we’ll confirm the exact amount.",
  },
] as const;

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-13 items-center justify-center rounded-xl border-[3px] border-[#021d41] bg-[#ffbd17] px-7 py-3 text-center text-base font-extrabold text-[#021d41] shadow-[5px_5px_0_#021d41] hover:bg-[#ffd37b]"
    >
      {children}
    </Link>
  );
}

function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-13 items-center justify-center rounded-xl border-[3px] border-[#021d41] bg-white px-7 py-3 text-center text-base font-extrabold text-[#021d41] hover:bg-[#cae2ff]"
    >
      {children}
    </Link>
  );
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border-2 border-[#021d41] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#021d41]">
      {children}
    </span>
  );
}

export function GreatBigStyleHome() {
  return (
    <>
      <section className="relative overflow-hidden border-b-[3px] border-[#021d41] bg-[#fef9ee] px-5 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24">
        <div className="absolute -left-20 top-24 h-44 w-44 rounded-full border-[18px] border-[#2424e9]/10" />
        <div className="absolute -right-16 bottom-14 h-52 w-52 rotate-12 rounded-[42px] bg-[#ffbd17]/30" />

        <div className="relative mx-auto grid max-w-[1280px] items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <SectionTag>Hyderabad&apos;s live game show</SectionTag>
            <h1 className="mt-7 max-w-[900px] font-extrabold leading-[0.88] tracking-[-0.055em] text-[#021d41] text-[clamp(3.4rem,9vw,7.6rem)]">
              Now, you&apos;re the contestant!
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-[#24386d] md:text-xl">
              Step onto a real game-show stage with your own live host, studio lights,
              buzzers and three rounds of rotating challenges. Bring 4–15 people,
              split into two teams and play for the win.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <PrimaryLink href="#tickets">Book a show</PrimaryLink>
              <SecondaryLink href="#how-it-works">How it works</SecondaryLink>
            </div>
          </div>

          <div className="rounded-[32px] border-[4px] border-[#021d41] bg-white p-5 shadow-[10px_10px_0_#2424e9] sm:p-7">
            <p className="rounded-2xl bg-[linear-gradient(43deg,#9728d1_3%,#f93a5a_52%,#ffbd17_100%)] px-5 py-4 text-center text-sm font-extrabold uppercase tracking-[0.16em] text-white">
              Your show at a glance
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border-[3px] border-[#021d41] bg-[#cae2ff] p-5">
                <p className="text-4xl font-extrabold text-[#021d41]">4–15</p>
                <p className="mt-1 text-sm font-bold text-[#24386d]">players</p>
              </div>
              <div className="rounded-2xl border-[3px] border-[#021d41] bg-[#ffd37b] p-5">
                <p className="text-4xl font-extrabold text-[#021d41]">45–60</p>
                <p className="mt-1 text-sm font-bold text-[#24386d]">minutes</p>
              </div>
              <div className="rounded-2xl border-[3px] border-[#021d41] bg-[#ffbdca] p-5">
                <p className="text-4xl font-extrabold text-[#021d41]">3</p>
                <p className="mt-1 text-sm font-bold text-[#24386d]">rounds</p>
              </div>
              <div className="rounded-2xl border-[3px] border-[#021d41] bg-[#c9f7cd] p-5">
                <p className="text-4xl font-extrabold text-[#021d41]">1</p>
                <p className="mt-1 text-sm font-bold text-[#24386d]">live host</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-[3px] border-[#021d41] bg-[#ebd2f7] px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.55fr_1fr] lg:items-start">
          <SectionTag>What is it?</SectionTag>
          <div>
            <h2 className="text-4xl font-extrabold leading-[0.98] tracking-[-0.04em] text-[#021d41] md:text-6xl">
              A private group experience that feels like being on TV.
            </h2>
            <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-[#24386d]">
              This is not an arcade and it is not an escape room. Your entire group is
              part of the show. A host explains every challenge, keeps the scores,
              controls the pace and makes sure every player gets involved.
            </p>
          </div>
        </div>
      </section>

      <section id="mini-games" className="border-b-[3px] border-[#021d41] bg-[#f5f6fa] px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1280px]">
          <SectionTag>Every round is different</SectionTag>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.65fr] lg:items-end">
            <h2 className="text-4xl font-extrabold leading-[0.98] tracking-[-0.04em] text-[#021d41] md:text-6xl">
              Different gameplay means everyone gets a chance to shine.
            </h2>
            <p className="text-base font-semibold leading-7 text-[#24386d] md:text-lg">
              The exact line-up can rotate. Expect a mix of strategy, trivia, speed,
              teamwork and buzzer battles across three hosted rounds.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gameTypes.map((game) => {
              const Icon = game.icon;

              return (
                <article
                  key={game.title}
                  className={`${game.color} min-h-64 rounded-[26px] border-[3px] border-[#021d41] p-7 shadow-[6px_6px_0_#021d41]`}
                >
                  <Icon size={34} strokeWidth={2.5} aria-hidden="true" />
                  <h3 className="mt-10 text-2xl font-extrabold tracking-[-0.03em]">
                    {game.title}
                  </h3>
                  <p className="mt-3 text-base font-semibold leading-7 opacity-80">
                    {game.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b-[3px] border-[#021d41] bg-[#021d41] px-5 py-20 text-white md:px-10 md:py-28">
        <div className="mx-auto max-w-[1280px]">
          <span className="inline-flex rounded-full border-2 border-white bg-[#ffbd17] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#021d41]">
            Made for your group
          </span>
          <h2 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[0.98] tracking-[-0.04em] md:text-6xl">
            Big laughs work for every kind of celebration.
          </h2>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((audience) => {
              const Icon = audience.icon;

              return (
                <article
                  key={audience.title}
                  className={`${audience.color} rounded-[26px] border-[3px] border-white p-7`}
                >
                  <Icon size={34} strokeWidth={2.5} aria-hidden="true" />
                  <h3 className="mt-10 text-2xl font-extrabold tracking-[-0.03em]">
                    {audience.title}
                  </h3>
                  <p className="mt-3 text-sm font-semibold leading-6 opacity-85">
                    {audience.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-b-[3px] border-[#021d41] bg-[#fef9ee] px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1180px]">
          <SectionTag>How it works</SectionTag>
          <h2 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[0.98] tracking-[-0.04em] text-[#021d41] md:text-6xl">
            From booking to the final score, we run the whole show.
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {steps.map((step) => (
              <article
                key={step.number}
                className="grid gap-5 rounded-[26px] border-[3px] border-[#021d41] bg-white p-7 sm:grid-cols-[90px_1fr]"
              >
                <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#2424e9] text-2xl font-extrabold text-white">
                  {step.number}
                </span>
                <div>
                  <h3 className="text-2xl font-extrabold tracking-[-0.03em] text-[#021d41]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base font-semibold leading-7 text-[#24386d]">
                    {step.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="show-rounds" className="border-b-[3px] border-[#021d41] bg-[#ffbd17] px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1180px]">
          <SectionTag>Choose your show</SectionTag>
          <h2 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[0.98] tracking-[-0.04em] text-[#021d41] md:text-6xl">
            Two formats. The same live game-show feeling.
          </h2>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="rounded-[30px] border-[4px] border-[#021d41] bg-white p-8 shadow-[8px_8px_0_#2424e9] md:p-10">
              <span className="inline-flex rounded-full bg-[#cae2ff] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#021d41]">
                The original
              </span>
              <h3 className="mt-6 text-4xl font-extrabold tracking-[-0.045em] text-[#021d41]">
                The Classic
              </h3>
              <p className="mt-4 text-lg font-semibold leading-8 text-[#24386d]">
                A focused 45-minute show with three hosted rounds, buzzers, live
                scoring and the essential team-versus-team competition.
              </p>
              <ul className="mt-7 space-y-3 text-base font-bold text-[#021d41]">
                <li>✓ Best for first-time groups and families</li>
                <li>✓ Three rotating game-show rounds</li>
                <li>✓ Live host and winner moment</li>
              </ul>
            </article>

            <article className="rounded-[30px] border-[4px] border-[#021d41] bg-[#ebd2f7] p-8 shadow-[8px_8px_0_#f93a5a] md:p-10">
              <span className="inline-flex rounded-full bg-[#f93a5a] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-white">
                Most popular
              </span>
              <h3 className="mt-6 text-4xl font-extrabold tracking-[-0.045em] text-[#021d41]">
                Prime Time
              </h3>
              <p className="mt-4 text-lg font-semibold leading-8 text-[#24386d]">
                A 60-minute celebration that adds more social group games, bigger
                crowd moments and extra time under the lights.
              </p>
              <ul className="mt-7 space-y-3 text-base font-bold text-[#021d41]">
                <li>✓ Best for birthdays and celebrations</li>
                <li>✓ Full game show plus party-style games</li>
                <li>✓ More time for group interaction</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b-[3px] border-[#021d41] bg-[#f93a5a] px-5 py-20 text-white md:px-10 md:py-28">
        <div className="mx-auto max-w-[980px] text-center">
          <Trophy className="mx-auto" size={54} strokeWidth={2.5} aria-hidden="true" />
          <blockquote className="mt-8 text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] md:text-6xl">
            “The lights come on. The buzzer is in your hand. Suddenly, it&apos;s your show.”
          </blockquote>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-8 text-white/85">
            Every person plays, every round feels different, and the live host keeps
            the whole room involved from the first question to the final score.
          </p>
        </div>
      </section>

      <section id="location" className="border-b-[3px] border-[#021d41] bg-[#cae2ff] px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <SectionTag>Find your stage</SectionTag>
            <h2 className="mt-6 text-4xl font-extrabold leading-[0.98] tracking-[-0.04em] text-[#021d41] md:text-6xl">
              Live in Khajaguda, Hyderabad.
            </h2>
            <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-[#24386d]">
              4th Floor, Survey No. 1, Khajaguda–Nanakramguda Road, Khajaguda,
              Hyderabad, Telangana 500104.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <PrimaryLink href="https://maps.app.goo.gl/MZfvdmxwBTa3NPj29">
                Get directions
              </PrimaryLink>
              <SecondaryLink href="tel:+919000187731">Call +91 90001 87731</SecondaryLink>
            </div>
          </div>

          <div className="rounded-[30px] border-[4px] border-[#021d41] bg-white p-8 shadow-[8px_8px_0_#021d41]">
            <MapPin size={42} className="text-[#f93a5a]" strokeWidth={2.5} aria-hidden="true" />
            <h3 className="mt-6 text-3xl font-extrabold tracking-[-0.035em] text-[#021d41]">
              Plan before you arrive
            </h3>
            <ul className="mt-6 space-y-4 text-base font-bold text-[#24386d]">
              <li className="flex gap-3"><UsersRound className="shrink-0 text-[#2424e9]" /> Groups of 4–15 players</li>
              <li className="flex gap-3"><Clock3 className="shrink-0 text-[#9728d1]" /> Arrive 15 minutes early</li>
              <li className="flex gap-3"><Flag className="shrink-0 text-[#f93a5a]" /> Advance booking recommended</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="questions" className="border-b-[3px] border-[#021d41] bg-white px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[980px]">
          <SectionTag>Questions</SectionTag>
          <h2 className="mt-6 text-4xl font-extrabold leading-[0.98] tracking-[-0.04em] text-[#021d41] md:text-6xl">
            Everything to know before your show.
          </h2>

          <div className="mt-12 space-y-4">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border-[3px] border-[#021d41] bg-[#f5f6fa] p-6"
              >
                <summary className="cursor-pointer list-none pr-8 text-xl font-extrabold text-[#021d41] marker:hidden">
                  {item.question}
                </summary>
                <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-[#24386d]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="tickets" className="bg-[#2424e9] px-5 py-20 text-white md:px-10 md:py-24">
        <div className="mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.15em] text-[#ffd37b]">
              Ready to play?
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[0.98] tracking-[-0.04em] md:text-6xl">
              Send your group size and preferred date.
            </h2>
          </div>
          <Link
            href="https://wa.me/919000187731?text=Hi!%20I%27d%20like%20to%20book%20a%20Game%20Show%20Challenge%20Rooms%20experience.%20My%20group%20size%20is%20__%20and%20my%20preferred%20date%20is%20__."
            className="inline-flex min-h-14 shrink-0 items-center justify-center gap-3 rounded-xl border-[3px] border-white bg-[#ffbd17] px-8 py-4 text-lg font-extrabold text-[#021d41] shadow-[6px_6px_0_white] hover:bg-[#ffd37b]"
          >
            <MessageCircle size={22} aria-hidden="true" />
            Book on WhatsApp
          </Link>
        </div>
      </section>
    </>
  );
}
