'use client';

import { Button } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'en' ? 'th' : 'en';
    await i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="light"
      onPress={toggleLanguage}
      className="text-sm"
    >
      {i18n.language === 'en' ? 'ไทย' : 'ENG'}
    </Button>
  );
}