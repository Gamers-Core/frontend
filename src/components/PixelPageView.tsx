'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { initMetaPixel, sha256, trackPageView } from '@/lib/meta-pixel';
import { useAuthStore } from '@/stores';

export const PixelPageView = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!isLoggedIn || !user) return initMetaPixel();

    const [firstName = '', ...rest] = user.name?.trim().split(/\s+/) ?? [];
    const lastName = rest.join(' ');

    Promise.all([
      user.email ? sha256(user.email.trim().toLowerCase()) : undefined,
      firstName ? sha256(firstName.toLowerCase()) : undefined,
      lastName ? sha256(lastName.toLowerCase()) : undefined,
      sha256(String(user.id)),
    ]).then(([em, fn, ln, external_id]) => initMetaPixel({ em, fn, ln, external_id }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    trackPageView();
  }, [pathname, searchParams]);

  return null;
};
