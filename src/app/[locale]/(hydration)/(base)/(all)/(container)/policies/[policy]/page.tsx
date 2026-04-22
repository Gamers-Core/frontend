import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PagePropsWithParams } from '@/app/types';
import { policies, PolicyType } from '@/api';
import { PolicyBody, PolicyHeader } from '@/components';

type PageParams = PagePropsWithParams<{ policy: string }>;

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const policy = (await params).policy;
  if (!policy) return notFound();

  return {
    title: `Gamers Core | ${policy}`,
    description: `View ${policy} policy of Gamers Core`,
  };
}

export default async function Policy({ params }: PageParams) {
  const policy = (await params).policy.toLowerCase() as PolicyType;

  if (!policy || !policies.includes(policy)) return notFound();

  return (
    <>
      <PolicyHeader policyType={policy} />

      <PolicyBody policyType={policy} />
    </>
  );
}
