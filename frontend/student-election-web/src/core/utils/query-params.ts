type QueryParameterValue = string | number | boolean | null | undefined

export function buildQueryString<T extends { [Key in keyof T]: QueryParameterValue }>(
  values: T,
): string {
  const query = new URLSearchParams()
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value))
    }
  })
  const queryString = query.toString()
  return queryString ? `?${queryString}` : ''
}
