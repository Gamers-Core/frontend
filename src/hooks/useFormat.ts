'use client';

import { Locale, useLocale } from 'next-intl';

import { formatNumber } from '@/helpers';

export const useFormatNumber = (locale?: Locale) => {
  const currentLocale = useLocale();

  return formatNumber(locale ?? currentLocale);
};

export const useFormatCurrency = (locale?: Locale) => {
  const format = useFormatNumber(locale);

  return (num: number, currency = 'EGP') =>
    format(num, { style: 'currency', currency, trailingZeroDisplay: 'stripIfInteger' });
};
