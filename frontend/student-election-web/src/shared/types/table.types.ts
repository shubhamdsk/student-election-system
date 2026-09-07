import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T, rowIndex: number) => ReactNode
  width?: string
  maxWidth?: string
  align?: 'left' | 'center' | 'right'
  sticky?: 'left' | 'right'
  sortable?: boolean
  filterable?: boolean
}

export interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string | number
  emptyMessage?: string
  loading?: boolean
  loadingContent?: ReactNode
  caption?: string
  className?: string
  canMaximize?: boolean
}
