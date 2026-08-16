import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Standalone output is for the Docker image; on Vercel it breaks the
  // platform's own build tracing (missing .nft.json files), so skip it there.
  output: process.env.VERCEL ? undefined : "standalone",
  images: {
    qualities: [75],
  },
};

export default nextConfig;
