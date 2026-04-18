'use client';

import { useTranslations } from 'next-intl';
import { HugeiconsIcon } from '@hugeicons/react';
import { Checkmark, PencilEdit02Icon, PlusSignFreeIcons, Trash } from '@hugeicons/core-free-icons';
import { toast } from 'sonner';
import { useState } from 'react';

import { Address } from '@/api';
import { I18nKey } from '@/i18n';
import {
  Disclosure,
  useAddressesQuery,
  useDefaultAddressMutation,
  useDeleteAddressMutation,
  useDisclosure,
} from '@/hooks';
import { cn } from '@/lib/utils';

import { Button } from '../Button';
import { AddressDialog, AddressDialogModeParams } from './AddressDialog';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui';

export const ProfileAddresses = () => {
  const t = useTranslations();
  const [addressDialogModeParams, setAddressDialogModeParams] = useState<AddressDialogModeParams | object>(() => ({}));
  const addressDialogDisclosure = useDisclosure();

  const onOpen = (params?: AddressDialogModeParams) => {
    if (params) setAddressDialogModeParams(params);
    else setAddressDialogModeParams({});
    addressDialogDisclosure.onOpen();
  };

  const addressQuery = useAddressesQuery();

  if (!addressQuery.data) return null;

  return (
    <section className="p-4 flex flex-col gap-4 flex-1 bg-sidebar-border rounded-lg max-h-192">
      <AddressDialog {...addressDialogModeParams} {...addressDialogDisclosure} />

      <div className="flex gap-4">
        <h3 className="text-xl">{t('address_title')}</h3>

        <Button
          variant="outline"
          icon={<HugeiconsIcon icon={PlusSignFreeIcons} className="rtl:rotate-y-180" />}
          onClick={() => onOpen()}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:overflow-x-auto overflow-y-auto flex-1">
        {addressQuery.data.length ? (
          addressQuery.data.map((address) => <AddressItem key={address.id} {...address} openDialog={onOpen} />)
        ) : (
          <p className="text-muted-foreground m-auto text-center">{t('address_empty')}</p>
        )}
      </div>
    </section>
  );
};

interface AddressItemProps extends Address {
  openDialog: (params: AddressDialogModeParams) => void;
}

const AddressItem = ({ openDialog, ...address }: AddressItemProps) => {
  const t = useTranslations();

  const defaultAddressMutation = useDefaultAddressMutation();
  const deleteAddressDisclosure = useDisclosure();

  const onSetDefault = () => {
    if (address.isDefault) return;

    defaultAddressMutation.mutate(address.id, {
      onSuccess: () => toast.success(t('address_set_default_success')),
    });
  };

  return (
    <div className="relative flex flex-col gap-2 p-4 bg-sidebar rounded-lg md:w-88 md:min-w-88">
      <AddressField label="address_name_ar" value={address.nameAr} className="font-cairo" />
      <AddressField label="address_zone" value={address.districtName} className="font-cairo" />
      <AddressField label="address_city" value={address.cityName} className="font-cairo" />
      <AddressField label="address_detailed" value={address.detailedAddress} className="font-cairo" />
      <AddressField label="address_phone" value={address.phoneNumber} />

      <div className="absolute p-2 top-2 inset-e-2 flex gap-2">
        <Button
          variant={address.isDefault ? 'default' : 'outline'}
          isDisabled={address.isDefault || defaultAddressMutation.isPending}
          onClick={onSetDefault}
          icon={<HugeiconsIcon icon={Checkmark} className="rtl:rotate-y-180" />}
        />
        <Button
          variant="outline"
          icon={<HugeiconsIcon icon={PencilEdit02Icon} className="rtl:rotate-y-180" />}
          onClick={() => openDialog({ id: address.id, defaultValues: address })}
        />
        <Button
          variant="destructive"
          icon={<HugeiconsIcon icon={Trash} className="rtl:rotate-y-180" />}
          onClick={deleteAddressDisclosure.onOpen}
        />

        <DeleteAddressDialog id={address.id} {...deleteAddressDisclosure} />
      </div>
    </div>
  );
};

interface AddressFieldProps {
  label: I18nKey;
  value: string;
  className?: string;
}

const AddressField = ({ label, value, className }: AddressFieldProps) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col">
      <span className="text-lg text-ring">{t(label)}</span>

      <span className={cn('text-base text-foreground line-clamp-2', className)}>{value}</span>
    </div>
  );
};

interface DeleteAddressDialogProps extends Disclosure {
  id: number;
}

const DeleteAddressDialog = ({ id, ...disclosure }: DeleteAddressDialogProps) => {
  const t = useTranslations();

  const deleteAddressMutation = useDeleteAddressMutation();

  const onDelete = () => {
    deleteAddressMutation.mutate(id, {
      onSuccess: () => {
        toast.success(t('address_delete_success'));
        disclosure.onClose();
      },
    });
  };

  return (
    <Dialog {...disclosure}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('address_delete_title')}</DialogTitle>

          <DialogDescription>{t('address_delete_description')}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t('cancel')}</Button>
          </DialogClose>

          <Button
            variant="destructive"
            loadingIconClassName="size-fit"
            isLoading={deleteAddressMutation.isPending}
            onClick={onDelete}
          >
            {t('delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
