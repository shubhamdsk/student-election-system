import type { PropsWithChildren } from 'react'

export type SnackbarType = 'success' | 'error' | 'warning' | 'info'

export interface SnackbarOptions {
  type: SnackbarType
  message: string
  duration?: number
}

export interface SnackbarItem extends SnackbarOptions {
  id: number
}

export interface SnackbarProps {
  snackbar: SnackbarItem
  onClose(): void
}

export interface SnackbarContextValue {
  showSnackbar(options: SnackbarOptions): void
  showSuccess(message: string, duration?: number): void
  showError(message: string, duration?: number): void
  showWarning(message: string, duration?: number): void
  showInfo(message: string, duration?: number): void
}

export type SnackbarProviderProps = PropsWithChildren
