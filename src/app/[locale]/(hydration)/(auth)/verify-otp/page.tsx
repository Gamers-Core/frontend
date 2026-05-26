import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { AuthHeader, VerifyOTPForm } from '@/components';
import { PagePropsWithSearchParams } from '@/app/types';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t('page_verify_otp_title'),
    description: t('page_verify_otp_description'),
  };
}

export default async function Page(props: PagePropsWithSearchParams<{ sessionId: string; from?: string }>) {
  const searchParams = await props.searchParams;

  const sessionId = searchParams.sessionId;
  const from = searchParams.from;

  const params = new URLSearchParams();
  if (from) params.append('from', from);

  if (!sessionId) redirect(`/signin?${params.toString()}`);

  return (
    <>
      <AuthHeader title="verify_otp_title" subtitle="verify_otp_subtitle" />

      <VerifyOTPForm sessionId={sessionId} from={from} />
    </>
  );
}
