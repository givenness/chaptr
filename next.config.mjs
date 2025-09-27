/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    domains: ['via.placeholder.com'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'ngrok-skip-browser-warning',
            value: 'true',
          },
        ],
      },
    ]
  },
  // Ensure proper build optimization
  swcMinify: true,
  // Enable compression
  compress: true,
  // Optimize for World App mini-app
  experimental: {
    optimizePackageImports: ['@worldcoin/minikit-js'],
  },
}

export default nextConfig
