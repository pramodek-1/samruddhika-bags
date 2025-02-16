/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      "react/jsx-runtime": "react/jsx-runtime.js",
      "react": "react",
    };
    return config;
  },
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['utfs.io'],
  },
}

module.exports = nextConfig;