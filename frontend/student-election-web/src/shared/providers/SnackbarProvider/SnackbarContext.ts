import { createContext } from 'react'
import type { SnackbarContextValue } from '@shared/types/snackbar.types'

export const SnackbarContext = createContext<SnackbarContextValue | null>(null)
