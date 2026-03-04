/**
 * Dependency Injection Container
 *
 * NOTE: This file is kept for backwards compatibility.
 * All API calls now use generated React Query hooks directly.
 *
 * Import hooks from respective feature folders instead:
 * - useProducts, useProduct, etc. from '@/presentation/features/product/hooks/useProducts'
 * - useCart from '@/presentation/features/cart/hooks/useCart'
 * - useAuth from '@/presentation/features/auth/hooks/useAuth'
 *
 * Generated API hooks are available at:
 * - '@/infrastructure/api/generated/products/products'
 * - '@/infrastructure/api/generated/carts/carts'
 * - '@/infrastructure/api/generated/identity/identity'
 */

// Re-export generated hooks for convenience
export {
  useGetApiV1Products,
  useGetApiV1ProductsId,
  usePostApiV1Products,
  usePutApiV1ProductsId,
  useDeleteApiV1ProductsId,
  usePostApiV1ProductsSearch,
} from '@/infrastructure/api/generated/products/products';

export {
  useGetApiV1Carts,
  usePostApiV1Carts,
  usePutApiV1CartsId,
  useDeleteApiV1CartsId,
  useDeleteApiV1CartsDeleteAll,
} from '@/infrastructure/api/generated/carts/carts';

export {
  usePostApiV1IdentityLogin,
  usePostApiV1IdentityRegister,
  useGetApiV1IdentityMe,
  usePostApiV1IdentityRefreshToken,
} from '@/infrastructure/api/generated/identity/identity';

// Legacy exports (deprecated) - will be removed in future versions
export const repositories = {};
export const services = {};
