'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import { useAuthStore } from '@/stores';

import { useMeQuery } from './users';
import { useLogoutMutation } from './auth';

export const useAuthSync = () => {
  const t = useTranslations();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setUser = useAuthStore((state) => state.setUser);

  const meQuery = useMeQuery(false, isLoggedIn);
  const logoutMutation = useLogoutMutation();

  useEffect(() => {
    if (meQuery.error?.response?.data.status === 401)
      logoutMutation.mutate(void 0, {
        onSuccess: () => {
          toast.error(t('error_unauthorized'));
        },
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meQuery.error]);

  useEffect(() => {
    if (!meQuery.isSuccess) return setUser(null);

    setUser(meQuery.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meQuery.isSuccess, meQuery.data]);
};
