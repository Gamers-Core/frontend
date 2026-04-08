import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import { ProductListing, RecommendedProducts } from '@/components';
import { useProductQuery, useProductRecommendationsQuery } from '@/hooks';
import { PagePropsWithParams } from '@/app/types';

type PageParams = PagePropsWithParams<{ id: string }>;

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const id = Number((await params).id);
  if (isNaN(id)) return notFound();

  const queryClient = new QueryClient();

  const [product] = await Promise.all([
    queryClient.fetchQuery({
      ...useProductQuery,
      queryKey: useProductQuery.queryKey(id),
    }),
  ]);

  if (!product) return notFound();

  const productName = product.name.length > 20 ? `${product.name.slice(0, 20)}...` : product.name;

  return {
    title: `Gamers Core | ${productName}`,
    description: `View details of product ${productName}`,
  };
}

export default async function ProductPage({ params }: PageParams) {
  const id = Number((await params).id);
  if (isNaN(id)) return notFound();

  const queryClient = new QueryClient();

  const [product] = await Promise.all([
    queryClient.fetchQuery({
      ...useProductQuery,
      queryKey: useProductQuery.queryKey(id),
    }),
    queryClient.prefetchQuery({
      ...useProductRecommendationsQuery,
      queryKey: useProductRecommendationsQuery.queryKey(id),
    }),
  ]).catch(() => [null]);

  if (!product) return notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListing id={id} />

      <RecommendedProducts id={id} />
    </HydrationBoundary>
  );
}
