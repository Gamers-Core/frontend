import z from 'zod';

import { TranslationFn } from '@/i18n';

export const verifyOTPSchema = (t: TranslationFn) =>
  z.object({
    otp: z
      .string()
      .min(6, t('otp_must_be_6_digits'))
      .max(6, t('otp_must_be_6_digits'))
      .refine((value) => /^\d+$/.test(value), t('otp_must_contain_only_digits')),
  });

export type VerifyOTPSchema = z.infer<ReturnType<typeof verifyOTPSchema>>;
