export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PagedResult<T> {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export type ValidationErrors = Record<string, string[]>

export interface ValidationErrorData {
  errors: ValidationErrors
}

export type EmptyResponseData = Record<string, never>

export interface PaginationQuery {
  pageNumber?: number
  pageSize?: number
}
