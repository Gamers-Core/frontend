import { Locale } from '@/i18n';

import {
  authPurposes,
  mediaTypes,
  orderStatuses,
  paymentMethods,
  paymentStatuses,
  policies,
  sortOptions,
  stockFilters,
} from './const';

interface ValidationError<P extends string = string> {
  property: P;
  keys: string[];
  messages: string[];
  children: ValidationError<P>[];
}

export type ValidationErrors<K extends string = string> = {
  errors: ValidationError<K>[];
};

export interface AppError {
  message: string;
}

export type BackendError<E extends ValidationErrors | AppError = ValidationErrors | AppError> = {
  status: number;
} & E;

export type MediaType = (typeof mediaTypes)[number];

export interface MediaAttachment<T extends MediaType = MediaType> {
  url: string;
  type: T;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface Variant {
  externalId: string;
  name: string;
  price: number;
  compareAt: number | null;
  stock: number;
  media: MediaAttachment[];
}

export interface Brand {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  title: string;
  description: string;
  variants: Variant[];
  media: MediaAttachment[];
  brand: Brand;
  category: Category;
}

interface VariantWithProduct extends Variant {
  product: Omit<Product, 'variants'>;
}

export interface FeaturedVariant {
  title: string;
  variant: VariantWithProduct;
}

export interface UserReview {
  facebookURL: string;
  image: MediaAttachment<'image'>;
}

export interface Address {
  id: number;
  phoneNumber: string;
  detailedAddress: string;
  districtId: string;
  districtName: string;
  cityId: string;
  cityName: string;
  cityDropOff: string;
  nameAr: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BasicUser {
  id: number;
  name: string;
  email: string;
  locale: Locale;
  isMe: boolean;
}

export interface FullUserDTO extends BasicUser {
  addresses: Address[];
}

export interface OTPFlowResponse {
  sessionId: string;
}

export interface OtpVerifyResultMap {
  signin: {
    user: BasicUser;
    cart: Cart;
    isNewUser: boolean;
  };
}

export type AuthPurpose = (typeof authPurposes)[number];

export type VerifyOTPResponse = {
  [P in AuthPurpose]: { purpose: P } & OtpVerifyResultMap[P];
};

export interface CreateItem {
  externalId: string;
  quantity: number;
}

export interface CartItem {
  id: number;
  variant: {
    name: string;
    externalId: string;
    imageURL: string;
    product: {
      id: number;
      name: string;
      title: string;
      brand: Brand;
      category: Category;
    };
    stock: number;
    price: number;
    compareAt: number | null;
  };
  quantity: number;
  total: number;
}

export interface Cart {
  items: CartItem[];
  count: number;
  compareAt: number | null;
  total: number;
}

export interface City {
  _id: string;
  name: string;
  nameAr: string;
  code: string;
}

export interface District {
  districtId: string;
  districtName: string;
  districtOtherName: string;
}

export type OrderStatus = (typeof orderStatuses)[number];
export type PaymentStatus = (typeof paymentStatuses)[number];
export type PaymentMethod = (typeof paymentMethods)[number];

export interface OrderItem {
  productId: number;
  productTitle: string;
  variantExternalId: string;
  variantName: string;
  imageURL: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  createdAt: string;
}

export interface Order {
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  canOpenPackage: boolean;
  items: OrderItem[];
  shippingAddress: {
    id: number;
    nameAr: string;
    phoneNumber: string;
    detailedAddress: string;
    districtName: string;
    cityName: string;
  };
  history: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string | null;
  note: string | null;
  trackingNumber: string | null;
  subtotal: number;
  shippingFee: number;
  total: number;
  currency: string;
}

export interface ShippingFees {
  openingFee: number;
  codFee: number;
  shippingFee: number;
}

export type PolicyType = (typeof policies)[number];

export interface Policy {
  value: string;
  updatedAt: string;
}

export type Policies = Record<PolicyType, Policy>;

export interface FAQ {
  question: string;
  answer: string;
}

export type StockFilter = (typeof stockFilters)[number];

export type SortOption = (typeof sortOptions)[number];

export interface SearchResponse extends Omit<Product, 'variants' | 'description' | 'media'> {
  imageURL: string;
  hasStock: boolean;
  price: { min: number; max: number; sale: boolean };
}
