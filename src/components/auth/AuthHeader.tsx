'use client';

import { useTranslations } from 'next-intl';

import { I18nKey } from '@/i18n';

interface AuthHeaderProps {
  title: I18nKey;
  subtitle: I18nKey;
}

export const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
  const t = useTranslations();

  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-2xl md:text-4xl font-bold text-sidebar-primary">{t(title)}</h1>
      <p className="text-sm md:text-base text-muted-foreground">{t(subtitle)}</p>
    </section>
  );
};
