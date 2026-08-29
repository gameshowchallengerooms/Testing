import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // Pin the workspace root: parent folders and ~ carry their own lockfiles,
  // which makes Turbopack resolve `next` from the wrong node_modules.
  turbopack: {
    root: __dirname,
  },
  images: {
    qualities: [75],
  },
};

export default nextConfig;
