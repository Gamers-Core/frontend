'use client';

import { PolicyType } from '@/api';
import { usePoliciesQuery } from '@/hooks';

import { HTMLRender } from '../HTMLRender';

interface PolicyBodyProps {
  policyType: PolicyType;
}

export const PolicyBody = ({ policyType }: PolicyBodyProps) => {
  const policiesQuery = usePoliciesQuery();

  if (!policiesQuery.data) return null;

  const currentPolicyHTML = policiesQuery.data[policyType].value;

  return <PolicyBodyHTML html={currentPolicyHTML} className="flex flex-col bg-sidebar-border p-4 gap-6 rounded-lg" />;
};

const PolicyBodyHTML = HTMLRender('PolicyBody');
