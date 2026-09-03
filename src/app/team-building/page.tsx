import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { TeamBuildingSection } from "@/components/TeamBuildingSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Footer } from "@/components/Footer";
import { WhatsAppChat } from "@/components/WhatsAppChat";

const SITE_URL = "https://gameshowchallengerooms.com";
const PAGE_URL = `${SITE_URL}/team-building`;

const TITLE = "Team Building Activities in Hyderabad | Game Show Challenge Rooms";
const DESCRIPTION =
  "Looking for team building activities in Hyderabad? Game Show Challenge Rooms is a hosted, team-versus-team challenge experience in Gachibowli for corporate outings, offsites, startups, birthdays and festive parties. Book on WhatsApp.";

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
    "birthday party venue hyderabad",
    "diwali party games hyderabad",
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
        alt: "Game Show Challenge Rooms — team building activities in Hyderabad",
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
        "Madhapur",
        "Kondapur",
      ],
      audience: {
        "@type": "BusinessAudience",
        audienceType: "Corporate teams, startups, offsites, schools and colleges",
      },
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: PAGE_URL,
        servicePhone: "+91-90001-87731",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Team Building", item: PAGE_URL },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: TITLE,
      description: DESCRIPTION,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#business` },
      breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
      inLanguage: "en-IN",
    },
  ],
};

export default function TeamBuildingPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      {/* Header clearance — the navbar is fixed/overlaid on the home hero, so on
          this standalone page we add top padding to clear it. */}
      <div className="pt-24 md:pt-28">
        <TeamBuildingSection />
        <TestimonialsSection />
      </div>
      <Footer />
      <WhatsAppChat />
    </main>
  );
}
