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
  "best things to do in hyderabad",
  "things to do in hyderabad",
  "things to do in hyderabad with friends",
  "fun things to do in hyderabad",
  "fun activities in hyderabad",
  "best entertainment in hyderabad",
  "best places to visit in hyderabad",
  "indoor activities hyderabad",
  "indoor games hyderabad",
  "weekend activities hyderabad",
  "weekend entertainment hyderabad",
  "weekend plans hyderabad",
  "unique experiences hyderabad",
  "group activities hyderabad",
  "group games hyderabad",
  "activities for groups hyderabad",
  "entertainment in hyderabad",
  "places to hang out in hyderabad",
  "fun places in hyderabad",
  "date ideas hyderabad",
  "things to do near me hyderabad",
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
  // Hyper-local — Gachibowli & the IT/office corridor (where the venue is)
  "things to do in gachibowli",
  "things to do in gachibowli with friends",
  "fun activities gachibowli",
  "entertainment gachibowli",
  "game show gachibowli",
  "team building gachibowli",
  "corporate activities gachibowli",
  "things to do near my office hyderabad",
  "office team outing gachibowli",
  "things to do in nanakramguda",
  "activities financial district hyderabad",
  "things to do in manikonda",
  "things to do in raidurg",
  "fun things to do hitec city",
  "things to do in hitec city",
  "activities in madhapur",
  "things to do in kokapet",
  "things to do in narsingi",
  "things to do in tellapur",
  "entertainment jubilee hills",
  "fun things to do banjara hills",
  "things to do kondapur",
  "activities secunderabad",
  // Nearby places & wider region (not just central Hyderabad)
  "things to do near hyderabad",
  "places to visit near hyderabad",
  "weekend getaway near hyderabad",
  "things to do in cyberabad",
  "things to do in secunderabad",
  "things to do in shamshabad",
  "things to do in patancheru",
  "things to do in miyapur",
  "things to do in kukatpally",
  "things to do in lb nagar",
  "things to do in uppal",
  "entertainment near me",
  "game show near me",
  "fun activities near me",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Game Show Challenge Rooms Hyderabad | Live Game Show Experience for Groups",
    template: "%s | Game Show Challenge Rooms Hyderabad",
  },
  description:
    "Step off the couch and onto the show. Game Show Challenge Rooms is Hyderabad's #1 live game show experience — a real host, studio lights and buzzers, for groups of 4–15. Perfect for team building, birthdays, bachelorette parties, kids and corporate outings. Book your show today.",
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
      "All your life you watched it on TV. Now you can be in it. Hyderabad's first live game show experience — host, lights, buzzers and your crew. Great for team building, birthdays and corporate outings. Book your show.",
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
      "Hyderabad's first live game show experience — host, lights, buzzers and your crew. Groups of 4–15. Book your show.",
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

/** The show formats sold on the page — each becomes a structured Offer so Google
 *  understands the breadth of what we run (corporate, kids, bachelorette, virtual…). */
const SHOW_FORMATS: { name: string; description: string }[] = [
  { name: "Classic Showdowns", description: "Buzzer-smashing trivia and brain-teasers where the smartest, fastest team is crowned champion." },
  { name: "Primetime Showdowns", description: "Our highest-energy format — quick-fire rounds plus 60-second Time Rush skill challenges." },
  { name: "Corporate Team Building", description: "The office outing everyone will actually talk about — perfect for corporate teams, startups and offsites in Hyderabad." },
  { name: "Birthday Party Show", description: "A live game show for birthdays, with a Celebration Room to cut the cake afterwards." },
  { name: "Kids Show", description: "Same thrill with kid-friendly questions for ages 10–15." },
  { name: "Bachelor / Bachelorette Show", description: "Cheeky questions themed around the big day." },
  { name: "Virtual Game Show", description: "Face off against anyone, anywhere, live on Zoom." },
  { name: "Roadshows", description: "We bring the lights, host and props to your venue anywhere in Hyderabad." },
];

const localBusiness = {
  "@type": "EntertainmentBusiness",
  "@id": `${SITE_URL}/#business`,
  name: "Game Show Challenge Rooms",
  alternateName: "Game Show Challenge Rooms Hyderabad",
  description:
    "Hyderabad's first live game show experience — a real host, studio lights and buzzers, for groups of 4–15 players. Great for team building, birthdays, bachelorette parties, corporate outings and family fun.",
  slogan: "All your life you watched it on TV. Tonight, you're on the show.",
  url: SITE_URL,
  image: `${SITE_URL}/images/logo.png`,
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
    "live game show experience",
    "corporate team building",
    "birthday party games",
    "team outings",
    "trivia and quiz games",
    "things to do in Hyderabad",
    "weekend activities in Hyderabad",
    "indoor entertainment",
  ],
  priceRange: "₹500–₹1200 per person",
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
    "https://www.instagram.com/",
    "https://www.facebook.com/",
    "https://maps.app.goo.gl/MZfvdmxwBTa3NPj29",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "10000",
  },
  makesOffer: SHOW_FORMATS.map((f) => ({
    "@type": "Offer",
    name: f.name,
    description: f.description,
    priceCurrency: "INR",
    price: "750",
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: "500",
      maxPrice: "1200",
      priceCurrency: "INR",
      description: "Per person; varies by group size and day of week.",
    },
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
    "Hyderabad's #1 live game show experience and one of the best things to do in Hyderabad for groups — team building, birthdays and weekend entertainment.",
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
      a: "Game Show Challenge Rooms is one of the only live game show experiences in Hyderabad for everyone: friends, family, and coworkers. Groups split into teams, pick their own team names and colours, play three different game shows, and earn Challenge Points. Winners join the Champions Wall of Fame. The experience needs a minimum of 4 people and accommodates up to 15 guests per show.",
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
      a: "Yes, you will need to book 1-3 days in advance. Showtimes are subject to availability and city/location.",
    },
    {
      q: "Is there an age limit?",
      a: "We recommend ages 10 and up get the most out of the experience, but we're flexible — especially if there are younger players with older family members. Players 15 and under require adult accompaniment.",
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
