'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { useDiscountQuery } from '@/hooks';
import { BackendError, Discount } from '@/api';

import { Button } from './Button';
import { Field, FieldError, Input } from './ui';

interface DiscountValidationProps {
  onClear?: () => void;
  onSuccess?: (data: Discount | null) => void;
  onError?: (error: BackendError) => void;
}

export const DiscountValidation = ({ onSuccess, onError, onClear }: DiscountValidationProps) => {
  const t = useTranslations();

  const [value, setValue] = useState('');
  const [code, setCode] = useState<string | undefined>();
  const [error, setError] = useState<BackendError | null>(null);

  const discountQuery = useDiscountQuery(code);

  const canSubmit = value.length > 0 && (!discountQuery.isPending || !discountQuery.isEnabled);

  useEffect(() => {
    if (discountQuery.status === 'success') {
      onSuccess?.(discountQuery.data);

      setCode(value);
      setError(null);
    }

    if (discountQuery.status === 'error') {
      onError?.(discountQuery.error);

      setCode('');
      setError(discountQuery.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountQuery.status, code]);

  useEffect(() => {
    if (!code) return;

    discountQuery.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const apply = () => {
    if (!canSubmit) return;

    setCode(value);
    4;
  };

  if (discountQuery.isSuccess && !!code && code.length > 0)
    return (
      <div className="flex gap-2 items-center min-h-10 justify-between">
        <Input
          placeholder={t('discount_code_placeholder')}
          value={code}
          readOnly
          className="h-10 p-2 px-3 text-sm/relaxed md:text-base/relaxed text-left"
        />

        <Button
          variant="outline"
          onClick={() => {
            setCode('');

            setValue('');
            onClear?.();
          }}
          className="h-10"
        >
          {t('remove')}
        </Button>
      </div>
    );

  return (
    <Field className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        <Input
          placeholder={t('discount_code_placeholder')}
          value={value}
          onChange={(e) => {
            setCode('');
            setError(null);
            setValue(e.target.value.trim().toUpperCase());
          }}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            e.preventDefault();

            apply();
          }}
          className="h-10 p-2 px-3 text-sm/relaxed md:text-base/relaxed text-left rtl:placeholder:text-right"
        />

        <Button
          isLoading={discountQuery.isPending && discountQuery.isEnabled}
          isDisabled={!canSubmit}
          onClick={apply}
          className="w-14 h-10"
          loadingIconClassName="size-4"
        >
          {t('apply')}
        </Button>
      </div>

      {error && (
        <FieldError
          className="text-sm/normal md:text-sm/relaxed"
          errors={[
            {
              message:
                'message' in error
                  ? error.message
                  : 'errors' in error
                    ? error.errors[0].messages[0]
                    : t('error_generic'),
            },
          ]}
        />
      )}
    </Field>
  );
};
