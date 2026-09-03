import type { MetadataRoute } from "next";

const SITE_URL = "https://gameshowchallengerooms.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/team-building`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
