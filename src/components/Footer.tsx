import { Messages, useTranslations } from 'next-intl';
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react';

import { policies } from '@/api';

import { Logo } from './Logo';
import { Link } from './Link';
import { Facebook, WhatsappFreeIcons } from '@hugeicons/core-free-icons';

interface SocialLink {
  title: keyof Messages;
  href: string;
  icon: IconSvgElement;
}

const socialLinks: SocialLink[] = [
  {
    title: 'facebook',
    href: 'https://www.facebook.com/people/Best-Controllers-in-Egypt/100092936143868/',
    icon: Facebook,
  },
  {
    title: 'whatsapp',
    href: 'https://wa.me/+201559241000',
    icon: WhatsappFreeIcons,
  },
];

export const Footer = () => {
  const t = useTranslations();

  return (
    <footer className="flex items-center min-h-20 border-t-2 border-sidebar-border w-full">
      <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-4 md:container flex-wrap px-4 py-8">
        <Logo className="flex-1" />

        <div className="flex-1 flex flex-col md:flex-row-reverse gap-4 items-center">
          <div className="flex-1 grid grid-cols-2 md:flex-0 md:flex gap-4 min-w-fit">
            {policies.map((policy) => (
              <Link
                key={policy}
                href={`/policies/${policy}`}
                className="block min-w-max transition-colors duration-300 hover:text-primary hover:underline text-lg md:text-base text-center md:text-start"
              >
                {t(`policy_${policy}`)}
              </Link>
            ))}
          </div>

          <div className="flex gap-6 md:gap-4">
            {socialLinks.map(({ icon, ...props }, index) => (
              <Link
                key={index}
                {...props}
                className="transition-colors duration-300 hover:text-primary hover:underline"
                target="_blank"
              >
                <HugeiconsIcon icon={icon} className="size-6" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
