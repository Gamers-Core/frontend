import { AxiosError, AxiosResponse } from 'axios';
import { QueryFunctionContext, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';

import { BackendError, BasicUser, FullUserDTO, gamersCore } from '@/api';

type MeQueryResult<T extends boolean> = T extends true ? FullUserDTO : BasicUser;

const queryKey = <T extends boolean>(isFull?: T) => ['me', !!isFull] as const;

type QueryKey = ReturnType<typeof queryKey>;

const queryFn = <T extends boolean = false>({ queryKey: [, isFull] }: QueryFunctionContext<QueryKey>) =>
  gamersCore
    .get<MeQueryResult<T>, AxiosResponse<MeQueryResult<T>>>(`/users/me/${isFull ? 'full' : ''}`)
    .then((res) => res.data);

export const useMeQuery = <T extends boolean = false>(
  isFull?: T,
  enabled: boolean = false,
): UseQueryResult<MeQueryResult<T>, AxiosError<BackendError>> => {
  return useQuery<MeQueryResult<T>, AxiosError<BackendError>, MeQueryResult<T>, QueryKey>({
    queryKey: queryKey(isFull),
    queryFn: queryFn<T>,
    enabled,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useInvalidateMeQuery = () => {
  const queryClient = useQueryClient();

  return (isFull: boolean = false) => queryClient.invalidateQueries({ queryKey: queryKey(isFull) });
};

useMeQuery.queryKey = queryKey;
useMeQuery.queryFn = queryFn;
