'use client';

import { useTranslations } from 'next-intl';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';

import { Order, getOrderStatus } from '@/api';
import { useFormatCurrency, useFormatDate, useFormatNumber, useOrdersQuery } from '@/hooks';
import { cn } from '@/lib/utils';

import { Link } from '../Link';
import { Separator } from '../ui';

export const ProfileOrders = () => {
  const t = useTranslations();

  const orderQuery = useOrdersQuery();

  if (!orderQuery.data) return null;

  return (
    <section className="p-4 flex flex-col flex-1 gap-4 bg-sidebar-border rounded-lg min-h-124 max-h-200">
      <h3 className="text-xl">{t('orders_title')}</h3>

      <div className="flex flex-col md:flex-row gap-4 md:overflow-x-auto overflow-y-auto flex-1">
        {orderQuery.data.length ? (
          orderQuery.data.map((order) => <OrderItem key={order.orderNumber} {...order} />)
        ) : (
          <p className="text-muted-foreground m-auto">{t('orders_empty')}</p>
        )}
      </div>
    </section>
  );
};

const OrderItem = (order: Order) => {
  const t = useTranslations();

  const formatDate = useFormatDate();
  const formatNumber = useFormatNumber();
  const formatCurrency = useFormatCurrency();

  const status = getOrderStatus(order.status, order);
  const totalItems = order.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="flex flex-col gap-5 p-4 bg-sidebar rounded-lg md:w-88 md:min-w-88">
      <div className="flex flex-col gap-4 bg-accent rounded-sm p-4 min-h-36">
        <p dir="ltr" className="text-lg font-bold text-primary rtl:text-end">
          #{order.orderNumber}
        </p>

        <Separator />

        <div>
          <div
            className={cn('flex gap-2', {
              'text-muted-foreground': status.style === 'default',
              'text-green-500': status.style === 'success',
              'text-red-500': status.style === 'error',
              'text-yellow-500': status.style === 'warning',
              'text-blue-500': status.style === 'info',
            })}
          >
            <HugeiconsIcon icon={status.icon} />

            <p className="text-lg font-semibold">{t(status.label)}</p>
          </div>

          {status.date && <p className="ps-8 text-muted-foreground">{formatDate(status.date, 'PPP')}</p>}
        </div>
      </div>

      <div className="w-full h-80">
        <Image
          src={order.items?.[0]?.imageURL ?? '/assets/placeholder.svg'}
          alt={order.items?.[0]?.variantName ?? ''}
          width={200}
          height={400}
          className="size-full object-contain rounded"
          loading="eager"
        />
      </div>

      <div className="bg-accent rounded-sm p-4">
        <p className="text-lg text-ring">
          <span className="text-sidebar-primary font-bold">{t('orders_items')}</span>

          <span className="font-semibold">{formatNumber(totalItems)}</span>
        </p>

        <p className="text-lg text-ring">
          <span className="text-sidebar-primary font-bold">{t('orders_total')}</span>

          <span className="font-semibold">{formatCurrency(order.total)}</span>
        </p>
      </div>

      <Link
        href={`/orders/${order.orderNumber}`}
        className="w-full h-10 flex justify-center items-center bg-primary text-base font-medium text-primary-foreground rounded-lg transition-colors duration-300 hover:bg-sidebar-primary"
      >
        {t('view_details')}
      </Link>
    </div>
  );
};
