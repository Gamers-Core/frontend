import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { TopBar } from '@/components';

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TopBar />

      <main className="pt-16">{children}</main>
    </HydrationBoundary>
  );
}
