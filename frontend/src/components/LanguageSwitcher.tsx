'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'th' : 'en';
    router.push(pathname, { locale: newLocale });
  };

  return (
    <button onClick={toggleLanguage}>
      {locale === 'en' ? 'ไทย' : 'EN'}
    </button>
  );
}