import { IconSvgElement } from '@hugeicons/react';
import {
  Alert02Icon,
  CheckmarkCircleIcon,
  ClockIcon,
  DeliveryView01Icon,
  ExclamationMarkBigIcon,
  MultiplicationSignCircleIcon,
  ProgressIcon,
  ShippingTruck01Icon,
} from '@hugeicons/core-free-icons';

import { Order, OrderStatus, OrderStatusTimestamps, PaymentStatus } from '../types';

export type Status = OrderStatus | PaymentStatus;

export interface OrderStatusItem<S extends Status = Status> {
  status: S;
  date: Date | null;
  label: `status_${S}`;
  style: 'default' | 'success' | 'error' | 'warning' | 'info';
  icon: IconSvgElement;
}

export const getOrderStatus = <S extends Status>(status: S, order: Order): OrderStatusItem<S> =>
  ({
    status,
    label: `status_${status}` as const,
    ...statusMap[status],
    date: statusMap[status].dateKey ? order[statusMap[status].dateKey] : null,
  }) as const;

interface StatusMapItem {
  dateKey: keyof OrderStatusTimestamps | null;
  style: 'default' | 'success' | 'error' | 'warning' | 'info';
  icon: IconSvgElement;
}

const statusMap: Record<Status, StatusMapItem> = {
  pending: {
    dateKey: 'createdAt',
    style: 'default',
    icon: ClockIcon,
  },
  confirmed: {
    dateKey: 'confirmedAt',
    style: 'success',
    icon: CheckmarkCircleIcon,
  },
  'on-hold': {
    dateKey: 'confirmedAt',
    style: 'warning',
    icon: ExclamationMarkBigIcon,
  },
  'on-progress': {
    dateKey: 'confirmedAt',
    style: 'info',
    icon: ProgressIcon,
  },
  shipped: {
    dateKey: 'shippedAt',
    style: 'info',
    icon: ShippingTruck01Icon,
  },
  delivered: {
    dateKey: 'deliveredAt',
    style: 'info',
    icon: DeliveryView01Icon,
  },
  completed: {
    dateKey: 'completedAt',
    style: 'success',
    icon: CheckmarkCircleIcon,
  },
  returned: {
    dateKey: 'returnedAt',
    style: 'warning',
    icon: Alert02Icon,
  },
  cancelled: {
    dateKey: 'canceledAt',
    style: 'error',
    icon: MultiplicationSignCircleIcon,
  },
  unpaid: {
    dateKey: null,
    style: 'warning',
    icon: ExclamationMarkBigIcon,
  },
  paid: {
    dateKey: 'paidAt',
    style: 'success',
    icon: CheckmarkCircleIcon,
  },
  refunded: {
    dateKey: 'refundedAt',
    style: 'warning',
    icon: Alert02Icon,
  },
};
