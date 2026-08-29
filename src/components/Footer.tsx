import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { FAQSection } from "@/components/FAQSection";

const footerLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Mini games", href: "#mini-games" },
  { label: "Show formats", href: "#show-rounds" },
  { label: "Who it’s for", href: "#visitors" },
  { label: "Team building", href: "/team-building" },
  { label: "Find the venue", href: "#location" },
] as const;

function FacebookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="flex w-full flex-col items-center gap-6 bg-black px-5 pb-7 pt-20">
      {/* Top row: brand/SEO block on the LEFT, FAQ on the RIGHT. Stacks on
          mobile (brand block first, then FAQ). */}
      <div className="grid w-full max-w-[1280px] grid-cols-1 gap-12 border-t border-white/10 pb-10 pt-12 lg:grid-cols-2 lg:gap-16">
        {/* SEO copy — real, crawlable text covering long-tail and hyper-local
            terms. Visible and on-brand (not hidden) so it counts for ranking. */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <Image
            src="/images/logo.png"
            alt="Game Show Challenge Rooms"
            width={186}
            height={120}
            className="mb-5 h-12 w-auto"
          />
          <h2 className="mb-4 text-xl font-bold text-white md:text-2xl">
            Hyderabad&apos;s #1 Live Game Show Experience
          </h2>
          <p className="max-w-[820px] text-sm leading-relaxed text-white/55">
            Looking for fun things to do in Hyderabad with friends, family or
            coworkers? Game Show Challenge Rooms is a real live game show — host,
            studio lights and buzzers — for groups of 4 to 15 players. It&apos;s the
            perfect indoor activity for{" "}
            <span className="text-white/75">corporate team building</span>,{" "}
            <span className="text-white/75">birthday parties</span>,{" "}
            <span className="text-white/75">bachelorette and bachelor parties</span>,
            kitty parties, school and college trips, office outings and family
            celebrations. A fresh alternative to escape rooms, mystery rooms and
            trivia nights.
          </p>
          <p className="mt-4 max-w-[820px] text-sm leading-relaxed text-white/45">
            Right in the heart of Gachibowli&apos;s office hub and serving all of
            Hyderabad &amp; Secunderabad — Nanakramguda, Financial District, HITEC City,
            Madhapur, Manikonda, Raidurg, Kokapet, Kondapur, Jubilee Hills, Banjara Hills
            and nearby areas — plus virtual game shows on Zoom and on-site roadshows we
            bring to your venue.
          </p>
          <p className="mt-4 max-w-[820px] text-sm leading-relaxed text-white/45">
            If you&apos;re searching for the best things to do in Hyderabad, the best
            entertainment in Hyderabad, or fun weekend activities and unique places to
            hang out, this is it. Step under the studio lights, smash the buzzer and
            become the star of your own live game show — an unforgettable group outing
            you can&apos;t get anywhere else in the city.
          </p>

          <div className="mt-7 w-full border-t border-white/10 pt-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
              Explore the experience
            </p>
            <nav className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-white/68 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social — Instagram, Facebook, YouTube — under the brand block. */}
          <div className="mt-6 flex items-center gap-4">
            <Link
              href="https://www.instagram.com/gameshowchallengerooms/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white transition-opacity hover:opacity-70"
            >
              <InstagramIcon />
            </Link>
            <Link
              href="https://www.facebook.com/people/Game-Show-Challenge-Rooms/61593501426544/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-white transition-opacity hover:opacity-70"
            >
              <FacebookIcon />
            </Link>
            <Link
              href="https://www.youtube.com/@GameShowChallengeRooms/shorts"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-white transition-opacity hover:opacity-70"
            >
              <YouTubeIcon />
            </Link>
          </div>

          {/* Contact + Privacy — sit directly below the social handlers. */}
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:gap-6 lg:items-start">
            <Link
              href="mailto:gameshowchallengerooms@gmail.com"
              className="flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              <Mail size={16} className="text-gs-violet-bright" />
              gameshowchallengerooms@gmail.com
            </Link>
            <Link
              href="tel:+919000187731"
              className="flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              <Phone size={16} className="text-gs-violet-bright" />
              +91 90001 87731
            </Link>
          </div>

          <Link
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-sm font-normal text-white transition-opacity hover:underline hover:opacity-80"
          >
            Privacy Policy
          </Link>
        </div>

        {/* FAQ — moved here from its own section, embedded as the right column. */}
        <div className="text-left">
          <FAQSection embedded />
        </div>
      </div>

      {/* Closing line + copyright — the footer's final note, full width. */}
      <div className="mt-6 flex w-full max-w-[1280px] flex-col items-center gap-2 border-t border-white/10 pt-7 text-center">
        <p className="text-sm font-medium text-white/70">
          Lights, buzzers, glory — we&apos;ll see you under the studio lights. 🎬
        </p>
        <span className="text-xs font-normal text-white/50">
          © Game Show Challenge Rooms · Hyderabad · All Rights Reserved
        </span>
        {/* Legal entity — required on-site for Meta business verification. */}
        <span className="text-xs font-normal text-white/50">
          Game Show Challenge Rooms is owned and operated by Vindi LLP
        </span>
      </div>
    </footer>
  );
}
