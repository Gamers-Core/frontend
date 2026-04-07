'use client';

import { useSearchParams } from 'next/navigation';

import { SlideImage } from 'yet-another-react-lightbox';

import { useProductQuery } from '@/hooks';
import { formatMedia } from '@/helpers';

import { MediaCarousel } from './MediaCarousel';

export interface ProductListingProps {
  id: number;
}

export const ProductListing = ({ id }: ProductListingProps) => {
  const searchParams = useSearchParams();

  const productQuery = useProductQuery(id);

  if (!productQuery.data) return <div>Product not found</div>;

  const variantExternalId = searchParams.get('variant');
  const selectedVariant = productQuery.data.variants.find((variant) => variant.externalId === variantExternalId);

  const defaultVariant = selectedVariant ?? productQuery.data.variants[0];

  const media: SlideImage[] = [...defaultVariant.media, ...productQuery.data.media].map((mediaItem) => ({
    ...formatMedia(mediaItem),
    type: 'image',
  }));

  return (
    <section className="flex flex-col lg:flex-row gap-8 md:container">
      <MediaCarousel media={media} />
    </section>
  );
};
