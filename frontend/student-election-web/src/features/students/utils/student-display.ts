import type { Gender } from '@core/types/enums'

const GENDER_LABELS: Record<Gender, string> = {
  Male: 'Male', Female: 'Female', Other: 'Other', PreferNotToSay: 'Prefer Not To Say',
}

export function formatGender(gender: Gender): string {
  return GENDER_LABELS[gender]
}

export function displayOptional(value: string | null): string {
  return value?.trim() || 'Not provided'
}
