import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';

import { useBrandsQuery, useCategoriesQuery, useProductsQuery } from '@/hooks';
import { PagePropsWithSearchParams } from '@/app/types';
import { SearchProductOptions } from '@/api';
import { SearchOptions, SearchResults } from '@/components';

type PageParams = PagePropsWithSearchParams<SearchProductOptions>;

export async function generateMetadata({ searchParams }: PageParams): Promise<Metadata> {
  const query = (await searchParams).q;

  return {
    title: `Gamers Core | Search${query ? ` |  ${query}` : ''}`,
    description: query ? `Search results for ${query}` : 'Search for products',
  };
}

export default async function ProductPage({ searchParams }: PageParams) {
  const params = await searchParams;

  const queryClient = new QueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery({ ...useProductsQuery, queryKey: useProductsQuery.queryKey(params) }),
    queryClient.prefetchQuery(useBrandsQuery),
    queryClient.prefetchQuery(useCategoriesQuery),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchResults searchParams={params} />
    </HydrationBoundary>
  );
}
