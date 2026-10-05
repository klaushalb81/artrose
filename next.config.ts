import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // The parent "Hjemmeside" folder also contains a package-lock.json, which
  // otherwise makes Next.js guess the wrong workspace root.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
