import { CreateItem } from '@/api';

export const toCreateItems = <T extends CreateItem>(items: T[]): CreateItem[] =>
  items.map(({ externalId, quantity }) => ({ externalId, quantity }));

export const buildSignature = (items: CreateItem[]) => {
  const map = new Map(items.map(({ externalId, quantity }) => [externalId, quantity]));

  return JSON.stringify([...map.entries()].sort(([a], [b]) => a.localeCompare(b)));
};

export const buildSignatureFromItems = <T extends CreateItem>(items: T[]) => buildSignature(toCreateItems(items));
