'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { CheckoutSchema } from '@/api';
import { useAddressesQuery, useCartQuery, useDiscountQuery, useFormatCurrency, useShippingFeesQuery } from '@/hooks';
import { I18nKey } from '@/i18n';

import { Skeleton } from '../ui';
import { PolicyModal } from '../policies';

export const ShippingFees = () => {
  const t = useTranslations();

  const form = useFormContext<CheckoutSchema>();

  const addressId = Number(form.watch('addressId'));
  const paymentMethod = form.watch('paymentMethod');
  const isCOD = paymentMethod === 'cod';
  const canOpenPackage = form.watch('canOpenPackage');

  const discountQuery = useDiscountQuery<string | undefined>(form.watch('discountCode'), paymentMethod);

  const cartQuery = useCartQuery();
  const addressesQuery = useAddressesQuery();
  const defaultAddress = addressesQuery.data?.find((address) => address.isDefault);
  const dropOffAddress = addressesQuery.data?.find((address) => address.id === addressId);

  const cartTotal = cartQuery.data?.total;

  const shippingFeesQuery = useShippingFeesQuery({
    cod: cartTotal,
    dropOffCity: dropOffAddress?.cityDropOff || defaultAddress?.cityDropOff,
  });

  const codFee = isCOD ? (shippingFeesQuery.data?.codFee ?? 0) : 0;
  const openPackageFee = canOpenPackage ? (shippingFeesQuery.data?.openingFee ?? 0) : 0;

  const subtotal = cartTotal! + codFee + openPackageFee;
  const discountAmount = discountQuery.data?.isFreeShipping ? 0 : (discountQuery.data?.discountAmount ?? 0);

  const total =
    (discountQuery.data?.isFreeShipping ? subtotal : subtotal + (shippingFeesQuery.data?.shippingFee ?? 0)) -
    discountAmount;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex gap-4">
        <h3 className="text-xl font-bold">{t('shipping_fees')}</h3>

        <PolicyModal policyType="shipping" />
      </div>

      <div className="flex flex-col gap-2">
        <Item title="subtotal" value={cartTotal} />
        {!!addressesQuery.data?.length && (
          <>
            <Item
              title="shipping_fees"
              value={
                discountQuery.isSuccess && discountQuery.data?.isFreeShipping
                  ? t('free_shipping')
                  : shippingFeesQuery.data?.shippingFee
              }
            />

            {canOpenPackage && <Item title="open_package_fee" value={shippingFeesQuery.data?.openingFee} />}

            {isCOD && <Item title="cod_fee" value={shippingFeesQuery.data?.codFee} />}
          </>
        )}

        {!!discountQuery.data && !discountQuery.data.isFreeShipping && (
          <Item title="discount" value={-1 * discountQuery.data.discountAmount} />
        )}

        <Item title="total" value={total} />
      </div>
    </section>
  );
};

interface ItemProps {
  title: I18nKey;
  value: string | number | undefined;
}

const Item = ({ title, value }: ItemProps) => {
  const t = useTranslations();

  const formatCurrency = useFormatCurrency();

  return (
    <div className="flex gap-2 items-center">
      <p className="font-semibold text-sidebar-primary/70">{t(title)}:</p>

      {typeof value === 'number' ? (
        <p>{formatCurrency(value)}</p>
      ) : typeof value === 'string' ? (
        <p>{value}</p>
      ) : (
        <Skeleton className="h-5 w-15 rounded-sm bg-background" />
      )}
    </div>
  );
};
