import { useQuery } from '@tanstack/react-query';

import { BackendError, FeaturedVariant, gamersCore } from '@/api';

const queryKey = ['featured'];

const queryFn = () => gamersCore.get<FeaturedVariant[]>('/featured-variants').then((res) => res.data);

export const useFeaturedQuery = () =>
  useQuery<FeaturedVariant[], BackendError>({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

useFeaturedQuery.queryKey = queryKey;
useFeaturedQuery.queryFn = queryFn;
