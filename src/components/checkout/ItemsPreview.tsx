'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { useCartQuery, useFormatCurrency, useFormatNumber } from '@/hooks';
import { CartItem } from '@/api';

export const ItemsPreview = () => {
  const t = useTranslations();

  const cartQuery = useCartQuery();

  if (!cartQuery.data) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">{t('items_preview')}</h2>

      <div className="flex flex-col gap-4 max-h-125 overflow-y-auto">
        {cartQuery.data?.items.map((item) => (
          <CartItemCard key={item.variant.externalId} {...item} />
        ))}
      </div>
    </section>
  );
};

const CartItemCard = (props: CartItem) => {
  const formatCurrency = useFormatCurrency();
  const formatNumber = useFormatNumber();

  return (
    <div className="flex gap-4 md:gap-4 p-4">
      <div className="relative">
        <Image
          src={props.variant.imageURL}
          alt={props.variant.product.name}
          width={120}
          height={120}
          className="max-w-20 object-contain"
        />

        <span className="absolute -top-2 -inset-e-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
          {formatNumber(props.quantity)}
        </span>
      </div>

      <div className="flex flex-1 gap-4 items-start flex-col xl:flex-row xl:justify-between">
        <div>
          <h3 className="text-lg font-bold">{props.variant.product.name}</h3>

          <p className="text-muted-foreground">{props.variant.name}</p>
        </div>

        <div className="flex gap-1 items-center">
          <span className="text-lg font-bold">{formatCurrency(props.variant.price)}</span>

          {props.variant.compareAt && (
            <span className="text-base font-semibold line-through text-popover-foreground/50">
              {formatCurrency(props.variant.compareAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
