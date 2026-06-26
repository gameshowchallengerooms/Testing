import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Game Show Challenge Rooms Hyderabad",
    short_name: "Challenge Rooms",
    description:
      "Hyderabad's #1 live game show experience — host, lights, buzzers and your crew. The best thing to do in Hyderabad for groups, team building, birthdays and weekends.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#7C5CFC",
    lang: "en-IN",
    categories: ["entertainment", "events", "lifestyle"],
    icons: [
      {
        src: "/seo/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/images/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
