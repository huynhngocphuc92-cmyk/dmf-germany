import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // 1. Image Optimization: Allow Supabase Storage
  images: {
    formats: ["image/avif", "image/webp"],
    // Add quality options to fix warnings
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co", // Covers all Supabase projects
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Common placeholder source
      },
      {
        protocol: "https",
        hostname: "dmf.edu.vn", // Allow legacy images if any
      },
    ],
  },

  // 2. Server Actions: Increase body size limit for file uploads (5MB)
  // Configure experimental.serverActions.bodySizeLimit for Next.js 16
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },

  // 3. Security Headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload", // Force HTTPS for 2 years
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN", // Prevent Click-jacking (iframe embedding)
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff", // Prevent MIME-sniffing
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin", // Privacy protection
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()", // Block unused browser features
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://dmf.edu.vn https://www.google-analytics.com",
              "connect-src 'self' https://*.supabase.co https://api.telegram.org https://www.google-analytics.com",
              "frame-ancestors 'self'",
              "form-action 'self'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
