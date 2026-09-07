// src/app/providers/AppProviders.tsx
import type { PropsWithChildren } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@core/auth/AuthProvider'
import { queryClient } from '@core/query/queryClient'
import { SnackbarProvider } from '@shared/providers/SnackbarProvider/SnackbarProvider'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SnackbarProvider>
          <AuthProvider>{children}</AuthProvider>
        </SnackbarProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
