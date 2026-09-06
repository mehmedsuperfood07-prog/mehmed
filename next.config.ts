import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage -- product/blog/gallery images uploaded via the
      // admin dashboard once that upload flow is built.
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      // Placeholder imagery until real product/facility photography exists
      // (PLAN.md 5.4). Remove once no longer needed.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
