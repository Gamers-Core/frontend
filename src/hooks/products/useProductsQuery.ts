import { QueryFunctionContext, useQuery } from '@tanstack/react-query';

import { BackendError, gamersCore, SearchProductOptions, SearchResponse } from '@/api';
import { AxiosResponse } from 'axios';

const queryKey = (searchOptions: SearchProductOptions = {}) => ['products', searchOptions] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = ({ queryKey: [, params] }: QueryFunctionContext<QueryKey>) =>
  gamersCore
    .get<SearchResponse[], AxiosResponse<SearchResponse[], SearchProductOptions>>('/products', { params })
    .then((res) => res.data);

export const useProductsQuery = (searchOptions: SearchProductOptions = {}) =>
  useQuery<SearchResponse[], BackendError, SearchResponse[], QueryKey>({
    queryKey: queryKey(searchOptions),
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

useProductsQuery.queryKey = queryKey;
useProductsQuery.queryFn = queryFn;
