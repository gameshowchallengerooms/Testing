import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, Phone } from "lucide-react";

const SITE_URL = "https://gameshowchallengerooms.com";
const LAST_UPDATED = "27 June 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Game Show Challenge Rooms Hyderabad collects, uses and protects the information you share when you book or enquire about a live game show.",
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
  robots: { index: true, follow: true },
};

interface Section {
  heading: string;
  body: React.ReactNode;
}

const sections: Section[] = [
  {
    heading: "1. Who we are",
    body: (
      <p>
        Game Show Challenge Rooms (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;)
        runs live, hosted game show experiences for groups in Hyderabad, India. This
        Privacy Policy explains what information we collect when you visit this website,
        book a show or get in touch with us, and how we use and protect it.
      </p>
    ),
  },
  {
    heading: "2. Information we collect",
    body: (
      <>
        <p>We only collect the information we need to respond to you and run your show:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-white/65">
          <li>
            <span className="font-semibold text-white/85">Contact details</span> you give us
            — such as your name, email address and phone number — when you enquire, book a
            show or message us on WhatsApp.
          </li>
          <li>
            <span className="font-semibold text-white/85">Booking details</span> — such as
            your preferred date, group size, occasion and any special requests.
          </li>
          <li>
            <span className="font-semibold text-white/85">Usage data</span> — basic,
            non-identifying analytics about how visitors use this site (pages viewed,
            device and browser type) to help us improve it.
          </li>
        </ul>
        <p className="mt-3">
          We do not collect payment card details on this website; any payments are handled
          directly with you or through a trusted third-party provider.
        </p>
      </>
    ),
  },
  {
    heading: "3. How we use your information",
    body: (
      <>
        <p>We use the information you share to:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-white/65">
          <li>respond to your enquiries and confirm your booking;</li>
          <li>organise, host and follow up on your game show;</li>
          <li>send you information you ask for, such as availability and pricing;</li>
          <li>improve our website, shows and customer service.</li>
        </ul>
        <p className="mt-3">
          We will only send you marketing messages if you have asked us to, and you can opt
          out at any time.
        </p>
      </>
    ),
  },
  {
    heading: "4. Sharing your information",
    body: (
      <p>
        We do not sell or rent your personal information. We only share it with trusted
        service providers who help us operate (for example, scheduling, messaging or
        analytics tools), and only to the extent they need it to provide that service. We
        may also disclose information if required to do so by law.
      </p>
    ),
  },
  {
    heading: "5. Cookies and analytics",
    body: (
      <p>
        This site may use cookies and similar technologies to keep it working smoothly and
        to understand how it is used. You can control or disable cookies through your
        browser settings; some parts of the site may not work as expected if you do.
      </p>
    ),
  },
  {
    heading: "6. Data retention & security",
    body: (
      <p>
        We keep your information only for as long as we need it to provide our services and
        meet our legal obligations, after which it is deleted or anonymised. We take
        reasonable measures to protect your information against loss, misuse and
        unauthorised access.
      </p>
    ),
  },
  {
    heading: "7. Your rights",
    body: (
      <p>
        You can ask us to access, correct or delete the personal information we hold about
        you, or to stop using it for marketing. To make a request, contact us using the
        details below and we will respond as soon as we reasonably can.
      </p>
    ),
  },
  {
    heading: "8. Children's privacy",
    body: (
      <p>
        Our Kids Show is designed for ages 10–15 and is always booked and supervised by a
        parent, guardian or organiser. We do not knowingly collect personal information
        directly from children without the consent of a responsible adult.
      </p>
    ),
  },
  {
    heading: "9. Changes to this policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted on
        this page with a revised &ldquo;Last updated&rdquo; date.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="relative min-h-screen bg-black">
      {/* ambient glow to match the site */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(124,92,252,0.18), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[820px] px-5 pb-24 pt-16 md:pt-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="mt-8 flex items-center gap-4">
          <Image
            src="/images/logo.png"
            alt="Game Show Challenge Rooms"
            width={186}
            height={120}
            className="h-11 w-auto"
          />
        </div>

        <h1
          className="mt-8 text-4xl font-semibold leading-tight text-white md:text-[52px]"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-1.6px" }}
        >
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-white/45">Last updated: {LAST_UPDATED}</p>

        <p className="mt-6 text-base leading-relaxed text-white/65">
          Your privacy matters to us. This page explains, in plain language, what
          information we collect when you use this website or book a live game show with
          us, and how we look after it.
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2
                className="mb-3 text-xl font-bold text-white md:text-2xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {section.heading}
              </h2>
              <div className="text-base leading-relaxed text-white/65">{section.body}</div>
            </section>
          ))}

          {/* Contact */}
          <section>
            <h2
              className="mb-3 text-xl font-bold text-white md:text-2xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              10. Contact us
            </h2>
            <p className="text-base leading-relaxed text-white/65">
              If you have any questions about this Privacy Policy or how we handle your
              information, please get in touch:
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-6">
              <Link
                href="mailto:gameshowchallengerooms@gmail.com"
                className="flex items-center gap-2 text-sm font-medium text-white/85 transition-colors hover:text-white"
              >
                <Mail size={16} className="text-gs-violet-bright" />
                gameshowchallengerooms@gmail.com
              </Link>
              <Link
                href="tel:+919000187731"
                className="flex items-center gap-2 text-sm font-medium text-white/85 transition-colors hover:text-white"
              >
                <Phone size={16} className="text-gs-violet-bright" />
                +91 90001 87731
              </Link>
            </div>
            <p className="mt-4 text-sm text-white/45">
              Game Show Challenge Rooms · Gachibowli, Hyderabad, India
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
