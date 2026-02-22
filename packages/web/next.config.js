/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // 👇 ADD THIS
  transpilePackages: ['@salescout/tools'],

  experimental: {
    appDir: true,
  },

  images: {
    domains: ['images.unsplash.com'],
  },

  env: {
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  },
};

module.exports = nextConfig;