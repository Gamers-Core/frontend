import { useTranslations } from 'next-intl';

export const ProfileHeader = () => {
  const t = useTranslations();

  return (
    <header className="flex flex-col gap-2 px-4">
      <h1 className="text-3xl font-bold">{t('profile_title')}</h1>

      <p className="text-gray-600">{t('profile_description')}</p>
    </header>
  );
};
