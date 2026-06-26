"use client";

import Link from "next/link";
import { MapPin, Navigation, Clock, Users } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const ADDRESS =
  "4th Floor, Survey No. 1, Khajaguda - Nanakramguda Rd, Khajaguda, Hyderabad, Telangana 500104";
const DIRECTIONS_URL = "https://maps.app.goo.gl/MZfvdmxwBTa3NPj29";
// Keyless Google Maps embed driven by the address query.
const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  ADDRESS
)}&output=embed`;

const facts = [
  { icon: Users, label: "Groups of 4–15 players" },
  { icon: Clock, label: "Open 7 days a week" },
  { icon: MapPin, label: "Khajaguda, Hyderabad" },
];

// Approximate driving distances from well-known Hyderabad spots.
const landmarks = [
  { name: "Gachibowli", dist: "3 km" },
  { name: "HITEC City", dist: "5 km" },
  { name: "Financial District", dist: "6 km" },
  { name: "Jubilee Hills", dist: "8 km" },
  { name: "Banjara Hills", dist: "11 km" },
  { name: "Hi-Tech City Metro", dist: "6 km" },
];

export function LocationSection() {
  return (
    <section
      id="location"
      className="relative overflow-hidden bg-[#08080a] px-5 py-20 md:px-10 md:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 15% 10%, rgba(20,126,255,0.12), transparent 60%), radial-gradient(ellipse 50% 40% at 85% 90%, rgba(252,25,237,0.10), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-[1200px] items-stretch gap-8 lg:grid-cols-[1fr_1.3fr]">
        {/* Left: details */}
        <div className="flex flex-col justify-center">
          <Reveal>
            <div className="mb-4 flex items-center gap-4">
              <span className="block h-[2px] w-[60px] bg-white/50" />
              <span className="font-sans text-base font-normal text-white/80">
                Find Us
              </span>
            </div>
          </Reveal>

          <Reveal delay={70}>
            <h2
              className="text-3xl font-medium leading-tight tracking-tight text-white md:text-[48px] md:leading-[1.06]"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-1.5px" }}
            >
              Your stage is in{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #147EFF, #FC19ED)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Khajaguda
              </span>
            </h2>
          </Reveal>

          <Reveal delay={130}>
            <p className="mt-4 flex items-start gap-3 text-base leading-relaxed text-white/70">
              <MapPin size={20} className="mt-0.5 shrink-0 text-[#FC19ED]" />
              {ADDRESS}
            </p>
          </Reveal>

          {/* Quick facts */}
          <Reveal delay={170}>
            <div className="mt-6 flex flex-wrap gap-2">
              {facts.map((f) => {
                const Icon = f.icon;
                return (
                  <span
                    key={f.label}
                    className="flex items-center gap-2 rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/75"
                  >
                    <Icon size={14} className="text-[#B49BFF]" />
                    {f.label}
                  </span>
                );
              })}
            </div>
          </Reveal>

          {/* Distances from famous spots */}
          <Reveal delay={210}>
            <div className="mt-7">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                <Navigation size={13} className="text-[#FFD23F]" />
                Easy to reach
              </p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {landmarks.map((l) => (
                  <div
                    key={l.name}
                    className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5"
                  >
                    <span className="text-sm text-white/80">{l.name}</span>
                    <span
                      className="text-sm font-bold text-white"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {l.dist}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={230}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
                style={{
                  background: "linear-gradient(135deg, #147EFF, #7C5CFC, #FC19ED)",
                  boxShadow: "0 12px 36px rgba(124,92,252,0.4)",
                }}
              >
                <Navigation size={17} />
                Get Directions
              </Link>
              <Link
                href="#tickets"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                Book Your Show
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Right: map */}
        <Reveal direction="left" className="h-full">
          <div className="relative h-full min-h-[340px] overflow-hidden rounded-3xl border border-white/10 md:min-h-[440px]">
            <iframe
              title="Game Show Challenge Rooms location on Google Maps"
              src={MAP_EMBED_URL}
              className="absolute inset-0 h-full w-full"
              style={{ border: 0, filter: "grayscale(0.2) contrast(1.05)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
