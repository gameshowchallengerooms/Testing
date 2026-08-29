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
import { Cta } from "@/components/ui/cta";

const faqItems = [
  {
    q: "What is Game Show Challenge Rooms?",
    a: "It is a private, live-hosted game show experience in Hyderabad for groups of 4–15 people. Your group becomes the contestants, splits into two teams and competes under studio lights using real buzzers.",
  },
  {
    q: "How does this work?",
    a: "On arrival, you divide into two teams, choose team names and colours, and get a quick briefing. A live host then leads three different game-show rounds. Every round earns Challenge Points, and the highest-scoring team becomes champion.",
  },
  {
    q: "How long does a show take?",
    a: "The Classic includes approximately 45 minutes of gameplay, while Prime Time runs for approximately 60 minutes. Please arrive 15 minutes before your booked slot for check-in and team setup.",
  },
  {
    q: "What is the price?",
    a: "Pricing is per person and depends on your group size and the day you pick. Message us on WhatsApp or call us with your group size and preferred date and we'll share the exact price for your show.",
  },
  {
    q: "Do I need to book in advance?",
    a: "Yes — we recommend booking upfront, ideally 1-3 days in advance, as slots fill up fast due to high demand. Spot bookings are only possible if a slot is available, so to be safe please book ahead. Showtimes are subject to availability and city/location.",
  },
  {
    q: "Is there an age limit?",
    a: "We recommend ages 10 and up get the most out of the experience, but we're flexible — especially if there are younger players with older family members. Players 15 and under require adult accompaniment.",
  },
  {
    q: "Do we need to prepare or bring anything?",
    a: "No preparation or special game-show knowledge is needed. Come in comfortable clothes with your group; your host explains the rules and keeps the experience moving from start to finish.",
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
                    isOpen ? "bg-gs-surface-raised" : "bg-gs-surface hover:bg-gs-surface-raised"
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
 *  (carries the #tickets anchor every "Book Your Show" button links to). */
export function StillHaveQuestions() {
  return (
    <section id="tickets" className="w-full bg-black px-5 py-10 md:px-10">
      <div className="mx-auto w-full" style={{ maxWidth: 1400 }}>
        <Reveal delay={120}>
          {/* Anthracite panel with a single precise accent edge — BMW-style
              restraint instead of a saturated gradient. */}
          <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-sm border border-white/10 bg-gs-surface-sunken p-8 text-center md:flex-row md:justify-between md:p-10 md:text-left">
            <span
              className="pointer-events-none absolute inset-y-0 left-0 w-[3px]"
              style={{ background: "linear-gradient(180deg, var(--gs-blue-bright), var(--gs-violet))" }}
              aria-hidden="true"
            />
            <div>
              <h3
                className="text-2xl font-semibold tracking-tight text-white md:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Ready to plan your show?
              </h3>
              <p className="mt-1.5 text-sm text-white/55 md:text-base">
                Send your group size and preferred date. We&apos;ll confirm the best
                format, available time and exact price.
              </p>
            </div>

            {/* Two ways to reach us — chat on WhatsApp or call straight away. */}
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:shrink-0">
              <Cta
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                variant="secondary"
                size="lg"
                className="text-sm uppercase tracking-[0.12em]"
              >
                <span className="text-gs-whatsapp">
                  <WhatsAppGlyph size={18} />
                </span>
                Chat
              </Cta>
              <Cta
                href={`tel:${PHONE_NUMBER}`}
                aria-label={`Call us at ${PHONE_DISPLAY}`}
                variant="solid"
                className="flex-col gap-0 py-3"
              >
                <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase leading-tight tracking-[0.12em]">
                  <Phone size={16} strokeWidth={2.4} />
                  Talk to us
                </span>
                <span className="text-xs font-medium tracking-wide text-white/70">
                  {PHONE_DISPLAY}
                </span>
              </Cta>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
