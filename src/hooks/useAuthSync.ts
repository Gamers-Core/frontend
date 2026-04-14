'use client';

import { useEffect } from 'react';

import { useAuthStore } from '@/stores';

import { useMeQuery } from './users';

export const useAuthSync = (isLoggedIn: boolean) => {
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const setUser = useAuthStore((state) => state.setUser);

  const meQuery = useMeQuery(false, isLoggedIn);

  useEffect(() => {
    setIsLoggedIn(isLoggedIn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  useEffect(() => {
    if (!meQuery.isSuccess) return setUser(null);

    setUser(meQuery.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meQuery.isSuccess, meQuery.data]);
};
