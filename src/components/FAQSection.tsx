"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import {
  WhatsAppGlyph,
  whatsappHref,
  PHONE_NUMBER,
  PHONE_DISPLAY,
} from "@/components/WhatsAppChat";

const faqItems = [
  {
    q: "What is Game Show Challenge Rooms?",
    a: "Game Show Challenge Rooms is one of the only live game show experiences in Hyderabad for everyone: friends, family, and coworkers! Groups split into teams, pick their own team names and colours, play three different game shows, and earn Challenge Points. Winners join the Champions Wall of Fame. The experience needs a minimum of 4 people and accommodates up to 15 guests per show.",
  },
  {
    q: "How does this work?",
    a: "Upon arrival, groups divide into two teams, choose names, and receive game show name tags before entering the arena to compete. Three game show rounds award Challenge Points, with the highest-scoring team becoming champion and earning recognition on the lobby wall.",
  },
  {
    q: "What is the price?",
    a: "Pricing is per person and depends on your group size and the day. Weekdays (Mon-Thu) range from ₹900 per person for a group of 4 down to ₹750 per person for groups of 6 or more. Weekends and public holidays range from ₹1000 per person for 4 down to ₹850 per person for 6 or more. Kids play is ₹500 (ages 5-8). All prices include applicable taxes.",
  },
  {
    q: "Do I need to book in advance?",
    a: "Yes — we recommend booking upfront, ideally 1-3 days in advance, as slots fill up fast due to high demand. Spot bookings are only possible if a slot is available, so to be safe please book ahead. Showtimes are subject to availability and city/location.",
  },
  {
    q: "Is there an age limit?",
    a: "We recommend ages 10 and up get the most out of the experience, but we're flexible — especially if there are younger players with older family members. Players 15 and under require adult accompaniment.",
  },
];

/** `embedded` strips the standalone section chrome (full-bleed padding +
 *  decorative background) so the FAQ can live inside another section — e.g. as
 *  the right column of the Footer. */
export function FAQSection({ embedded = false }: { embedded?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (embedded) {
    return (
      <div id="questions" className="w-full">
        <FAQContent
          faqItems={faqItems}
          openIndex={openIndex}
          handleToggle={handleToggle}
        />
      </div>
    );
  }

  return (
    <section id="questions" className="w-full bg-black">
      <div
        className="relative mx-auto w-full px-5 py-10 md:px-10 md:py-20"
        style={{ maxWidth: 1400 }}
      >
        {/* Decorative background image */}
        <Image
          src="/images/3pCUVCONlMbPw2vvJvV9TGG1gVY.png"
          alt=""
          aria-hidden="true"
          fill
          className="pointer-events-none z-0 object-cover opacity-10"
          sizes="100vw"
        />

        {/* Content */}
        <div className="relative z-[1]">
          <FAQContent
            faqItems={faqItems}
            openIndex={openIndex}
            handleToggle={handleToggle}
          />
        </div>
      </div>
    </section>
  );
}

/** Shared inner content (label, heading, accordion, CTA) used by both the
 *  standalone section and the embedded (footer) variant. */
function FAQContent({
  faqItems,
  openIndex,
  handleToggle,
}: {
  faqItems: { q: string; a: string }[];
  openIndex: number | null;
  handleToggle: (index: number) => void;
}) {
  return (
    <>
          {/* Section Label */}
          <div className="mb-6 flex items-center gap-4">
            <span
              className="block h-[2px] w-[60px] bg-white opacity-50"
              aria-hidden="true"
            />
            <span
              className="text-base font-normal text-white"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Questions
            </span>
          </div>

          {/* Heading */}
          <h2
            className="mb-10 text-[28px] font-medium leading-[1.2] tracking-[-2px] text-white md:mb-[60px] md:text-[48px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            All the Important Details Before Your Game Show
          </h2>

          {/* Accordion */}
          <div>
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <Reveal key={index} delay={index * 60}>
                <div
                  className={cn(
                    "mb-3 cursor-pointer rounded-2xl px-5 py-4 transition-colors duration-200 ease-in-out md:px-8 md:py-6",
                    isOpen ? "bg-[#222222]" : "bg-[#1a1a1a] hover:bg-[#222222]"
                  )}
                  onClick={() => handleToggle(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleToggle(index);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3
                      className="text-lg font-medium text-white"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {item.q}
                    </h3>
                    <span
                      className="ml-4 flex-shrink-0 text-white transition-transform duration-300 ease-in-out"
                      style={{
                        transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                      }}
                    >
                      {isOpen ? (
                        <X size={24} />
                      ) : (
                        <Plus size={24} />
                      )}
                    </span>
                  </div>
                  <div
                    className="grid transition-all duration-300 ease-in-out"
                    style={{
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                    }}
                  >
                    <div className="overflow-hidden">
                      <p
                        className="pt-4 text-base font-normal text-white/70"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
                </Reveal>
              );
            })}
          </div>
    </>
  );
}

/** "Still have questions?" CTA — extracted from the FAQ so it can sit on its own
 *  (rendered right below the Pricing section). */
export function StillHaveQuestions() {
  return (
    <section className="w-full bg-black px-5 py-10 md:px-10">
      <div className="mx-auto w-full" style={{ maxWidth: 1400 }}>
        <Reveal delay={120}>
          <div
            className="flex flex-col items-center gap-5 overflow-hidden rounded-3xl p-8 text-center md:flex-row md:justify-between md:text-left"
            style={{
              background:
                "linear-gradient(120deg, #147EFF 0%, #7C5CFC 50%, #FC19ED 100%)",
            }}
          >
            <div>
              <h3
                className="text-2xl font-bold text-white md:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Still have questions?
              </h3>
              <p className="mt-1 text-sm text-white/80 md:text-base">
                Grab your crew, pick a slot, and let&apos;s get you in the game show.
              </p>
            </div>

            {/* Two ways to reach us — chat on WhatsApp or call straight away. */}
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:shrink-0">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-7 py-4 text-base font-bold text-[#7C5CFC] shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-transform hover:scale-[1.04]"
              >
                <span className="text-[#25D366]">
                  <WhatsAppGlyph size={20} />
                </span>
                Chat
              </a>
              <a
                href={`tel:${PHONE_NUMBER}`}
                aria-label={`Call us at ${PHONE_DISPLAY}`}
                className="group inline-flex flex-col items-center justify-center rounded-full bg-white px-7 py-3 text-[#7C5CFC] shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-transform hover:scale-[1.04]"
              >
                <span className="inline-flex items-center gap-2 text-base font-bold leading-tight">
                  <Phone size={18} strokeWidth={2.6} />
                  Talk to us
                </span>
                <span className="text-xs font-semibold text-[#7C5CFC]/70">
                  {PHONE_DISPLAY}
                </span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
