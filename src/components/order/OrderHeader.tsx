'use client';

import { useTranslations } from 'next-intl';

import { useFormatDate, useOrderQuery } from '@/hooks';

import { Link } from '../Link';
import { whatsappBusinessNumber } from '@/const';
import { requestReturnMessage } from './const';

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
    <section className="flex flex-col md:flex-row gap-2 justify-between md:items-center">
      <div>
        <h1 className="text-lg font-bold">
          {t('order_OrderNumber_title')}
          <span dir="ltr" className="text-primary">
            #{order.orderNumber}
          </span>
        </h1>

        <p className="text-sm text-gray-500">
          {t('placed_on')} {formatDate(order.createdAt, 'PPP')}
        </p>
      </div>

      {!order.canReturn && (
        <div>
          <Link
            href={`https://wa.me/${whatsappBusinessNumber}?text=${encodeURIComponent(requestReturnMessage(order.orderNumber))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border-yellow-500/20 bg-yellow-500/10 p-3 text-sm font-medium text-yellow-600 transition-colors hover:bg-yellow-500/20 dark:text-yellow-400"
          >
            Request a Return
          </Link>
        </div>
      )}
    </section>
  );
};
