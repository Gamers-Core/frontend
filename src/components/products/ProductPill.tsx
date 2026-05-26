'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { ShoppingBagAddIcon } from '@hugeicons/core-free-icons';

import { cn } from '@/lib/utils';
import { CartItem } from '@/stores';
import { useFormatCurrency, useFormatNumber, useScroll } from '@/hooks';

import { Image } from '../Image';
import { Button } from '../Button';

interface ProductPillProps {
  isInView: boolean;
  item: CartItem;
  onAddToCart: () => void;
}

export const ProductPill = ({ isInView, item, onAddToCart }: ProductPillProps) => {
  const formatCurrency = useFormatCurrency();
  const formatNumber = useFormatNumber();

  const { isScrolled: isAtEnd } = useScroll({ thresholdPercentage: 95 });

  return (
    <div className="flex justify-center items-center fixed bottom-2.5 inset-s-5 md:bottom-7.5 md:inset-s-10 z-10 pointer-events-none w-[calc(100%-6rem)] md:w-[calc(100%-9rem)] transition-all duration-500">
      <div
        className={cn(
          'pointer-events-none opacity-0 blur-lg transition-all duration-500',
          'w-120 lg:w-200 flex flex-col md:flex-row gap-2 items-center justify-between p-4 md:p-2 bg-card/70 backdrop-blur-[0px] rounded-xl border border-border',
          { 'blur-none opacity-100 backdrop-blur-lg pointer-events-auto': !isInView && !isAtEnd },
        )}
      >
        <div className="flex items-center gap-2 w-full md:w-fit">
          <div className="size-12 md:size-14 shrink-0 rounded-lg">
            <Image
              image={item.image}
              alt={item.productName}
              className="w-full aspect-square object-cover overflow-hidden rounded-lg"
            />
          </div>

          <div className="flex flex-col justify-center h-full gap-1">
            <h3 className="font-medium text-base line-clamp-1">{item.productName}</h3>

            <p className="text-sm text-muted-foreground line-clamp-1">{item.name}</p>
          </div>
        </div>

        <div className="w-full flex items-center justify-between md:w-fit md:justify-end gap-2">
          <div className="flex flex-col justify-center gap-1">
            <p className="text-sm text-foreground">{formatCurrency(item.price)}</p>

            {item.compareAt && (
              <p className="text-center text-xs text-muted-foreground line-through">{formatCurrency(item.compareAt)}</p>
            )}
          </div>

          <Button
            icon={<HugeiconsIcon icon={ShoppingBagAddIcon} className="size-5 rtl:rotate-y-180" />}
            variant="ghost"
            className="flex-1 w-fit max-w-fit min-w-0 h-12 rounded-lg text-base gap-2 bg-primary/30 hover:bg-primary/50 hover:dark:bg-primary/50"
            onClick={onAddToCart}
          >
            x {formatNumber(item.quantity)}
          </Button>
        </div>
      </div>
    </div>
  );
};
