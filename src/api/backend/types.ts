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

export interface MediaAttachmentDTO {
  url: string;

  type: MediaType;

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

  media: MediaAttachmentDTO[];
}

export interface BrandDTO {
  name: string;
}

export interface Product {
  id: number;

  name: string;

  title: string;

  description: string;

  variants: Variant[];

  media: MediaAttachmentDTO[];

  brand: BrandDTO | null;
}

interface VariantWithProductDTO extends Variant {
  product: Product;
}

export interface FeaturedVariant {
  title: string;

  variant: VariantWithProductDTO;
}
