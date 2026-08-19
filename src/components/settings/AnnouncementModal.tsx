'use client';

import { useTranslations } from 'next-intl';

import { useAppSettingsQuery, useDisclosure } from '@/hooks';
import { useAnnouncementStore } from '@/stores';

import { Modal } from '../Modal';
import { HTMLRender } from '../HTMLRender';
import { MediaCarousel } from '../products';

export const AnnouncementModal = () => {
  const t = useTranslations();

  const shouldShowAnnouncement = useAnnouncementStore((state) => state.shouldShow);
  const markAsShown = useAnnouncementStore((state) => state.markAsShown);

  const appSettingsQuery = useAppSettingsQuery();
  const announcementDisclosure = useDisclosure({
    defaultIsOpen: shouldShowAnnouncement(appSettingsQuery.data?.announcement.intervalHours),
  });

  if (
    !appSettingsQuery.data ||
    appSettingsQuery.data.maintenanceMode.enabled ||
    !appSettingsQuery.data.announcement.enabled
  )
    return null;

  return (
    <Modal
      title={t('announcement_title')}
      description={t('announcement_description')}
      {...announcementDisclosure}
      onOpenChange={(isOpen) => {
        if (!isOpen) markAsShown();

        announcementDisclosure.onOpenChange(isOpen);
      }}
    >
      {appSettingsQuery.data.announcement.media.length > 0 && (
        <MediaCarousel media={appSettingsQuery.data.announcement.media} className="flex-none" />
      )}

      <AnnouncementHTML html={appSettingsQuery.data.announcement.message} />
    </Modal>
  );
};

const AnnouncementHTML = HTMLRender('AnnouncementMessage');
