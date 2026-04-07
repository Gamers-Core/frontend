import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import { useProductQuery } from '@/hooks';
import { PagePropsWithParams } from '@/app/types';

type PageParams = PagePropsWithParams<{ id: string }>;

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const id = (await params).id as unknown as number;
  if (typeof Number(id) !== 'number') return notFound();

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
  const id = (await params).id as unknown as number;
  if (typeof Number(id) !== 'number') return notFound();

  const queryClient = new QueryClient();

  const [product] = await Promise.all([
    queryClient.fetchQuery({
      ...useProductQuery,
      queryKey: useProductQuery.queryKey(id),
    }),
  ]).catch(() => [null]);

  if (!product) return notFound();

  return <HydrationBoundary state={dehydrate(queryClient)}></HydrationBoundary>;
}
