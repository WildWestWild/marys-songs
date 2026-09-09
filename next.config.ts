import type { NextConfig } from "next";

// Empty for portable hosting; keep the existing GitHub Pages path by default.
const basePath = process.env.SITE_BASE_PATH ?? "/marys-songs";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
