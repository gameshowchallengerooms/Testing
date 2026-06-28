"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Game Shows", href: "#games" },
  { label: "Team Building", href: "/team-building", newTab: true },
  { label: "Pricing", href: "#tickets" },
  { label: "Location", href: "#location" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
            background: "rgba(30, 30, 30, 0.6)",
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
                  background: "rgba(40, 40, 40, 0.8)",
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
          <Link
            href="#tickets"
            className="hidden flex-shrink-0 items-center text-white transition-opacity hover:opacity-90 md:flex"
            style={{
              background: "black",
              borderRadius: 33,
              padding: "8px 8px 8px 16px",
              gap: 8,
              fontFamily: "Inter, sans-serif",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Book Your Show
            <span
              className="flex items-center justify-center"
              style={{
                background: "#3b82f6",
                borderRadius: "50%",
                width: 32,
                height: 32,
              }}
            >
              <ArrowUpRight className="text-white" size={18} strokeWidth={2.5} />
            </span>
          </Link>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-90 md:hidden"
          >
            <Menu size={22} strokeWidth={2.5} />
          </button>
        </div>
      </nav>

      {/* State 2: Compact Nav (scrolled > 100px) */}
      <nav
        className={cn(
          "pointer-events-none fixed z-50 flex items-center justify-center gap-3 opacity-0 transition-all duration-300 ease-in-out",
          scrolled && "pointer-events-auto opacity-100"
        )}
        style={{
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: 33,
          padding: "4px 8px",
          background: "rgba(30, 30, 30, 0.8)",
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
        <Link
          href="#tickets"
          className="flex shrink-0 items-center text-white transition-opacity hover:opacity-90"
          style={{
            background: "black",
            borderRadius: 33,
            padding: "8px 8px 8px 16px",
            gap: 8,
            fontFamily: "Inter, sans-serif",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          Book Your Show
          <span
            className="flex items-center justify-center"
            style={{
              background: "#3b82f6",
              borderRadius: "50%",
              width: 32,
              height: 32,
            }}
          >
            <ArrowUpRight className="text-white" size={18} strokeWidth={2.5} />
          </span>
        </Link>
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
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
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
              className="rounded-2xl bg-white/[0.06] px-6 py-4 text-xl font-semibold text-white transition-colors hover:bg-white/[0.12]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="#tickets"
            onClick={() => setMenuOpen(false)}
            className="mt-4 flex items-center justify-center gap-3 rounded-full px-6 py-4 text-lg font-bold text-white transition-transform hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #147EFF, #7C5CFC, #FC19ED)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Book Your Show
            <span
              className="flex items-center justify-center"
              style={{
                background: "rgba(0,0,0,0.35)",
                borderRadius: "50%",
                width: 32,
                height: 32,
              }}
            >
              <ArrowUpRight className="text-white" size={18} strokeWidth={2.5} />
            </span>
          </Link>
        </nav>
      </div>
    </>
  );
}
