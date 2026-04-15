'use client';

import { useEffect } from 'react';

import { useAuthStore } from '@/stores';

import { useMeQuery } from './users';

export const useAuthSync = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setUser = useAuthStore((state) => state.setUser);

  const meQuery = useMeQuery(false, isLoggedIn);

  useEffect(() => {
    if (!meQuery.isSuccess) return setUser(null);

    setUser(meQuery.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meQuery.isSuccess, meQuery.data]);
};
