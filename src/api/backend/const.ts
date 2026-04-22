export const mediaTypes = ['auto', 'image', 'video', 'raw'] as const;

export const authPurposes = ['signin'] as const;

export const orderStatuses = [
  'pending',
  'confirmed',
  'on-hold',
  'on-progress',
  'shipped',
  'delivered',
  'completed',
  'returned',
  'cancelled',
] as const;

export const paymentStatuses = ['unpaid', 'paid', 'refunded'] as const;

export const paymentMethods = ['cod', 'instapay', 'valu', 'card'] as const;

export const policies = ['terms-of-service', 'shipping', 'refund', 'privacy'] as const;
