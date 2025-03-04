// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Remove the i18n configuration as it's not compatible with app router
  // and we're using next-intl instead
};

module.exports = nextConfig;