import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

import { BackendError, Cart, gamersCore } from '@/api';

export const defaultCart: Cart = {
  items: [],
  count: 0,
  compareAt: null,
  total: 0,
};

const queryKey = ['cart'] as const;

const queryFn = async () => gamersCore.get<Cart, AxiosResponse<Cart>, void>('/cart').then((res) => res.data);

export const useCartQuery = (enabled: boolean = true) =>
  useQuery<Cart, AxiosError<BackendError>>({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled,
  });

export const useInvalidateCartQuery = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey });
};

export const useSetCartData = () => {
  const queryClient = useQueryClient();

  return (cart: Cart) => queryClient.setQueryData(queryKey, cart);
};

export const useClearCartData = () => {
  const queryClient = useQueryClient();

  return () => queryClient.setQueryData(queryKey, defaultCart);
};

useCartQuery.queryKey = queryKey;
useCartQuery.queryFn = queryFn;
