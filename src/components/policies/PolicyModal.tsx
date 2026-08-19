'use client';

import { useTranslations } from 'next-intl';
import { HugeiconsIcon } from '@hugeicons/react';
import { HelpCircleFreeIcons } from '@hugeicons/core-free-icons';

import { PolicyType } from '@/api';
import { useFormatDate, usePoliciesQuery, useDisclosure } from '@/hooks';

import { Modal } from '../Modal';
import { Button } from '../Button';
import { HTMLRender } from '../HTMLRender';

interface PolicyModalProps {
  policyType: PolicyType;
}

export const PolicyModal = ({ policyType }: PolicyModalProps) => {
  const t = useTranslations();
  const formatDate = useFormatDate();

  const policiesQuery = usePoliciesQuery();
  const policyDisclosure = useDisclosure();

  if (!policiesQuery.data) return null;

  const policy = policiesQuery.data[policyType];

  return (
    <>
      <Button
        variant="outline"
        icon={<HugeiconsIcon icon={HelpCircleFreeIcons} />}
        onClick={policyDisclosure.onOpen}
        aria-label={t(`policy_${policyType}`)}
      />

      <Modal
        title={t(`policy_${policyType}`)}
        description={`${t('last_updated_at')} ${formatDate(policy.updatedAt, 'dd/MM/yyyy hh:mm a')}`}
        {...policyDisclosure}
      >
        <PolicyBodyHTML html={policy.value} className="flex-1 min-h-0" />
      </Modal>
    </>
  );
};

const PolicyBodyHTML = HTMLRender('PolicyBody');
