import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    // 100 is used for the crisp logo in the scroll-zoom intro; 75 is the default.
    qualities: [75, 100],
  },
};

export default nextConfig;
