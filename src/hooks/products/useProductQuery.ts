import { QueryFunctionContext, useQuery } from '@tanstack/react-query';

import { gamersCore, Product } from '@/api';

const queryKey = (id: number) => ['product', id] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = ({ queryKey: [, id] }: QueryFunctionContext<QueryKey>) =>
  gamersCore.get<Product>(`/products/${id}`).then((res) => res.data);

export const useProductQuery = (id: number) =>
  useQuery({
    queryKey: queryKey(id),
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes,
  });

useProductQuery.queryKey = queryKey;
useProductQuery.queryFn = queryFn;
