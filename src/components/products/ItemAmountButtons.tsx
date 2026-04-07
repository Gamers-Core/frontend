'use client';

import { useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { MinusSignFreeIcons, PlusSignFreeIcons } from '@hugeicons/core-free-icons';

import { Variant } from '@/api';
import { useFormatNumber } from '@/hooks';
import { cn } from '@/lib/utils';

import { Button } from '../Button';

interface ItemAmountButtonsProps {
  variant: Variant;
  amount: number;
  setAmount: (amount: number | ((prev: number) => number)) => void;
}

export const ItemAmountButtons = ({ variant, amount, setAmount }: ItemAmountButtonsProps) => {
  const formatNumber = useFormatNumber();

  useEffect(() => {
    setAmount(1);
  }, [variant.externalId, setAmount]);

  const onIncrease = () => setAmount((prev) => Math.min(variant.stock, prev + 1));
  const onDecrease = () => setAmount((prev) => Math.max(1, prev - 1));

  const canIncrease = amount < variant.stock;
  const canDecrease = amount > 1;

  return (
    <div className="flex bg-ring/40 dark:bg-background rounded-lg gap-1 min-h-14 w-fit p-1">
      <AmountButton icon={<HugeiconsIcon icon={MinusSignFreeIcons} />} isDisabled={!canDecrease} onClick={onDecrease} />

      <p className="text-lg font-normal select-none flex items-center justify-center w-5">{formatNumber(amount)}</p>

      <AmountButton icon={<HugeiconsIcon icon={PlusSignFreeIcons} />} isDisabled={!canIncrease} onClick={onIncrease} />
    </div>
  );
};

interface AmountButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  isDisabled?: boolean;
}

const AmountButton = (props: AmountButtonProps) => (
  <Button
    variant="ghost"
    {...props}
    className={cn('h-auto flex-1 px-4 text-2xl', { 'cursor-not-allowed pointer-events-auto': props.isDisabled })}
  />
);
