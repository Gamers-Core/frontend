'use client';

import { QueryFunctionContext, useQuery } from '@tanstack/react-query';

import { District, gamersCore } from '@/api';

const queryKey = (id: string | undefined) => ['address', 'cities', id] as const;

const queryFn = ({ queryKey: [, , id] }: QueryFunctionContext) =>
  gamersCore.get<District[]>(`/addresses/cities/${id}/districts`).then((res) => res.data);

export const useAddressDistrictsQuery = (id: string | undefined) =>
  useQuery({
    queryKey: queryKey(id),
    queryFn,
    enabled: !!id,
    staleTime: Infinity,
  });

useAddressDistrictsQuery.queryKey = queryKey;
useAddressDistrictsQuery.queryFn = queryFn;
