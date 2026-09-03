"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * THE site-wide button. Every clickable CTA — nav, hero, pricing, location,
 * FAQ, team building, show cards — renders through this component so shape,
 * size and colour stay identical everywhere.
 *
 * Colour comes from the `--gs-*` tokens in globals.css; change a token there
 * and every button on the site updates. Never hardcode a hex here.
 *
 * Shape is fixed: pill (`--gs-btn-radius`). Variants change colour only, so a
 * new section can't accidentally introduce a new button silhouette.
 */
const ctaVariants = cva(
  // Shared skeleton: pill shape, centred content, consistent motion + focus.
  "group/cta relative inline-flex shrink-0 items-center justify-center gap-2 rounded-full text-center font-bold whitespace-nowrap transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** The headline action ("Book Your Show"). Brand gradient. */
        primary:
          "bg-[image:var(--gs-gradient-brand)] text-white shadow-[0_10px_30px_-12px_rgba(124,92,252,0.75)] hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-14px_rgba(252,25,237,0.7)]",
        /** Second action beside a primary. Outlined, fills faintly on hover. */
        secondary:
          "border border-(--gs-line-strong) bg-transparent text-white hover:border-(--gs-line-hover) hover:bg-(--gs-veil-hover)",
        /** Single flat-brand action where a gradient would be too loud. */
        solid:
          "bg-(--gs-blue) text-white shadow-[0_10px_28px_-14px_rgba(20,126,255,0.7)] hover:bg-(--gs-blue-bright)",
        /** On top of a coloured/gradient panel, where gradient-on-gradient fails. */
        contrast:
          "bg-black/30 text-white backdrop-blur-sm hover:bg-black/50",
        /** On top of imagery — solid white chip. */
        light:
          "bg-white text-(--gs-surface-sunken) shadow-lg hover:bg-white/90",
        /** Low-emphasis / tertiary. */
        ghost:
          "bg-(--gs-veil) text-white hover:bg-(--gs-veil-hover)",
        /** Inside the nav chrome, where a full gradient pill overpowers the bar.
            Black pill; the brand shows through the arrow badge only. */
        nav: "bg-black text-white hover:opacity-90",
      },
      size: {
        sm: "px-4 py-2 text-xs",
        md: "px-(--gs-btn-px) py-(--gs-btn-py) text-sm",
        lg: "px-7 py-4 text-base",
        /** Circular icon-only button (hamburger, close, etc.). */
        icon: "h-11 w-11 gap-0 p-0",
      },
      /** Adds the circular arrow badge used by the "Book Your Show" family. */
      badge: {
        true: "pr-2",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      badge: false,
    },
  }
);

type CtaVariantProps = VariantProps<typeof ctaVariants>;

/** The circular arrow badge that trails the primary CTA label. */
function CtaBadge({ variant }: { variant: CtaVariantProps["variant"] }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 group-hover/cta:rotate-45",
        // On the gradient the badge is a dark scrim; elsewhere it picks up brand blue.
        variant === "primary" || variant === "contrast"
          ? "bg-black/35"
          : "bg-(--gs-blue)"
      )}
    >
      <ArrowUpRight className="text-white" size={18} strokeWidth={2.5} />
    </span>
  );
}

type CtaOwnProps = CtaVariantProps & {
  className?: string;
  children?: React.ReactNode;
};

type CtaLinkProps = CtaOwnProps &
  Omit<React.ComponentProps<typeof Link>, "className" | "children">;

type CtaButtonProps = CtaOwnProps &
  Omit<React.ComponentProps<"button">, "className" | "children"> & {
    href?: undefined;
  };

export type CtaProps = CtaLinkProps | CtaButtonProps;

/**
 * Renders a `next/link` when given `href`, otherwise a `<button>`.
 * Pass `badge` to append the circular arrow used by booking CTAs.
 */
/**
 * Resolves an href like "#tickets" or "/#tickets" to the in-page element it
 * targets, or null when it points at another page (or nothing on this one).
 */
function inPageHashTarget(href: unknown): HTMLElement | null {
  if (typeof href !== "string") return null;
  const hashIdx = href.indexOf("#");
  if (hashIdx < 0) return null;
  const path = href.slice(0, hashIdx);
  if (path && path !== window.location.pathname) return null;
  return document.getElementById(href.slice(hashIdx + 1));
}

export function Cta({
  className,
  variant,
  size,
  badge,
  children,
  ...props
}: CtaProps) {
  const classes = cn(ctaVariants({ variant, size, badge, className }));
  // In-page hash links ("#tickets") are scrolled manually. The browser and
  // next/link both treat "navigate to the hash we're already on" as a no-op, so
  // the second click on "Book Your Show" after scrolling back up did nothing.
  // Handling it ourselves always scrolls.
  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    (props as CtaLinkProps).onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const target = inPageHashTarget((props as CtaLinkProps).href);
    if (!target) return;
    e.preventDefault();
    window.history.replaceState(window.history.state, "", `#${target.id}`);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const content = (
    <>
      {children}
      {badge ? <CtaBadge variant={variant} /> : null}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    return (
      <Link className={classes} {...(props as CtaLinkProps)} onClick={handleHashClick}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...(props as Omit<CtaButtonProps, "href">)}
    >
      {content}
    </button>
  );
}

export { ctaVariants };
