'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { MinusSignFreeIcons, PlusSignFreeIcons } from '@hugeicons/core-free-icons';
import { useTranslations } from 'next-intl';

import { useFormatNumber } from '@/hooks';
import { cn } from '@/lib/utils';

import { Button } from '../Button';

interface ItemAmountButtonsProps {
  variant: {
    externalId: string;
    stock: number;
  };
  amount: number;
  setAmount: (amount: number | ((prev: number) => number)) => void;
}

export const ItemAmountButtons = ({ variant, amount, setAmount }: ItemAmountButtonsProps) => {
  const t = useTranslations();

  const formatNumber = useFormatNumber();

  const onIncrease = () => setAmount((prev) => Math.min(variant.stock, prev + 1));
  const onDecrease = () => setAmount((prev) => Math.max(1, prev - 1));

  const canIncrease = amount < variant.stock;
  const canDecrease = amount > 1;

  return (
    <div className="flex bg-ring/40 dark:bg-background rounded-lg gap-1 min-h-14 w-fit p-1">
      <AmountButton
        title={t('title_decrease_amount')}
        icon={<HugeiconsIcon icon={MinusSignFreeIcons} />}
        isDisabled={!canDecrease}
        onClick={onDecrease}
      />

      <p
        className={cn('text-lg font-normal select-none flex items-center justify-center w-5', {
          'text-muted-foreground': variant.stock === 0,
        })}
      >
        {formatNumber(Math.min(amount, variant.stock))}
      </p>

      <AmountButton
        title={t(canIncrease ? 'title_increase_amount' : 'title_max_stock_reached')}
        icon={<HugeiconsIcon icon={PlusSignFreeIcons} />}
        isDisabled={!canIncrease}
        onClick={onIncrease}
      />
    </div>
  );
};

interface AmountButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  isDisabled?: boolean;
  title?: string;
}

const AmountButton = (props: AmountButtonProps) => (
  <Button
    variant="ghost"
    {...props}
    className={cn('h-auto flex-1 px-4 text-2xl', { 'cursor-not-allowed pointer-events-auto': props.isDisabled })}
  />
);
