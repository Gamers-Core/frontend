import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { BackendError, Category, gamersCore } from '@/api';

const queryKey = ['categories'] as const;

const queryFn = async () => gamersCore.get<Category[]>('/categories').then((res) => res.data);

export const useCategoriesQuery = () =>
  useQuery<Category[], AxiosError<BackendError>>({
    queryKey,
    queryFn,
    retry: false,
    staleTime: Infinity,
  });

useCategoriesQuery.queryKey = queryKey;
useCategoriesQuery.queryFn = queryFn;
