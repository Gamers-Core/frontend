import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { headers } from 'next/headers';

import { Footer, MaintenanceMode, QueryProviders } from '@/components';
import { useAppSettingsQuery, useCartQuery, useMeQuery } from '@/hooks';
import { isLoggedInHeaderKey } from '@/proxy/const';

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const queryClient = new QueryClient();

  const headersList = await headers();
  const isLoggedIn = headersList.get(isLoggedInHeaderKey) === 'true';

  const prefetchPromises: Promise<void>[] = [];

  if (isLoggedIn) {
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: useMeQuery.queryKey(false),
        queryFn: useMeQuery.queryFn<false>,
      }),
      queryClient.prefetchQuery(useCartQuery),
    );
  }

  const [settings] = await Promise.allSettled([
    queryClient.fetchQuery(useAppSettingsQuery),
    Promise.allSettled(prefetchPromises),
  ]);

  if (settings.status === 'fulfilled' && settings.value.maintenanceMode.enabled)
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MaintenanceMode />
      </HydrationBoundary>
    );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QueryProviders />

      {children}

      <Footer />
    </HydrationBoundary>
  );
}
