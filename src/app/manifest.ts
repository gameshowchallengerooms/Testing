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
        // The file actually 180×180 on disk. (apple-touch-icon.png is only
        // 64×64 despite its name, which is what triggered the manifest
        // "resource size is not correct" warning.)
        src: "/seo/favicon-32.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        // logo.png is 1497×966, not square — declare its true dimensions so the
        // manifest size assertion matches the resource.
        src: "/images/logo.png",
        sizes: "1497x966",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
