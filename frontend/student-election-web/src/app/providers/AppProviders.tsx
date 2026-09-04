import type { PropsWithChildren } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@core/auth/AuthProvider'
import { SnackbarProvider } from '@shared/providers/SnackbarProvider/SnackbarProvider'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <BrowserRouter>
      <SnackbarProvider>
        <AuthProvider>{children}</AuthProvider>
      </SnackbarProvider>
    </BrowserRouter>
  )
}
