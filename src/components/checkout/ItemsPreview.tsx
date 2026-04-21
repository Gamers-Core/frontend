'use client';

import { useTranslations } from 'next-intl';

import { useCartQuery } from '@/hooks';

import { VariantPreviewCard } from '../VariantPreviewCard';

export const ItemsPreview = () => {
  const t = useTranslations();

  const cartQuery = useCartQuery();

  if (!cartQuery.data) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">{t('items_preview')}</h2>

      <div className="flex flex-col gap-4 max-h-125 overflow-y-auto">
        {cartQuery.data?.items.map((item) => (
          <VariantPreviewCard key={item.variant.externalId} {...item} />
        ))}
      </div>
    </section>
  );
};
