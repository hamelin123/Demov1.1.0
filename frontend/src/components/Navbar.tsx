'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar() {
  const t = useTranslations('navigation');

  return (
    <nav>
      <Link href="/services">{t('services')}</Link>
      <Link href="/tracking">{t('tracking')}</Link>
      <Link href="/contact">{t('contact')}</Link>
      <LanguageSwitcher />
    </nav>
  );
}