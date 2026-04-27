'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { useBrandsQuery } from '@/hooks';

import { Link } from '../Link';

export const BrandsBody = () => {
  const t = useTranslations();

  const brandsQuery = useBrandsQuery();

  if (!brandsQuery.data || brandsQuery.data.length === 0)
    return (
      <p className="m-auto text-center text-muted-foreground text-lg md:text-xl lg:text-2xl">{t('brands_empty')}</p>
    );

  return (
    <section className="flex-1 bg-sidebar-border p-4 rounded-lg">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
        {brandsQuery.data.map(({ id, image, name }) => (
          <Link
            href={`/search?brandId=${id}`}
            key={id}
            className="flex flex-col items-center gap-4 hover:text-sidebar-primary transition-colors duration-300"
          >
            <div className="w-full h-full flex flex-col justify-center items-center bg-white dark:bg-border rounded-lg p-2 aspect-video">
              <Image
                {...image}
                src={image.url}
                alt={name}
                className="h-full w-full object-contain rounded-lg overflow-hidden"
              />
            </div>

            <h3 className="text-lg md:text-xl lg:text-2xl font-medium">{name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};
