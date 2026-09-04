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
