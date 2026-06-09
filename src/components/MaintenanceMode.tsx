'use client';

import { useTranslations } from 'next-intl';
import { HugeiconsIcon } from '@hugeicons/react';
import { Settings } from '@hugeicons/core-free-icons';

import { useAppSettingsQuery, useCountDown, useFormatNumber } from '@/hooks';

export const MaintenanceMode = () => {
  const { data } = useAppSettingsQuery();

  if (!data?.maintenanceMode.enabled) return null;

  const { message, countdown } = data.maintenanceMode;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 text-center">
      <div className="flex items-center justify-center size-24 rounded-full border border-border">
        <HugeiconsIcon icon={Settings} className="size-10 text-muted-foreground animate-[spin_10s_linear_infinite]" />
      </div>

      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-semibold max-w-xl">{message}</h1>

        {countdown && <Countdown expiresAt={countdown} />}
      </div>
    </div>
  );
};

interface CountdownProps {
  expiresAt: string;
}

const Countdown = ({ expiresAt }: CountdownProps) => {
  const t = useTranslations();
  const formatNumber = useFormatNumber();

  const {
    parts: { days, hours, minutes, seconds },
    totalSeconds,
  } = useCountDown(expiresAt);

  const units = [
    { key: 'day', value: days },
    { key: 'hour', value: hours },
    { key: 'minute', value: minutes },
    { key: 'second', value: seconds },
  ] as const;

  if (totalSeconds <= 0) return null;

  const visible = units.slice(units.findIndex((u) => u.value > 0));
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-lg text-muted-foreground">{t('maintenance_back_in')}</p>

      <div className="flex gap-3 flex-wrap justify-center">
        {visible.map(({ value, key }) => (
          <div key={key} className="flex flex-col gap-1 items-center bg-muted border rounded-xl px-5 py-4 min-w-24">
            <p className="text-3xl font-medium leading-none">{formatNumber(value, { minimumIntegerDigits: 2 })}</p>

            <p className="text-sm text-muted-foreground">{t(`countdown_${key}`, { count: value })}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
