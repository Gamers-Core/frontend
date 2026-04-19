'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, CheckoutSchema, gamersCore, Order, ValidationErrors } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateOrdersQuery, useSetOrderQueryData } from '../orders';
import { useInvalidateCartQuery } from '../cart';

interface CheckoutMutationData extends Omit<CheckoutSchema, 'addressId'> {
  addressId: number;
}

export const useCheckoutMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidateOrdersQuery = useInvalidateOrdersQuery();
  const invalidateCartQuery = useInvalidateCartQuery();
  const setOrderQueryData = useSetOrderQueryData();

  return useMutation<Order, BackendError<ValidationErrors<keyof CheckoutSchema>> | null, CheckoutSchema>({
    mutationFn: (data) =>
      gamersCore
        .post<Order, AxiosResponse<Order>, CheckoutMutationData>('/orders/checkout', {
          ...data,
          addressId: Number(data.addressId),
        })
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: async (res) => {
      await invalidateOrdersQuery();
      await invalidateCartQuery();
      setOrderQueryData(res.orderNumber, res);
    },
  });
};
