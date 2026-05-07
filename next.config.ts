import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Fallback placeholder so `neon()` won't throw during `next build`
    // when DATABASE_URL is not set. Real value must be provided at runtime.
    DATABASE_URL: process.env.DATABASE_URL ?? 'postgresql://placeholder:placeholder@localhost/placeholder',
  },
};

export default nextConfig;
