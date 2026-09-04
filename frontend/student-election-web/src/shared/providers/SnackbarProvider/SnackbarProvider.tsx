import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Snackbar } from '@shared/components/Snackbar/Snackbar'
import type {
  SnackbarContextValue, SnackbarItem, SnackbarOptions, SnackbarProviderProps,
  SnackbarType,
} from '@shared/types/snackbar.types'
import { SnackbarContext } from './SnackbarContext'

const DEFAULT_DURATION = 4000

export function SnackbarProvider({ children }: SnackbarProviderProps) {
  const [queue, setQueue] = useState<SnackbarItem[]>([])
  const nextId = useRef(0)
  const activeSnackbar = queue[0]

  const closeSnackbar = useCallback(() => {
    setQueue((currentQueue) => currentQueue.slice(1))
  }, [])

  const showSnackbar = useCallback((options: SnackbarOptions) => {
    const message = options.message.trim()
    if (!message) return
    nextId.current += 1
    setQueue((currentQueue) => [...currentQueue, { ...options, message, id: nextId.current }])
  }, [])

  const showByType = useCallback(
    (type: SnackbarType, message: string, duration?: number) =>
      showSnackbar({ type, message, duration }),
    [showSnackbar],
  )

  useEffect(() => {
    if (!activeSnackbar) return
    const duration = activeSnackbar.duration ?? DEFAULT_DURATION
    if (duration <= 0) return
    const timeoutId = window.setTimeout(closeSnackbar, duration)
    return () => window.clearTimeout(timeoutId)
  }, [activeSnackbar, closeSnackbar])

  const value = useMemo<SnackbarContextValue>(() => ({
    showSnackbar,
    showSuccess: (message, duration) => showByType('success', message, duration),
    showError: (message, duration) => showByType('error', message, duration),
    showWarning: (message, duration) => showByType('warning', message, duration),
    showInfo: (message, duration) => showByType('info', message, duration),
  }), [showByType, showSnackbar])

  return (
    <SnackbarContext value={value}>
      {children}
      {activeSnackbar && <Snackbar snackbar={activeSnackbar} onClose={closeSnackbar} />}
    </SnackbarContext>
  )
}
