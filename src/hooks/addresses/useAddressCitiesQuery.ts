import { useQuery } from '@tanstack/react-query';

import { City, gamersCore } from '@/api';

const queryKey = ['address', 'cities'] as const;

const queryFn = () => gamersCore.get<City[]>('/addresses/cities').then((res) => res.data);

export const useAddressCitiesQuery = () => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: Infinity,
  });
};

useAddressCitiesQuery.queryKey = queryKey;
useAddressCitiesQuery.queryFn = queryFn;
