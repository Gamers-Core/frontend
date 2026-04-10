'use client';

import { SlideImage } from 'yet-another-react-lightbox';
import { memo, useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ShoppingBagAddIcon } from '@hugeicons/core-free-icons';
import { useTranslations } from 'next-intl';

import { useFormatCurrency, useProductQuery, useSearchParams } from '@/hooks';
import { formatMedia } from '@/helpers';
import { useCartDrawerStore, useCartStore } from '@/stores';

import { MediaCarousel } from './MediaCarousel';
import { VariantSwitcher } from './VariantSwitcher';
import { ItemAmountButtons } from './ItemAmountButtons';
import { Button } from '../Button';
import { useRouter } from '@/i18n';

export interface ProductListingProps {
  id: number;
}

export const ProductListing = ({ id }: ProductListingProps) => {
  const [amount, setAmount] = useState(1);
  const t = useTranslations();

  const router = useRouter();
  const searchParams = useSearchParams();
  const productQuery = useProductQuery(id);
  const formatCurrency = useFormatCurrency();

  const setItem = useCartStore((state) => state.setItem);
  const setItems = useCartStore((state) => state.setItems);
  const openCartDrawer = useCartDrawerStore((state) => state.onOpen);

  const variantExternalId = searchParams.get('variant');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAmount(1);
  }, [variantExternalId]);

  if (!productQuery.data) return <div>Product not found</div>;

  const selectedVariant = productQuery.data.variants.find((variant) => variant.externalId === variantExternalId);

  const activeVariant = selectedVariant ?? productQuery.data.variants[0];

  const media: SlideImage[] = [...activeVariant.media, ...productQuery.data.media].map((mediaItem) => ({
    ...formatMedia(mediaItem),
    type: 'image',
  }));
  const hasStock = activeVariant.stock > 0;

  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:gap-8 md:container">
      <MediaCarousel
        media={media}
        className="h-max md:px-4 md:min-w-md lg:min-w-lg xl:min-w-2xl 2xl:min-w-3xl lg:sticky lg:top-14"
      />

      <div className="flex flex-col gap-4 min-w-0 px-4 lg:px-0">
        <div className="p-4 flex flex-col gap-4 bg-sidebar-border rounded-lg">
          <div className="flex flex-col gap-2">
            <div>
              <span className="text-lg text-sidebar-primary uppercase">{productQuery.data.brand.name}</span>

              <span> {t('slash')} </span>

              <span className="text-base text-muted-foreground/50 capitalize">{productQuery.data.category.name}</span>
            </div>

            <h1 className="text-2xl">{productQuery.data.title}</h1>
          </div>

          <div className="flex gap-2 items-center">
            <p className="text-xl text-sidebar-primary font-semibold">{formatCurrency(activeVariant.price)}</p>

            <p className="text-base md:text-base lg:text-lg xl:text-xl line-through text-sidebar-primary/70">
              {activeVariant.compareAt && formatCurrency(activeVariant.compareAt)}
            </p>
          </div>

          <VariantSwitcher activeVariant={activeVariant} product={productQuery.data} />
        </div>

        <div className="p-4 flex flex-col gap-2 bg-sidebar-border rounded-lg">
          <div className="flex flex-1 gap-2">
            <ItemAmountButtons variant={activeVariant} amount={amount} setAmount={setAmount} />

            <Button
              icon={<HugeiconsIcon icon={ShoppingBagAddIcon} className="size-5 rtl:rotate-y-180" />}
              variant="ghost"
              isDisabled={!hasStock}
              className="flex-1 h-auto rounded-lg text-base gap-2 bg-primary/30 hover:bg-primary/50 hover:dark:bg-primary/50"
              onClick={() => {
                setItem({
                  externalId: activeVariant.externalId,
                  productId: productQuery.data.id,
                  productName: productQuery.data.name,
                  name: activeVariant.name,
                  stock: activeVariant.stock,
                  price: activeVariant.price,
                  compareAt: activeVariant.compareAt,
                  imageURL: formatMedia(activeVariant.media[0] ?? productQuery.data.media[0]).src,
                  quantity: amount,
                });

                openCartDrawer();
              }}
            >
              {t(hasStock ? 'add_to_cart' : 'out_of_stock')}
            </Button>
          </div>

          <Button
            variant="default"
            isDisabled={!hasStock}
            className="flex-1 h-auto rounded-lg text-base min-h-12"
            onClick={() => {
              setItems([
                {
                  externalId: activeVariant.externalId,
                  productId: productQuery.data.id,
                  productName: productQuery.data.name,
                  name: activeVariant.name,
                  stock: activeVariant.stock,
                  price: activeVariant.price,
                  compareAt: activeVariant.compareAt,
                  imageURL: (activeVariant.media[0] ?? productQuery.data.media[0]).url,
                  quantity: amount,
                },
              ]);

              router.push('/checkout');
            }}
          >
            {t(hasStock ? 'buy_now' : 'out_of_stock')}
          </Button>
        </div>

        <div className="p-4 flex flex-col gap-6 bg-sidebar-border rounded-lg">
          <h3 className="text-2xl font-semibold text-sidebar-primary/90">{t('description')}</h3>

          <ProductDescription html={productQuery.data.description} />
        </div>
      </div>
    </section>
  );
};

interface ProductDescriptionProps {
  html: string;
}

const ProductDescription = memo(({ html }: ProductDescriptionProps) => (
  <div dangerouslySetInnerHTML={{ __html: html }} />
));

ProductDescription.displayName = 'ProductDescription';
