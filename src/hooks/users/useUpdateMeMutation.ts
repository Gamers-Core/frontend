'use client';

import type { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, gamersCore, BasicUser, MeSchema, ValidationErrors } from '@/api';

import { useErrorHandler } from '../useErrorHandler';

export const useUpdateMeMutation = () => {
  const errorHandler = useErrorHandler();

  return useMutation<BasicUser, BackendError<ValidationErrors<keyof MeSchema>> | null, MeSchema>({
    mutationFn: (data) =>
      gamersCore
        .patch<BasicUser, AxiosResponse<BasicUser>, MeSchema>('/users/me', data)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
  });
};
