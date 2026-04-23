'use client';

import { useTranslations } from 'next-intl';

export const FAQsHeader = () => {
  const t = useTranslations();

  return (
    <header className="flex flex-col gap-2 rtl:gap-6 text-center">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">{t('faqs_title')}</h2>

      <p className="font-medium text-muted-foreground text-lg md:text-xl lg:text-2xl">{t('faqs_description')}</p>
    </header>
  );
};
