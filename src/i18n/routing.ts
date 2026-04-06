import { defineRouting } from 'next-intl/routing';

import { defaultLocale, locales } from './const';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});
