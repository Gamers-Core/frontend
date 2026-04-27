'use client';

import { useTranslations } from 'next-intl';

export const BrandsHeader = () => {
  const t = useTranslations();

  return (
    <header className="flex flex-col gap-2 rtl:gap-6 text-center">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">{t('brands_title')}</h2>

      <p className="font-medium text-muted-foreground text-lg md:text-xl lg:text-2xl">{t('brands_description')}</p>
    </header>
  );
};
