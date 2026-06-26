"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Game Shows", href: "#games" },
  { label: "Team Building", href: "#team-building" },
  { label: "Pricing", href: "#tickets" },
  { label: "Location", href: "#location" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <>
      {/* State 1: Full Nav (scroll position 0) */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex items-start transition-all duration-300 ease-in-out",
          scrolled ? "pointer-events-none opacity-0" : "opacity-100"
        )}
        style={{
          padding: "16px 40px",
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

          {/* Nav Links */}
          <div className="flex items-center" style={{ gap: 8 }}>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
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

          {/* Book Now CTA */}
          <Link
            href="#tickets"
            className="flex flex-shrink-0 items-center text-white transition-opacity hover:opacity-90"
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
        </div>
      </nav>

      {/* State 2: Compact Nav (scrolled > 100px) */}
      <nav
        className={cn(
          "pointer-events-none fixed z-50 flex items-center opacity-0 transition-all duration-300 ease-in-out",
          scrolled && "pointer-events-auto opacity-100"
        )}
        style={{
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: 33,
          padding: "4px 4px 4px 12px",
          background: "rgba(30, 30, 30, 0.8)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          gap: 10,
        }}
      >
        {/* Logo */}
        <Image
          src="/images/logo.png"
          alt="Game Show Challenge Rooms"
          width={155}
          height={100}
          className="h-9 w-auto flex-shrink-0"
        />

        {/* Compact Book Now CTA */}
        <Link
          href="#tickets"
          className="flex flex-shrink-0 items-center text-white transition-opacity hover:opacity-90"
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
    </>
  );
}
