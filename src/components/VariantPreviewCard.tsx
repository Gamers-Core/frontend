'use client';

import Image from 'next/image';

import { useFormatCurrency, useFormatNumber } from '@/hooks';

export interface VariantPreviewCardProps {
  variant: {
    name: string;
    price: number;
    compareAt: number | null;
    imageURL: string;
    product: { name: string };
  };
  quantity: number;
}

export const VariantPreviewCard = (props: VariantPreviewCardProps) => {
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
