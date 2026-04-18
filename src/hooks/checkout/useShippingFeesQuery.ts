import { QueryFunctionContext, useQuery, useQueryClient } from '@tanstack/react-query';

import { BackendError, gamersCore, ShippingFees } from '@/api';

interface ShippingFeesOptions {
  cod: number | undefined;
  dropOffCity: string | undefined;
}

const queryKey = (options: ShippingFeesOptions) => ['shipping-fees', options] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = ({ queryKey: [, params] }: QueryFunctionContext<QueryKey>) =>
  gamersCore.get<ShippingFees>('/addresses/shipping-fees', { params }).then((res) => res.data);

export const useShippingFeesQuery = (options: ShippingFeesOptions) =>
  useQuery<ShippingFees, BackendError, ShippingFees, QueryKey>({
    queryKey: queryKey(options),
    queryFn,
    enabled: !!options.cod !== undefined && !!options.dropOffCity,
    staleTime: 1000 * 60, // 1 minute,
  });

export const useInvalidateShippingFees = () => {
  const queryClient = useQueryClient();

  return (options: ShippingFeesOptions) => queryClient.invalidateQueries({ queryKey: queryKey(options) });
};

useShippingFeesQuery.queryKey = queryKey;
useShippingFeesQuery.queryFn = queryFn;
