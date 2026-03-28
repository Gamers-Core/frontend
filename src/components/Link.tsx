import type { ComponentProps } from 'react';
import NextLink from 'next/link';

import { getSearchParams } from '@/helpers';
import { cn } from '@/lib/utils';

import { Button } from './Button';

type NextLinkProps = ComponentProps<typeof NextLink>;

interface LinkProps extends NextLinkProps {
  keepSearchParams?: boolean;
  isDisabled?: boolean;
}

export const Link = ({ keepSearchParams, isDisabled, className, children, ...props }: LinkProps) => {
  const searchParams = getSearchParams();

  const href = keepSearchParams ? `${props.href}?${searchParams}` : props.href;

  if (isDisabled)
    return (
      <Button isDisabled className={cn('bg-transparent p-0 min-h-0 h-auto min-w-0 w-auto', className)}>
        {children}
      </Button>
    );

  return (
    <NextLink className={cn(className)} {...props} href={href}>
      {children}
    </NextLink>
  );
};
