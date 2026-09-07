const DEFAULT_DATE_TIME_FORMAT = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatUtcDateTime(
  utcDateTime: string,
  formatter: Intl.DateTimeFormat = DEFAULT_DATE_TIME_FORMAT,
): string {
  const date = new Date(utcDateTime)
  return Number.isNaN(date.getTime()) ? '' : formatter.format(date)
}

export function toUtcIsoString(localDateTime: string): string {
  return new Date(localDateTime).toISOString()
}

export function toLocalDateTimeInput(utcDateTime: string): string {
  const date = new Date(utcDateTime)
  if (Number.isNaN(date.getTime())) return ''
  const localTime = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return localTime.toISOString().slice(0, 16)
}
