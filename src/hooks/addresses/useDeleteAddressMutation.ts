import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { BackendError, gamersCore } from '@/api';

import { useInvalidateAddressesQuery } from './useAddressesQuery';
import { useErrorHandler } from '../useErrorHandler';

export const useDeleteAddressMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidateAddressesQuery = useInvalidateAddressesQuery();

  return useMutation<void, BackendError | null, number>({
    mutationFn: (id: number) =>
      gamersCore
        .delete(`/addresses/${id}`)
        .then(() => {})
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      invalidateAddressesQuery();
    },
  });
};
