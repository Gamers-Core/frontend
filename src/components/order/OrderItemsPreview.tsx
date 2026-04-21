import { OrderItem } from '@/api';

import { VariantPreviewCard, VariantPreviewCardProps } from '../VariantPreviewCard';

interface ItemPreviewProps {
  items: OrderItem[];
}

export const OrderItemsPreview = ({ items }: ItemPreviewProps) => {
  return (
    <section className="flex flex-col gap-4 max-h-125 overflow-y-auto">
      {items.map((item) => (
        <VariantPreviewCard key={item.variantExternalId} {...mapOrderItemToCartItem(item)} />
      ))}
    </section>
  );
};

const mapOrderItemToCartItem = (item: OrderItem): VariantPreviewCardProps => ({
  variant: {
    name: item.variantName,
    imageURL: item.imageURL,
    price: item.unitPrice,
    compareAt: null,
    product: { name: item.productTitle },
  },
  quantity: item.quantity,
});
