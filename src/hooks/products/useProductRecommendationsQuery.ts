import { QueryFunctionContext, useQuery } from '@tanstack/react-query';

import { BackendError, gamersCore, Product } from '@/api';

const queryKey = (id: number) => ['recommended-products', id] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = ({ queryKey: [, id] }: QueryFunctionContext<QueryKey>) =>
  gamersCore.get<Product[]>(`/products/${id}/recommendations`).then((res) => res.data);

export const useProductRecommendationsQuery = (id: number) =>
  useQuery<Product[], BackendError, Product[], QueryKey>({
    queryKey: queryKey(id),
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes,
  });

useProductRecommendationsQuery.queryKey = queryKey;
useProductRecommendationsQuery.queryFn = queryFn;
