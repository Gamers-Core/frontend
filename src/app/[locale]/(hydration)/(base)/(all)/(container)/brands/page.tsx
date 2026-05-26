import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { useBrandsQuery } from '@/hooks';
import { BrandsBody, BrandsHeader } from '@/components';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t('page_brands_title'),
    description: t('page_brands_description'),
  };
}
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
