import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

import { BackendError, gamersCore, Product } from '@/api';

const queryKey = (ids: number[]) => ['products', 'many', ...ids] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = async ({ queryKey: [, , ...ids] }: QueryFunctionContext<QueryKey>) =>
  gamersCore
    .get<Product[], AxiosResponse<Product[]>, { ids: string }>('/products/many', { params: { ids: ids.join(',') } })
    .then((res) => res.data);

export const useManyProductsQuery = (ids: number[]) =>
  useQuery<Product[], AxiosError<BackendError>, Product[], QueryKey>({
    queryKey: queryKey(ids),
    queryFn,
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

useManyProductsQuery.queryKey = queryKey;
useManyProductsQuery.queryFn = queryFn;
