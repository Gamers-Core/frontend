'use client';

import { useTranslations } from 'next-intl';

import { useFormatCurrency, useOrderQuery } from '@/hooks';

interface OrderShippingFeesProps {
  orderNumber: string;
}

export const OrderShippingFees = ({ orderNumber }: OrderShippingFeesProps) => {
  const t = useTranslations();

  const formatCurrency = useFormatCurrency();

  const orderQuery = useOrderQuery(orderNumber);

  if (!orderQuery.data) return null;

  const order = orderQuery.data;

  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-xl font-bold">{t('shipping_fees')}</h3>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <p className="font-semibold text-sidebar-primary/70">{t('subtotal')}:</p>

          <p>{formatCurrency(order.subtotal)}</p>
        </div>

        <div className="flex gap-2 items-center">
          <p className="font-semibold text-sidebar-primary/70">{t('shipping_fees')}:</p>

          <p>{formatCurrency(order.shippingFee)}</p>
        </div>

        <div className="flex gap-2 items-center">
          <p className="font-semibold text-sidebar-primary/70">{t('total')}:</p>

          <p>{formatCurrency(order.total)}</p>
        </div>
      </div>
    </section>
  );
};
