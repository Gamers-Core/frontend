'use client';

import { useEffect, useState } from 'react';

import { useFormatDate } from './useFormat';
import { useMounted } from './useMounted';

interface CountdownOptions {
  format: string;
}

export const useCountDown = (expiresAt: string, { format = 'HH:mm:ss' }: Partial<CountdownOptions> = {}) => {
  const [expiresAtDate] = useState(() => new Date(expiresAt));

  const [countdown, setCountdown] = useState(() => Math.max(+expiresAtDate - +new Date(), 0));

  const formatDate = useFormatDate();

  const mounted = useMounted();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev < 1000) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const totalSeconds = Math.floor(countdown / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (!mounted)
    return {
      date: expiresAtDate,
      formatted: formatDate(expiresAtDate, format),
      parts: { days, hours, minutes, seconds: 0 },
      totalSeconds,
    };

  return {
    date: new Date(countdown),
    formatted: formatDate(countdown, format),
    parts: { days, hours, minutes, seconds },
    totalSeconds,
  };
};
