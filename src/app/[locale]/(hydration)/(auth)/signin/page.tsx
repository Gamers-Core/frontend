import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { AuthHeader, SigninForm } from '@/components';
import { PagePropsWithSearchParams } from '@/app/types';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t('page_signin_title'),
    description: t('page_signin_description'),
  };
}

export default async function Page(props: PagePropsWithSearchParams<{ from: string }>) {
  const searchParams = await props.searchParams;
  const from = searchParams.from;

  return (
    <>
      <AuthHeader title="signin_title" subtitle="signin_subtitle" />

      <SigninForm from={from} />
    </>
  );
}
