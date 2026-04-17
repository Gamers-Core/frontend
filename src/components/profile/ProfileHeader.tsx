'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useLogoutMutation } from '@/hooks';

import { Button } from '../Button';

export const ProfileHeader = () => {
  const t = useTranslations();

  const logoutMutation = useLogoutMutation();

  const onLogout = () => {
    logoutMutation.mutate(void 0, {
      onSuccess: () => {
        toast.success(t('logout_success'));
      },
    });
  };

  return (
    <div className="flex items-center justify-between">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{t('profile_title')}</h1>

        <p className="text-gray-600">{t('profile_description')}</p>
      </header>

      <Button variant="destructive" onClick={onLogout} isLoading={logoutMutation.isPending} className="text-base">
        {t('logout')}
      </Button>
    </div>
  );
};
