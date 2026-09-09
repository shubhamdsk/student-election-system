import { useEffect, useState } from 'react'

/**
 * Custom hook to debounce search input values and enforce minimum character length requirement.
 * - If value.trim() is empty, clears search query instantly (0ms delay).
 * - If value.trim().length >= minChars, sets debounced search query after delay.
 * - If value.trim().length < minChars, sets '' to prevent under-length search queries.
 */
export function useDebouncedSearch(value: string, delay = 300, minChars = 3): string {
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const trimmed = value.trim()
    const effective = trimmed.length >= minChars ? trimmed : ''
    const timeoutDelay = !trimmed ? 0 : delay

    const timerId = window.setTimeout(() => {
      setDebouncedSearch(effective)
    }, timeoutDelay)

    return () => window.clearTimeout(timerId)
  }, [value, delay, minChars])

  return debouncedSearch
}
