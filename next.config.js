/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      "react/jsx-runtime": "react/jsx-runtime.js",
      "react": "react",
    };
    return config;
  },
}

module.exports = nextConfig