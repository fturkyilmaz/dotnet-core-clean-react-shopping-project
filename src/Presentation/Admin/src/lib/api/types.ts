/**
 * API Types - Admin Panel
 * TypeScript interfaces for backend API
 */

// --------------------
// Common Types
// --------------------
export type HttpStatusCode = number

export interface ServiceResult<T> {
    isSuccess?: boolean
    data?: T
    message?: string | null
    statusCode?: HttpStatusCode
    location?: string | null
}

export interface PaginatedList<T> {
    items?: T[] | null
    pageNumber?: number
    totalPages?: number
    totalCount?: number
    hasPreviousPage?: boolean
    hasNextPage?: boolean
}

export interface ProblemDetails {
    type?: string | null
    title?: string | null
    status?: number | null
    detail?: string | null
    instance?: string | null
    [key: string]: unknown
}

// --------------------
// Identity Types
// --------------------
export interface LoginCommand {
    email: string
    password: string
}

export interface RegisterCommand {
    email: string
    password: string
    firstName?: string
    lastName?: string
    gender?: string
    role?: string
}

export interface RefreshTokenCommand {
    accessToken: string
    refreshToken: string
}

export interface ForgotPasswordCommand {
    email: string
}

export interface ResetPasswordCommand {
    email: string
    token: string
    newPassword: string
}

export interface UpdateMeCommand {
    userId?: string
    firstName?: string
    lastName?: string
    gender?: string
}

export interface AuthResponse {
    accessToken?: string | null
    refreshToken?: string | null
    expires?: string
}

export interface UserInfoResponse {
    id?: string | null
    email?: string | null
    firstName?: string | null
    lastName?: string | null
    userName?: string | null
    gender?: string | null
    roles?: string[] | null
}

// --------------------
// Product Types
// --------------------
export interface ProductDto {
    id?: number
    title?: string | null
    price?: number
    description?: string | null
    category?: string | null
    image?: string | null
    rating?: RatingDto
}

export interface RatingDto {
    rate?: number
    count?: number
}

export interface CreateProductCommand {
    title?: string
    price?: number
    description?: string
    category?: string
    image?: string
}

export interface UpdateProductCommand {
    id?: number
    title?: string
    price?: number
    description?: string
    image?: string
    category?: string
}

// --------------------
// Cart Types
// --------------------
export interface CartDto {
    id?: number
    title?: string | null
    price?: number
    image?: string | null
    quantity?: number
    ownerId?: string | null
}

export interface CreateCartCommand {
    ownerId?: number | null
    quantity?: number
    title?: string
    price?: number
    image?: string
}

export interface UpdateCartCommand {
    id?: number
    title?: string
    price?: number
    image?: string
    quantity?: number
}

// --------------------
// Audit Log Types
// --------------------
export interface AuditLogDto {
    id?: number
    userId?: string | null
    action?: string | null
    entity?: string | null
    entityId?: string | null
    timestamp?: string
    changes?: string | null
}

// --------------------
// Cache Types
// --------------------
export interface RedisCacheRequest {
    key: string
    value: string
}

// --------------------
// Dynamic Query Types
// --------------------
export interface DynamicQuery {
    sort?: Sort[] | null
    filter?: Filter
}

export interface Sort {
    field?: string | null
    dir?: string | null
}

export interface Filter {
    field?: string | null
    value?: string | null
    operator?: string | null
    logic?: string | null
    filters?: Filter[] | null
}

export interface IPaginate<T> {
    from?: number
    index?: number
    size?: number
    count?: number
    pages?: number
    items?: readonly T[] | null
    hasPrevious?: boolean
    hasNext?: boolean
}
