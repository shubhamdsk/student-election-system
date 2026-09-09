// src/app/providers/AppProviders.tsx
import { useState, type PropsWithChildren } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@core/auth/AuthProvider'
import { createQueryClient } from '@core/query/queryClient'
import { SnackbarProvider } from '@shared/providers/SnackbarProvider/SnackbarProvider'
import { useSnackbar } from '@shared/hooks/useSnackbar'

function QueryProvider({ children }: PropsWithChildren) {
  const { showError } = useSnackbar()
  const [queryClient] = useState(() => createQueryClient((error) => {
    showError(error instanceof Error ? error.message : 'Unable to load data. Please try again.')
  }))

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <BrowserRouter>
      <SnackbarProvider>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </SnackbarProvider>
    </BrowserRouter>
  )
}
