'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';

import { CheckoutSchema, paymentMethods } from '@/api';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
  RadioGroup,
  RadioGroupItem,
} from '../ui';

export const PaymentMethod = () => {
  const t = useTranslations();
  const locale = useLocale();

  const form = useFormContext<CheckoutSchema>();

  return (
    <AccordionItem asChild value="payment_methods">
      <section className="flex flex-col gap-4 p-2 md:p-4 rounded-lg bg-sidebar-border transition-colors duration-300">
        <AccordionTrigger>
          <h3 className="text-lg">{t('payment_method')}</h3>
        </AccordionTrigger>

        <Controller
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <AccordionContent>
              <RadioGroup
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
                value={field.value}
                onValueChange={field.onChange}
                defaultValue={paymentMethods[0]}
              >
                {paymentMethods.map((method) => (
                  <FieldLabel key={method}>
                    <Field orientation="horizontal">
                      <RadioGroupItem value={method} id={`payment_${method}`} />
                      <FieldContent className="flex flex-col">
                        <FieldTitle className="text-base font-medium">{t(`payment_method_${method}`)}</FieldTitle>

                        <FieldDescription className="flex flex-col text-sm">
                          {method === 'instapay'
                            ? t('payment_method_instapay_description')
                            : t('payment_method_bosta_description')}
                        </FieldDescription>
                      </FieldContent>
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
            </AccordionContent>
          )}
        />
      </section>
    </AccordionItem>
  );
};
