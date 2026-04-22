import type { ComponentProps } from 'react';

import { Link as NextLink } from '@/i18n';
import { getSearchParams, isClient } from '@/helpers';
import { cn } from '@/lib/utils';

import { Button } from './Button';

type NextLinkProps = ComponentProps<typeof NextLink>;

export interface LinkProps extends NextLinkProps {
  keepSearchParams?: boolean;
  isDisabled?: boolean;
}

export const Link = ({ keepSearchParams, isDisabled, className, children, ...props }: LinkProps) => {
  const searchParams = getSearchParams();

  const href = keepSearchParams ? `${props.href}?${searchParams}` : props.href;
  const isCurrent = isClient() && props.href === window.location.pathname;

  if (isDisabled)
    return (
      <Button
        isDisabled
        variant="ghost"
        className={cn('bg-transparent text-start p-0 min-h-0 h-auto min-w-0 w-auto', className)}
      >
        {children}
      </Button>
    );

  return (
    <NextLink
      onClick={() => isCurrent && document.querySelector('html')?.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(className)}
      {...props}
      href={href}
    >
      {children}
    </NextLink>
  );
};
