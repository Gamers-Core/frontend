'use client';

import { useTranslations } from 'next-intl';

import { useAppSettingsQuery, useDisclosure } from '@/hooks';

import { Modal } from '../Modal';
import { HTMLRender } from '../HTMLRender';
import { MediaCarousel } from '../products';

export const AnnouncementModal = () => {
  const t = useTranslations();

  const announcementDisclosure = useDisclosure({ defaultIsOpen: true });
  const appSettingsQuery = useAppSettingsQuery();

  if (
    !appSettingsQuery.data ||
    appSettingsQuery.data.maintenanceMode.enabled ||
    !appSettingsQuery.data.announcement.enabled
  )
    return null;

  return (
    <Modal {...announcementDisclosure} title={t('announcement_title')} description={t('announcement_description')}>
      {appSettingsQuery.data.announcement.media.length > 0 && (
        <MediaCarousel media={appSettingsQuery.data.announcement.media} />
      )}

      <AnnouncementHTML html={appSettingsQuery.data.announcement.message} />
    </Modal>
  );
};

const AnnouncementHTML = HTMLRender('AnnouncementMessage');
