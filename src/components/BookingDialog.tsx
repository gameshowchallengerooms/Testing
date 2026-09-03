"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Phone, X } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Cta, ctaVariants } from "@/components/ui/cta";
import {
  PHONE_DISPLAY,
  PHONE_NUMBER,
  WhatsAppGlyph,
  whatsappHref,
} from "@/components/WhatsAppChat";

/**
 * "Book your slot" no longer scrolls the page: it opens this small dialog with
 * the two ways to reach us (WhatsApp chat, phone call). Rendered through a
 * portal so it escapes the transformed / blurred nav chrome it is usually
 * triggered from.
 */

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
}

const OPTION_CLASS =
  "group/opt flex items-center gap-4 rounded-xl border border-white/10 bg-white/4 p-4 text-left transition-colors duration-200 hover:border-white/25 hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70";

export function BookingDialog({ open, onClose }: BookingDialogProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    // Move focus into the dialog so keyboard and screen-reader users land on
    // the first action instead of staying on the (now covered) trigger.
    const first = panelRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 animate-in bg-black/70 backdrop-blur-sm duration-200 fade-in-0"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md animate-in overflow-hidden rounded-2xl border border-white/10 bg-gs-surface-panel text-white shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] duration-300 fade-in-0 zoom-in-95 slide-in-from-bottom-4"
      >
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gs-gold" />

        <div className="flex items-start justify-between gap-4 p-6 pb-4 sm:p-7 sm:pb-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gs-gold">
              Book your slot
            </p>
            <h2 id={titleId} className="mt-2 text-2xl font-black leading-tight tracking-[-0.03em]">
              Tell us your group size and date
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/60">
              We&apos;ll confirm the best format and an available time. Pick
              whichever is easier for you.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/4 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <X size={18} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-3 px-6 pb-6 sm:px-7 sm:pb-7">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className={OPTION_CLASS}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gs-whatsapp text-white">
              <WhatsAppGlyph size={24} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-bold">Chat on WhatsApp</span>
              <span className="mt-0.5 block text-sm text-white/55">
                Message us your group size and preferred date
              </span>
            </span>
            <span className="text-sm font-semibold text-gs-whatsapp transition-transform duration-200 group-hover/opt:translate-x-0.5">
              Open
            </span>
          </a>

          <a
            href={`tel:${PHONE_NUMBER}`}
            aria-label={`Call us at ${PHONE_DISPLAY}`}
            onClick={onClose}
            className={OPTION_CLASS}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gs-blue text-white">
              <Phone size={22} strokeWidth={2.4} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-bold">Call us</span>
              <span className="mt-0.5 block text-sm text-white/55">{PHONE_DISPLAY}</span>
            </span>
            <span className="text-sm font-semibold text-gs-blue-bright transition-transform duration-200 group-hover/opt:translate-x-0.5">
              Dial
            </span>
          </a>

          <p className="mt-1 text-center text-xs text-white/40">
            Hosted live in Hyderabad. 45–60 minutes per show.
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

type BookingCtaProps = VariantProps<typeof ctaVariants> & {
  className?: string;
  children: ReactNode;
  /** Runs before the dialog opens (e.g. to close a menu the button lives in). */
  onClick?: () => void;
};

/** A site CTA button that opens the booking dialog instead of navigating. */
export function BookingCta({ onClick, className, children, ...variantProps }: BookingCtaProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  return (
    <>
      <Cta
        ref={triggerRef}
        {...variantProps}
        className={cn(className)}
        onClick={() => {
          onClick?.();
          setOpen(true);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {children}
      </Cta>
      <BookingDialog open={open} onClose={close} />
    </>
  );
}
