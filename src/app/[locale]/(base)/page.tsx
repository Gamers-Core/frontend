import { Metadata } from 'next';

import { Hero } from '@/components';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { useFeaturedQuery } from '@/hooks';

export const metadata: Metadata = {
  title: 'Gamers Core',
  description: 'Get your gaming Gear at the best price',
};

export default async function Home() {
  const queryClient = new QueryClient();

  await Promise.all([queryClient.prefetchQuery(useFeaturedQuery)]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Hero />
    </HydrationBoundary>
  );
}
