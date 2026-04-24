import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { BackendError, Brand, gamersCore } from '@/api';

const queryKey = ['brands'] as const;

const queryFn = async () => gamersCore.get<Brand[]>('/brands').then((res) => res.data);

export const useBrandsQuery = () =>
  useQuery<Brand[], AxiosError<BackendError>>({
    queryKey,
    queryFn,
    retry: false,
    staleTime: Infinity,
  });

useBrandsQuery.queryKey = queryKey;
useBrandsQuery.queryFn = queryFn;
