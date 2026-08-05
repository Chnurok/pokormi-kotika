import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: { root: process.cwd() },
  basePath: isGitHubPages ? "/pokormi-kotika" : "",
  assetPrefix: isGitHubPages ? "/pokormi-kotika/" : "",
};

export default nextConfig;
