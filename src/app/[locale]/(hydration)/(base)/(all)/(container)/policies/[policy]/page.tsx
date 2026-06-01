import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { PagePropsWithParams } from '@/app/types';
import { policies, PolicyType } from '@/api';
import { PolicyBody, PolicyHeader } from '@/components';
import { QueryClient } from '@tanstack/react-query';
import { usePoliciesQuery } from '@/hooks';

type PageParams = PagePropsWithParams<{ policy: string }>;

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const policy = (await params).policy;
  if (!policy) return notFound();

  const normalizedPolicy = policy.toLowerCase() as PolicyType;
  if (!policies.includes(normalizedPolicy)) return notFound();

  const t = await getTranslations();
  const policyTitle = t(`policy_${normalizedPolicy}`);

  return {
    title: t('page_policy_title', { policy: policyTitle }),
    description: t('page_policy_description', { policy: policyTitle }),
  };
}

export default async function Policy({ params }: PageParams) {
  const policy = (await params).policy.toLowerCase() as PolicyType;

  if (!policy || !policies.includes(policy)) return notFound();

  const queryClient = new QueryClient();
  const [policiesResult] = await Promise.allSettled([queryClient.fetchQuery(usePoliciesQuery)]);

  if (policiesResult.status === 'rejected' || !policiesResult.value[policy].value) return notFound();

  return (
    <>
      <PolicyHeader policyType={policy} />

      <PolicyBody policyType={policy} />
    </>
  );
}
