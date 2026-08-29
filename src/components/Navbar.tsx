"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Cta } from "@/components/ui/cta";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Game Shows", href: "#show-rounds" },
  { label: "Team Building", href: "/team-building", newTab: true },
  { label: "Location", href: "#location" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // True while the pinned "One unforgettable night" show story is on screen on a
  // MOBILE viewport — we hide the floating compact "Book Your Show" pill there so
  // it doesn't overlap the flipping book covers, then return once it's scrolled
  // past. (Desktop keeps the pill; the story has room beside it.)
  const [overShowStory, setOverShowStory] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Watch the pinned "One unforgettable night" show story (#show-rounds) so the
  // compact CTA can step aside while it's in view on MOBILE, then return once
  // it's scrolled past. The hide is mobile-only: on desktop the story has room
  // beside the pill, so we keep it. The mobile check runs in the IO callback (and
  // on resize) so the gating tracks viewport changes.
  useEffect(() => {
    const story = document.getElementById("show-rounds");
    if (!story) return;

    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

    let intersecting = false;
    const sync = () => setOverShowStory(intersecting && isMobile());

    const io = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    io.observe(story);

    // Keep the mobile gating correct if the viewport crosses the breakpoint.
    window.addEventListener("resize", sync, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* State 1: Full Nav (scroll position 0) */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex items-start px-4 py-4 transition-all duration-300 ease-in-out md:px-10",
          scrolled ? "pointer-events-none opacity-0" : "opacity-100"
        )}
        style={{
          height: 90,
          gap: 20,
        }}
      >
        <div
          className="flex w-full items-center"
          style={{
            borderRadius: 33,
            padding: "4px 4px 4px 12px",
            gap: 10,
            background: "var(--gs-nav-bg)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Game Show Challenge Rooms"
              width={186}
              height={120}
              className="h-11 w-auto"
              priority
            />
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Nav Links — hidden on mobile, shown from md up */}
          <div className="hidden items-center md:flex" style={{ gap: 8 }}>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                {...("newTab" in link && link.newTab
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="whitespace-nowrap text-white transition-colors hover:text-white/80"
                style={{
                  background: "var(--gs-nav-pill)",
                  borderRadius: 20,
                  padding: "8px 16px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Book Now CTA — hidden on mobile, shown from md up */}
          <Cta
            href="#tickets"
            variant="nav"
            badge
            className="hidden py-1.5 pl-4 text-base md:inline-flex"
          >
            Book Your Show
          </Cta>

          {/* Hamburger — mobile only */}
          <Cta
            variant="contrast"
            size="icon"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="bg-black hover:bg-black/80 md:hidden"
          >
            <Menu size={22} strokeWidth={2.5} />
          </Cta>
        </div>
      </nav>

      {/* State 2: Compact Nav (scrolled > 100px) — on mobile it steps aside while
          the "One unforgettable night" show story is on screen, then returns once
          it's scrolled past. */}
      <nav
        className={cn(
          "pointer-events-none fixed z-50 flex items-center justify-center gap-3 opacity-0 transition-all duration-300 ease-in-out",
          scrolled && !overShowStory && "pointer-events-auto opacity-100"
        )}
        style={{
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: 33,
          padding: "4px 8px",
          background: "var(--gs-nav-bg-solid)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        {/* Logo and CTA sit together as a centred flex group. */}
        <Link href="/" className="flex shrink-0 items-center pl-1">
          <Image
            src="/images/logo.png"
            alt="Game Show Challenge Rooms"
            width={155}
            height={100}
            className="h-9 w-auto"
          />
        </Link>

        {/* Compact Book Now CTA */}
        <Cta href="#tickets" variant="nav" badge className="py-1.5 pl-4 text-base">
          Book Your Show
        </Cta>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[60] flex flex-col bg-black/95 backdrop-blur-lg transition-opacity duration-300 ease-in-out md:hidden",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/" onClick={() => setMenuOpen(false)} className="flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Game Show Challenge Rooms"
              width={186}
              height={120}
              className="h-11 w-auto"
            />
          </Link>
          <Cta
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} strokeWidth={2.5} />
          </Cta>
        </div>

        <nav className="flex flex-1 flex-col justify-center gap-3 px-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              {...("newTab" in link && link.newTab
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-(--gs-veil) px-6 py-4 text-xl font-semibold text-white transition-colors hover:bg-(--gs-veil-hover)"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {link.label}
            </Link>
          ))}

          <Cta
            href="#tickets"
            badge
            size="lg"
            onClick={() => setMenuOpen(false)}
            className="mt-4 text-lg"
          >
            Book Your Show
          </Cta>
        </nav>
      </div>
    </>
  );
}
