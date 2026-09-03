import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const gamestoriiRegular = localFont({
  src: [
    { path: "../../public/fonts/gamestorii-regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/gamestorii-regular-2.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-gamestorii",
  display: "swap",
});

const interDisplay = localFont({
  src: [
    { path: "../../public/fonts/inter-display.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/inter-display-2.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-inter-display",
  display: "swap",
});

const interTight = localFont({
  src: [
    { path: "../../public/fonts/inter-tight-regular.woff2", weight: "400 500", style: "normal italic" },
  ],
  variable: "--font-inter-tight",
  display: "swap",
});

const SITE_URL = "https://gameshowchallengerooms.com";

/**
 * Keyword strategy (Sept 2026, research-backed):
 *  Nobody searches "live game show". Demand sits in activity / experience
 *  language — "things to do", "fun activities", "indoor activities", "group
 *  activities", "team outing", "unique experiences" — plus the venue's own
 *  neighbourhood (Gachibowli / HITEC City corridor). Keep this list in that
 *  vocabulary; the game-show format is the differentiator, not the category.
 */
const KEYWORDS = [
  // Brand
  "game show challenge rooms",
  "game show challenge rooms hyderabad",
  "challenge rooms hyderabad",
  // Category — how buyers actually search
  "fun things to do in hyderabad",
  "things to do in hyderabad with friends",
  "best things to do in hyderabad",
  "fun activities in hyderabad",
  "indoor activities hyderabad",
  "indoor games hyderabad",
  "group activities hyderabad",
  "unique experiences hyderabad",
  "unique things to do in hyderabad",
  "weekend activities hyderabad",
  "immersive experience hyderabad",
  "interactive gaming experience hyderabad",
  "fun places in hyderabad",
  "date ideas hyderabad",
  // Competing categories we win against
  "escape room alternative hyderabad",
  "escape room hyderabad",
  "gaming zone hyderabad",
  "trivia night hyderabad",
  // Corporate / team building
  "team building activities hyderabad",
  "corporate team building hyderabad",
  "team outing hyderabad",
  "office outing hyderabad",
  "employee engagement activities hyderabad",
  // Celebrations
  "birthday party ideas hyderabad",
  "birthday party venue hyderabad",
  "bachelorette party hyderabad",
  "bachelor party hyderabad",
  "kitty party games hyderabad",
  // Hyper-local
  "things to do in gachibowli",
  "fun activities gachibowli",
  "things to do in hitec city",
  "activities in madhapur",
  "things to do in nanakramguda",
  "activities financial district hyderabad",
  "things to do kondapur",
  "entertainment jubilee hills",
  "things to do near me hyderabad",
  "fun activities near me",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Game Show Challenge Rooms | Fun Indoor Group Activity in Hyderabad",
    template: "%s | Game Show Challenge Rooms Hyderabad",
  },
  description:
    "Looking for fun things to do in Hyderabad with friends, family or your team? Game Show Challenge Rooms is an immersive live challenge experience in Hyderabad — two teams, three rounds of trivia, puzzle, speed and physical challenges, and a host who runs the show. Book on WhatsApp.",
  keywords: KEYWORDS,
  authors: [{ name: "Game Show Challenge Rooms" }],
  creator: "Game Show Challenge Rooms",
  publisher: "Game Show Challenge Rooms",
  category: "Entertainment",
  applicationName: "Game Show Challenge Rooms",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Game Show Challenge Rooms",
    title: "Game Show Challenge Rooms | Hyderabad's Most Fun Group Activity",
    description:
      "An immersive live challenge experience in Hyderabad. Trivia, puzzles, speed rounds and physical challenges, with a host keeping the energy up. Perfect for friends, birthdays and team outings.",
    images: [
      {
        url: "/seo/og-image.png",
        width: 1200,
        height: 630,
        alt: "Game Show Challenge Rooms — Hyderabad's most fun indoor group activity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Show Challenge Rooms | Hyderabad's Most Fun Group Activity",
    description:
      "An immersive live challenge experience in Hyderabad. Two teams, three rounds, one champion. Book on WhatsApp.",
    images: ["/seo/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // All icons are the brand logo on the dark brand square (generated from
  // public/images/logo-transparent.png). src/app/favicon.ico is the multi-res
  // .ico Next serves at /favicon.ico automatically.
  icons: {
    icon: [
      { url: "/seo/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/seo/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/seo/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/seo/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  other: {
    "geo.region": "IN-TG",
    "geo.placename": "Hyderabad",
    "geo.position": "17.385044;78.486671",
    ICBM: "17.385044, 78.486671",
    "facebook-domain-verification": "5thshl52xz05f4xsnpg7dqblmkddl4",
  },
};

/** The show formats sold on the page — each becomes a structured Offer so Google
 *  understands the breadth of what we run (corporate, kids, bachelorette, virtual…). */
const SHOW_FORMATS: { name: string; description: string }[] = [
  { name: "The Classic", description: "A focused 45-minute session of buzzer trivia, puzzle rounds and speed challenges for two teams, run by a live host." },
  { name: "Prime Time", description: "A 60-minute session with extra physical and team challenges, party-style group games and bigger crowd moments." },
  { name: "Corporate Team Building", description: "The office outing people actually talk about on Monday — for corporate teams, startups and offsites in Hyderabad." },
  { name: "Birthday Party Session", description: "A birthday where the whole group plays, with a Celebration Room to cut the cake afterwards." },
  { name: "Kids Session", description: "The same challenges with kid-friendly rounds for ages 10–15." },
  { name: "Bachelor / Bachelorette Session", description: "Cheeky, themed rounds built for the big celebration." },
  { name: "Virtual Challenge Session", description: "Play against anyone, anywhere, live on Zoom." },
  { name: "Roadshows", description: "We bring the host, lights and challenges to your venue anywhere in Hyderabad." },
];

const localBusiness = {
  "@type": "EntertainmentBusiness",
  "@id": `${SITE_URL}/#business`,
  name: "Game Show Challenge Rooms",
  legalName: "Vindi LLP",
  alternateName: "Game Show Challenge Rooms Hyderabad",
  description:
    "An immersive live challenge experience in Hyderabad. Your group splits into two teams and compete in trivia, puzzle, speed and physical challenge rounds run by a live host. One of the most fun indoor activities in Hyderabad for friends, birthdays and team outings.",
  slogan: "Hyderabad's unique game experience.",
  url: SITE_URL,
  image: [`${SITE_URL}/seo/og-image.png`, `${SITE_URL}/images/logo.png`],
  logo: `${SITE_URL}/images/logo.png`,
  email: "gameshowchallengerooms@gmail.com",
  telephone: "+91-90001-87731",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "4th Floor, Survey No. 1, Khajaguda - Nanakramguda Rd, Khajaguda",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    postalCode: "500104",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "17.4192577",
    longitude: "78.3753142",
  },
  hasMap: "https://maps.app.goo.gl/MZfvdmxwBTa3NPj29",
  areaServed: [
    { "@type": "City", name: "Hyderabad" },
    { "@type": "City", name: "Secunderabad" },
    { "@type": "City", name: "Cyberabad" },
    "Gachibowli",
    "Nanakramguda",
    "Financial District",
    "HITEC City",
    "Madhapur",
    "Manikonda",
    "Raidurg",
    "Kokapet",
    "Narsingi",
    "Tellapur",
    "Kondapur",
    "Miyapur",
    "Kukatpally",
    "Jubilee Hills",
    "Banjara Hills",
    "Shamshabad",
  ],
  knowsAbout: [
    "immersive group activities",
    "indoor activities in Hyderabad",
    "things to do in Hyderabad",
    "corporate team building",
    "team outings",
    "birthday party activities",
    "trivia and puzzle challenges",
    "weekend activities in Hyderabad",
  ],
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, UPI, Credit Card, Debit Card",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-90001-87731",
    email: "gameshowchallengerooms@gmail.com",
    contactType: "reservations",
    areaServed: "IN",
    availableLanguage: ["en", "hi", "te"],
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "11:00",
    closes: "22:00",
  },
  sameAs: [
    "https://www.instagram.com/gameshowchallengerooms/",
    "https://www.facebook.com/people/Game-Show-Challenge-Rooms/61593501426544/",
    "https://www.youtube.com/@GameShowChallengeRooms/shorts",
    "https://maps.app.goo.gl/MZfvdmxwBTa3NPj29",
  ],
  makesOffer: SHOW_FORMATS.map((f) => ({
    "@type": "Offer",
    name: f.name,
    description: f.description,
    availability: "https://schema.org/InStock",
    areaServed: "Hyderabad",
  })),
};

const website = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Game Show Challenge Rooms",
  alternateName: [
    "Game Show Challenge Rooms Hyderabad",
    "Challenge Rooms Hyderabad",
  ],
  description:
    "Hyderabad's most fun indoor group activity — an immersive live challenge experience in Hyderabad for friends, birthdays, team outings and weekend plans.",
  publisher: { "@id": `${SITE_URL}/#business` },
  inLanguage: "en-IN",
};

/** Mirrors the on-page FAQ in FAQSection.tsx so Google can show FAQ rich results. */
const faqPage = {
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#faq`,
  mainEntity: [
    {
      q: "What is Game Show Challenge Rooms?",
      a: "An immersive, live-hosted challenge experience in Hyderabad for friends, families and teams. Your group splits into two teams and competes in trivia, puzzle, speed and physical challenge rounds, with a host running the show and the scores on the board.",
    },
    {
      q: "How does it work?",
      a: "On arrival you divide into two teams, pick team names and colours, and get a quick briefing. Your host then runs three different challenge rounds. Every round earns Challenge Points, and the highest-scoring team is crowned champion.",
    },
    {
      q: "How long does it take?",
      a: "The Classic includes approximately 45 minutes of gameplay, while Prime Time runs for approximately 60 minutes. Please arrive 15 minutes before your booked slot for check-in and team setup.",
    },
    {
      q: "Do I need to book in advance?",
      a: "Yes. Slots fill up fast, especially on weekends, so we recommend booking 1–3 days ahead on WhatsApp. Walk-ins are welcome only if a slot happens to be free.",
    },
    {
      q: "Is there an age limit?",
      a: "We recommend ages 10 and up get the most out of the experience, but we're flexible — especially if there are younger players with older family members. Players 15 and under require adult accompaniment.",
    },
    {
      q: "Do I need to be fit or good at trivia?",
      a: "No. The rounds mix brains, speed and light physical challenges, so every kind of player gets a moment to shine. Come in comfortable clothes; your host explains everything and keeps the session moving from start to finish.",
    },
    {
      q: "Is it like an escape room or a gaming zone?",
      a: "No. There are no locked rooms or arcade machines. It is a hosted, team-versus-team competition in an open arena, so the whole group plays at the same time and the energy stays high throughout.",
    },
  ].map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [localBusiness, website, faqPage],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${inter.variable} ${gamestoriiRegular.variable} ${interDisplay.variable} ${interTight.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
      <GoogleAnalytics gaId="G-WLT7B50QM5" />
    </html>
  );
}
