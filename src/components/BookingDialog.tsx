"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Phone, Star, Ticket, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PHONE_DISPLAY,
  PHONE_NUMBER,
  WHATSAPP_NUMBER,
  WhatsAppGlyph,
} from "@/components/WhatsAppChat";

/**
 * The booking moment.
 *
 * Every "Book Your Show" CTA on the site opens this dialog instead of a form:
 * shows are booked by talking to us, so the dialog hands the visitor straight
 * to WhatsApp (with their chosen show pre-filled) or a phone call. The host
 * cutout presents it like a mini stage moment — spotlights, gold star, and a
 * ticket chip echoing exactly what they were about to book.
 *
 * Wiring: wrap the app in <BookingProvider> once (layout), then any client
 * component calls `useBooking().openBooking("Prime Time for 6+ players…")`.
 */

type BookingContextValue = {
  /** Open the dialog. `detail` names what they tried to book, e.g. "Prime Time". */
  openBooking: (detail?: string) => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}

function whatsappBookingHref(detail?: string) {
  const what = detail ? `book ${detail}` : "book a show";
  const message = `Hi! I'd like to ${what} at Game Show Challenge Rooms. Here's my date and group size — and if we're celebrating anything, I'd love to hear how you'd theme it.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Tiny gold stars that twinkle around the card — the "magic" dust. */
const TWINKLES = [
  { left: "8%", top: "14%", size: 13, delay: 0 },
  { left: "86%", top: "10%", size: 10, delay: 0.6 },
  { left: "14%", top: "78%", size: 9, delay: 1.1 },
  { left: "72%", top: "86%", size: 12, delay: 0.3 },
] as const;

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ open: boolean; detail?: string }>({
    open: false,
  });
  const whatsappRef = useRef<HTMLAnchorElement>(null);

  const openBooking = useCallback((detail?: string) => {
    setState({ open: true, detail });
  }, []);
  const close = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
  }, []);

  // Escape closes; the page behind stops scrolling while the dialog is up.
  useEffect(() => {
    if (!state.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    // Land focus on the primary action so keyboard users can book in one tap.
    const focusId = requestAnimationFrame(() => whatsappRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      cancelAnimationFrame(focusId);
    };
  }, [state.open, close]);

  return (
    <BookingContext.Provider value={{ openBooking }}>
      {children}

      <AnimatePresence>
        {state.open && (
          <motion.div
            className="fixed inset-0 z-100 flex items-end justify-center p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {/* Backdrop — house lights down */}
            <button
              type="button"
              aria-label="Close booking dialog"
              onClick={close}
              className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Book your show"
              className="relative w-full max-w-105 overflow-hidden rounded-3xl border border-white/12 bg-gs-surface-black shadow-[0_40px_120px_rgba(0,0,0,0.8),0_0_60px_rgba(124,92,252,0.25)]"
              initial={{ opacity: 0, y: 28, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            >
              {/* Stage spotlights sweeping down from the card's top corners */}
              <div aria-hidden className="pointer-events-none absolute inset-0">
                <div
                  className="absolute inset-0 opacity-80"
                  style={{
                    background:
                      "linear-gradient(205deg, rgba(31,162,255,0.22) 0%, transparent 42%), linear-gradient(155deg, rgba(252,25,237,0.16) 0%, transparent 46%), radial-gradient(ellipse 120% 90% at 50% 115%, rgba(124,92,252,0.22) 0%, transparent 60%)",
                  }}
                />
                {TWINKLES.map((t, i) => (
                  <motion.span
                    key={i}
                    className="absolute"
                    style={{ left: t.left, top: t.top }}
                    animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1.15, 0.7] }}
                    transition={{
                      duration: 2.4,
                      delay: t.delay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Star
                      size={t.size}
                      className="fill-gs-gold text-gs-gold"
                      style={{ filter: "drop-shadow(0 0 6px rgba(255,210,63,0.8))" }}
                    />
                  </motion.span>
                ))}
              </div>

              {/* The host presents the moment */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-7 bottom-0 h-52 w-24 sm:h-60 sm:w-28"
              >
                <Image
                  src="/images/show-crew/host-color.webp"
                  alt=""
                  fill
                  sizes="7rem"
                  className="select-none object-contain object-bottom"
                  draggable={false}
                />
              </div>

              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="relative px-6 pb-7 pt-8 pr-20 sm:px-8 sm:pr-24">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gs-gold">
                  <Star size={13} className="fill-gs-gold text-gs-gold" />
                  Let&apos;s set your stage
                </p>

                <h2 className="mt-3 font-(--font-display) text-2xl font-black uppercase leading-[1.05] text-white sm:text-3xl">
                  Your show,
                  <br />
                  your moment.
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Live host, buzzers, studio lights — the full game show. And
                  if you&apos;re celebrating something, we&apos;ll theme it
                  around you: your names in the rounds, your moment on the
                  scoreboard. That&apos;s why we book over a quick chat.
                </p>

                {state.detail && (
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-gs-gold/40 bg-gs-gold/10 px-3.5 py-1.5 text-xs font-semibold text-gs-gold">
                    <Ticket size={14} />
                    {state.detail}
                  </p>
                )}

                <p className="mt-4 text-sm leading-relaxed text-white/55">
                  Tell us your date and group size — we&apos;ll confirm your
                  slot and the exact price upfront. No payment needed to talk.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <a
                    ref={whatsappRef}
                    href={whatsappBookingHref(state.detail)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group inline-flex items-center justify-center gap-2.5 rounded-full bg-gs-whatsapp px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_34px_-10px_rgba(37,211,102,0.65)] transition-all duration-300",
                      "hover:-translate-y-0.5 hover:bg-(--gs-whatsapp-deep) focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black outline-none",
                    )}
                  >
                    <WhatsAppGlyph size={20} />
                    Book on WhatsApp
                  </a>
                  <a
                    href={`tel:${PHONE_NUMBER}`}
                    className="inline-flex items-center justify-center gap-2.5 rounded-full border border-(--gs-line-strong) px-6 py-3.5 text-sm font-bold text-white transition-colors duration-300 hover:border-(--gs-line-hover) hover:bg-(--gs-veil-hover) focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black outline-none"
                  >
                    <Phone size={17} />
                    Call {PHONE_DISPLAY}
                  </a>
                </div>

                <p className="mt-4 text-[11px] leading-relaxed text-white/40">
                  You&apos;re messaging our team at Game Show Challenge Rooms,
                  Khajaguda, Hyderabad. Fastest on WhatsApp — we usually reply
                  within minutes.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </BookingContext.Provider>
  );
}
