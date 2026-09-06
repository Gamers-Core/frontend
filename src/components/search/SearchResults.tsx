'use client';

import { useTranslations } from 'next-intl';

import { SearchSchema } from '@/api';
import { useProductsInfiniteQuery, useSearchParams } from '@/hooks';

import { ProductCard } from '../ProductCard';
import { InfiniteScrollTrigger } from '../InfiniteScrollTrigger';

interface SearchResultsProps {
  searchParams?: SearchSchema;
}

export const SearchResults = ({ searchParams }: SearchResultsProps) => {
  const t = useTranslations();

  const { get } = useSearchParams();

  const urlOptions = get<SearchSchema>();
  const options = Object.keys(urlOptions).length > 0 ? urlOptions : searchParams;
  const productsQuery = useProductsInfiniteQuery(options);

  const products = productsQuery.data?.pages.flatMap((page) => page.data) ?? [];

  if (!products.length)
    return (
      <section className="flex-1 flex justify-center items-center bg-sidebar-border p-4 rounded-lg">
        <p className="m-auto text-center text-muted-foreground text-base md:text-lg lg:text-xl">
          {t('search_results_empty')}
        </p>
      </section>
    );

  return (
    <section className="flex-1 bg-sidebar-border p-4 rounded-lg">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} className="min-w-full w-full md:w-full md:min-w-70" />
        ))}

        {productsQuery.isFetchingNextPage && (
          <ProductCard.Skeleton className="min-w-full w-full md:w-full md:min-w-70" />
        )}
      </div>

      <InfiniteScrollTrigger
        onLoadMore={productsQuery.fetchNextPage}
        hasMore={productsQuery.hasNextPage}
        isLoading={productsQuery.isFetchingNextPage}
      />
    </section>
  );
};
