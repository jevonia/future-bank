import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  turbopack: { root: process.cwd() },
  redirects() {
    // The privacy policy and terms share one page.
    return Promise.resolve([
      { source: "/terms", destination: "/privacy#terms", permanent: true },
    ]);
  },
};

export default nextConfig;
