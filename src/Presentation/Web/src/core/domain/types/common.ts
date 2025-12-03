/**
 * Common domain types used across entities
 */

/**
 * Base entity with ID
 */
export interface BaseEntity {
  id: number | string;
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
  deletedAt: string | null;
  isDeleted: boolean;
}

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
