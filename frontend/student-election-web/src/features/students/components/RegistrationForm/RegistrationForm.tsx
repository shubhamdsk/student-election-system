import { useState, type FormEvent } from 'react'
import type { Gender } from '@core/types/enums'
import type { FieldErrors } from '@core/utils/form-errors'
import { FormField } from '@shared/components/FormField/FormField'
import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import { PasswordInput } from '@shared/components/PasswordInput/PasswordInput'
import type { RegistrationField, RegistrationFormProps, RegistrationFormValues } from '../../types/student.types'
import './RegistrationForm.scss'

const INITIAL_VALUES: RegistrationFormValues = {
  email: '', password: '', registrationNumber: '', fullName: '', department: '',
  yearOfStudy: '', gender: '', phoneNumber: '',
}
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^\+?[\d\s().-]{7,20}$/
const GENDERS: readonly { value: Gender; label: string }[] = [
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
  if (!values.registrationNumber.trim()) errors.registrationNumber = 'Registration number is required.'
  else if (values.registrationNumber.trim().length > 30) errors.registrationNumber = 'Use 30 characters or fewer.'
  if (!values.fullName.trim()) errors.fullName = 'Full name is required.'
  else if (values.fullName.trim().length > 150) errors.fullName = 'Use 150 characters or fewer.'
  if (!values.department.trim()) errors.department = 'Department is required.'
  else if (values.department.trim().length > 100) errors.department = 'Use 100 characters or fewer.'
  if (!values.yearOfStudy) errors.yearOfStudy = 'Year of study is required.'
  else if (!Number.isInteger(year) || year < 1 || year > 10) errors.yearOfStudy = 'Enter a whole number from 1 to 10.'
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
      registrationNumber: values.registrationNumber.trim(), fullName: values.fullName.trim(),
      department: values.department.trim(), yearOfStudy: Number(values.yearOfStudy),
      gender: values.gender, phoneNumber: values.phoneNumber.trim() || null,
    })
  }

  const genderErrorId = 'registration-gender-error'
  return (
    <form className="registration-form" onSubmit={handleSubmit} noValidate>
      <div className="registration-form__grid">
        <FormField id="registration-full-name" label="Full name" name="fullName" autoComplete="name" value={values.fullName} onChange={(event) => update('fullName', event.target.value)} error={errors.fullName} disabled={isSubmitting} maxLength={150} required />
        <FormField id="registration-number" label="Registration number" name="registrationNumber" value={values.registrationNumber} onChange={(event) => update('registrationNumber', event.target.value)} error={errors.registrationNumber} disabled={isSubmitting} maxLength={30} required />
        <FormField id="registration-email" label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={(event) => update('email', event.target.value)} error={errors.email} disabled={isSubmitting} required />
        <PasswordInput id="registration-password" label="Password" name="password" autoComplete="new-password" value={values.password} onChange={(event) => update('password', event.target.value)} error={errors.password} disabled={isSubmitting} required />
        <FormField id="registration-department" label="Department" name="department" value={values.department} onChange={(event) => update('department', event.target.value)} error={errors.department} disabled={isSubmitting} maxLength={100} required />
        <FormField id="registration-year" label="Year of study" name="yearOfStudy" type="number" inputMode="numeric" min={1} max={10} step={1} value={values.yearOfStudy} onChange={(event) => update('yearOfStudy', event.target.value)} error={errors.yearOfStudy} disabled={isSubmitting} required />
        <div className={`registration-form__field${errors.gender ? ' registration-form__field--invalid' : ''}`}>
          <label htmlFor="registration-gender">Gender <span aria-hidden="true">*</span></label>
          <select id="registration-gender" name="gender" value={values.gender} onChange={(event) => update('gender', event.target.value)} disabled={isSubmitting} required aria-invalid={Boolean(errors.gender)} aria-describedby={errors.gender ? genderErrorId : undefined}>
            <option value="">Select an option</option>
            {GENDERS.map((gender) => <option key={gender.value} value={gender.value}>{gender.label}</option>)}
          </select>
          <p
            id={genderErrorId}
            className={errors.gender ? 'registration-form__field-error--visible' : undefined}
            aria-hidden={!errors.gender}
          >
            {errors.gender ? `Error: ${errors.gender}` : ''}
          </p>
        </div>
        <FormField id="registration-phone" label="Phone number (optional)" name="phoneNumber" type="tel" autoComplete="tel" value={values.phoneNumber} onChange={(event) => update('phoneNumber', event.target.value)} error={errors.phoneNumber} disabled={isSubmitting} maxLength={20} />
      </div>
      <button className="registration-form__submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoadingSpinner label="Submitting registration" /> : 'Submit registration'}
      </button>
    </form>
  )
}
