import { Locale } from 'next-intl';

import { defaultLocale } from './i18n';

export const isClient = () => typeof window !== 'undefined';

export const formatNumber =
  (locale: Locale = defaultLocale) =>
  (num: number, options?: Intl.NumberFormatOptions) =>
    new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', options).format(num);
