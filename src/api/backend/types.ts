import { Locale } from '@/i18n';

import { mediaTypes } from './const';

interface ValidationError {
  property: string;
  codes: string[];
  children: ValidationError[];
}

export interface ValidationErrors {
  errors: ValidationError[];
}

export interface AppError {
  message: string;
}

export type BackendError = {
  status: number;
} & (ValidationErrors | AppError);

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
