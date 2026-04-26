'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { addressSchema, AddressSchema } from '@/api';
import { Disclosure, useAddressCitiesQuery, useAddressDistrictsQuery, useAddressMutation } from '@/hooks';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  FieldError,
  FieldGroup,
  Input,
  Label,
  Spinner,
  Textarea,
} from '../ui';
import { Button } from '../Button';

export interface AddressDialogModeParams {
  id?: number;
  defaultValues?: AddressSchema;
}
type AddressDialogMode = 'create' | 'edit';

const defaultAddressValues: AddressSchema = {
  nameAr: '',
  cityId: '',
  districtId: '',
  detailedAddress: '',
  phoneNumber: '',
};

export const AddressDialog = ({ id, defaultValues, ...disclosure }: AddressDialogModeParams & Disclosure) => {
  const t = useTranslations();
  const locale = useLocale();

  let mode: AddressDialogMode = 'create';
  if (id) mode = 'edit';

  const isCreateMode = mode === 'create';

  const [cityId, setCityId] = useState<string | undefined>();

  const form = useForm<AddressSchema>({
    defaultValues: defaultAddressValues,
    mode: 'onChange',
    resolver: zodResolver(addressSchema(t, !isCreateMode)),
  });

  const addressMutation = useAddressMutation(id);
  const addressCitiesQuery = useAddressCitiesQuery();
  const addressDistrictsQuery = useAddressDistrictsQuery(cityId);

  useEffect(() => {
    if (!id) return form.reset(defaultAddressValues);

    form.reset(defaultValues);
    setCityId(defaultValues?.cityId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, form.reset]);

  useEffect(() => {
    if (cityId !== defaultValues?.cityId) form.setValue('districtId', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId]);

  const onSubmit: SubmitHandler<AddressSchema> = async (data) => {
    if (!form.formState.isValid || addressMutation.isPending) return;

    addressMutation.mutate(data, {
      onSuccess: () => {
        onClose();
        toast.success(t(isCreateMode ? 'address_create_success' : 'address_update_success'));
        form.reset(defaultAddressValues);
      },
      onError: (validationErrors) => {
        if (!validationErrors) return;

        validationErrors.errors.forEach((error) => {
          form.setError(error.property, { message: error.messages[0] });
        });
      },
    });
  };

  const onClose = () => {
    disclosure.onClose();
    form.reset(defaultAddressValues);
    setCityId(undefined);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) onClose();

    disclosure.onOpenChange(open);
  };

  return (
    <Dialog {...disclosure} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-2xl">
        <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit, console.warn)}>
          <DialogHeader>
            <DialogTitle>{t(isCreateMode ? 'address_create_title' : 'address_update_title')}</DialogTitle>

            <DialogDescription className="text-destructive">{t('address_description')}</DialogDescription>
          </DialogHeader>

          <FieldGroup className="flex md:flex-row gap-4">
            <Controller
              name="nameAr"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <Label htmlFor="nameAr">{t('address_name_ar')}</Label>

                  <Input
                    className="font-cairo ltr:text-right"
                    id="nameAr"
                    type="text"
                    autoComplete="name"
                    placeholder={t('name_placeholder')}
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />

                  {fieldState.invalid && (
                    <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="phoneNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <Label htmlFor="phoneNumber">{t('address_phone')}</Label>

                  <Input
                    id="phoneNumber"
                    type="text"
                    autoComplete="phone"
                    placeholder="01234567899"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />

                  {fieldState.invalid && (
                    <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup className="flex md:flex-row gap-4">
            <Controller
              name="cityId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <Label htmlFor="cityId">{t('address_city')}</Label>

                  <Combobox
                    required
                    autoHighlight
                    loopFocus
                    items={addressCitiesQuery.data?.map(({ _id }) => _id)}
                    defaultValue={addressCitiesQuery.data?.find((city) => city._id === field.value)?._id}
                    value={field.value}
                    locale={locale}
                    onValueChange={(value) => {
                      field.onChange(value ?? '');
                      setCityId(value ?? '');
                    }}
                    itemToStringLabel={(item) =>
                      addressCitiesQuery.data?.find((city) => city._id === item)?.nameAr || ''
                    }
                  >
                    <ComboboxInput
                      placeholder={t('address_city_placeholder')}
                      aria-invalid={fieldState.invalid}
                      className="font-cairo ltr:text-right"
                      id="cityId"
                    />

                    <ComboboxContent className="pointer-events-auto">
                      <ComboboxEmpty>{t('address_city_empty')}</ComboboxEmpty>

                      <ComboboxList>
                        {(id: string) => (
                          <ComboboxItem className="font-cairo ltr:text-right" key={id} value={id}>
                            {addressCitiesQuery.data?.find((city) => city._id === id)?.nameAr || ''}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>

                  {fieldState.invalid && (
                    <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="districtId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <Label htmlFor="districtId">{t('address_zone')}</Label>

                  {/* <Select
                    {...field}
                    onValueChange={field.onChange}
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                    defaultValue={
                      addressDistrictsQuery.data?.find((district) => district.districtId === field.value)?.districtId
                    }
                    disabled={!cityId || addressDistrictsQuery.isPending || !addressDistrictsQuery.data?.length}
                  >
                    <SelectTrigger className="font-cairo ltr:text-right">
                      <SelectValue placeholder={t('address_zone_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="font-cairo ltr:text-right">
                        {addressDistrictsQuery.data?.map((district) => (
                          <SelectItem key={district.districtId} value={district.districtId}>
                            {district.districtOtherName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select> */}

                  <Combobox
                    required
                    autoHighlight
                    loopFocus
                    items={addressDistrictsQuery.data?.map(({ districtId }) => districtId)}
                    defaultValue={
                      addressDistrictsQuery.data?.find((district) => district.districtId === field.value)?.districtId
                    }
                    value={field.value}
                    locale={locale}
                    onValueChange={(value) => field.onChange(value ?? '')}
                    itemToStringLabel={(item) =>
                      addressDistrictsQuery.data?.find((district) => district.districtId === item)?.districtOtherName ||
                      ''
                    }
                  >
                    <div className="relative">
                      <ComboboxInput
                        placeholder={t('address_zone_placeholder')}
                        aria-invalid={fieldState.invalid}
                        className="font-cairo ltr:text-right"
                        id="districtId"
                        disabled={!cityId || addressDistrictsQuery.isPending || !addressDistrictsQuery.data?.length}
                      />

                      {addressDistrictsQuery.isPending && cityId && (
                        <div className="absolute inset-y-0 inset-e-2 flex items-center justify-center">
                          <Spinner />
                        </div>
                      )}
                    </div>

                    <ComboboxContent className="pointer-events-auto">
                      <ComboboxEmpty>{t('address_zone_empty')}</ComboboxEmpty>

                      <ComboboxList>
                        {(id: string) => (
                          <ComboboxItem className="font-cairo ltr:text-right" key={id} value={id}>
                            {addressDistrictsQuery.data?.find((district) => district.districtId === id)
                              ?.districtOtherName || ''}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>

                  {fieldState.invalid && (
                    <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup className="flex md:flex-row gap-4">
            <Controller
              name="detailedAddress"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <Label htmlFor="detailedAddress">{t('address_detailed')}</Label>

                  <Textarea
                    className="font-cairo ltr:text-right"
                    id="detailedAddress"
                    autoComplete="street-address"
                    placeholder={t('address_detailed_placeholder')}
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />

                  {fieldState.invalid && (
                    <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t('cancel')}</Button>
            </DialogClose>

            <Button
              type="submit"
              variant="default"
              loadingIconClassName="size-fit"
              isDisabled={
                !form.formState.isValid ||
                addressMutation.isPending ||
                addressCitiesQuery.isPending ||
                addressDistrictsQuery.isPending
              }
              isLoading={addressMutation.isPending}
            >
              {t(isCreateMode ? 'address_create_title' : 'address_update_title')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
