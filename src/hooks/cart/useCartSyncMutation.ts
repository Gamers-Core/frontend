'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, gamersCore, Cart, CreateItem, ValidationErrors } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useSetCartData } from './useCartQuery';

export const useCartSyncMutation = () => {
  const errorHandler = useErrorHandler();

  const setCartData = useSetCartData();

  return useMutation<Cart, BackendError<ValidationErrors> | null, CreateItem[]>({
    mutationFn: (data) =>
      gamersCore
        .post<Cart, AxiosResponse<Cart>, CreateItem[]>('/cart', data)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: (cart) => {
      setCartData(cart);
    },
  });
};
