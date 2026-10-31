import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  experimental: {
    // Don't write Turbopack's build cache: it records env values (secrets) and
    // Netlify doesn't reuse it between builds anyway, so it only trips the
    // secret scanner.
    turbopackFileSystemCacheForBuild: false,
  },
  // The parent "Hjemmeside" folder also contains a package-lock.json, which
  // otherwise makes Next.js guess the wrong workspace root.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;