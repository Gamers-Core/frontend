import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { BackendError, Discount, gamersCore, PaymentMethod } from '@/api';

type DiscountQueryResult<C extends string | undefined> = C extends string ? Discount : Discount | null;

const queryKey = <C extends string | undefined>(code: C, paymentMethod?: PaymentMethod) =>
  code ? (['discount', paymentMethod, code] as const) : (['discount', paymentMethod] as const);

type QueryKey<C extends string | undefined> = ReturnType<typeof queryKey<C>>;

const queryFn = <C extends string | undefined>({
  queryKey: [, paymentMethod, code],
}: QueryFunctionContext<QueryKey<C>>) => {
  return gamersCore
    .get<DiscountQueryResult<C>, AxiosResponse<DiscountQueryResult<C>>, { code: C }>('/discounts', {
      params: { code, paymentMethod },
    })
    .then((res) => res.data)
    .catch((error) => {
      throw error.response?.data;
    });
};

export const useDiscountQuery = <C extends string | undefined = string | undefined>(
  code: C = undefined as C,
  paymentMethod?: PaymentMethod,
) =>
  useQuery<DiscountQueryResult<C>, BackendError, DiscountQueryResult<C>, QueryKey<C>>({
    enabled: !code || code?.length > 0,
    queryKey: queryKey<C>(code, paymentMethod),
    queryFn: queryFn<C>,
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    retry: false,
  });

useDiscountQuery.queryKey = queryKey;
useDiscountQuery.queryFn = queryFn;
