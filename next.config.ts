import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    // Enable Next.js Image Optimization for better performance
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Enable React strict mode for better debugging
  reactStrictMode: true,
  // Enable compression
  compress: true,
  // Production source maps (disable for smaller builds)
  productionBrowserSourceMaps: false,
  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['recharts', 'lucide-react', '@radix-ui/react-avatar', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
  },
};

export default nextConfig;
