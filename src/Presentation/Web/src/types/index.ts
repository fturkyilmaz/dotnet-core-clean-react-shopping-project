/**
 * Central export point for all type definitions
 */

// Common utilities and base types
export * from './common';

// Domain types
export * from './product';
export * from './cart';
export * from './auth';

// Re-export commonly used types for convenience
export type { Product, ProductCategory, ProductRating } from './product';
export type { CartItem, CreateCartDto, UpdateCartDto } from './cart';
export type { User, AuthState, LoginRequest, RegisterRequest } from './auth';
