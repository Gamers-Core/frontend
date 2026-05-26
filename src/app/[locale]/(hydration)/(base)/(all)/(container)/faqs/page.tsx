import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { useFAQsQuery } from '@/hooks';
import { FAQsBody, FAQsHeader } from '@/components';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t('page_faqs_title'),
    description: t('page_faqs_description'),
  };
}
export default async function FAQs() {
  const queryClient = new QueryClient();

  await Promise.all([queryClient.prefetchQuery(useFAQsQuery)]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FAQsHeader />

      <FAQsBody />
    </HydrationBoundary>
  );
}
