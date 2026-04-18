'use client';

import { useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';

import { CheckoutSchema } from '@/api';

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
} from '../ui';

export const ShippingOptions = () => {
  const t = useTranslations();

  const form = useFormContext<CheckoutSchema>();

  return (
    <AccordionItem asChild value="shipping_options">
      <section className="flex flex-col gap-4 p-2 md:p-4 rounded-lg bg-sidebar-border h-max">
        <AccordionTrigger>
          <h3 className="text-lg">{t('shipping_options')}</h3>
        </AccordionTrigger>

        <Controller
          control={form.control}
          name="canOpenPackage"
          render={({ field }) => (
            <AccordionContent>
              <FieldGroup className="w-full">
                <FieldLabel htmlFor="shipping_options_can_open_package">
                  <Field orientation="horizontal">
                    <FieldContent className="flex flex-col">
                      <FieldTitle className="text-base font-medium">{t('can_open_package')}</FieldTitle>

                      <FieldDescription className="flex flex-col text-sm">
                        {t('can_open_package_description')}
                      </FieldDescription>
                    </FieldContent>

                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="shipping_options_can_open_package"
                    />
                  </Field>
                </FieldLabel>
              </FieldGroup>
            </AccordionContent>
          )}
        />
      </section>
    </AccordionItem>
  );
};
