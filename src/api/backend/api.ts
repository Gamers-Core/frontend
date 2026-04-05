import axios from 'axios';

import { getCookiesLocale } from './helpers';

export const gamersCore = axios.create({ baseURL: process.env.NEXT_PUBLIC_BACKEND_URL });

gamersCore.interceptors.request.use(async (config) => {
  const locale = await getCookiesLocale();

  if (locale) config.headers['x-locale'] = locale;

  return config;
});
