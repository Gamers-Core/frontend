'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { UserReview } from '@/api';
import { useUserReviewsQuery } from '@/hooks';
import { formatMedia } from '@/helpers';

import { Link } from '../Link';

export const UserReviews = () => {
  const t = useTranslations();

  const userReviewsQuery = useUserReviewsQuery();

  if (!userReviewsQuery.data?.length) return null;

  return (
    <section className="md:container flex flex-col w-full py-10 gap-15 text-center items-center transition-colors duration-300 px-5">
      <div className="flex flex-col gap-2 md:gap-4 xl:gap-6">
        <h2 className="text-center text-4xl md:text-5xl xl:text-6xl font-bold">{t('home_reviews_title')}</h2>

        <p className="text-center text-xl md:text-2xl xl:text-3xl text-gray-500">{t('home_reviews_subtitle')}</p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-5">
          {userReviewsQuery.data.map((review, index) => (
            <UserReviewCard key={index} {...review} />
          ))}
        </div>

        <Link
          href="https://www.facebook.com/profile.php?id=100092936143868&sk=reviews"
          title={t('home_reviews_view_more')}
          target="_blank"
          className="text-primary hover:underline w-fit text-lg md:text-xl lg:text-2xl h-auto px-4 py-2 md:px-6 md:py-4 bg-accent rounded-lg font-bold transition-colors duration-300"
        >
          {t('home_reviews_view_more')}
        </Link>
      </div>
    </section>
  );
};

const UserReviewCard = ({ facebookURL, image }: UserReview) => {
  const t = useTranslations();

  return (
    <Link
      href={facebookURL}
      title={t('title_click_to_view')}
      target="_blank"
      className="block p-2 flex-1 md:min-w-110 md:max-w-160 bg-border rounded-lg"
    >
      <div className="rounded-lg overflow-hidden">
        <Image {...formatMedia(image)} alt="user Review" fetchPriority="high" className="w-full" />
      </div>
    </Link>
  );
};
