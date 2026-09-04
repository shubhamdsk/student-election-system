import { use } from 'react'
import { SnackbarContext } from '@shared/providers/SnackbarProvider/SnackbarContext'

export function useSnackbar() {
  const context = use(SnackbarContext)
  if (!context) throw new Error('useSnackbar must be used within SnackbarProvider.')
  return context
}
