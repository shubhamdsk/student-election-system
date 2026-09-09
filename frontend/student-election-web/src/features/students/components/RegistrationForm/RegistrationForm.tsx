import { useState, type FormEvent } from 'react'
import type { FieldErrors } from '@core/utils/form-errors'
import { FormField } from '@shared/components/FormField/FormField'
import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import { PasswordInput } from '@shared/components/PasswordInput/PasswordInput'
import { SelectDropdown } from '@shared/components/SelectDropdown/SelectDropdown'
import type { SelectDropdownOption } from '@shared/types/select-dropdown.types'
import type { RegistrationField, RegistrationFormProps, RegistrationFormValues } from '../../types/student.types'
import { MAX_YEAR_OF_STUDY, MIN_YEAR_OF_STUDY } from '../../constants/student.constants'
import './RegistrationForm.scss'

const INITIAL_VALUES: RegistrationFormValues = {
  email: '', password: '', fullName: '', department: '',
  yearOfStudy: '', gender: '', phoneNumber: '',
}
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^\+?[\d\s().-]{7,20}$/
const GENDERS: SelectDropdownOption[] = [
  { value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' }, { value: 'PreferNotToSay', label: 'Prefer not to say' },
]

function validate(values: RegistrationFormValues): FieldErrors<RegistrationField> {
  const errors: FieldErrors<RegistrationField> = {}
  const email = values.email.trim()
  const year = Number(values.yearOfStudy)
  if (!email) errors.email = 'Email is required.'
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Enter a valid email address.'
  if (!values.password) errors.password = 'Password is required.'
  else if (values.password.length < 8) errors.password = 'Password must be at least 8 characters.'
  else if (!/[A-Z]/.test(values.password) || !/[a-z]/.test(values.password) || !/\d/.test(values.password)) errors.password = 'Include an uppercase letter, a lowercase letter, and a number.'
  if (!values.fullName.trim()) errors.fullName = 'Full name is required.'
  else if (values.fullName.trim().length > 150) errors.fullName = 'Use 150 characters or fewer.'
  if (!values.department.trim()) errors.department = 'Department is required.'
  else if (values.department.trim().length > 100) errors.department = 'Use 100 characters or fewer.'
  if (!values.yearOfStudy) errors.yearOfStudy = 'Year of study is required.'
  else if (!Number.isInteger(year) || year < MIN_YEAR_OF_STUDY || year > MAX_YEAR_OF_STUDY) errors.yearOfStudy = `Enter a whole number from ${MIN_YEAR_OF_STUDY} to ${MAX_YEAR_OF_STUDY}.`
  if (!values.gender) errors.gender = 'Select a gender option.'
  const phone = values.phoneNumber.trim()
  if (phone.length > 20) errors.phoneNumber = 'Use 20 characters or fewer.'
  else if (phone && !PHONE_PATTERN.test(phone)) errors.phoneNumber = 'Enter a valid phone number.'
  return errors
}

export function RegistrationForm({ isSubmitting, fieldErrors, onSubmit }: RegistrationFormProps) {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [localErrors, setLocalErrors] = useState<FieldErrors<RegistrationField>>({})
  const errors = { ...fieldErrors, ...localErrors }
  const update = (field: keyof RegistrationFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setLocalErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return
    const nextErrors = validate(values)
    setLocalErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0 || !values.gender) return
    await onSubmit({
      email: values.email.trim(), password: values.password,
      fullName: values.fullName.trim(),
      department: values.department.trim(), yearOfStudy: Number(values.yearOfStudy),
      gender: values.gender, phoneNumber: values.phoneNumber.trim() || null,
    })
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit} noValidate>
      <div className="registration-form__grid">
        <FormField id="registration-full-name" label="Full name" name="fullName" autoComplete="name" value={values.fullName} onChange={(event) => update('fullName', event.target.value)} error={errors.fullName} disabled={isSubmitting} maxLength={150} required />
        <FormField id="registration-email" label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={(event) => update('email', event.target.value)} error={errors.email} disabled={isSubmitting} required />
        <PasswordInput id="registration-password" label="Password" name="password" autoComplete="new-password" value={values.password} onChange={(event) => update('password', event.target.value)} error={errors.password} disabled={isSubmitting} required />
        <FormField id="registration-department" label="Department" name="department" value={values.department} onChange={(event) => update('department', event.target.value)} error={errors.department} disabled={isSubmitting} maxLength={100} required />
        <FormField id="registration-year" label="Year of study" name="yearOfStudy" type="number" inputMode="numeric" min={MIN_YEAR_OF_STUDY} max={MAX_YEAR_OF_STUDY} step={1} value={values.yearOfStudy} onChange={(event) => update('yearOfStudy', event.target.value)} error={errors.yearOfStudy} disabled={isSubmitting} required />
        <SelectDropdown className="registration-form__field" label="Gender" value={values.gender} options={[{ value: '', label: 'Select an option' }, ...GENDERS]} disabled={isSubmitting} required error={errors.gender} reserveErrorSpace onChange={(value) => update('gender', value)} />
        <FormField id="registration-phone" label="Phone number (optional)" name="phoneNumber" type="tel" autoComplete="tel" value={values.phoneNumber} onChange={(event) => update('phoneNumber', event.target.value)} error={errors.phoneNumber} disabled={isSubmitting} maxLength={20} />
      </div>
      <button className="registration-form__submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoadingSpinner label="Submitting registration" /> : 'Submit registration'}
      </button>
    </form>
  )
}
