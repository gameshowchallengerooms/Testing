import type { Metadata } from "next";
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
 * Keyword strategy (research-backed, June 2026):
 *  - Brand + category: "game show challenge rooms", "live game show experience"
 *  - Primary intent: "things to do in Hyderabad", "fun activities", "group activities"
 *  - Competing categories we win against: escape rooms, mystery rooms, trivia/quiz nights
 *  - Audience segments (each is a real page section / show format on this site)
 *  - Hyper-local: Gachibowli, HITEC City, Madhapur, Jubilee Hills, Banjara Hills, Kondapur, Secunderabad
 */
const KEYWORDS = [
  // Brand
  "game show challenge rooms",
  "game show challenge rooms hyderabad",
  "challenge rooms hyderabad",
  // Category
  "live game show experience",
  "live game show hyderabad",
  "game show hyderabad",
  "real life game show",
  "interactive game show",
  "hosted game show",
  "tv game show experience",
  "game show studio hyderabad",
  // Intent / discovery
  "things to do in hyderabad",
  "things to do in hyderabad with friends",
  "fun things to do in hyderabad",
  "fun activities in hyderabad",
  "indoor activities hyderabad",
  "indoor games hyderabad",
  "weekend activities hyderabad",
  "unique experiences hyderabad",
  "group activities hyderabad",
  "group games hyderabad",
  "activities for groups hyderabad",
  "entertainment in hyderabad",
  "places to hang out in hyderabad",
  // Competing categories
  "escape room hyderabad",
  "escape room alternative",
  "mystery room hyderabad",
  "trivia night hyderabad",
  "quiz night hyderabad",
  "gaming zone hyderabad",
  // Corporate / team building
  "team building hyderabad",
  "corporate team building hyderabad",
  "corporate team building activities",
  "team building activities hyderabad",
  "team building games hyderabad",
  "corporate events hyderabad",
  "office outing hyderabad",
  "corporate offsite hyderabad",
  "employee engagement activities hyderabad",
  "team outing hyderabad",
  "startup team building",
  // Celebrations
  "birthday party hyderabad",
  "birthday party games hyderabad",
  "birthday party venue hyderabad",
  "kids birthday party hyderabad",
  "adult birthday party ideas hyderabad",
  "bachelorette party hyderabad",
  "bachelor party hyderabad",
  "kitty party games hyderabad",
  "anniversary celebration hyderabad",
  "farewell party ideas hyderabad",
  "festive party hyderabad",
  "diwali party games",
  // Audiences / formats
  "kids game show",
  "family activities hyderabad",
  "school trip activities hyderabad",
  "college group activities hyderabad",
  "virtual game show",
  "online game show",
  "game show on zoom",
  "game show roadshow",
  // Hyper-local
  "things to do in gachibowli",
  "things to do in hitec city",
  "activities in madhapur",
  "entertainment jubilee hills",
  "fun things to do banjara hills",
  "things to do kondapur",
  "activities secunderabad",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Game Show Challenge Rooms Hyderabad | Live Game Show Experience for Groups",
    template: "%s | Game Show Challenge Rooms Hyderabad",
  },
  description:
    "Step off the couch and onto the show. Game Show Challenge Rooms is Hyderabad's #1 live game show experience — a real host, studio lights and buzzers, for groups of 4–15. Perfect for team building, birthdays, bachelorette parties, kids and corporate outings. Book your private show today.",
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
    title: "Game Show Challenge Rooms Hyderabad | You're On The Show",
    description:
      "All your life you watched it on TV. Now you can be in it. Hyderabad's first live game show experience — host, lights, buzzers and your crew. Great for team building, birthdays and corporate outings. Book your private show.",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Game Show Challenge Rooms — Hyderabad's live game show experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Show Challenge Rooms Hyderabad | You're On The Show",
    description:
      "Hyderabad's first live game show experience — host, lights, buzzers and your crew. Groups of 4–15. Book your private show.",
    images: ["/images/logo.png"],
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
  icons: {
    icon: "/seo/ZrnSOoqkPD3fRzQY8ti5PBxhnc.png",
    apple: "/seo/apple-touch-icon.png",
  },
  other: {
    "geo.region": "IN-TG",
    "geo.placename": "Hyderabad",
    "geo.position": "17.385044;78.486671",
    ICBM: "17.385044, 78.486671",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EntertainmentBusiness",
  name: "Game Show Challenge Rooms",
  description:
    "Hyderabad's first live game show experience — a real host, studio lights and buzzers, for groups of 4–15 players.",
  url: SITE_URL,
  image: `${SITE_URL}/images/logo.png`,
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
    latitude: "17.4106",
    longitude: "78.3656",
  },
  hasMap: "https://maps.app.goo.gl/MZfvdmxwBTa3NPj29",
  areaServed: "Hyderabad",
  priceRange: "₹750–₹1200 per person",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "10000",
  },
  makesOffer: {
    "@type": "Offer",
    name: "Private Live Game Show",
    priceCurrency: "INR",
    price: "750",
    description: "Per person, for groups of 6 or more on weekdays.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${gamestoriiRegular.variable} ${interDisplay.variable} ${interTight.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
