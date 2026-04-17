import { Address, BackendError, gamersCore } from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

const queryKey = ['addresses'] as const;

const queryFn = () => gamersCore.get<Address[]>('/addresses').then((res) => res.data);

export const useAddressesQuery = () =>
  useQuery<Address[], AxiosError<BackendError>>({
    queryKey,
    queryFn,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

export const useInvalidateAddressesQuery = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey });
};

useAddressesQuery.queryKey = queryKey;
useAddressesQuery.queryFn = queryFn;
