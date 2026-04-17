import { Metadata } from 'next';

import { AuthHeader, SigninForm } from '@/components';
import { PagePropsWithSearchParams } from '@/app/types';

export const metadata: Metadata = {
  title: 'Gamers Core | Sign In',
  description: 'Sign in to your Gamers Core account to access exclusive deals and personalized recommendations.',
};

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
