import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/socket/:path*",
        destination: "https://websocket-seven-nu.vercel.app/:path*",
      },
    ];
  },
};

export default nextConfig;
