import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

import { BackendError, gamersCore, SimpleProduct } from '@/api';

const normalizeIds = (ids: number[]) => Array.from(new Set(ids)).sort((a, b) => a - b);

const queryKey = (ids: number[]) => ['products', 'many', ...normalizeIds(ids)] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = async ({ queryKey: [, , ...ids] }: QueryFunctionContext<QueryKey>) =>
  gamersCore
    .get<
      SimpleProduct[],
      AxiosResponse<SimpleProduct[]>,
      { ids: string }
    >('/products/many', { params: { ids: ids.join(',') } })
    .then((res) => res.data);

export const useManyProductsQuery = (ids: number[]) =>
  useQuery<SimpleProduct[], AxiosError<BackendError>, SimpleProduct[], QueryKey>({
    queryKey: queryKey(ids),
    queryFn,
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

useManyProductsQuery.queryKey = queryKey;
useManyProductsQuery.queryFn = queryFn;
