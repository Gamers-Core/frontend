'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { FeaturedVariant } from '@/api';
import { useFeaturedQuery, useFormatCurrency } from '@/hooks';
import { cn } from '@/lib/utils';

import { Link } from '../Link';

export const FeaturedProducts = () => {
  const t = useTranslations();

  const featuredQuery = useFeaturedQuery();

  if (!featuredQuery.data?.length) return null;

  return (
    <section id="featured-products" className="md:container w-full flex flex-col py-20 gap-10">
      <div className="flex flex-col gap-2 md:gap-4 xl:gap-6">
        <h2 className="text-center text-4xl md:text-5xl xl:text-6xl font-bold">{t('home_featured_title')}</h2>

        <p className="text-center text-xl md:text-2xl xl:text-3xl text-gray-500">{t('home_featured_subtitle')}</p>
      </div>

      <div className="flex flex-col gap-5 py-10 px-5">
        <FeaturedProductCard isMain {...featuredQuery.data[0]} />

        <div className="flex flex-row flex-wrap gap-5">
          {featuredQuery.data.slice(1).map((featured) => (
            <FeaturedProductCard key={featured.variant.externalId} {...featured} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface FeaturedProductCardProps extends FeaturedVariant {
  isMain?: boolean;
}

const FeaturedProductCard = ({ isMain = false, ...featured }: FeaturedProductCardProps) => {
  const t = useTranslations();

  const formatCurrency = useFormatCurrency();

  const media = featured.variant.media[0] ?? featured.variant.product.media[0];

  return (
    <div
      className={cn(
        'bg-sidebar-border text-center md:text-start rounded-lg hover:scale-101 transition-all duration-300',
        {
          'flex-1 min-w-fit md:min-w-xs lg:min-w-md xl:min-w-152 md:text-center': !isMain,
        },
      )}
    >
      <div
        className={cn(
          'flex container flex-col md:flex-row md:gap-2 lg:gap-4 xl:gap-10 justify-center py-6 md:py-15 px-4 md:px-8 lg:px-10',
          { 'flex-col md:flex-col px-6 lg:px-12 items-center xl:gap-6 lg:gap-2 md:gap-1': !isMain },
        )}
      >
        <div className="relative md:max-w-xl flex-1">
          <Image
            src={media.url}
            width={media.width}
            height={media.height}
            alt={featured.title}
            loading="eager"
            fetchPriority="high"
            priority
          />

          <p
            className={cn(
              'absolute text-sm md:text-base top-5 inset-s-5 px-4 py-2 rounded-full font-bold bg-primary text-primary-foreground transition-colors duration-300',
              { 'inset-s-auto inset-e-5 text-foreground bg-background text-xs md:text-sm': !isMain },
            )}
          >
            {featured.title}
          </p>
        </div>

        <div
          className={cn('flex flex-col flex-1 md:max-w-xl gap-5 md:pt-6 lg:pt-10 items-center md:items-start', {
            'md:items-center md:pt-0 lg:pt-0 md:max-w-2xl': !isMain,
          })}
        >
          <h3
            className={cn('text-3xl lg:text-4xl xl:text-5xl font-bold rtl:leading-snug', {
              'md:text-2xl lg:text-3xl xl:text-4xl': !isMain,
            })}
          >
            {featured.variant.product.name}
          </h3>

          {isMain && (
            <p className="md:text-base lg:text-lg xl:text-2xl text-gray-500 line-clamp-4 lg:line-clamp-5 xl:line-clamp-6">
              {featured.variant.product.description}
            </p>
          )}

          <div
            className={cn('flex items-center gap-0.5 md:gap-4 w-fit flex-col md:flex-row', {
              'md:flex-col md:gap-0.5': !isMain,
            })}
          >
            <p className="text-3xl md:text-2xl lg:text-2xl xl:text-3xl font-semibold text-sidebar-primary">
              {formatCurrency(featured.variant.price)}
            </p>

            <p className="text-xl md:text-base lg:text-lg xl:text-xl line-through text-sidebar-primary/80">
              {featured.variant.compareAt && formatCurrency(featured.variant.compareAt)}
            </p>
          </div>

          <Link
            href={`/products/${featured.variant.product.id}/${featured.variant.externalId}`}
            className="w-fit text-lg md:text-xl lg:text-2xl h-auto px-6 py-4 bg-primary rounded-lg text-primary-foreground font-bold"
          >
            {t('home_featured_button')}
          </Link>
        </div>
      </div>
    </div>
  );
};
