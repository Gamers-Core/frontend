import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { useSearchParams } from '@/hooks';
import { Variant } from '@/api';
import { formatMedia } from '@/helpers';

import { Button } from '../Button';

interface VariantSwitcherProps {
  activeVariant: Variant;
  variants: Variant[];
}

export const VariantSwitcher = ({ activeVariant, variants }: VariantSwitcherProps) => {
  const t = useTranslations();

  const searchParams = useSearchParams();

  if (variants.length <= 1) return null;

  return (
    <>
      <div className="w-full h-px bg-muted-foreground" />

      <div className="flex flex-col gap-3">
        <div>
          <h3 className="inline text-2xl font-semibold text-sidebar-primary/90">{t('products_variants_title')}</h3>

          <span className="text-lg font-medium capitalize my-auto">{activeVariant.name}</span>
        </div>

        <div className="w-full flex gap-2 overflow-x-auto py-2">
          {variants.map((variant) => (
            <Button
              key={variant.externalId}
              variant={variant.externalId === activeVariant.externalId ? 'default' : 'ghost'}
              onClick={() => searchParams.set('variant', variant.externalId)}
              className="flex-1 h-auto relative flex flex-col min-w-32 max-w-32 p-2 overflow-y-hidden active:translate-0"
            >
              <div className="flex items-center justify-center bg-white dark:bg-border p-2 rounded-lg">
                <Image {...formatMedia(variant.media[0])} alt={variant.name ?? ''} className="rounded-lg" />
              </div>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};
