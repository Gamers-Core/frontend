import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { BackendError, gamersCore, Policies } from '@/api';

const queryKey = ['policies'] as const;

const queryFn = async () => gamersCore.get<Policies>('/policies').then((res) => res.data);

export const usePoliciesQuery = () =>
  useQuery<Policies, AxiosError<BackendError>>({
    queryKey,
    queryFn,
    retry: false,
    staleTime: Infinity,
  });

usePoliciesQuery.queryKey = queryKey;
usePoliciesQuery.queryFn = queryFn;
