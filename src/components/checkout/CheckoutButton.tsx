'use client';

import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';

import { CheckoutSchema } from '@/api';
import { useAddressesQuery, useCartQuery, useShippingFeesQuery } from '@/hooks';

import { Button } from '../Button';

export const CheckoutButton = () => {
  const t = useTranslations();

  const form = useFormContext<CheckoutSchema>();

  const addressId = Number(form.watch('addressId'));

  const cartQuery = useCartQuery();
  const addressesQuery = useAddressesQuery();
  const defaultAddress = addressesQuery.data?.find((address) => address.isDefault);
  const dropOffAddress = addressesQuery.data?.find((address) => address.id === addressId);

  const shippingFeesQuery = useShippingFeesQuery({
    cod: cartQuery.data?.total,
    dropOffCity: dropOffAddress?.cityDropOff || defaultAddress?.cityDropOff,
  });

  return (
    <Button
      type="submit"
      isDisabled={!form.formState.isValid || !addressesQuery.data?.length}
      isLoading={
        form.formState.isSubmitting ||
        cartQuery.isPending ||
        addressesQuery.isPending ||
        (!!addressId && !!cartQuery.data?.total && shippingFeesQuery.isPending)
      }
      className="w-full h-12 text-base"
    >
      {t('checkout_title')}
    </Button>
  );
};
