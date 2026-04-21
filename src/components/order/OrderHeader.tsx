'use client';

import { useTranslations } from 'next-intl';

import { useFormatDate, useOrderQuery } from '@/hooks';

interface OrderHeaderProps {
  orderNumber: string;
}

export const OrderHeader = ({ orderNumber }: OrderHeaderProps) => {
  const t = useTranslations();

  const orderQuery = useOrderQuery(orderNumber);

  const formatDate = useFormatDate();

  if (!orderQuery.data) return null;

  const order = orderQuery.data;

  return (
    <section>
      <h1 className="text-lg font-bold">
        {t('order_OrderNumber_title')}
        <span dir="ltr" className="text-primary">
          #{order.orderNumber}
        </span>
      </h1>

      <p className="text-sm text-gray-500">
        {t('placed_on')} {formatDate(order.createdAt, 'PPP')}
      </p>
    </section>
  );
};
