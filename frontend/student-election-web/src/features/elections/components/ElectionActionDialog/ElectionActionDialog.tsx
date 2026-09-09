import { useEffect, useRef } from 'react'
import { Button } from '@shared/components/Button/Button'
import type { ElectionActionDialogProps } from '../../types/election-management.types'
import '../ElectionDialog/ElectionDialog.scss'

export function ElectionActionDialog({ selection, config, isSubmitting, onCancel, onConfirm }: ElectionActionDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (selection && config && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal()
  }, [config, selection])

  if (!selection || !config) return null

  return (
    <dialog
      ref={dialogRef}
      className="election-dialog"
      aria-labelledby="election-action-title"
      onCancel={(event) => { if (isSubmitting) event.preventDefault(); else onCancel() }}
    >
      <header className="election-dialog__header">
        <h2 id="election-action-title">{config.title}</h2>
        <button type="button" className="election-dialog__close" aria-label="Close dialog" disabled={isSubmitting} onClick={onCancel}>
          ✕
        </button>
      </header>
      <div className="election-dialog__content">
        <p className="election-dialog__message">{config.message}</p>
      </div>
      <div className="election-dialog__actions">
        <Button variant="secondary" disabled={isSubmitting} onClick={onCancel}>Cancel</Button>
        <Button variant={config.variant} isLoading={isSubmitting} loadingLabel="Working" onClick={onConfirm}>
          {config.confirmLabel}
        </Button>
      </div>
    </dialog>
  )
}
