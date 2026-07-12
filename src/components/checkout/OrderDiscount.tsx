'use client';

import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import { CheckoutSchema } from '@/api';

import { DiscountValidation } from '../DiscountValidation';

export const OrderDiscount = () => {
  const t = useTranslations();

  const form = useFormContext<CheckoutSchema>();

  return (
    <DiscountValidation
      onSuccess={(discount) => {
        if (!discount || !discount.code) return;

        form.setValue('discountCode', discount.code, { shouldDirty: true });

        toast.success(t('discount_applied', { code: discount.code }));
      }}
      onClear={() => {
        form.setValue('discountCode', undefined);
      }}
    />
  );
};
