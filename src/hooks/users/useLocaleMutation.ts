'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { Locale } from 'next-intl';

import { BackendError, gamersCore, BasicUser, setCookiesLocale } from '@/api';
import { useAuthStore } from '@/stores';

import { useErrorHandler } from '../useErrorHandler';

export const useLocaleMutation = () => {
  const errorHandler = useErrorHandler();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<BasicUser, BackendError | null, Locale>({
    mutationFn: (locale) =>
      gamersCore
        .patch<BasicUser, AxiosResponse<BasicUser>, never>('/users/me/locale/' + locale)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: (data) => {
      setCookiesLocale(data.locale);
      setUser(data);
    },
  });
};
