import z from 'zod';
import { TranslationFn } from '@/i18n';
import { sortOptions, stockFilters } from '../const';

const priceRangeRefinement =
  (t: TranslationFn) =>
  ({ minPrice, maxPrice }: { minPrice?: string; maxPrice?: string }, ctx: z.RefinementCtx) => {
    if (!minPrice || !maxPrice) return;

    if (Number(maxPrice) >= Number(minPrice)) return;

    ctx.addIssue({ code: 'custom', message: t('search_max_price_must_be_greater'), path: ['maxPrice'] });
  };

export const filtersSchema = (t: TranslationFn) =>
  z
    .object({
      brandId: z
        .string()
        .optional()
        .refine(refineOptionalStringNumber, { message: t('search_invalid_brand') }),
      categoryId: z
        .string()
        .optional()
        .refine(refineOptionalStringNumber, { message: t('search_invalid_category') }),
      minPrice: z
        .string()
        .optional()
        .refine(refineOptionalStringNumber, { message: t('search_invalid_price_range') }),
      maxPrice: z
        .string()
        .optional()
        .refine(refineOptionalStringNumber, { message: t('search_invalid_price_range') }),
      stock: z.enum(stockFilters).optional(),
      sort: z.enum(sortOptions).optional(),
    })
    .superRefine(priceRangeRefinement(t));

export const searchSchema = (t: TranslationFn) =>
  z.object({ q: z.string().optional() }).extend(filtersSchema(t).shape).superRefine(priceRangeRefinement(t));

export type SearchSchema = z.infer<ReturnType<typeof searchSchema>>;
export type FiltersSchema = z.infer<ReturnType<typeof filtersSchema>>;

const refineOptionalStringNumber = (val: string | undefined) =>
  typeof val === 'undefined' || val === '' || (!isNaN(Number(val)) && Number(val) >= 1);
