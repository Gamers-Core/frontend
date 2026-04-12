import axios from 'axios';

import { isClient } from '@/helpers';

import { getCookiesLocale } from './helpers';

export const gamersCore = axios.create({ baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, withCredentials: true });

gamersCore.interceptors.request.use(async (config) => {
  const locale = await getCookiesLocale();

  if (locale) config.headers['x-locale'] = locale;

  if (!isClient()) {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();

    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');

    config.headers.set('Cookie', cookieHeader);
  }

  return config;
});
