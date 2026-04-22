'use client';

import { useTranslations } from 'next-intl';

import { useFormatDate, usePoliciesQuery } from '@/hooks';
import { PolicyType } from '@/api';

interface PolicyHeaderProps {
  policyType: PolicyType;
}

export const PolicyHeader = ({ policyType }: PolicyHeaderProps) => {
  const t = useTranslations();

  const formatDate = useFormatDate();

  const policiesQuery = usePoliciesQuery();

  if (!policiesQuery.data) return null;

  const currentPolicyUpdateAtDate = policiesQuery.data[policyType].updatedAt;

  return (
    <header className="flex flex-col gap-2 rtl:gap-6 text-center">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">{t(`policy_${policyType}`)}</h2>

      <p className="sm:text-lg md:text-xl lg:text-2xl">
        <span className="font-medium text-muted-foreground/60">{t('last_updated_at')}</span>

        <span className="font-semibold text-muted-foreground">
          {formatDate(currentPolicyUpdateAtDate, 'dd/MM/yyyy hh:mm a')}
        </span>
      </p>
    </header>
  );
};
