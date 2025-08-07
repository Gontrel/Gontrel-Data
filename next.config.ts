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
        hostname: "p16-sign-va.tiktokcdn.com",
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
    domains: ["p16-pu-sign-no.tiktokcdn-eu.com"],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
