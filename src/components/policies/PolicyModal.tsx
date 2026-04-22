'use client';

import { useTranslations } from 'next-intl';
import { HugeiconsIcon } from '@hugeicons/react';
import { HelpCircleFreeIcons, X } from '@hugeicons/core-free-icons';

import { Policy, PolicyType } from '@/api';
import { Disclosure, useBreakpoint, useDisclosure, useFormatDate, usePoliciesQuery } from '@/hooks';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '../ui';
import { Button } from '../Button';
import { HTMLRender } from '../HTMLRender';

interface PolicyModalProps {
  policyType: PolicyType;
}

export const PolicyModal = ({ policyType }: PolicyModalProps) => {
  const t = useTranslations();

  const { isMobile } = useBreakpoint();

  const policiesQuery = usePoliciesQuery();
  const policyDisclosure = useDisclosure();

  if (!policiesQuery.data) return null;

  const policy = policiesQuery.data[policyType];

  const Component = isMobile ? PolicyDrawer : PolicyDialog;

  return (
    <>
      <Button
        variant="outline"
        icon={<HugeiconsIcon icon={HelpCircleFreeIcons} />}
        onClick={policyDisclosure.onOpen}
        aria-label={t(`policy_${policyType}`)}
      />

      <Component policyType={policyType} policy={policy} {...policyDisclosure} />
    </>
  );
};

interface PolicyProps extends Disclosure {
  policyType: PolicyType;
  policy: Policy;
}

const PolicyDrawer = ({ policyType, policy, ...disclosure }: PolicyProps) => {
  const t = useTranslations();

  const formatDate = useFormatDate();

  return (
    <Drawer direction="bottom" {...disclosure}>
      <DrawerContent className="bg-transparent before:backdrop-blur-lg before:bg-popover/60 h-full">
        <DrawerHeader className="flex flex-row justify-between items-center">
          <div className="flex flex-col gap-2">
            <DrawerTitle className="text-xl font-bold text-start">{t(`policy_${policyType}`)}</DrawerTitle>

            <DrawerDescription>
              <span className="text-xs font-medium text-muted-foreground/60">{t('last_updated_at')}</span>

              <span className="text-xs font-semibold text-muted-foreground">
                {formatDate(policy.updatedAt, 'dd/MM/yyyy hh:mm a')}
              </span>
            </DrawerDescription>
          </div>

          <DrawerClose asChild>
            <Button icon={<HugeiconsIcon icon={X} />} variant="outline" aria-label={t('close')} />
          </DrawerClose>
        </DrawerHeader>

        <PolicyBodyHTML html={policy.value} className="px-4 overflow-y-auto" />
      </DrawerContent>
    </Drawer>
  );
};

const PolicyDialog = ({ policyType, policy, ...disclosure }: PolicyProps) => {
  const t = useTranslations();

  const formatDate = useFormatDate();

  return (
    <Dialog {...disclosure}>
      <DialogContent showCloseButton={false} className="sm:max-w-md md:max-w-2xl">
        <DialogHeader className="flex flex-row justify-between items-center">
          <div className="flex flex-col gap-2">
            <DialogTitle className="text-xl">{t(`policy_${policyType}`)}</DialogTitle>

            <DialogDescription className="text-destructive">
              <span className="text-base font-medium text-muted-foreground/60">{t('last_updated_at')}</span>

              <span className="text-base font-semibold text-muted-foreground">
                {formatDate(policy.updatedAt, 'dd/MM/yyyy hh:mm a')}
              </span>
            </DialogDescription>
          </div>

          <DialogClose asChild>
            <Button icon={<HugeiconsIcon icon={X} />} variant="outline" aria-label={t('close')} />
          </DialogClose>
        </DialogHeader>

        <PolicyBodyHTML html={policy.value} className="max-h-[50vh] overflow-y-auto" />
      </DialogContent>
    </Dialog>
  );
};

const PolicyBodyHTML = HTMLRender('PolicyBody');
