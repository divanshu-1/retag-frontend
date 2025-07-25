
/**
 * Next.js Configuration for ReTag Marketplace
 *
 * This configuration file customizes Next.js behavior for the ReTag application.
 * It includes settings for:
 * - Image optimization and remote patterns
 * - API route rewrites for backend communication
 * - Build-time error handling
 * - TypeScript and ESLint configuration
 *
 * @author ReTag Team
 */

import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Development settings - consider removing for production
  typescript: {
    ignoreBuildErrors: true,  // Skip TypeScript errors during build (not recommended for production)
  },
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint errors during build (not recommended for production)
  },
  // Image optimization configuration
  images: {
    remotePatterns: [
      // Placeholder image service
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.univ-smb.fr',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imgmediagumlet.lbb.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'petitefemmelabel.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.asos-media.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '5thave-img-cdn.beyondstyle.us',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.myntassets.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ebayimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.hm.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lp2.hm.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.zara.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.nbastore.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.ajio.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'srstore.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.tatacliq.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'u-mercari-images.mercdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 't4.ftcdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.insmind.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8080',
        pathname: '/uploads/**',
      },
    ],
  },
  /**
   * API Route Rewrites
   *
   * Proxies API requests to the backend server. This allows the frontend
   * to make requests to /api/* which get forwarded to the backend server.
   *
   * Development: Routes to localhost:8080 (local backend)
   * Production: Routes to deployed backend URL (update with actual URL)
   */
  async rewrites() {
    return [
      {
        source: '/api/:path*',                    // Frontend API path pattern
        destination: process.env.NODE_ENV === 'production'
          ? 'https://your-backend-url.railway.app/api/:path*'  // TODO: Replace with actual production backend URL
          : 'http://localhost:8080/api/:path*',   // Local development backend
      },
    ];
  },
};

export default nextConfig;
