import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { TeamBuildingHype } from "@/components/TeamBuildingHype";
import { WhatsAppChat } from "@/components/WhatsAppChat";

const SITE_URL = "https://gameshowchallengerooms.com";
const PAGE_URL = `${SITE_URL}/team-building`;

const TITLE = "Hyderabad's Biggest Team Building Activity | Game Show Challenge Rooms";
const DESCRIPTION =
  "A live, hosted game show for your whole team in Gachibowli, Hyderabad. Two teams, buzzers, lights and an hour of laughing. Food arranged, GST invoice included, full refund if you don't love it. Book on WhatsApp.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "team building activities hyderabad",
    "corporate team building hyderabad",
    "team outing hyderabad",
    "office outing hyderabad",
    "corporate offsite hyderabad",
    "employee engagement activities hyderabad",
    "team building gachibowli",
    "team building hitec city",
  ],
  alternates: { canonical: "/team-building" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: PAGE_URL,
    siteName: "Game Show Challenge Rooms",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/seo/og-image.png",
        width: 1200,
        height: 630,
        alt: "Game Show Challenge Rooms — team building in Hyderabad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/seo/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${PAGE_URL}#service`,
      name: "Corporate Team Building in Hyderabad",
      serviceType: "Team building activity",
      description: DESCRIPTION,
      url: PAGE_URL,
      provider: { "@id": `${SITE_URL}/#business` },
      areaServed: [
        { "@type": "City", name: "Hyderabad" },
        "Gachibowli",
        "HITEC City",
        "Financial District",
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Team Building", item: PAGE_URL },
      ],
    },
  ],
};

export default function TeamBuildingPage() {
  return (
    <main className="relative min-h-screen bg-gs-surface-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <TeamBuildingHype />
      <Footer />
      <WhatsAppChat />
    </main>
  );
}
