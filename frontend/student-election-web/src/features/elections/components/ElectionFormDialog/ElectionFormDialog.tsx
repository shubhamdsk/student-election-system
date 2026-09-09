import { useEffect, useRef, useState, type FormEvent } from 'react'
import { toLocalDateTimeInput, toUtcIsoString } from '@core/utils/date'
import type { FieldErrors } from '@core/utils/form-errors'
import { Button } from '@shared/components/Button/Button'
import type { ElectionFormDialogProps, ElectionFormField, ElectionFormValues } from '../../types/election-management.types'
import '../ElectionDialog/ElectionDialog.scss'
import './ElectionFormDialog.scss'

function initialValues({ election }: ElectionFormDialogProps): ElectionFormValues {
  return {
    title: election?.title ?? '',
    description: election?.description ?? '',
    nominationStartAt: election ? toLocalDateTimeInput(election.nominationStartAt) : '',
    nominationEndAt: election ? toLocalDateTimeInput(election.nominationEndAt) : '',
    votingStartAt: election ? toLocalDateTimeInput(election.votingStartAt) : '',
    votingEndAt: election ? toLocalDateTimeInput(election.votingEndAt) : '',
    maxCandidates: election?.maxCandidates?.toString() ?? '',
  }
}

function validate(values: ElectionFormValues): FieldErrors<ElectionFormField> {
  const errors: FieldErrors<ElectionFormField> = {}
  if (!values.title.trim()) errors.title = 'Title is required.'
  else if (values.title.trim().length > 200) errors.title = 'Use 200 characters or fewer.'
  if (values.description.trim().length > 2000) errors.description = 'Use 2000 characters or fewer.'
  const maximum = Number(values.maxCandidates)
  if (!values.maxCandidates) errors.maxCandidates = 'Maximum candidates is required.'
  else if (!Number.isInteger(maximum) || maximum <= 0) errors.maxCandidates = 'Enter a positive whole number.'
  const dateFields: readonly ElectionFormField[] = ['nominationStartAt', 'nominationEndAt', 'votingStartAt', 'votingEndAt']
  dateFields.forEach((field) => { if (!values[field]) errors[field] = 'Date and time are required.' })
  if (values.nominationStartAt && values.nominationEndAt && new Date(values.nominationEndAt) <= new Date(values.nominationStartAt)) errors.nominationEndAt = 'Nomination end must be after nomination start.'
  if (values.nominationEndAt && values.votingStartAt && new Date(values.votingStartAt) < new Date(values.nominationEndAt)) errors.votingStartAt = 'Voting start cannot be before nomination end.'
  if (values.votingStartAt && values.votingEndAt && new Date(values.votingEndAt) <= new Date(values.votingStartAt)) errors.votingEndAt = 'Voting end must be after voting start.'
  return errors
}

export function ElectionFormDialog(props: ElectionFormDialogProps) {
  const { mode, isLoading, isSubmitting, serverErrors, onClose, onSubmit } = props
  const dialogRef = useRef<HTMLDialogElement>(null)
  const isUnavailable = mode === 'edit' && !isLoading && !props.election
  const [values, setValues] = useState(() => initialValues(props))
  const [localErrors, setLocalErrors] = useState<FieldErrors<ElectionFormField>>({})
  const errors = { ...localErrors, ...serverErrors }

  useEffect(() => { if (dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal() }, [])

  const update = (field: ElectionFormField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setLocalErrors((current) => ({ ...current, [field]: undefined }))
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setLocalErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit({
      title: values.title.trim(),
      description: values.description.trim() || null,
      nominationStartAt: toUtcIsoString(values.nominationStartAt),
      nominationEndAt: toUtcIsoString(values.nominationEndAt),
      votingStartAt: toUtcIsoString(values.votingStartAt),
      votingEndAt: toUtcIsoString(values.votingEndAt),
      maxCandidates: Number(values.maxCandidates),
    })
  }

  const field = (name: ElectionFormField, label: string, type = 'text') => (
    <div className="election-form__field">
      <label htmlFor={`election-${name}`}>{label} <span aria-hidden="true">*</span></label>
      <input
        id={`election-${name}`}
        type={type}
        value={values[name]}
        disabled={isSubmitting}
        maxLength={name === 'title' ? 200 : undefined}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={`${name}-error`}
        onChange={(event) => update(name, event.target.value)}
      />
      <p id={`${name}-error`} className="election-form__error">{errors[name] && `Error: ${errors[name]}`}</p>
    </div>
  )

  return (
    <dialog
      ref={dialogRef}
      className="election-dialog"
      aria-labelledby="election-form-title"
      onCancel={(event) => { if (isSubmitting) event.preventDefault(); else onClose() }}
    >
      <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
        <header className="election-dialog__header">
          <h2 id="election-form-title">{mode === 'create' ? 'Create election' : 'Edit election'}</h2>
          <button type="button" className="election-dialog__close" aria-label="Close dialog" disabled={isSubmitting} onClick={onClose}>
            ✕
          </button>
        </header>
        <div className="election-dialog__content">
          {isLoading ? (
            <span>Loading election...</span>
          ) : isUnavailable ? (
            <p>Election details could not be loaded.</p>
          ) : (
            <div className="election-form">
              {field('title', 'Title')}
              <div className="election-form__field election-form__field--wide">
                <label htmlFor="election-description">Description</label>
                <textarea
                  id="election-description"
                  value={values.description}
                  maxLength={2000}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby="description-error"
                  onChange={(event) => update('description', event.target.value)}
                />
                <p id="description-error" className="election-form__error">{errors.description && `Error: ${errors.description}`}</p>
              </div>
              {field('nominationStartAt', 'Nomination start', 'datetime-local')}
              {field('nominationEndAt', 'Nomination end', 'datetime-local')}
              {field('votingStartAt', 'Voting start', 'datetime-local')}
              {field('votingEndAt', 'Voting end', 'datetime-local')}
              {field('maxCandidates', 'Maximum candidates', 'number')}
            </div>
          )}
        </div>
        <div className="election-dialog__actions">
          <Button variant="secondary" disabled={isSubmitting} onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting} loadingLabel="Saving" disabled={isLoading || isUnavailable}>
            {mode === 'create' ? 'Create Election' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </dialog>
  )
}
