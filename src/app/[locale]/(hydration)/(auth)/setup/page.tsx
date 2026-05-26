import { Metadata } from 'next';
import { QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { AuthHeader, SetupAccountForm } from '@/components';
import { useMeQuery } from '@/hooks';
import { PagePropsWithSearchParams } from '@/app/types';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t('page_setup_title'),
    description: t('page_setup_description'),
  };
}

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

  const from = searchParams?.from;

  if (me?.name) {
    if (!from) redirect('/');

    return redirect(from);
  }

  return (
    <>
      <AuthHeader title="setup_account_title" subtitle="setup_account_subtitle" />

      <SetupAccountForm from={from} />
    </>
  );
}
