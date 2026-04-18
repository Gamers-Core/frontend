import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';

import {
  Accordion,
  CheckoutButton,
  CheckoutForm,
  ItemsPreview,
  PaymentMethod,
  Separator,
  ShippingAddress,
  ShippingFees,
  ShippingNote,
  ShippingOptions,
} from '@/components';
import { useAddressesQuery, useCartQuery } from '@/hooks';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Gamers Core | Checkout',
  description:
    'Complete your purchase with Gamers Core. Review your order, enter your payment details, and finalize your transaction securely.',
};

export default async function Checkout() {
  const queryClient = new QueryClient();

  const [cart, addresses] = await Promise.all([
    queryClient.fetchQuery(useCartQuery),
    queryClient.fetchQuery(useAddressesQuery),
  ]);

  if (cart.items.length === 0) return redirect('/');

  const defaultAddress = addresses.find((address) => address.isDefault);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CheckoutForm
        className="flex-1 w-full flex flex-col md:flex-row gap-4"
        defaultAddressId={defaultAddress?.id.toString()}
      >
        <Accordion
          type="single"
          defaultValue="shipping_addresses"
          className="flex flex-col gap-4 md:flex-1 xl:flex-1 border-0"
        >
          <ShippingAddress />

          <PaymentMethod />

          <ShippingOptions />

          <ShippingNote />

          <CheckoutButton />
        </Accordion>

        <div className="flex-1 flex flex-col bg-sidebar-border p-4 gap-8 rounded-lg h-fit">
          <ItemsPreview />

          <Separator />

          <ShippingFees />
        </div>
      </CheckoutForm>
    </HydrationBoundary>
  );
}
