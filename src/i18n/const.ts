export const defaultLocale = 'en' as const satisfies Locale;
export const locales = ['en', 'ar'] as const;

export type Locale = (typeof locales)[number];
