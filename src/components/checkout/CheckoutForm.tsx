'use client';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useEffect } from 'react';

import { checkoutSchema, CheckoutSchema } from '@/api';
import { useCartQuery, useCheckoutMutation } from '@/hooks';
import { useRouter } from '@/i18n';
import { useCartStore } from '@/stores';

const defaultValues: CheckoutSchema = {
  addressId: '',
  paymentMethod: 'cod',
  canOpenPackage: false,
  note: '',
};

interface CheckoutFormProps {
  children: React.ReactNode;
  className?: string;

  defaultAddressId?: string;
}

export const CheckoutForm = ({ defaultAddressId, ...props }: CheckoutFormProps) => {
  const t = useTranslations();

  const form = useForm<CheckoutSchema>({
    defaultValues: {
      ...defaultValues,
      addressId: defaultAddressId || defaultValues.addressId,
    },
    mode: 'onChange',
    resolver: zodResolver(checkoutSchema(t)),
  });
  const router = useRouter();

  const checkoutMutation = useCheckoutMutation();
  const cartQuery = useCartQuery();

  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (!cartQuery.data || checkoutMutation.isSuccess) return;

    if (cartQuery.data.count === 0) router.replace('/');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartQuery.data?.count, router]);

  const onSubmit: SubmitHandler<CheckoutSchema> = async (data) => {
    if (!form.formState.isValid || checkoutMutation.isPending) return;

    await checkoutMutation.mutateAsync(data, {
      onSuccess: (res) => {
        toast.success(t('checkout_success'));

        clearCart();
        router.push(`/orders/${res.orderNumber}`);
      },
      onError: (validationErrors) => {
        if (!validationErrors) return;

        validationErrors.errors.forEach((error) => {
          form.setError(error.property, { message: error.messages[0] });
        });
      },
    });
  };

  return (
    <FormProvider {...form}>
      <form {...props} onSubmit={form.handleSubmit(onSubmit, console.warn)} />
    </FormProvider>
  );
};
