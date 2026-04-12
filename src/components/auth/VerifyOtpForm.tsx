'use client';

import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

import { useVerifyOTPMutation, useCounter, useResendOTPMutation, useFormatNumber } from '@/hooks';
import { setCookiesLocale, verifyOTPSchema, VerifyOTPSchema } from '@/api';
import { Button, Field, FieldError, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components';
import { useRouter } from '@/i18n';
import { useAuthStore } from '@/stores';
import { toast } from 'sonner';

const defaultValues: VerifyOTPSchema = {
  otp: '',
};

interface VerifyOTPFormProps {
  sessionId: string;
}

export const VerifyOTPForm = ({ sessionId }: VerifyOTPFormProps) => {
  const t = useTranslations();

  const form = useForm<VerifyOTPSchema>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(verifyOTPSchema(t)),
  });
  const router = useRouter();

  const verifyOTPMutation = useVerifyOTPMutation();
  const resendOTPMutation = useResendOTPMutation();
  const setUser = useAuthStore((state) => state.setUser);
  const formatNumber = useFormatNumber();

  const resendCounter = useCounter({
    duration: 30,
    onComplete: resendOTPMutation.reset,
  });

  const onSubmit: SubmitHandler<VerifyOTPSchema> = async (data) => {
    if (!form.formState.isValid || verifyOTPMutation.isPending) return;

    verifyOTPMutation.mutate(
      { ...data, sessionId },
      {
        onSuccess: (res) => {
          switch (res.purpose) {
            case 'signin':
              setUser(res.user);

              setCookiesLocale(res.user.locale);

              router.push('/', { locale: res.user.locale });
              break;
          }
        },
        onError: (error) => {
          if (!error) return;

          error.errors.forEach((err) => {
            form.setError(err.property, { message: err.messages[0] });
          });
        },
      },
    );
  };

  const onResendOTP = () => {
    resendCounter.start();

    resendOTPMutation.mutate(
      { sessionId },
      {
        onSuccess: () => {
          toast.success(t('verify_otp_resend_success'));
        },
      },
    );
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit, console.warn)}>
      <Controller
        name="otp"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="flex flex-col gap-2" {...field}>
            <InputOTP
              maxLength={6}
              inputMode="numeric"
              pattern={REGEXP_ONLY_DIGITS}
              containerClassName="flex justify-center w-full"
              {...field}
            >
              <InputOTPGroup className="text-lg flex-1">
                <InputOTPSlot className="flex-1 h-12 text-xl" index={0} />
                <InputOTPSlot className="flex-1 h-12 text-xl" index={1} />
                <InputOTPSlot className="flex-1 h-12 text-xl" index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="flex-1">
                <InputOTPSlot className="flex-1 h-12 text-xl" index={3} />
                <InputOTPSlot className="flex-1 h-12 text-xl" index={4} />
                <InputOTPSlot className="flex-1 h-12 text-xl" index={5} />
              </InputOTPGroup>
            </InputOTP>

            <div className="flex justify-between">
              <FieldError className="flex items-center" errors={[fieldState.error]} />

              <Button
                variant="outline"
                type="button"
                className="text-primary-500 small-semibold ms-auto self-end py-1 px-2 h-auto"
                isDisabled={resendCounter.isActive}
                onClick={onResendOTP}
              >
                {resendCounter.isActive
                  ? t('verify_otp_resend_in', { count: formatNumber(resendCounter.count) })
                  : t('verify_otp_resend')}
              </Button>
            </div>
          </Field>
        )}
      />

      <Button
        type="submit"
        variant="default"
        className="w-full h-auto py-2 text-lg"
        isDisabled={!form.formState.isValid || verifyOTPMutation.isSuccess}
        isLoading={verifyOTPMutation.isPending}
      >
        {t('verify_otp_title')}
      </Button>
    </form>
  );
};
