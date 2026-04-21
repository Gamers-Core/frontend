import { QueryFunctionContext, useQuery, useQueryClient } from '@tanstack/react-query';

import { BackendError, gamersCore, Order } from '@/api';
import { AxiosError } from 'axios';

const queryKey = (orderNumber: string) => ['order', orderNumber] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = ({ queryKey: [, orderNumber] }: QueryFunctionContext<QueryKey>) =>
  gamersCore.get<Order>(`/orders/${orderNumber}`).then((res) => res.data);

export const useOrderQuery = (orderNumber: string) =>
  useQuery<Order, AxiosError<BackendError>, Order, QueryKey>({
    queryKey: queryKey(orderNumber),
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!orderNumber,
    retry: false,
  });

export const useSetOrderQueryData = () => {
  const queryClient = useQueryClient();

  return (orderNumber: string, order: Order) => queryClient.setQueryData(queryKey(orderNumber), order);
};

useOrderQuery.queryKey = queryKey;
useOrderQuery.queryFn = queryFn;
