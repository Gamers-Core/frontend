import { z } from 'zod';

import { TranslationFn } from '@/i18n';

const schema = (t: TranslationFn) =>
  z.object({
    phoneNumber: z
      .string()
      .min(1, t('address_phone_required'))
      .regex(/^(010|011|012|015)\d{8}$/, t('address_phone_invalid')),
    detailedAddress: z.string().min(1, t('address_detailed_required')),
    districtId: z.string().min(1, t('address_zone_required')),
    cityId: z.string().min(1, t('address_city_required')),
    nameAr: z.string().min(1, t('address_name_ar_required')),
  });

export const addressSchema = (t: TranslationFn, isEdit = false) => (isEdit ? schema(t).partial() : schema(t));

export type AddressSchema = z.infer<ReturnType<typeof addressSchema>>;
