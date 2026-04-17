import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { headers } from 'next/headers';

import { QueryProviders } from '@/components';
import { useCartQuery, useMeQuery } from '@/hooks';
import { isLoggedInHeaderKey } from '@/proxy/const';

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const queryClient = new QueryClient();

  const headersList = await headers();
  const isLoggedIn = headersList.get(isLoggedInHeaderKey) === 'true';

  if (isLoggedIn)
    await Promise.all([
      queryClient.prefetchQuery({
        ...useMeQuery,
        queryKey: useMeQuery.queryKey(false),
        queryFn: useMeQuery.queryFn<false>,
      }),
      queryClient.prefetchQuery(useCartQuery),
    ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QueryProviders />

      {children}
    </HydrationBoundary>
  );
}
