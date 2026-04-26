'use client';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { HugeiconsIcon } from '@hugeicons/react';
import { Filter, X } from '@hugeicons/core-free-icons';

import { useBrandsQuery, useBreakpoint, useCategoriesQuery, useDisclosure, useFormatNumber } from '@/hooks';
import { filtersSchema, SearchSchema, sortOptions, stockFilters, type FiltersSchema } from '@/api';
import { cn } from '@/lib/utils';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  Separator,
} from '../ui';
import { Button } from '../Button';

const defaultSearchValues: FiltersSchema = {
  brandId: '',
  categoryId: '',
  minPrice: '',
  maxPrice: '',
  stock: 'all',
  sort: 'created-descending',
};

interface FiltersDrawerProps {
  options: SearchSchema;
  setOptions: (options: SearchSchema) => void;
}

export const FiltersDrawer = ({ options, setOptions }: FiltersDrawerProps) => {
  const t = useTranslations();
  const locale = useLocale();

  const { isMobile } = useBreakpoint();
  const disclosure = useDisclosure();
  const formatNumber = useFormatNumber();

  const form = useForm<FiltersSchema>({
    defaultValues: options,
    mode: 'onChange',
    resolver: zodResolver(filtersSchema(t)),
  });

  const brandsQuery = useBrandsQuery();
  const categoriesQuery = useCategoriesQuery();

  const direction = isMobile ? 'bottom' : locale === 'ar' ? 'left' : 'right';

  const onSubmit: SubmitHandler<FiltersSchema> = async (data) => {
    setOptions(data);
    form.reset(data);
    disclosure.onClose();
  };
  const onClose = () => {
    if (!form.formState.isValid) return form.reset(options);

    onSubmit(form.getValues());
  };

  const filtersCount = Object.keys(defaultSearchValues).filter((key) => {
    const filterKey = key as keyof FiltersSchema;

    return typeof options[filterKey] !== 'undefined' && options[filterKey] !== defaultSearchValues[filterKey];
  }).length;

  const minPrice = form.watch('minPrice') || '0';

  return (
    <>
      <Button
        variant="outline"
        icon={<HugeiconsIcon icon={Filter} className="rtl:rotate-y-180" />}
        onClick={disclosure.onOpen}
        aria-label={t('filters')}
        className="relative h-auto aspect-square bg-accent dark:border-sidebar-border hover:bg-accent/50 transition-colors duration-300"
      >
        {filtersCount > 0 && (
          <p className="absolute -top-2 -inset-e-2 bg-primary text-primary-foreground text-sm rounded-full h-4 min-w-4 px-1.5 flex items-center justify-center">
            {formatNumber(filtersCount)}
          </p>
        )}
      </Button>

      <Drawer direction={direction} {...disclosure} onClose={onClose}>
        <DrawerContent className="bg-transparent before:backdrop-blur-lg before:bg-popover/60 h-full">
          <DrawerHeader className="flex flex-row justify-between items-center">
            <div className="flex flex-col gap-2">
              <DrawerTitle className="text-xl font-bold text-start">{t('filters')}</DrawerTitle>

              <DrawerDescription className="hidden" />
            </div>

            <DrawerClose asChild>
              <Button icon={<HugeiconsIcon icon={X} />} variant="outline" aria-label={t('close')} onClick={onClose} />
            </DrawerClose>
          </DrawerHeader>

          <form className="flex-1 flex flex-col gap-4 min-h-0" onSubmit={form.handleSubmit(onSubmit, console.warn)}>
            <Accordion type="multiple" className="border-0 px-4 overflow-y-auto gap-4 flex-1 flex-col">
              <AccordionItem
                value="brand"
                className="bg-sidebar-border p-4 gap-6 rounded-lg transition-colors duration-300"
              >
                <AccordionTrigger className="text-lg">{t('brand')}</AccordionTrigger>

                <Controller
                  control={form.control}
                  name="brandId"
                  render={({ field }) => (
                    <AccordionContent className="flex flex-wrap gap-2">
                      {brandsQuery.data?.map(({ name, id }) => (
                        <SelectButton
                          key={id}
                          onChange={field.onChange}
                          value={id.toString()}
                          isCurrent={field.value === id.toString()}
                        >
                          {name}
                        </SelectButton>
                      ))}
                    </AccordionContent>
                  )}
                />
              </AccordionItem>

              <AccordionItem
                value="category"
                className="bg-sidebar-border p-4 gap-6 rounded-lg transition-colors duration-300"
              >
                <AccordionTrigger className="text-lg">{t('category')}</AccordionTrigger>

                <Controller
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <AccordionContent className="flex flex-wrap gap-2">
                      {categoriesQuery.data?.map(({ name, id }) => (
                        <SelectButton
                          key={id}
                          onChange={field.onChange}
                          value={id.toString()}
                          isCurrent={field.value === id.toString()}
                        >
                          {name}
                        </SelectButton>
                      ))}
                    </AccordionContent>
                  )}
                />
              </AccordionItem>

              <AccordionItem
                value="price_range"
                className="bg-sidebar-border p-4 gap-6 rounded-lg transition-colors duration-300"
              >
                <AccordionTrigger className="text-lg">{t('price_range')}</AccordionTrigger>

                <AccordionContent>
                  <FieldGroup className="w-full flex flex-col gap-4">
                    <Controller
                      control={form.control}
                      name="minPrice"
                      render={({ field, fieldState }) => (
                        <Field>
                          <div className="flex items-center justify-between">
                            <FieldLabel htmlFor="min_price" className="text-xs md:text-xs">
                              {t('price_range_min')}
                            </FieldLabel>

                            {fieldState.invalid && (
                              <FieldError className="text-xs/normal md:text-xs/relaxed" errors={[fieldState.error]} />
                            )}
                          </div>

                          <InputGroup className="h-10">
                            <InputGroupInput
                              id="min_price"
                              placeholder={t('price_range_min_placeholder')}
                              type="number"
                              min={1}
                              autoComplete="off"
                              aria-invalid={fieldState.invalid}
                              {...field}
                              value={field.value ?? ''}
                              className="sm:text-base md:text-base"
                            />

                            <InputGroupAddon align="inline-end">
                              <InputGroupText>{t('egp')}</InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name="maxPrice"
                      render={({ field, fieldState }) => (
                        <Field>
                          <div className="flex items-center justify-between">
                            <FieldLabel htmlFor="max_price" className="text-xs md:text-xs">
                              {t('price_range_max')}
                            </FieldLabel>

                            {fieldState.invalid && (
                              <FieldError className="text-xs/normal md:text-xs/relaxed" errors={[fieldState.error]} />
                            )}
                          </div>

                          <InputGroup className="h-10">
                            <InputGroupInput
                              id="max_price"
                              placeholder={t('price_range_max_placeholder')}
                              type="number"
                              min={minPrice}
                              autoComplete="off"
                              aria-invalid={fieldState.invalid}
                              {...field}
                              value={field.value ?? ''}
                              className="sm:text-base md:text-base"
                            />

                            <InputGroupAddon align="inline-end">
                              <InputGroupText>{t('egp')}</InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="stock"
                className="bg-sidebar-border p-4 gap-6 rounded-lg transition-colors duration-300"
              >
                <AccordionTrigger className="text-lg">{t('stock')}</AccordionTrigger>

                <Controller
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <AccordionContent className="flex flex-wrap gap-2">
                      {stockFilters.slice(1, 3).map((stockFilter) => (
                        <SelectButton
                          key={stockFilter}
                          onChange={(value) => field.onChange(value === '' ? 'all' : value)}
                          value={stockFilter}
                          isCurrent={field.value === stockFilter}
                        >
                          {t(`stock_${stockFilter}`)}
                        </SelectButton>
                      ))}
                    </AccordionContent>
                  )}
                />
              </AccordionItem>

              <AccordionItem
                value="sort_by"
                className="bg-sidebar-border p-4 gap-6 rounded-lg transition-colors duration-300"
              >
                <AccordionTrigger className="text-lg">{t('sort_by')}</AccordionTrigger>

                <Controller
                  control={form.control}
                  name="sort"
                  render={({ field }) => (
                    <AccordionContent className="flex flex-wrap gap-2">
                      {sortOptions
                        // only show relevance sorting when there's a search query
                        .filter((option) => option !== 'most-relevant' || options.q)
                        .map((sortOption) => (
                          <SelectButton
                            key={sortOption}
                            onChange={field.onChange}
                            value={sortOption}
                            isCurrent={field.value === sortOption}
                            canToggle={false}
                          >
                            {t(`sort_${sortOption}`)}
                          </SelectButton>
                        ))}
                    </AccordionContent>
                  )}
                />
              </AccordionItem>
            </Accordion>

            <DrawerFooter className="flex flex-col gap-5">
              <Separator className="bg-border" />

              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  className="flex-1 h-12"
                  type="button"
                  onClick={() => {
                    form.reset(defaultSearchValues);

                    setOptions(defaultSearchValues);
                  }}
                >
                  {t('clear_filters')}
                </Button>

                <Button className="flex-1 h-12" type="submit">
                  {t('apply_filters')}
                </Button>
              </div>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
};

interface SelectButtonProps {
  value: string;
  onChange: (value: string) => void;
  children?: React.ReactNode;
  isCurrent?: boolean;
  canToggle?: boolean;
}

const SelectButton = ({ value, onChange, children, isCurrent = false, canToggle = true }: SelectButtonProps) => (
  <Button
    key={value}
    variant="outline"
    type="button"
    onClick={() => onChange(canToggle && isCurrent ? '' : value)}
    className={cn('text-base px-2 py-1.5 h-auto', {
      'bg-sidebar-primary dark:bg-sidebar-primary text-primary-foreground dark:text-primary-foreground hover:bg-sidebar-primary/50':
        isCurrent,
    })}
  >
    {children}
  </Button>
);
