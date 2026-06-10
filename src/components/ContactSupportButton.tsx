'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { WhatsappFreeIcons } from '@hugeicons/core-free-icons';
import { useTranslations } from 'next-intl';

import { useScroll } from '@/hooks';
import { cn } from '@/lib/utils';

import { Link } from './Link';
import { socialLinks } from './Footer';

const whatsappNumber = socialLinks
  .find(({ title }) => title === 'whatsapp')!
  .href.split('/')
  .pop();

export const ContactSupportButton = () => {
  const t = useTranslations();

  const { isScrolled } = useScroll({ threshold: 200 });

  return (
    <Link
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      className={cn(
        'flex justify-center items-center z-10 fixed bottom-5 inset-e-5 md:inset-e-10 md:bottom-10 rounded-full size-12 md:size-12 backdrop-blur-xl border border-sidebar-border transition-all duration-500 bg-green-400/20 hover:bg-green-400/30',
        { 'bottom-20 md:bottom-25 pointer-events-auto': isScrolled },
      )}
      aria-label={t('go_to_top')}
    >
      <HugeiconsIcon icon={WhatsappFreeIcons} className="text-foreground size-5" />
    </Link>
  );
};
