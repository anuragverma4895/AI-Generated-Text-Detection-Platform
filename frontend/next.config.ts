import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  turbopack: {
    root: process.cwd(),
  },
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist'],
};

export default nextConfig;
