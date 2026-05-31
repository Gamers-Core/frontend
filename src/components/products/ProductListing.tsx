'use client';

import { useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ShoppingBagAddIcon } from '@hugeicons/core-free-icons';
import { useTranslations } from 'next-intl';

import { useCartSyncMutation, useFormatCurrency, useIsInView, useProductQuery, useSearchParams } from '@/hooks';
import { useCartDrawerStore, useCartStore } from '@/stores';
import { Media } from '@/api';
import { useRouter } from '@/i18n';

import { MediaCarousel } from './MediaCarousel';
import { VariantSwitcher } from './VariantSwitcher';
import { ItemAmountButtons } from './ItemAmountButtons';
import { Button } from '../Button';
import { HTMLRender } from '../HTMLRender';
import { ProductPill } from './ProductPill';

export interface ProductListingProps {
  id: number;
}

export const ProductListing = ({ id }: ProductListingProps) => {
  const [amount, setAmount] = useState(1);
  const t = useTranslations();
  const searchParams = useSearchParams();

  const [variantExternalId, setVariantExternalId] = useState<string | null>(searchParams.get('variant'));

  const router = useRouter();
  const [ref, isInView] = useIsInView({ isInView: true });
  const formatCurrency = useFormatCurrency();
  const productQuery = useProductQuery(id);

  const cartSyncMutation = useCartSyncMutation();

  const setItem = useCartStore((state) => state.setItem);
  const setItems = useCartStore((state) => state.setItems);
  const openCartDrawer = useCartDrawerStore((state) => state.onOpen);

  useEffect(() => {
    searchParams.set('variant', variantExternalId);

    setAmount(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variantExternalId]);

  if (!productQuery.data) return <div>Product not found</div>;

  const selectedVariant = productQuery.data.variants.find((variant) => variant.externalId === variantExternalId);

  const activeVariant = selectedVariant ?? productQuery.data.variants[0];

  const media: Media[] = [activeVariant.image!, ...productQuery.data.media];
  const hasStock = activeVariant.stock > 0;

  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:gap-8 md:container">
      <MediaCarousel
        media={media}
        className="h-max md:px-4 md:min-w-md lg:min-w-lg xl:min-w-2xl 2xl:min-w-3xl lg:sticky lg:top-14"
      />

      <div className="flex flex-col gap-4 min-w-0 px-4 lg:px-0 flex-1">
        <div ref={ref} className="flex flex-col gap-4">
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

            <VariantSwitcher
              activeVariant={activeVariant}
              product={productQuery.data}
              onVariantExternalIdChange={setVariantExternalId}
            />
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
                    ...activeVariant,
                    productId: productQuery.data.id,
                    productName: productQuery.data.name,
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
              isLoading={cartSyncMutation.isPending}
              className="flex-1 h-auto rounded-lg text-base min-h-12"
              onClick={() => {
                cartSyncMutation.mutate([{ externalId: activeVariant.externalId, quantity: amount }], {
                  onSettled: () => {
                    setItems([
                      {
                        ...activeVariant,
                        productId: productQuery.data.id,
                        productName: productQuery.data.name,
                        quantity: amount,
                      },
                    ]);

                    router.push('/checkout');
                  },
                });
              }}
            >
              {t(hasStock ? 'buy_now' : 'out_of_stock')}
            </Button>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-6 bg-sidebar-border rounded-lg flex-1">
          <h3 className="text-2xl font-semibold text-sidebar-primary/90">{t('description')}</h3>

          <ProductDescription html={productQuery.data.description} />
        </div>
      </div>

      {activeVariant.stock > 0 && (
        <ProductPill
          isInView={isInView}
          item={{
            ...activeVariant,
            productId: productQuery.data.id,
            productName: productQuery.data.name,
            quantity: amount,
          }}
          onAddToCart={() => {
            setItem({
              ...activeVariant,
              productId: productQuery.data.id,
              productName: productQuery.data.name,
              quantity: amount,
            });

            openCartDrawer();
          }}
        />
      )}
    </section>
  );
};

const ProductDescription = HTMLRender('ProductDescription');
