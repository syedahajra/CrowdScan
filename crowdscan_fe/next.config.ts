import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb', // Increase limit to 10MB (adjust as needed)
    },
  },
};

export default nextConfig;
