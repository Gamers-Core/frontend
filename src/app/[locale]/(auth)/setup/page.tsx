import { Metadata } from 'next';
import { QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { AuthHeader, SetupAccountForm } from '@/components';
import { useMeQuery } from '@/hooks';
import { PagePropsWithSearchParams } from '@/app/types';

export const metadata: Metadata = {
  title: 'Gamers Core | Setup Your Account',
  description:
    'Set up your Gamers Core account by providing your name to access personalized features and exclusive deals.',
};

export default async function Page(props: PagePropsWithSearchParams<{ from: string }>) {
  const searchParams = await props.searchParams;
  const queryClient = new QueryClient();

  const [me] = await Promise.all([
    queryClient
      .fetchQuery({
        queryKey: useMeQuery.queryKey(false),
        queryFn: useMeQuery.queryFn,
      })
      .catch(() => null),
  ]);

  const from = searchParams.from || '/';

  if (me?.name) {
    if (!from) redirect('/');

    return redirect(decodeURIComponent(from));
  }

  return (
    <>
      <AuthHeader title="setup_account_title" subtitle="setup_account_subtitle" />

      <SetupAccountForm />
    </>
  );
}
