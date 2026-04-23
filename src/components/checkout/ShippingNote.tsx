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
  Textarea,
} from '../ui';

export const ShippingNote = () => {
  const t = useTranslations();

  const form = useFormContext<CheckoutSchema>();

  return (
    <AccordionItem asChild value="shipping_note">
      <section className="flex flex-col gap-4 p-2 md:p-4 rounded-lg bg-sidebar-border transition-colors duration-300">
        <AccordionTrigger>
          <h3 className="text-lg">
            {t('shipping_note')} <span className="text-sidebar-primary/70">({t('optional')})</span>
          </h3>
        </AccordionTrigger>

        <Controller
          control={form.control}
          name="note"
          render={({ field }) => (
            <AccordionContent>
              <FieldGroup className="w-full">
                <FieldLabel htmlFor="shipping_note">
                  <Field>
                    <FieldContent className="flex flex-col">
                      <FieldDescription className="flex flex-col text-sm">
                        {t('shipping_note_description')}
                      </FieldDescription>
                    </FieldContent>

                    <Textarea className="md:text-sm font-cairo" id="shipping_note" {...field} />
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
