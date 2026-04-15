import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { ProfileAddresses, ProfileHeader, ProfileInfo } from '@/components';
import { useAddressesQuery, useMeQuery } from '@/hooks';

export const metadata: Metadata = {
  title: 'Gamers Core | Profile',
  description: 'Access and manage your Gamers Core profile, view your order history, and update your account settings.',
};

export default async function Page() {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileHeader />
    </HydrationBoundary>
  );
}
