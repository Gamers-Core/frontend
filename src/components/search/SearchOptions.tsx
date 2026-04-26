'use client';

import { useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { X } from '@hugeicons/core-free-icons';
import { useTranslations } from 'next-intl';

import { SearchSchema } from '@/api';
import { useDebounce, useSearchParams } from '@/hooks';

import { Input } from '../ui';
import { Button } from '../Button';
import { FiltersDrawer } from './FiltersDrawer';

interface SearchOptionsProps {
  searchParams?: SearchSchema;
}

const defaultOptions: SearchSchema = {
  q: '',
};

export const SearchOptions = ({ searchParams }: SearchOptionsProps) => {
  const [options, setOptions] = useState({ ...defaultOptions, ...searchParams });
  const t = useTranslations();

  const { set } = useSearchParams();
  const debouncedOptions = useDebounce(options, 700);

  useEffect(() => {
    set(debouncedOptions, 'replace');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedOptions]);

  const setSearchOptions = ({ stock, sort, ...newOptions }: Partial<SearchSchema>) => {
    const stockValue = stock === 'all' ? undefined : stock;
    const sortValue = sort === 'created-descending' ? undefined : sort;

    set({ ...options, ...newOptions, stock: stockValue, sort: sortValue }, 'replace');
    setOptions((prev) => ({ ...prev, ...newOptions, stock: stockValue, sort: sortValue }));
  };

  return (
    <section className="flex bg-sidebar-border p-4 gap-4 rounded-lg">
      <div className="relative flex-1">
        <Input
          value={options.q ?? ''}
          onChange={(e) => setOptions({ q: e.target.value })}
          placeholder={t('search_placeholder')}
          className="w-full min-h-10 p-2 px-3 text-sm/relaxed md:text-base/relaxed bg-accent"
        />

        {options.q && (
          <Button
            variant="ghost"
            icon={<HugeiconsIcon icon={X} />}
            className="absolute top-1 inset-e-1"
            onClick={() => setSearchOptions({ q: '' })}
          />
        )}
      </div>

      <FiltersDrawer options={options} setOptions={setSearchOptions} />
    </section>
  );
};
