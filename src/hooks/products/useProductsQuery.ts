import { useQuery } from '@tanstack/react-query';

import { gamersCore, Product } from '@/api';

const queryKey = ['products'];

const queryFn = () => gamersCore.get<Product[]>('/products').then((res) => res.data);

export const useProductsQuery = () =>
  useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

useProductsQuery.queryKey = queryKey;
useProductsQuery.queryFn = queryFn;
