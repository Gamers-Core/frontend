import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { useBrandsQuery, useCategoriesQuery, useProductsQuery } from '@/hooks';
import { PagePropsWithSearchParams } from '@/app/types';
import { SearchOptions, SearchResults } from '@/components';
import { SearchSchema } from '@/api';

type PageParams = PagePropsWithSearchParams<SearchSchema>;

export async function generateMetadata({ searchParams }: PageParams): Promise<Metadata> {
  const query = (await searchParams).q;
  const t = await getTranslations();

  return {
    title: query ? t('page_search_title_with_query', { query }) : t('page_search_title'),
    description: query ? t('page_search_description_with_query', { query }) : t('page_search_description'),
  };
}

export default async function SearchPage({ searchParams }: PageParams) {
  const params = await searchParams;

  const queryClient = new QueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery({ ...useProductsQuery, queryKey: useProductsQuery.queryKey(params) }),
    queryClient.prefetchQuery(useBrandsQuery),
    queryClient.prefetchQuery(useCategoriesQuery),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchOptions searchParams={params} />

      <SearchResults searchParams={params} />
    </HydrationBoundary>
  );
}
