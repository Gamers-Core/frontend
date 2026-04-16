'use client';

import type { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, gamersCore } from '@/api';
import { useAuthStore, useCartStore } from '@/stores';
import { defaultLocale, useRouter } from '@/i18n';

import { useErrorHandler } from '../useErrorHandler';
import { useClearMeQueryData } from '../users';
import { useClearCartData } from '../cart';

interface LogoutResponse {
  isLoggedIn: false;
}

export const useLogoutMutation = () => {
  const router = useRouter();

  const errorHandler = useErrorHandler();

  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearCart = useCartStore((state) => state.clearCart);

  const clearMeQueryData = useClearMeQueryData();
  const clearCartData = useClearCartData();

  return useMutation<LogoutResponse, BackendError | null>({
    mutationFn: () =>
      gamersCore
        .post<LogoutResponse>('/auth/logout')
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      clearAuth();
      clearMeQueryData();

      clearCartData();
      clearCart();

      router.push('/signin', { locale: defaultLocale });
    },
  });
};
