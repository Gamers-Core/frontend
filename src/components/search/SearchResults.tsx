'use client';

import { useTranslations } from 'next-intl';

import { SearchSchema } from '@/api';
import { useProductsQuery, useSearchParams } from '@/hooks';

import { ProductCard } from '../ProductCard';

interface SearchResultsProps {
  searchParams?: SearchSchema;
}

export const SearchResults = ({ searchParams }: SearchResultsProps) => {
  const t = useTranslations();

  const { get } = useSearchParams();

  const urlOptions = get<SearchSchema>();
  const options = Object.keys(urlOptions).length > 0 ? urlOptions : searchParams;
  const productsQuery = useProductsQuery(options);

  if (!productsQuery.data || !productsQuery.data.length)
    return (
      <section className="flex-1 flex justify-center items-center bg-sidebar-border p-4 rounded-lg">
        <p className="m-auto text-center text-muted-foreground text-base md:text-lg lg:text-xl">
          {t('search_results_empty')}
        </p>
      </section>
    );

  return (
    <section className="flex-1 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] bg-sidebar-border p-4 gap-6 rounded-lg">
      {productsQuery.data.map((product) => (
        <ProductCard key={product.id} {...product} className="min-w-full w-full md:w-full md:min-w-70" />
      ))}
    </section>
  );
};
