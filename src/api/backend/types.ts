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

export type Error = {
  status: number;
} & (ValidationErrors | AppError);
