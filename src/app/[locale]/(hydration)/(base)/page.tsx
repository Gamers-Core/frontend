import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { FeaturedProducts, Hero, TopBar, UserReviews } from '@/components';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t('page_home_title'),
    description: t('page_home_description'),
  };
}

export default async function Home() {
  return (
    <>
      <TopBar isHome />

      <main className="flex-1 w-full">
        <Hero />

        <FeaturedProducts />

        <UserReviews />
      </main>
    </>
  );
}
