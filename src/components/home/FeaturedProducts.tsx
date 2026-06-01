'use client';

import { useTranslations } from 'next-intl';

import { FeaturedVariant } from '@/api';
import { useFeaturedQuery, useFormatCurrency } from '@/hooks';
import { cn } from '@/lib/utils';

import { Link } from '../Link';
import { Image } from '../Image';

export const FeaturedProducts = () => {
  const t = useTranslations();

  const featuredQuery = useFeaturedQuery();

  return (
    <section id="featured-products" className="md:container w-full flex flex-col pt-20 pb-10 gap-10">
      <div className="flex flex-col gap-2 md:gap-4 xl:gap-6 px-5">
        <h2 className="text-center text-4xl md:text-5xl xl:text-6xl font-bold">{t('home_featured_title')}</h2>

        <p className="text-center text-xl md:text-2xl xl:text-3xl text-gray-500">{t('home_featured_subtitle')}</p>
      </div>

      <div className="flex flex-col gap-5 py-10 px-5">
        {featuredQuery.isPending ? (
          <FeaturedProductCardSkeleton isMain />
        ) : featuredQuery.data && featuredQuery.data.length > 0 ? (
          <FeaturedProductCard isMain {...featuredQuery.data[0]} />
        ) : null}

        <div className="flex flex-row flex-wrap gap-5">
          {featuredQuery.isPending
            ? [1, 2].map((i) => <FeaturedProductCardSkeleton key={i} />)
            : featuredQuery.data
                ?.slice(1)
                .map((featured) => <FeaturedProductCard key={featured.variant.externalId} {...featured} />)}
        </div>
      </div>
    </section>
  );
};

interface FeaturedProductCardProps extends FeaturedVariant {
  isMain?: boolean;
}

const FeaturedProductCard = ({ isMain = false, variant, ...featured }: FeaturedProductCardProps) => {
  const t = useTranslations();

  const formatCurrency = useFormatCurrency();

  return (
    <div
      className={cn(
        'flex flex-col bg-sidebar-border text-center md:text-start rounded-lg hover:scale-101 transition-all duration-300',
        {
          'flex-1 min-w-fit md:min-w-xs lg:min-w-md xl:min-w-152 md:text-center': !isMain,
        },
      )}
    >
      <div
        className={cn(
          'flex container flex-col md:flex-row gap-10 lg:gap-4 xl:gap-10 justify-center py-6 md:py-15 px-4 md:px-8 lg:px-10 flex-1',
          { 'flex-col md:flex-col px-6 lg:px-12 items-center xl:gap-6 lg:gap-2': !isMain },
        )}
      >
        <div className="relative flex items-center md:max-w-xl flex-1">
          <Image image={variant.image} alt={featured.title} loading="eager" fetchPriority="high" priority />

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
          className={cn('flex flex-col flex-1 justify-center md:max-w-xl gap-5 md:gap-8 items-center md:items-start', {
            'md:items-center md:pt-0 lg:pt-0 md:max-w-2xl': !isMain,
          })}
        >
          <div className="flex flex-col gap-2">
            <div>
              <span className="text-sm md:text-base lg:text-lg text-sidebar-primary uppercase">
                {variant.product.brand.name}
              </span>

              <span> {t('slash')} </span>

              <span className="text-xs md:text-sm lg:text-base text-muted-foreground/50 capitalize">
                {variant.product.category.name}
              </span>
            </div>
            <h3
              className={cn('text-3xl lg:text-4xl xl:text-5xl font-bold rtl:leading-snug', {
                'md:text-2xl lg:text-3xl xl:text-4xl': !isMain,
              })}
            >
              {variant.product.name}
            </h3>
          </div>

          {isMain && (
            <p className="md:text-base lg:text-lg xl:text-2xl text-gray-500 line-clamp-4 lg:line-clamp-5 xl:line-clamp-6">
              {variant.product.description
                .replace(/<[^>]*>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()}
            </p>
          )}

          <div
            className={cn('flex items-center gap-0.5 md:gap-4 w-fit flex-col md:flex-row', {
              'md:flex-col md:gap-0.5': !isMain,
            })}
          >
            <p className="text-3xl md:text-2xl lg:text-2xl xl:text-3xl font-semibold text-sidebar-primary">
              {formatCurrency(variant.price)}
            </p>

            <p className="text-xl md:text-base lg:text-lg xl:text-xl line-through text-sidebar-primary/80">
              {variant.compareAt && formatCurrency(variant.compareAt)}
            </p>
          </div>

          <Link
            href={`/products/${variant.product.id}?variant=${variant.externalId}`}
            className="w-fit text-lg md:text-xl lg:text-2xl h-auto px-6 py-4 bg-primary rounded-lg text-primary-foreground font-bold"
          >
            {t('home_featured_button')}
          </Link>
        </div>
      </div>
    </div>
  );
};

interface FeaturedProductCardSkeletonProps {
  isMain?: boolean;
}

const FeaturedProductCardSkeleton = ({ isMain = false }: FeaturedProductCardSkeletonProps) => (
  <div
    className={cn('animate-pulse flex flex-col bg-sidebar-border text-center md:text-start rounded-lg', {
      'flex-1 min-w-fit md:min-w-xs lg:min-w-md xl:min-w-152 md:text-center': !isMain,
    })}
  >
    <div
      className={cn(
        'flex container flex-col md:flex-row gap-10 lg:gap-4 xl:gap-10 justify-center py-6 md:py-15 px-4 md:px-8 lg:px-10 flex-1',
        { 'flex-col md:flex-col px-6 lg:px-12 items-center xl:gap-6 lg:gap-2': !isMain },
      )}
    >
      <div className="relative flex items-center md:max-w-xl flex-1">
        <div className="w-full aspect-square rounded-lg bg-muted" />

        <div
          className={cn('absolute top-5 inset-s-5 h-8 w-24 rounded-full bg-muted-foreground/20', {
            'inset-s-auto inset-e-5 h-6 w-20': !isMain,
          })}
        />
      </div>

      <div
        className={cn('flex flex-col flex-1 justify-center md:max-w-xl gap-5 md:gap-8 items-center md:items-start', {
          'md:items-center md:pt-0 lg:pt-0 md:max-w-2xl': !isMain,
        })}
      >
        <div className="flex flex-col gap-2 w-full">
          <div className="h-4 w-32 rounded-full bg-muted" />

          <div
            className={cn('h-10 w-3/4 rounded-lg bg-muted', {
              'md:h-8 lg:h-9 xl:h-10': !isMain,
            })}
          />

          <div className="h-10 w-1/2 rounded-lg bg-muted" />
        </div>

        {isMain && (
          <div className="flex flex-col gap-2 w-full">
            <div className="h-4 w-full rounded-full bg-muted" />
            <div className="h-4 w-5/6 rounded-full bg-muted" />
            <div className="h-4 w-4/6 rounded-full bg-muted" />
            <div className="h-4 w-3/6 rounded-full bg-muted" />
          </div>
        )}

        <div
          className={cn('flex items-center gap-4 flex-col md:flex-row', {
            'md:flex-col md:gap-0.5': !isMain,
          })}
        >
          <div className="h-8 w-24 rounded-lg bg-muted" />
          <div className="h-5 w-16 rounded-lg bg-muted" />
        </div>

        <div className="h-14 w-40 rounded-lg bg-muted" />
      </div>
    </div>
  </div>
);
