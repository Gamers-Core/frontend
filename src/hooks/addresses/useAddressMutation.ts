import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

import { Address, AddressSchema, BackendError, gamersCore, ValidationErrors } from '@/api';

import { useErrorHandler } from '../useErrorHandler';
import { useInvalidateAddressesQuery } from './useAddressesQuery';

export const useAddressMutation = (id?: number) => {
  const errorHandler = useErrorHandler();

  const invalidateAddressesQuery = useInvalidateAddressesQuery();

  const api = id ? gamersCore.patch : gamersCore.post;

  return useMutation<Address, BackendError<ValidationErrors<keyof AddressSchema>> | null, AddressSchema>({
    mutationFn: (data) =>
      api<Address, AxiosResponse<Address>, AddressSchema>('/addresses' + (id ? `/${id}` : ''), data)
        .then((res) => res.data)
        .catch((err: AxiosError<BackendError>) => {
          throw errorHandler(err);
        }),
    onSuccess: () => {
      invalidateAddressesQuery();
    },
  });
};
