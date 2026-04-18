import z from 'zod';

import { TranslationFn } from '@/i18n';
import { paymentMethods } from '../const';

export const checkoutSchema = (t: TranslationFn) =>
  z.object({
    paymentMethod: z.enum(paymentMethods, { error: t('checkout_payment_method_required') }),
    addressId: z
      .string({ error: t('checkout_address_required') })
      .min(1, t('checkout_address_required'))
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, { message: t('checkout_address_required') }),
    note: z.string().optional(),
    canOpenPackage: z.boolean().optional(),
  });

export type CheckoutSchema = z.infer<ReturnType<typeof checkoutSchema>>;
