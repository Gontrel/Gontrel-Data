import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.tiktokcdn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.tiktokcdn-eu.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.tiktokcdn-us.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "gontrel-assets.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
