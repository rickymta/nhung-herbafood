import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pages read live data from SQLite on every request, so we use the classic
  // (non Cache Components) model and mark data routes dynamic explicitly.
  cacheComponents: false,
  partialPrefetching: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "tn-stroke-guard.vercel.app" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
