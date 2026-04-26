import { QueryFunctionContext, useQuery } from '@tanstack/react-query';

import { BackendError, gamersCore, SearchSchema, SearchResponse } from '@/api';
import { AxiosResponse } from 'axios';

const queryKey = (searchOptions: SearchSchema = {}) =>
  ['products', ...Object.entries(searchOptions).sort(([a], [b]) => a.localeCompare(b))] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = ({ queryKey: [, ...paramsArr] }: QueryFunctionContext<QueryKey>) =>
  gamersCore
    .get<SearchResponse[], AxiosResponse<SearchResponse[]>>('/products', { params: Object.fromEntries(paramsArr) })
    .then((res) => res.data);

export const useProductsQuery = (searchOptions: SearchSchema = {}) =>
  useQuery<SearchResponse[], BackendError, SearchResponse[], QueryKey>({
    queryKey: queryKey(searchOptions),
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

useProductsQuery.queryKey = queryKey;
useProductsQuery.queryFn = queryFn;
