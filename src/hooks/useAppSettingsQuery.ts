import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { BackendError, gamersCore, AppSettings } from '@/api';

const queryKey = ['settings'] as const;

const queryFn = async () => gamersCore.get<AppSettings>('/settings').then((res) => res.data);

export const useAppSettingsQuery = () =>
  useQuery<AppSettings, AxiosError<BackendError>>({
    queryKey,
    queryFn,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnReconnect: true,
  });

useAppSettingsQuery.queryKey = queryKey;
useAppSettingsQuery.queryFn = queryFn;
