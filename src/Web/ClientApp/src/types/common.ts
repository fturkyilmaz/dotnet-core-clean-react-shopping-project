/**
 * Common utility types and interfaces used across the application
 */

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// ============================================================================
// Async State Types
// ============================================================================

/**
 * Represents the state of an async operation
 */
export type AsyncState<T, E = Error> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E };

/**
 * Loading state with optional message
 */
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make specific properties required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Nullable type
 */
export type Nullable<T> = T | null;

/**
 * Optional type
 */
export type Optional<T> = T | undefined;

/**
 * Maybe type (null or undefined)
 */
export type Maybe<T> = T | null | undefined;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Check if value is null or undefined
 */
export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Check if async state is loading
 */
export function isLoading<T, E>(state: AsyncState<T, E>): state is { status: 'loading' } {
  return state.status === 'loading';
}

/**
 * Check if async state is success
 */
export function isSuccess<T, E>(state: AsyncState<T, E>): state is { status: 'success'; data: T } {
  return state.status === 'success';
}

/**
 * Check if async state is error
 */
export function isError<T, E>(state: AsyncState<T, E>): state is { status: 'error'; error: E } {
  return state.status === 'error';
}

// ============================================================================
// Common Interfaces
// ============================================================================

/**
 * Base entity with ID
 */
export interface BaseEntity {
  id: number;
}

/**
 * Entity with timestamps
 */
export interface Timestamped {
  createdAt: string;
  updatedAt: string;
}

/**
 * Soft deletable entity
 */
export interface SoftDeletable {
  deletedAt: Nullable<string>;
  isDeleted: boolean;
}

// ============================================================================
// Form Types
// ============================================================================

/**
 * Form field error
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * Form validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: FieldError[];
}

// ============================================================================
// Event Types
// ============================================================================

/**
 * Generic event handler type
 */
export type EventHandler<T = void> = (event: T) => void;

/**
 * Async event handler type
 */
export type AsyncEventHandler<T = void> = (event: T) => Promise<void>;
