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

  media: MediaAttachment[];
}

export interface Brand {
  name: string;
}

export interface Product {
  id: number;

  name: string;

  title: string;

  description: string;

  variants: Variant[];

  media: MediaAttachment[];

  brand: Brand | null;
}

interface VariantWithProduct extends Variant {
  product: Product;
}

export interface FeaturedVariant {
  title: string;

  variant: VariantWithProduct;
}

export interface UserReview {
  facebookURL: string;
  image: MediaAttachment<'image'>;
}
