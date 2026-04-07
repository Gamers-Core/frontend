'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { useFormatCurrency, useProductsQuery } from '@/hooks';
import { Product } from '@/api';
import { formatMedia } from '@/helpers';
import { Link } from '@/i18n';

interface RecommendedProductsProps {
  id: number;
}

export const RecommendedProducts = ({ id }: RecommendedProductsProps) => {
  const t = useTranslations();

  const productsQuery = useProductsQuery();

  if (!productsQuery.data) return null;

  const products = productsQuery.data.filter((product) => product.id !== id);

  return (
    <section className="px-4 lg:px-0 md:container">
      <div className="p-4 flex flex-col gap-6 bg-sidebar-border rounded-lg min-w-0">
        <h3 className="text-2xl md:text-3xl font-semibold text-sidebar-primary/90">{t('recommended_products')}</h3>

        <div className="flex flex-row gap-6 overflow-x-auto p-2">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({ id, media, name, variants }: Product) => {
  const formatCurrency = useFormatCurrency();

  const activeVariant = variants[0];

  return (
    <Link href={`/products/${id}`} className="flex flex-col relative gap-4 w-min">
      <div className="flex flex-col justify-center items-center size-60 md:size-75 bg-white dark:bg-border rounded-lg p-2">
        <Image {...formatMedia(media[0])} alt={name} className="w-full object-contain rounded-lg overflow-hidden" />
      </div>

      <div className="flex flex-col">
        <h4 className="text-lg">{name}</h4>

        <div className="flex gap-2 items-center">
          <p className="text-md text-sidebar-primary font-semibold">{formatCurrency(activeVariant.price)}</p>

          <p className="text-sm lg:text-base xl:text-lg line-through text-sidebar-primary/70">
            {activeVariant.compareAt && formatCurrency(activeVariant.compareAt)}
          </p>
        </div>
      </div>
    </Link>
  );
};
