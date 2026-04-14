import z from 'zod';

import { TranslationFn } from '@/i18n';

export const signinSchema = (t: TranslationFn) =>
  z.object({
    email: z.email(t('auth_email_invalid')).nonempty(t('auth_email_required')),
  });

export type SigninSchema = z.infer<ReturnType<typeof signinSchema>>;
