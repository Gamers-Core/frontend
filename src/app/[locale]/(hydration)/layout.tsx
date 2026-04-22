import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { headers } from 'next/headers';

import { Footer, QueryProviders } from '@/components';
import { useCartQuery, useMeQuery, usePoliciesQuery } from '@/hooks';
import { isLoggedInHeaderKey } from '@/proxy/const';

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const queryClient = new QueryClient();

  const headersList = await headers();
  const isLoggedIn = headersList.get(isLoggedInHeaderKey) === 'true';

  let queryPromises = [queryClient.prefetchQuery(usePoliciesQuery)];

  if (isLoggedIn)
    queryPromises = [
      ...queryPromises,
      queryClient.prefetchQuery({
        ...useMeQuery,
        queryKey: useMeQuery.queryKey(false),
        queryFn: useMeQuery.queryFn<false>,
      }),
      queryClient.prefetchQuery(useCartQuery),
    ];

  await Promise.allSettled(queryPromises);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QueryProviders />

      {children}

      <Footer />
    </HydrationBoundary>
  );
}
