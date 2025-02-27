/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // ลบหรือปรับปรุง i18n configuration ให้เข้ากับ Next.js 14
  // i18n: {
  //   locales: ['en', 'th'],
  //   defaultLocale: 'en',
  // },
};

module.exports = nextConfig;