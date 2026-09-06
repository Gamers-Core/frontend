import { InfiniteData, QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { BackendError, gamersCore, SearchSchema, SearchResponse, Pagination, PaginationParams } from '@/api';

const queryKey = (params: ProductsInfiniteQueryParams = {}) =>
  ['products', ...Object.entries(params).sort(([a], [b]) => a.localeCompare(b))] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = ({ queryKey: [, ...paramsArr], pageParam }: QueryFunctionContext<QueryKey>) =>
  gamersCore
    .get<Pagination<SearchResponse>, AxiosResponse<Pagination<SearchResponse>>>('/products', {
      params: { limit: 11, ...Object.fromEntries(paramsArr), page: pageParam },
    })
    .then((res) => res.data);

type ProductsInfiniteQueryParams = SearchSchema & PaginationParams;

export const useProductsInfiniteQuery = (params: ProductsInfiniteQueryParams = {}) =>
  useInfiniteQuery<Pagination<SearchResponse>, BackendError, InfiniteData<Pagination<SearchResponse>>, QueryKey>({
    queryKey: queryKey(params),
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
    getNextPageParam: (lastPage) =>
      lastPage.meta.currentPage < lastPage.meta.totalPages ? lastPage.meta.currentPage + 1 : undefined,
    initialPageParam: 1,
  });

useProductsInfiniteQuery.queryKey = queryKey;
useProductsInfiniteQuery.queryFn = queryFn;
