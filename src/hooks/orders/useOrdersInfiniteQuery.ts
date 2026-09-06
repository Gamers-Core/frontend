import { InfiniteData, QueryFunctionContext, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

import { BackendError, gamersCore, Order, Pagination, PaginationParams } from '@/api';

const queryKey = (paginationParams: PaginationParams = {}) =>
  ['orders', ...Object.entries(paginationParams).sort(([a], [b]) => a.localeCompare(b))] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = ({ queryKey: [, ...paramsArr], pageParam }: QueryFunctionContext<QueryKey>) =>
  gamersCore
    .get<Pagination<Order>, AxiosResponse<Pagination<Order>>>('/orders', {
      params: { limit: 8, ...Object.fromEntries(paramsArr), page: pageParam },
    })
    .then((res) => res.data);

export const useOrdersInfiniteQuery = (paginationParams: PaginationParams = {}) =>
  useInfiniteQuery<Pagination<Order>, AxiosError<BackendError>, InfiniteData<Pagination<Order>>, QueryKey>({
    queryKey: queryKey(paginationParams),
    queryFn,
    retry: false,
    staleTime: 1000 * 60 * 5,
    getNextPageParam: (lastPage) =>
      lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : undefined,
    initialPageParam: 1,
  });

export const useInvalidateOrdersQuery = (paginationParams: PaginationParams = {}) => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: queryKey(paginationParams) });
};

useOrdersInfiniteQuery.queryKey = queryKey;
useOrdersInfiniteQuery.queryFn = queryFn;
