import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { useCartQuery, useMeQuery } from '@/hooks';

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const queryClient = new QueryClient();

  const [me] = await Promise.all([
    queryClient
      .fetchQuery({
        ...useMeQuery,
        queryKey: useMeQuery.queryKey(false),
        queryFn: useMeQuery.queryFn<false>,
      })
      .catch(() => null),
  ]);

  const pathname = (await headers()).get('x-pathname');

  if (me && !me.name) {
    if (pathname) redirect('/setup?from=' + encodeURIComponent(pathname));

    return redirect('/setup');
  }

  if (!!me) await Promise.all([queryClient.prefetchQuery(useCartQuery)]);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
