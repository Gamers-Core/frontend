import axios, { AxiosHeaders } from 'axios';

import { isClient } from '@/helpers';

import { getCookiesLocale, setCookiesLocale } from './helpers';

export const gamersCore = axios.create({ baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, withCredentials: true });

gamersCore.interceptors.request.use(async (config) => {
  const headers = AxiosHeaders.from(config.headers);

  const locale = await getCookiesLocale();
  if (locale) headers.set('x-locale', locale);

  if (!isClient()) {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');
    headers.set('Cookie', cookieHeader);
  }

  config.headers = headers;
  return config;
});
gamersCore.interceptors.response.use((res) => {
  const newLocale = res.headers['x-locale'];

  if (newLocale) setCookiesLocale(newLocale);

  return res;
});
