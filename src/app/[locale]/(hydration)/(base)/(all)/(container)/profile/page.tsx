import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { ProfileAddresses, ProfileHeader, ProfileInfo, ProfileOrders } from '@/components';
import { useAddressCitiesQuery, useAddressesQuery, useMeQuery, useOrdersQuery } from '@/hooks';

export const metadata: Metadata = {
  title: 'Gamers Core | Profile',
  description: 'Access and manage your Gamers Core profile, view your order history, and update your account settings.',
};

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
    queryClient.prefetchQuery(useOrdersQuery),
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
