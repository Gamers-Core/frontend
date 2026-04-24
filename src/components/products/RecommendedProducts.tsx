'use client';

import { useTranslations } from 'next-intl';

import { useProductRecommendationsQuery } from '@/hooks';

import { ProductCard } from '../ProductCard';

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
          {recommendedProductsQuery.data.map((product) => {
            const activeVariant = product.variants[0];

            return (
              <ProductCard
                key={product.id}
                {...product}
                imageURL={activeVariant.media[0]?.url ?? product.media[0]}
                price={{ value: activeVariant.price, compareAt: activeVariant.compareAt }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
