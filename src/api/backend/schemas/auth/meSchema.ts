import z from 'zod';

import { TranslationFn } from '@/i18n';

export const meSchema = (t: TranslationFn) =>
  z.object({
    name: z.string().min(2, t('name_must_be_at_least_2_characters')).nonempty(t('name_required')),
  });

export type MeSchema = z.infer<ReturnType<typeof meSchema>>;
