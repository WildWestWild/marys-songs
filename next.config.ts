import type { NextConfig } from "next";

// Custom domains and portable exports use the domain root.
// GitHub Actions supplies the Pages base path from repository settings.
const basePath = process.env.SITE_BASE_PATH ?? "";

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
