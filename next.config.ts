import type { NextConfig } from "next";

const config: NextConfig = {
  turbopack: {},
  typescript: {
    // !! WARNING !!
    // Dangerously allow production builds to successfully complete 
    // even if your project has Type errors.
    ignoreBuildErrors: true,
  },
};

export default config;
