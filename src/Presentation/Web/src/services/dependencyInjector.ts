/**
 * Dependency Injection Container
 * Creates singleton instances of repositories and services
 */

import { ProductAPIRepository } from '@/infrastructure/persistence/ProductAPIRepository';
import { CartAPIRepository } from '@/infrastructure/persistence/CartAPIRepository';
import { AuthAPIService } from '@/infrastructure/persistence/AuthAPIService';

// Singleton instances
export const productRepository = new ProductAPIRepository();
export const cartRepository = new CartAPIRepository();
export const authService = new AuthAPIService();

// Export for convenience
export const repositories = {
  product: productRepository,
  cart: cartRepository,
};

export const services = {
  auth: authService,
};
