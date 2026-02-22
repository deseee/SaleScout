/** @type {import('next').NextConfig} */
let withPWA;

try {
  withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
  });
} catch (error) {
  console.warn('next-pwa not installed, PWA features disabled');
  withPWA = (config) => config;
}

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

module.exports = withPWA(nextConfig);
