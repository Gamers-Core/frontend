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

export const stockFilters = ['all', 'in-stock', 'out-of-stock'] as const;

export const sortOptions = [
  'most-relevant',
  'created-descending',
  'created-ascending',
  'title-ascending',
  'title-descending',
  'price-ascending',
  'price-descending',
] as const;
