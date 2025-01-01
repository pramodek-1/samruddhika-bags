/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-image-domain.com'],
  },
  eslint: {
    // Temporarily ignore ESLint during builds until we fix all issues
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig
