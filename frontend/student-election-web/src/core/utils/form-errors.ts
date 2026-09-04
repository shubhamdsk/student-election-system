import type { ValidationErrors } from '@core/types/api'

export type FieldErrors<TField extends string> = Partial<Record<TField, string>>

const normalizeFieldName = (fieldName: string) => fieldName.replace(/[^a-z0-9]/gi, '').toLowerCase()

export function mapValidationErrors<TField extends string>(
  validationErrors: ValidationErrors | undefined,
  fields: readonly TField[],
): FieldErrors<TField> {
  if (!validationErrors) return {}

  const fieldsByNormalizedName = new Map(
    fields.map((field) => [normalizeFieldName(field), field]),
  )

  return Object.entries(validationErrors).reduce<FieldErrors<TField>>(
    (mappedErrors, [backendField, messages]) => {
      const field = fieldsByNormalizedName.get(normalizeFieldName(backendField))
      const firstMessage = messages[0]
      if (field && firstMessage) mappedErrors[field] = firstMessage
      return mappedErrors
    },
    {},
  )
}
