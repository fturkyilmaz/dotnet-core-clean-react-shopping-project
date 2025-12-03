/**
 * Service Result DTO - Backend Response Wrapper
 */

export interface ServiceResult<T> {
  data: T;
  succeeded: boolean;
  errors?: string[];
  message?: string;
}

/**
 * Paginated Response DTO
 */
export interface PaginatedResponseDTO<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Error Response DTO
 */
export interface ErrorResponseDTO {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}
