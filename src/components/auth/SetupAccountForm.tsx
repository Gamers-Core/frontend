'use client';

import { useTranslations } from 'next-intl';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { MeSchema, meSchema } from '@/api';
import { Button, Field, FieldError, FieldLabel, Input } from '@/components';
import { useUpdateMeMutation } from '@/hooks';
import { useRouter } from '@/i18n';
import { useAuthStore } from '@/stores';

const defaultValues: MeSchema = {
  name: '',
};

interface SetupAccountFormProps {
  from?: string;
}

export const SetupAccountForm = ({ from }: SetupAccountFormProps) => {
  const t = useTranslations();

  const router = useRouter();
  const form = useForm<MeSchema>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(meSchema(t)),
  });
  const setUser = useAuthStore((state) => state.setUser);

  const updateMeMutation = useUpdateMeMutation();

  const onSubmit: SubmitHandler<MeSchema> = async (data) => {
    if (!form.formState.isValid || updateMeMutation.isPending) return;

    updateMeMutation.mutate(data, {
      onSuccess: (user) => {
        toast.success(t('profile_update_success'));
        setUser(user);

        let fromPath = '/';

        if (from) {
          try {
            fromPath = decodeURIComponent(from ?? '/');
          } catch {
            fromPath = '/';
          }
        }

        router.push(fromPath, { locale: user.locale });

        form.reset();
      },
      onError: (validationErrors) => {
        if (!validationErrors) return;

        validationErrors.errors.forEach((error) => {
          form.setError(error.property, { message: error.messages[0] });
        });
      },
    });
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit, console.warn)}>
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="name" className="text-base md:text-xl text-foreground">
              {t('name')}
            </FieldLabel>

            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder={t('name_placeholder')}
              className="w-full min-h-10 p-2 px-3 text-sm/relaxed md:text-base/relaxed"
              {...field}
            />

            {fieldState.invalid && (
              <FieldError className="text-sm/normal md:text-sm/relaxed" errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      <Button
        type="submit"
        variant="default"
        className="w-full h-auto py-2 text-lg"
        isDisabled={!form.formState.isValid}
        isLoading={updateMeMutation.isPending}
      >
        {t('save_changes')}
      </Button>
    </form>
  );
};
