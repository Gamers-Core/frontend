'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';
import { ArrowDown } from '@hugeicons/core-free-icons';
import Image from 'next/image';

import { Button } from '../Button';

export const Hero = () => {
  const t = useTranslations();

  return (
    <section className="relative h-svh w-full">
      <Image
        src="/assets/hero.jpg"
        alt="hero"
        className="size-full object-cover brightness-60 select-none"
        fill
        priority
        fetchPriority="high"
        loading="eager"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-between p-4 pt-40 pb-16 text-center">
        <div className="flex flex-col items-center justify-center gap-4 rtl:gap-8">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-accent dark:text-accent-foreground transition-colors duration-300">
            {t('home_hero_title')}
          </h1>

          <p className="text-2xl lg:text-3xl font-semibold text-gray-300 text-stroke rtl:text-3xl lg:rtl:text-4xl rtl:text-stroke-0 transition-colors duration-300">
            {t('home_hero_subtitle')}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 text-white">
          <p className="text-xl lg:text-2xl rtl:text-2xl rtl:lg:text-3xl transition-colors duration-300">
            {t('home_hero_cta')}
          </p>

          <Button
            icon={<HugeiconsIcon icon={ArrowDown} className="size-10 lg:size-12" />}
            onClick={() =>
              document.querySelector('#featured-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
            variant="ghost"
            className="p-1 h-auto animate-ping animation-duration-1800 hover:animate-none hover:text-primary transition-colors duration-300 hover:scale-110 hover:bg-transparent!"
          />
        </div>
      </div>
    </section>
  );
};
