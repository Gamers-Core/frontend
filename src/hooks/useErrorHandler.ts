'use client';

import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { AxiosError } from 'axios';

import { BackendError, ValidationErrors } from '@/api';

export const useErrorHandler = () => {
  const t = useTranslations();

  return (error: AxiosError<BackendError>) => {
    if (!(error instanceof AxiosError)) return null;

    const data = error.response?.data;

    if (!data) {
      toast.error(t('error_generic'));
      return null;
    }

    if ('errors' in data) return data as BackendError<ValidationErrors>;

    if ('message' in data) {
      toast.error(data.message);
      return null;
    }

    toast.error(t('error_generic'));
    return null;
  };
};
