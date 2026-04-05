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
