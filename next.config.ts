import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
// Cloudflare Pages 빌드는 CF_PAGES=1 을 자동 설정 → 루트 도메인(x.pages.dev)으로 서빙.
// GitHub Pages 는 /bwc-defense 하위 경로로 서빙.
const isCloudflare = process.env.CF_PAGES === "1";
const basePath = isCloudflare ? "" : "/bwc-defense";

const nextConfig: NextConfig = {
  ...(isProd ? { output: "export" as const } : {}),
  ...(basePath ? { basePath } : {}),
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
