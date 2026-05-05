import { Locale } from 'next-intl';

import { defaultLocale } from './i18n';

export const getSearchParams = () => {
  if (!isClient()) return new URLSearchParams();

  return new URLSearchParams(window.location.search);
};

export const isClient = () => typeof window !== 'undefined';

export const formatNumber =
  (locale: Locale = defaultLocale) =>
  (num: number, options?: Intl.NumberFormatOptions) =>
    new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', options).format(num);
