import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AuthHeader, VerifyOTPForm } from '@/components';
import { PagePropsWithSearchParams } from '@/app/types';

export const metadata: Metadata = {
  title: 'Gamers Core | Verify OTP',
  description: 'Verify your OTP to complete the sign-in process.',
};

export default async function Page(props: PagePropsWithSearchParams<{ sessionId: string }>) {
  const searchParams = await props.searchParams;

  const sessionId = searchParams.sessionId;

  if (!sessionId) redirect('/signin');

  return (
    <>
      <AuthHeader title="verify_otp_title" subtitle="verify_otp_subtitle" />

      <VerifyOTPForm sessionId={sessionId} />
    </>
  );
}
