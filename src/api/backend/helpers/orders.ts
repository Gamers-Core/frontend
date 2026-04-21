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
import { Order, OrderStatus } from '../types';

export interface OrderStatusItem {
  status: OrderStatus;
  date: Date;
  label: `status_${OrderStatus}`;
  style: 'default' | 'success' | 'error' | 'warning' | 'info';
  icon: IconSvgElement;
}

interface StatusMapItem {
  style: OrderStatusItem['style'];
  icon: IconSvgElement;
}

const statusMap: Record<OrderStatus, StatusMapItem> = {
  pending: { style: 'default', icon: ClockIcon },
  confirmed: { style: 'success', icon: CheckmarkCircleIcon },
  'on-hold': { style: 'warning', icon: ExclamationMarkBigIcon },
  'on-progress': { style: 'info', icon: ProgressIcon },
  shipped: { style: 'info', icon: ShippingTruck01Icon },
  delivered: { style: 'info', icon: DeliveryView01Icon },
  completed: { style: 'success', icon: CheckmarkCircleIcon },
  returned: { style: 'warning', icon: Alert02Icon },
  cancelled: { style: 'error', icon: MultiplicationSignCircleIcon },
};

export const statusesStyleMap = {
  default: 'text-muted-foreground',
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
} as const;

export const getOrderStatuses = (order: Order): OrderStatusItem[] =>
  order.history
    .map(({ status, createdAt }) => ({
      status,
      date: new Date(createdAt),
      label: `status_${status}` as const,
      ...statusMap[status],
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
