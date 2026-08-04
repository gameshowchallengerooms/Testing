"use client";

import Link from "next/link";
import { MapPin, Navigation, Clock, Users, Mail, Phone } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Cta } from "@/components/ui/cta";
import { useBooking } from "@/components/BookingDialog";

const ADDRESS =
  "4th Floor, Survey No. 1, Khajaguda - Nanakramguda Rd, Khajaguda, Hyderabad, Telangana 500104";
const DIRECTIONS_URL = "https://maps.app.goo.gl/MZfvdmxwBTa3NPj29";
// Real venue coordinates resolved from the Google Maps listing.
const LAT = 17.4192577;
const LNG = 78.3753142;

// When a Maps Embed API key is set, use the official place embed — it renders
// the verified business card (name, logo, rating, photos). Otherwise fall back
// to the basic keyless coordinate embed.
const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
const MAP_EMBED_URL = MAPS_KEY
  ? `https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=Game+Show+Challenge+Rooms,+Khajaguda,+Hyderabad&center=${LAT},${LNG}&zoom=16`
  : `https://maps.google.com/maps?q=${LAT},${LNG}&z=17&hl=en&output=embed`;

const facts = [
  { icon: Users, label: "Groups of 4–15 players" },
  { icon: Clock, label: "Open 7 days a week" },
];

// Approximate driving distances from well-known Hyderabad spots.
const landmarks = [
  { name: "Gachibowli", dist: "0.5 km" },
  { name: "Nanakramguda", dist: "1 km" },
  { name: "Financial District", dist: "2 km" },
  { name: "HITEC City", dist: "3 km" },
  { name: "Jubilee Hills", dist: "5 km" },
  { name: "Banjara Hills", dist: "7 km" },
];

export function LocationSection() {
  const { openBooking } = useBooking();
  return (
    <section
      id="location"
      className="relative overflow-hidden bg-gs- px-5 py-20 md:px-10 md:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 12% 8%, rgba(252,25,237,0.13), transparent 62%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-[1200px] items-stretch gap-8 lg:grid-cols-[1fr_1.3fr]">
        {/* Left: details */}
        <div className="flex flex-col justify-center">
          <Reveal>
            <div className="mb-4 flex items-center gap-4">
              <span className="block h-px w-[60px] bg-gs-" />
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                Find Us
              </span>
            </div>
          </Reveal>

          <Reveal delay={70}>
            <h2
              className="text-3xl font-medium leading-tight tracking-tight text-white md:text-[48px] md:leading-[1.06]"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-1.5px" }}
            >
              Your stage is{" "}
              <span className="text-gs-">ready &amp; waiting</span>
            </h2>
          </Reveal>

          <Reveal delay={130}>
            <p className="mt-4 flex items-start gap-3 text-base leading-relaxed text-white/70">
              <MapPin size={20} className="mt-0.5 shrink-0 text-gs-" />
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
                    className="flex items-center gap-2 rounded-sm border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-white/70"
                  >
                    <Icon size={14} className="text-gs-" />
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
                <Navigation size={13} className="text-gs-" />
                Easy to reach
              </p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {landmarks.map((l) => (
                  <div
                    key={l.name}
                    className="flex items-center justify-between gap-2 rounded-sm border-l-2 border-white/15 bg-white/[0.03] px-3.5 py-2.5 transition-colors hover:border-gs-"
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
              <Cta
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="solid"
                className="uppercase tracking-[0.12em]"
              >
                <Navigation size={16} />
                Get Directions
              </Cta>
              <Cta
                onClick={() => openBooking()}
                variant="secondary"
                className="uppercase tracking-[0.12em]"
              >
                Book Your Show
              </Cta>
            </div>
          </Reveal>

          {/* Contact */}
          <Reveal delay={260}>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-6">
              <Link
                href="tel:+919000187731"
                className="flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                <Phone size={16} className="text-gs-" />
                +91 90001 87731
              </Link>
              <Link
                href="mailto:gameshowchallengerooms@gmail.com"
                className="flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                <Mail size={16} className="text-gs-" />
                gameshowchallengerooms@gmail.com
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Right: map */}
        <Reveal direction="left" className="h-full">
          <div className="relative h-full min-h-[340px] overflow-hidden rounded-sm border border-white/10 md:min-h-[440px]">
            <iframe
              title="Game Show Challenge Rooms location on Google Maps"
              src={MAP_EMBED_URL}
              className="absolute inset-0 h-full w-full"
              style={{
                border: 0,
                // Keep the real listing card clean; only stylise the basic fallback map.
                filter: MAPS_KEY ? undefined : "grayscale(0.2) contrast(1.05)",
              }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />

            {/* Directions pill anchored to the map (this one is clickable) */}
            <Cta
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="light"
              size="sm"
              className="absolute bottom-4 right-4 uppercase tracking-[0.1em]"
            >
              <Navigation size={13} />
              Directions
            </Cta>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
