'use client';

import { useTranslations } from 'next-intl';
import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit02Icon } from '@hugeicons/core-free-icons';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

import { Disclosure, useDisclosure, useMeQuery, useSetMeQueryData, useUpdateMeMutation } from '@/hooks';
import { meSchema, MeSchema } from '@/api';

import { Button } from '../Button';
import {
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
} from '../ui';

export const ProfileInfo = () => {
  const t = useTranslations();

  const meQuery = useMeQuery(false);
  const updateProfileInfoDisclosure = useDisclosure();

  if (!meQuery.data) return null;

  return (
    <section className="p-4 flex flex-col gap-4 bg-sidebar-border rounded-lg">
      <div className="flex gap-4">
        <h3 className="text-xl">{t('profile_info_title')}</h3>

        <Button
          variant="outline"
          icon={<HugeiconsIcon icon={PencilEdit02Icon} className="rtl:rotate-y-180" />}
          onClick={updateProfileInfoDisclosure.onOpen}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-1 items-center justify-between">
          <UpdateProfileInfoDialog name={meQuery.data.name} {...updateProfileInfoDisclosure} />

          <div className="flex flex-col">
            <span className="text-ring">{t('name')}</span>

            <span>{meQuery.data.name}</span>
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <span className="text-ring">{t('email')}</span>

          <span>{meQuery.data.email}</span>
        </div>
      </div>
    </section>
  );
};

interface UpdateProfileInfoDialogProps extends Disclosure {
  name: string;
}

const UpdateProfileInfoDialog = ({ name, ...disclosure }: UpdateProfileInfoDialogProps) => {
  const t = useTranslations();

  const form = useForm<MeSchema>({
    defaultValues: { name },
    mode: 'onChange',
    resolver: zodResolver(meSchema(t)),
  });

  const setMeQueryData = useSetMeQueryData();
  const updateMeMutation = useUpdateMeMutation();

  const onSubmit: SubmitHandler<MeSchema> = async (data) => {
    if (!form.formState.isValid || updateMeMutation.isPending) return;

    updateMeMutation.mutate(data, {
      onSuccess: (user) => {
        setMeQueryData(user, false);

        disclosure.onClose();
        toast.success(t('profile_update_success'));
      },
      onError: (validationErrors) => {
        if (!validationErrors) return;

        validationErrors.errors.forEach((error) => {
          form.setError(error.property, { message: error.messages[0] });
        });
      },
    });
  };

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) form.reset({ name });

    disclosure.onOpenChange(isOpen);
  };

  return (
    <Dialog {...disclosure} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit, console.warn)}>
          <DialogHeader>
            <DialogTitle>{t('profile_info_title')}</DialogTitle>
            <DialogDescription>{t('profile_info_description')}</DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <Label htmlFor="name">{t('name')}</Label>

                  <Input id="name" type="text" autoComplete="name" placeholder={t('name_placeholder')} {...field} />

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
              isDisabled={!form.formState.isValid || !form.formState.isDirty}
              isLoading={updateMeMutation.isPending}
            >
              {t('save_changes')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
