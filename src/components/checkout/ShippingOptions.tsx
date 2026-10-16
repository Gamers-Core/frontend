'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';

import { CheckoutSchema } from '@/api';
import { useIsMobile } from '@/hooks';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui';

export const ShippingOptions = () => {
  const t = useTranslations();
  const locale = useLocale();

  const form = useFormContext<CheckoutSchema>();

  const isMobile = useIsMobile();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <AccordionItem asChild value="shipping_options">
      <section className="flex flex-col gap-4 p-2 md:p-4 rounded-lg bg-sidebar-border transition-colors duration-300">
        <AccordionTrigger>
          <h3 className="text-lg">{t('shipping_options')}</h3>
        </AccordionTrigger>

        <Controller
          control={form.control}
          name="canOpenPackage"
          render={({ field }) => (
            <AccordionContent>
              <FieldGroup className="w-full">
                <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                  <TooltipTrigger
                    asChild
                    onPointerDown={(e) => {
                      if (isMobile) e.preventDefault();
                    }}
                    onClick={(e) => {
                      if (isMobile) {
                        e.preventDefault();
                        setTooltipOpen((prev) => !prev);
                      }
                    }}
                  >
                    <FieldLabel htmlFor="shipping_options_can_open_package" className="cursor-not-allowed">
                      <Field orientation="horizontal">
                        <FieldContent className="flex flex-col opacity-50">
                          <FieldTitle className="text-base font-medium">{t('can_open_package')}</FieldTitle>

                          <FieldDescription className="flex flex-col text-sm">
                            {t('can_open_package_description')}
                          </FieldDescription>
                        </FieldContent>

                        <Switch
                          disabled
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="shipping_options_can_open_package"
                          className="pointer-events-none"
                        />
                      </Field>
                    </FieldLabel>
                  </TooltipTrigger>

                  <TooltipContent side={isMobile ? 'bottom' : locale === 'ar' ? 'left' : 'right'} align="center">
                    {t('feature_not_available')}
                  </TooltipContent>
                </Tooltip>
              </FieldGroup>
            </AccordionContent>
          )}
        />
      </section>
    </AccordionItem>
  );
};
