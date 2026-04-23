'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
import { Checkmark, PencilEdit02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { toast } from 'sonner';

import { Address, CheckoutSchema } from '@/api';
import { useAddressesQuery, useDefaultAddressMutation } from '@/hooks';

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
import { Button } from '../Button';
import { Link } from '../Link';

export const ShippingAddress = () => {
  const t = useTranslations();
  const locale = useLocale();

  const form = useFormContext<CheckoutSchema>();

  const addressesQuery = useAddressesQuery();
  const defaultAddressMutation = useDefaultAddressMutation();

  if (!addressesQuery.data) return null;

  const onSetDefault = (id: number) => {
    defaultAddressMutation.mutate(id, {
      onSuccess: () => {
        toast.success(t('address_set_default_success'));
        form.setValue('addressId', id.toString(), { shouldDirty: true });
      },
    });
  };

  const defaultAddress = addressesQuery.data.find((address) => address.isDefault);

  return (
    <AccordionItem asChild value="shipping_addresses">
      <section className="flex flex-col gap-4 p-2 md:p-4 rounded-lg bg-sidebar-border transition-colors duration-300">
        <AccordionTrigger className="flex gap-4">
          <h3 className="text-lg">{t('shipping_address')}</h3>

          <Link href="/profile">
            <HugeiconsIcon icon={PencilEdit02Icon} className="rtl:rotate-y-180" />
          </Link>
        </AccordionTrigger>

        <Controller
          control={form.control}
          name="addressId"
          render={({ field }) => (
            <AccordionContent className="h-80 overflow-y-auto flex flex-col">
              {addressesQuery.data.length ? (
                <RadioGroup
                  value={!field.value ? defaultAddress?.id.toString() : field.value}
                  onValueChange={field.onChange}
                  dir={locale === 'ar' ? 'rtl' : 'ltr'}
                >
                  {addressesQuery.data.map((address) => (
                    <AddressItem
                      key={address.id}
                      onSetDefault={onSetDefault}
                      isPending={defaultAddressMutation.isPending}
                      {...address}
                    />
                  ))}
                </RadioGroup>
              ) : (
                <p className="text-muted-foreground m-auto text-center">{t('address_empty')}</p>
              )}
            </AccordionContent>
          )}
        />
      </section>
    </AccordionItem>
  );
};

interface AddressItemProps extends Address {
  onSetDefault: (id: number) => void;
  isPending?: boolean;
}

const AddressItem = ({ onSetDefault, isPending, ...address }: AddressItemProps) => (
  <FieldLabel className="relative" htmlFor={`address_${address.id.toString()}`}>
    <Field orientation="horizontal">
      <RadioGroupItem value={address.id.toString()} id={`address_${address.id.toString()}`} />
      <FieldContent className="flex flex-col">
        <FieldTitle className="font-cairo text-sm font-medium">
          {address.districtName}, {address.cityName}
        </FieldTitle>

        <FieldDescription className="flex flex-col text-xs">
          <span className="font-cairo">{address.nameAr}</span>
          <span>{address.phoneNumber}</span>
        </FieldDescription>
      </FieldContent>
    </Field>

    <div className="absolute p-2 top-2 inset-e-2 flex gap-2">
      <Button
        variant={address.isDefault ? 'default' : 'outline'}
        isDisabled={address.isDefault}
        loadingIconClassName="size-4"
        isLoading={isPending}
        onClick={() => onSetDefault(address.id)}
        icon={<HugeiconsIcon icon={Checkmark} className="rtl:rotate-y-180" />}
      />
    </div>
  </FieldLabel>
);
