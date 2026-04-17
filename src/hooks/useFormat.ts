'use client';

import { Locale, useLocale } from 'next-intl';
import { format, type FormatDateOptions } from 'date-fns';
import { arEG, enUS } from 'date-fns/locale';

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

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export const formatArabicDigits = (str: string) => str.replace(/\d/g, (d) => ARABIC_DIGITS[+d]);

const useDateLocale = () => {
  const locale = useLocale();

  return locale === 'ar' ? arEG : enUS;
};

export const useFormatDate = () => {
  const locale = useDateLocale();

  return (date: Date | number | string, formatStr: string, options?: FormatDateOptions) => {
    const formattedDate = format(date, formatStr, { locale, ...options });

    return locale.code === 'ar-SA' ? formatArabicDigits(formattedDate) : formattedDate;
  };
};
