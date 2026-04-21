import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { useOrderQuery } from '@/hooks';
import { OrderHeader, OrderInfo, OrderItemsPreview, OrderShippingFees, OrderTracking, Separator } from '@/components';
import { PagePropsWithParams } from '@/app/types';

type PageParams = PagePropsWithParams<{ orderNumber: string }>;

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const orderNumber = (await params).orderNumber;
  if (!orderNumber) return notFound();

  return {
    title: `Gamers Core | ${orderNumber}`,
    description: `View details of order ${orderNumber}`,
  };
}

export default async function Order({ params }: PageParams) {
  const orderNumber = (await params).orderNumber;
  if (!orderNumber) return notFound();

  const queryClient = new QueryClient();

  const [order] = await Promise.all([
    queryClient.fetchQuery({
      ...useOrderQuery,
      queryKey: useOrderQuery.queryKey(orderNumber),
    }),
  ]).catch(() => [null]);

  if (!order) return notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderHeader orderNumber={orderNumber} />

      <div className="flex-1 w-full flex flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1 border-0">
          <OrderTracking orderNumber={orderNumber} />

          <OrderInfo orderNumber={orderNumber} />
        </div>

        <div className="flex-1 flex flex-col bg-sidebar-border p-4 gap-6 rounded-lg h-fit">
          <OrderItemsPreview items={order.items} />

          <Separator />

          <OrderShippingFees orderNumber={orderNumber} />
        </div>
      </div>
    </HydrationBoundary>
  );
}
