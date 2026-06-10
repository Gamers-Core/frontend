import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { FeaturedProducts, Hero, TopBar, UserReviews } from '@/components';
import { useFeaturedQuery, useUserReviewsQuery } from '@/hooks';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t('page_home_title'),
    description: t('page_home_description'),
  };
}

export default async function Home() {
  const queryClient = new QueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery(useFeaturedQuery),
    queryClient.prefetchQuery(useUserReviewsQuery),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TopBar isHome />

      <main className="flex-1 w-full">
        <Hero />

        <FeaturedProducts />

        <UserReviews />
      </main>
    </HydrationBoundary>
  );
}
