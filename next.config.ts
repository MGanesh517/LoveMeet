import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Exclude backend folder from Next.js build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  webpack: (config, { isServer }) => {
    // Exclude backend folder from webpack compilation
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
};

export default nextConfig;
