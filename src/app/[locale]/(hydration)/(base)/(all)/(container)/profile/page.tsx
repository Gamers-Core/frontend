import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { ProfileAddresses, ProfileHeader, ProfileInfo, ProfileOrders } from '@/components';
import { useAddressCitiesQuery, useAddressesQuery, useMeQuery, useOrdersInfiniteQuery } from '@/hooks';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t('page_profile_title'),
    description: t('page_profile_description'),
  };
}

export default async function Page() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      ...useMeQuery,
      queryKey: useMeQuery.queryKey(false),
      queryFn: useMeQuery.queryFn<false>,
    }),
    queryClient.prefetchQuery(useAddressesQuery),
    queryClient.prefetchQuery(useAddressCitiesQuery),
    queryClient.prefetchInfiniteQuery({
      queryKey: useOrdersInfiniteQuery.queryKey(),
      queryFn: useOrdersInfiniteQuery.queryFn,
      initialPageParam: 1,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileHeader />

      <div className="flex flex-col flex-1 gap-8">
        <ProfileInfo />

        <ProfileAddresses />

        <ProfileOrders />
      </div>
    </HydrationBoundary>
  );
}
