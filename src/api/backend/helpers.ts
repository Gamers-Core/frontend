import cookies from 'js-cookie';

import { isClient } from '@/helpers';

export const getCookiesLocale = async () => {
  if (!isClient()) {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();

    return cookieStore.get('NEXT_LOCALE')?.value;
  }

  return cookies.get('NEXT_LOCALE');
};

export const setCookiesLocale = (locale: string) => {
  setCookie('x-locale', locale);
  setCookie('NEXT_LOCALE', locale);
};

export const setCookie = (name: string, value: string, options?: Cookies.CookieAttributes) => {
  if (!isClient()) return;

  cookies.set(name, value, options);
};
