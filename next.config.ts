import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  ...(isProd ? { output: "export" as const } : {}),
  basePath: "/bwc-defense",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
