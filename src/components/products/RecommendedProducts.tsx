'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { useFormatCurrency, useProductRecommendationsQuery } from '@/hooks';
import { Product } from '@/api';
import { formatMedia } from '@/helpers';

import { Link } from '../Link';

interface RecommendedProductsProps {
  id: number;
}

export const RecommendedProducts = ({ id }: RecommendedProductsProps) => {
  const t = useTranslations();

  const recommendedProductsQuery = useProductRecommendationsQuery(id);

  if (!recommendedProductsQuery.data) return null;

  return (
    <section className="px-4 lg:px-0 md:container">
      <div className="p-4 flex flex-col gap-6 bg-sidebar-border rounded-lg min-w-0">
        <h3 className="text-2xl md:text-3xl font-semibold text-sidebar-primary/90">{t('recommended_products')}</h3>

        <div className="flex flex-row gap-6 overflow-x-auto p-2">
          {recommendedProductsQuery.data.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({ id, media, name, variants, brand, category }: Product) => {
  const t = useTranslations();

  const formatCurrency = useFormatCurrency();

  const activeVariant = variants[0];

  return (
    <Link href={`/products/${id}`} className="flex flex-col relative gap-4 w-min">
      <div className="flex flex-col justify-center items-center size-60 md:size-75 bg-white dark:bg-border rounded-lg p-2">
        <Image
          {...formatMedia(activeVariant.media?.[0] ?? media[0])}
          alt={name}
          className="w-full object-contain rounded-lg overflow-hidden"
        />
      </div>

      <div className="flex flex-col">
        <div>
          <span className="text-sm text-sidebar-primary uppercase">{brand.name}</span>

          <span> {t('slash')} </span>

          <span className="text-xs text-muted-foreground/50 capitalize">{category.name}</span>
        </div>

        <h4 className="text-lg">{name}</h4>

        <div className="flex gap-2 items-center">
          <p className="text-md text-sidebar-primary font-semibold">{formatCurrency(activeVariant.price)}</p>

          <p className="text-sm lg:text-base xl:text-lg line-through text-sidebar-primary/70">
            {activeVariant.compareAt && formatCurrency(activeVariant.compareAt)}
          </p>
        </div>
      </div>

      {activeVariant.compareAt && (
        <span className="absolute top-2.5 inset-e-2.5 text-foreground bg-muted dark:bg-background text-xs md:text-sm px-3 py-1.5 rounded-full font-bold transition-colors duration-300">
          {t('sale')}
        </span>
      )}
    </Link>
  );
};
