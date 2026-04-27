import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { useBrandsQuery } from '@/hooks';
import { BrandsBody, BrandsHeader } from '@/components';

export const metadata: Metadata = {
  title: 'Gamers Core | Brands',
  description: 'Discover our wide range of brands at Gamers Core.',
};
export default async function Brands() {
  const queryClient = new QueryClient();

  await Promise.all([queryClient.prefetchQuery(useBrandsQuery)]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BrandsHeader />

      <BrandsBody />
    </HydrationBoundary>
  );
}
