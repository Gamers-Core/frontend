'use client';

import { useLocale, useTranslations } from 'next-intl';
import { HugeiconsIcon } from '@hugeicons/react';
import { Trash2, X } from '@hugeicons/core-free-icons';
import Image from 'next/image';

import { useBreakpoint, useDebounce, useFormatCurrency, useFormatNumber } from '@/hooks';
import { CartItem, useCartDrawerStore, useCartStore } from '@/stores';

import { Button } from '../Button';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '../ui';
import { Link } from '@/i18n';
import { ItemAmountButtons } from '../products';
import { useEffect, useState } from 'react';

export const CartDrawer = () => {
  const locale = useLocale();
  const t = useTranslations();

  const formatCurrency = useFormatCurrency();
  const formatNumber = useFormatNumber();
  const cartDrawerStore = useCartDrawerStore((state) => state);
  const { isMobile } = useBreakpoint();

  const cartItems = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);
  const compareAtTotal = useCartStore((state) => state.compareAtTotal);
  const itemsCount = useCartStore((state) => state.count);

  const hasItems = cartItems.length > 0;
  const direction = isMobile ? 'bottom' : locale === 'ar' ? 'left' : 'right';

  return (
    <Drawer direction={direction} {...cartDrawerStore}>
      <DrawerContent
        className="bg-transparent before:backdrop-blur-lg before:bg-popover/60 h-full"
        aria-describedby="cart-drawer-description"
      >
        <DrawerHeader className="flex flex-row justify-between items-center">
          <div className="flex gap-2 items-center">
            <DrawerTitle className="text-3xl font-bold">{t('cart_title')}</DrawerTitle>

            {hasItems && (
              <p className="text-lg bg-muted min-w-6 h-6 px-2 flex justify-center items-center rounded-full">
                {formatNumber(itemsCount)}
              </p>
            )}
          </div>

          <DrawerClose asChild>
            <Button icon={<HugeiconsIcon icon={X} />} variant="outline" />
          </DrawerClose>
        </DrawerHeader>

        {hasItems ? (
          <>
            <div className="flex-1 px-4 flex flex-col gap-5 overflow-y-auto">
              {cartItems.map((item) => (
                <CartItemCard key={item.externalId} {...item} />
              ))}
            </div>

            <DrawerFooter className="flex flex-col gap-5">
              <div className="w-full h-px bg-border" />

              <div className="w-full flex items-start justify-between">
                <span className="text-lg font-bold">{t('cart_total')}</span>

                <div className="flex flex-col">
                  <span className="text-lg font-bold">{formatCurrency(total)}</span>

                  <span className="text-base font-semibold line-through text-popover-foreground/50">
                    {formatCurrency(compareAtTotal)}
                  </span>
                </div>
              </div>

              <p>{t('cart_checkout_note')}</p>

              <Button className="w-full h-12">{t('cart_checkout')}</Button>
            </DrawerFooter>
          </>
        ) : (
          <div className="flex-1 px-4 flex flex-col">
            <p className="text-popover-foreground flex-1 flex items-center justify-center text-xl">{t('cart_empty')}</p>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

const CartItemCard = (props: CartItem) => {
  const [amount, setAmount] = useState(props.quantity);

  const formatCurrency = useFormatCurrency();

  const closeCartDrawer = useCartDrawerStore((state) => state.onClose);
  const updateItem = useCartStore((state) => state.updateItem);
  const removeItem = useCartStore((state) => state.removeItem);

  const debouncedAmount = useDebounce(amount, 1000);

  useEffect(() => {
    if (debouncedAmount === props.quantity) return;

    updateItem(props.externalId, { quantity: debouncedAmount });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAmount]);

  return (
    <div className="flex flex-col justify-between md:justify-start">
      <Link
        href={`/products/${props.productId}?variant=${props.externalId}`}
        onClick={closeCartDrawer}
        className="flex gap-4 md:gap-4 p-4"
      >
        <Image
          src={props.imageURL}
          alt={props.productName}
          width={120}
          height={120}
          className="max-w-24 md:max-w-20 object-contain"
        />

        <div>
          <div>
            <h3 className="text-lg font-bold">{props.productName}</h3>

            <p className="text-muted-foreground">{props.name}</p>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-base font-bold">{formatCurrency(props.price)}</span>

            {props.compareAt && (
              <span className="text-sm font-semibold line-through text-popover-foreground/50">
                {formatCurrency(props.compareAt)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="flex justify-start items-center ps-30 md:ps-[32%] gap-4">
        <ItemAmountButtons variant={props} amount={amount} setAmount={setAmount} />

        <Button
          variant="ghost"
          icon={<HugeiconsIcon icon={Trash2} className="size-5" />}
          onClick={() => removeItem(props.externalId)}
          className="h-auto p-2"
        />
      </div>
    </div>
  );
};
