'use client';

import { useTranslations } from 'next-intl';
import { HugeiconsIcon } from '@hugeicons/react';
import { CircleIcon } from '@hugeicons/core-free-icons';

import { useFormatDate, useOrderQuery } from '@/hooks';
import { getOrderStatuses, statusesStyleMap } from '@/api';
import { cn } from '@/lib/utils';

import { Link } from '../Link';

interface OrderTrackingProps {
  orderNumber: string;
}

export const OrderTracking = ({ orderNumber }: OrderTrackingProps) => {
  const t = useTranslations();

  const orderQuery = useOrderQuery(orderNumber);
  const formatDate = useFormatDate();

  if (!orderQuery.data) return null;

  const order = orderQuery.data;
  const statuses = getOrderStatuses(order).reverse();

  return (
    <section className="flex flex-col gap-2 md:gap-4 p-4 rounded-lg bg-sidebar-border h-max">
      {!!order.trackingNumber && (
        <p>
          <span>{t('order_track_package_title')}</span>

          <Link
            href={`https://bosta.co/en-eg/tracking-shipments?shipment-number=${order.trackingNumber}`}
            className="text-sidebar-primary hover:underline font-bold transition-colors duration-300"
          >
            {order.trackingNumber}
          </Link>
        </p>
      )}

      <ul>
        {statuses.map(({ date, icon, label, style }, index) => {
          const isLast = index === statuses.length - 1;
          const isCurrent = index === 0;

          return (
            <li key={index} className="flex gap-1">
              <div className="flex flex-col items-center">
                <div className={cn('px-3 py-2', { 'p-1': isCurrent })}>
                  <HugeiconsIcon
                    icon={isCurrent ? icon : CircleIcon}
                    className={cn('size-2', { 'size-6': isCurrent, [statusesStyleMap[style]]: isCurrent })}
                  />
                </div>

                {!isLast && <div className="border-dashed border-l border-muted-foreground h-full" />}
              </div>

              <div className={cn('flex flex-col pb-4', { 'pb-0': isLast })}>
                <p className={cn({ [statusesStyleMap[style]]: isCurrent, 'text-lg font-semibold': isCurrent })}>
                  {t(label)}
                </p>

                <p className="text-sm text-gray-500">{formatDate(date, 'PPP')}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
