'use client';

import { useSearchParams as useSearchParamsNext } from 'next/navigation';

import { usePathname, useRouter } from '@/i18n';

import { useCallback } from 'react';

type ParamValue = string | number | boolean | null | undefined;
type ParamUpdates = Record<string, ParamValue>;
type NavigationMethod = 'replace' | 'push';

const applyParam = (params: URLSearchParams, key: string, value: ParamValue) => {
  if (value === undefined || value === null || value === '') return params.delete(key);

  params.set(key, String(value));
};

export const useSearchParams = () => {
  const searchParams = useSearchParamsNext();
  const pathname = usePathname();
  const router = useRouter();

  const get = useCallback((key: string) => searchParams.get(key), [searchParams]);

  const set = useCallback(
    (updates: ParamUpdates | string, value?: ParamValue, method: NavigationMethod = 'replace') => {
      const params = new URLSearchParams(searchParams.toString());

      if (typeof updates === 'string') applyParam(params, updates, value);
      else Object.entries(updates).forEach(([key, nextValue]) => applyParam(params, key, nextValue));

      const nextQuery = params.toString();
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
      const currentUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

      if (nextUrl === currentUrl) return;

      router[method](nextUrl, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { get, set };
};
