import { BackendError, gamersCore, Order } from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

const queryKey = ['orders'] as const;

const queryFn = () => gamersCore.get<Order[]>('/orders').then((res) => res.data);

export const useOrdersQuery = () =>
  useQuery<Order[], AxiosError<BackendError>>({
    queryKey,
    queryFn,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

export const useInvalidateOrdersQuery = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey });
};

useOrdersQuery.queryKey = queryKey;
useOrdersQuery.queryFn = queryFn;
