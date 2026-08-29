"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Floating WhatsApp Business chat widget.
 *
 * Opens a WhatsApp chat (wa.me) with a pre-filled message so visitors can
 * enquire/book in one tap. The number is configurable via
 * NEXT_PUBLIC_WHATSAPP_NUMBER (digits only, with country code, e.g. 919000187731)
 * and falls back to the business number used elsewhere on the site.
 *
 * The FAB stays hidden until the visitor has scrolled past the show line-up
 * (#show-rounds) section, then fades in.
 */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "919000187731";

/** Tel-dialable phone number and its display form, shared across the site. */
export const PHONE_NUMBER = "+919000187731";
export const PHONE_DISPLAY = "+91 90001 87731";

const PREFILLED_MESSAGE =
  "Hi! I'd like to book a Game Show Challenge Rooms experience. My group size is __ and my preferred date is __.";

/** Pre-filled WhatsApp chat link, reusable wherever we offer "Chat with us". */
export const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  PREFILLED_MESSAGE
)}`;

export function WhatsAppGlyph({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function WhatsAppChat() {
  // Reveal the FAB only after the visitor scrolls past the show line-up section.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const gate = document.getElementById("show-rounds");
    if (!gate) {
      // No gating section on this page — show the FAB normally. Defer the state
      // update to a microtask so we don't setState synchronously inside the
      // effect body (which would trigger a cascading render).
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    const check = () => {
      // Visible once the bottom of the show line-up section has scrolled above
      // the top of the viewport (i.e. the user is past it).
      setVisible(gate.getBoundingClientRect().bottom <= 0);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-gs-whatsapp py-3.5 pl-3.5 pr-4 text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)] transition-all duration-300 hover:bg-[var(--gs-whatsapp-deep)] md:bottom-7 md:right-7",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <WhatsAppGlyph size={28} />
      <span className="hidden text-sm font-bold sm:inline">Chat with us</span>
    </a>
  );
}
