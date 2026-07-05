'use client';

import { isClient } from '@/helpers';

const CONTENT_TYPE = 'product' as const;

type MetaEventName = 'AddToCart' | 'AddToWishlist' | 'InitiateCheckout' | 'ViewContent' | 'Search' | 'PageView';

interface MetaEventParameters {
  currency?: string;
  value?: number;
  content_ids?: string[];
  content_type?: typeof CONTENT_TYPE | 'product_group';
  content_name?: string;
  num_items?: number;
  search_string?: string;
}

interface FbqOptions {
  eventID?: string;
}

interface FbqInternal {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: FbqInternal;
  loaded: boolean;
  version: string;
}

interface Fbq {
  (command: 'init', pixelId: string, userData?: PixelUserData): void;

  (command: 'track', event: MetaEventName, parameters?: MetaEventParameters, options?: FbqOptions): void;

  (command: 'trackCustom', event: string, parameters?: Record<string, unknown>, options?: FbqOptions): void;

  (command: 'consent', action: 'grant' | 'revoke'): void;
}

export interface PixelUserData {
  em?: string; // sha256 hashed email
  ph?: string; // sha256 hashed phone
  fn?: string; // sha256 hashed first name
  ln?: string; // sha256 hashed last name
  external_id?: string; // sha256 hashed user id
}

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: FbqInternal;
  }
}

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';
const DEFAULT_CURRENCY = 'EGP';

export const sha256 = async (value: string): Promise<string> => {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));

  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

export const setUserData = (userData: PixelUserData) => {
  if (!isClient()) return;

  window.fbq?.('init', META_PIXEL_ID, userData);
};

const getOptions = (eventId?: string): FbqOptions | undefined => (eventId ? { eventID: eventId } : undefined);

const track = (event: MetaEventName, parameters?: MetaEventParameters, eventId?: string) => {
  if (!isClient()) return;

  window.fbq?.('track', event, parameters, getOptions(eventId));
};

export const initMetaPixel = (userData?: PixelUserData) => {
  if (!isClient()) return;
  if (!META_PIXEL_ID) return;
  if (window.fbq) return;

  const fbq: FbqInternal = (...args) => {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  };

  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];

  window.fbq = fbq as unknown as Fbq;
  window._fbq = window._fbq || fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';

  document.head.appendChild(script);

  fbq('init', META_PIXEL_ID, userData ?? {});
};

export const trackPageView = () => track('PageView');

export const trackViewContent = ({
  contentId,
  name,
  value,
  currency = DEFAULT_CURRENCY,
  eventId,
}: {
  contentId: string;
  name: string;
  value: number;
  currency?: string;
  eventId?: string;
}) =>
  track(
    'ViewContent',
    { content_ids: [contentId], content_type: CONTENT_TYPE, content_name: name, value, currency },
    eventId,
  );

export const trackAddToCart = ({
  contentId,
  value,
  currency = DEFAULT_CURRENCY,
  eventId,
}: {
  contentId: string;
  value: number;
  currency?: string;
  eventId?: string;
}) => track('AddToCart', { content_ids: [contentId], content_type: CONTENT_TYPE, value, currency }, eventId);

export const trackInitiateCheckout = ({
  contentIds,
  value,
  numItems,
  currency = DEFAULT_CURRENCY,
  eventId,
}: {
  contentIds: string[];
  value: number;
  numItems: number;
  currency?: string;
  eventId?: string;
}) =>
  track(
    'InitiateCheckout',
    { content_ids: contentIds, content_type: CONTENT_TYPE, value, currency, num_items: numItems },
    eventId,
  );

export const trackSearch = ({ search, eventId }: { search: string; eventId?: string }) =>
  track('Search', { search_string: search }, eventId);
