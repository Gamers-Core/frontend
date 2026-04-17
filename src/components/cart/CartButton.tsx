import { HugeiconsIcon } from '@hugeicons/react';
import { ShoppingBag } from '@hugeicons/core-free-icons';
import { useTranslations } from 'next-intl';

import { useCartDrawerStore, useCartStore } from '@/stores';
import { useFormatNumber } from '@/hooks';

import { Button, ButtonProps } from '../Button';

interface CartButtonProps extends ButtonProps {
  iconOnly?: boolean;
}

export const CartButton = ({ iconOnly = false, className, ...props }: CartButtonProps) => {
  const t = useTranslations();

  const openCartDrawer = useCartDrawerStore((state) => state.onOpen);
  const itemsCount = useCartStore((state) => state.count);

  const formatNumber = useFormatNumber();

  return (
    <Button
      variant="ghost"
      icon={
        <div className="relative">
          <HugeiconsIcon icon={ShoppingBag} className="rtl:rotate-y-180 size-full transition-colors duration-300" />

          {itemsCount > 0 && (
            <p className="absolute -top-2 -inset-e-2 bg-primary text-primary-foreground text-[0.6125rem] rounded-full h-4 min-w-4 px-1.5 flex items-center justify-center">
              {formatNumber(itemsCount)}
            </p>
          )}
        </div>
      }
      aria-label={t('cart_title')}
      {...props}
      onClick={(e) => {
        props.onClick?.(e);

        openCartDrawer();
      }}
      className={className}
    >
      {!iconOnly && t('cart_title')}
    </Button>
  );
};
