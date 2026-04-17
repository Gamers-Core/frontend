import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

import { Address, BackendError, gamersCore } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateAddressesQuery } from './useAddressesQuery';

export const useDefaultAddressMutation = () => {
  const errorHandler = useErrorHandler();

  const invalidateAddressesQuery = useInvalidateAddressesQuery();

  return useMutation<Address, BackendError | null, number>({
    mutationFn: (id: number) =>
      gamersCore
        .patch<Address, AxiosResponse<Address>>(`/addresses/${id}/default`)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      invalidateAddressesQuery();
    },
  });
};
