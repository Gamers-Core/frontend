'use client';

import { useTranslations } from 'next-intl';

import { useOrderQuery } from '@/hooks';

interface OrderShippingInfoProps {
  orderNumber: string;
}

export const OrderInfo = ({ orderNumber }: OrderShippingInfoProps) => {
  const t = useTranslations();

  const orderQuery = useOrderQuery(orderNumber);

  if (!orderQuery.data) return null;

  const order = orderQuery.data;
  const shippingAddress = order.shippingAddress;

  return (
    <section className="flex flex-col lg:flex-row gap-2 md:gap-4 p-4 rounded-lg bg-sidebar-border h-max">
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">{t('shipping_address')}</h2>

          <div>
            <p className="text-base text-muted-foreground font-cairo">{shippingAddress.districtName}</p>
            <p className="text-base text-muted-foreground font-cairo">{shippingAddress.cityName}</p>
            <p className="text-base text-muted-foreground line-clamp-2 font-cairo">{shippingAddress.detailedAddress}</p>
          </div>
        </div>

        {!!order.note && (
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold">{t('shipping_note')}</h2>

            <p className="text-base text-muted-foreground font-cairo">{order.note}</p>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">{t('order_contact_info_title')}</h2>

          <div>
            <p className="text-base text-muted-foreground font-cairo">{shippingAddress.nameAr}</p>
            <p className="text-base text-muted-foreground">{shippingAddress.phoneNumber}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">{t('payment_method')}</h2>

          <div>
            <p className="text-base text-muted-foreground">{t(`payment_method_${order.paymentMethod}`)}</p>
            <p className="text-base text-muted-foreground">
              {t('can_open_package')}: {order.canOpenPackage ? t('yes') : t('no')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
