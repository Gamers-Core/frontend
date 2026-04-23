import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { BackendError, FAQ, gamersCore } from '@/api';

const queryKey = ['faqs'] as const;

const queryFn = async () => gamersCore.get<FAQ[]>('/faqs').then((res) => res.data);

export const useFAQsQuery = () =>
  useQuery<FAQ[], AxiosError<BackendError>>({
    queryKey,
    queryFn,
    retry: false,
    staleTime: Infinity,
  });

useFAQsQuery.queryKey = queryKey;
useFAQsQuery.queryFn = queryFn;
