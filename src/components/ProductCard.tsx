import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { useFormatCurrency } from '@/hooks';
import { Brand, Category } from '@/api';
import { cn } from '@/lib/utils';

import { Link } from './Link';

interface ProductCardProps {
  id: number;
  imageURL: string;
  name: string;
  price: { min: number; max: number; sale: boolean } | { value: number; compareAt: number | null };
  brand: Brand;
  category: Category;
  hasStock?: boolean;
  className?: string;
}

export const ProductCard = ({
  id,
  imageURL,
  name,
  price,
  brand,
  category,
  hasStock = true,
  className,
}: ProductCardProps) => {
  const t = useTranslations();

  const formatCurrency = useFormatCurrency();

  const hasCompareAt = 'compareAt' in price && price.compareAt !== null;
  const hasSale = 'sale' in price && price.sale;

  return (
    <Link
      href={`/products/${id}`}
      className={cn('flex flex-col relative gap-4 min-w-60 md:min-w-75 w-60 md:w-75', className)}
    >
      <div className="relative flex flex-col justify-center items-center bg-white dark:bg-border aspect-square rounded-lg p-2">
        <Image
          src={imageURL}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="static! h-auto! w-full object-contain rounded-lg overflow-hidden"
        />
      </div>

      <div className="flex flex-col">
        <div>
          <span className="text-sm text-sidebar-primary uppercase">{brand.name}</span>

          <span> {t('slash')} </span>

          <span className="text-xs text-muted-foreground/50 capitalize">{category.name}</span>
        </div>

        <h4 className="text-lg">{name}</h4>

        {'value' in price ? (
          <div className="flex gap-2 items-center">
            <p className="text-md text-sidebar-primary font-semibold">{formatCurrency(price.value)}</p>

            <p className="text-sm lg:text-base xl:text-lg line-through text-sidebar-primary/70">
              {price.compareAt && formatCurrency(price.compareAt)}
            </p>
          </div>
        ) : (
          <div className="flex gap-1 items-center text-sidebar-primary">
            <p className="text-md font-semibold">{formatCurrency(price.min)}</p>
            {price.min !== price.max && (
              <>
                <span className="text-foreground">-</span>
                <p className="text-md font-semibold">{formatCurrency(price.max)}</p>
              </>
            )}
          </div>
        )}
      </div>

      {(!hasStock || hasCompareAt || hasSale) && (
        <span className="absolute top-2.5 inset-e-2.5 text-foreground bg-muted dark:bg-background text-xs md:text-sm px-3 py-1.5 rounded-full font-bold transition-colors duration-300">
          {!hasStock ? t('sold_out') : hasCompareAt || hasSale ? t('sale') : null}
        </span>
      )}
    </Link>
  );
};
