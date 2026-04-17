import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { FeaturedProducts, Hero, TopBar, UserReviews } from '@/components';
import { useFeaturedQuery, useUserReviewsQuery } from '@/hooks';

export const metadata: Metadata = {
  title: 'Gamers Core',
  description: 'Get your gaming Gear at the best price',
};

export default async function Home() {
  const queryClient = new QueryClient();

  await Promise.all([queryClient.prefetchQuery(useFeaturedQuery), queryClient.prefetchQuery(useUserReviewsQuery)]);

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
