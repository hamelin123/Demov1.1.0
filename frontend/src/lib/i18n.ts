import {Pathnames} from 'next-intl/navigation';

export const locales = ['en', 'th'] as const;

export const pathnames = {
  '/': '/',
  '/services': '/services',
  '/contact': '/contact'
} satisfies Pathnames<typeof locales>;

export const localePrefix = 'always';

export type Locale = (typeof locales)[number];