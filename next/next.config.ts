import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? 'https://backend.runmates.net/api/:path*'
          : 'http://localhost:3000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
