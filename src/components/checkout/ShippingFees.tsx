'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { CheckoutSchema } from '@/api';
import { useAddressesQuery, useCartQuery, useFormatCurrency, useShippingFeesQuery } from '@/hooks';
import { I18nKey } from '@/i18n';
import { Skeleton } from '../ui';

export const ShippingFees = () => {
  const t = useTranslations();

  const form = useFormContext<CheckoutSchema>();

  const addressId = Number(form.watch('addressId'));
  const isCOD = form.watch('paymentMethod') === 'cod';
  const canOpenPackage = form.watch('canOpenPackage');

  const cartQuery = useCartQuery();
  const addressesQuery = useAddressesQuery();
  const defaultAddress = addressesQuery.data?.find((address) => address.isDefault);
  const dropOffAddress = addressesQuery.data?.find((address) => address.id === addressId);

  const cartTotal = cartQuery.data?.total;

  const shippingFeesQuery = useShippingFeesQuery({
    cod: cartTotal,
    dropOffCity: dropOffAddress?.cityDropOff || defaultAddress?.cityDropOff,
  });

  const total =
    shippingFeesQuery.isSuccess && cartTotal !== undefined
      ? cartTotal +
        shippingFeesQuery.data.shippingFee +
        (canOpenPackage ? shippingFeesQuery.data.openingFee : 0) +
        (isCOD ? shippingFeesQuery.data.codFee : 0)
      : undefined;

  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-xl font-bold">{t('shipping_fees')}</h3>

      <div className="flex flex-col gap-2">
        <Item title="subtotal" value={cartTotal} />
        {addressesQuery.data?.length && (
          <>
            <Item title="shipping_fees" value={shippingFeesQuery.data?.shippingFee} />
            {canOpenPackage && <Item title="open_package_fee" value={shippingFeesQuery.data?.openingFee} />}
            {isCOD && <Item title="cod_fee" value={shippingFeesQuery.data?.codFee} />}
            <Item title="total" value={total} />
          </>
        )}
      </div>
    </section>
  );
};

interface ItemProps {
  title: I18nKey;
  value: number | undefined;
}

const Item = ({ title, value }: ItemProps) => {
  const t = useTranslations();

  const formatCurrency = useFormatCurrency();

  return (
    <div className="flex gap-2 items-center">
      <p className="font-semibold text-sidebar-primary/70">{t(title)}:</p>

      {value !== undefined ? (
        <p>{formatCurrency(value)}</p>
      ) : (
        <Skeleton className="h-5 w-15 rounded-sm bg-background" />
      )}
    </div>
  );
};
