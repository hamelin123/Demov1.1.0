const { locales } = require('./next-intl.config.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': './src/components',
      '@styles': './src/styles',
    };
    return config;
  },
  i18n: {
    locales,
    defaultLocale: 'en'
  }
};

module.exports = nextConfig;