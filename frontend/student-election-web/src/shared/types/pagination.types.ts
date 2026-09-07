export interface PaginationProps {
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  isDisabled: boolean
  ariaLabel?: string
  onPageChange(pageNumber: number): void
  onPageSizeChange(pageSize: number): void
}
