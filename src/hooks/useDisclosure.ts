'use client';

import { useCallback, useState } from 'react';

interface DisclosureOptions {
  defaultIsOpen?: boolean;
}

export const useDisclosure = ({ defaultIsOpen = false }: DisclosureOptions = {}) => {
  const [open, setOpen] = useState(defaultIsOpen);

  return {
    open,
    onOpen: useCallback(() => setOpen(true), []),
    onClose: useCallback(() => setOpen(false), []),
    onToggle: useCallback(() => setOpen((prev) => !prev), []),
  };
};

export type Disclosure = ReturnType<typeof useDisclosure>;
