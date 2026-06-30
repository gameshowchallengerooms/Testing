import type { MetadataRoute } from "next";

const SITE_URL = "https://gameshowchallengerooms.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    // In-page anchor sections — surfaced so they can appear as sitelinks.
    ...[
      "about",
      "live",
      "show-rounds",
      "team-building",
      "tickets",
      "questions",
    ].map((hash) => ({
      url: `${SITE_URL}/#${hash}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
