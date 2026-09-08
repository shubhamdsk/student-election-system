import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import type { SelectDropdownProps } from '@shared/types/select-dropdown.types'
import chevronDownIcon from '@shared/assets/icons/chevron-down.svg'
import './SelectDropdown.scss'

export function SelectDropdown({ label, value, options, disabled = false, required = false, error, reserveErrorSpace = false, className, onChange }: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const generatedId = useId()
  const labelId = `${generatedId}-label`
  const valueId = `${generatedId}-value`
  const optionsId = `${generatedId}-options`
  const errorId = `${generatedId}-error`
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value))
  const selectedLabel = options[selectedIndex]?.label ?? ''

  useEffect(() => {
    if (!isOpen) return
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) setIsOpen(false)
    }
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  const open = () => {
    setIsOpen(true)
    requestAnimationFrame(() => optionRefs.current[selectedIndex]?.focus())
  }

  const selectOption = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined
    if (event.key === 'ArrowDown') nextIndex = (index + 1) % options.length
    if (event.key === 'ArrowUp') nextIndex = (index - 1 + options.length) % options.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = options.length - 1
    if (nextIndex !== undefined) {
      event.preventDefault()
      optionRefs.current[nextIndex]?.focus()
    }
  }

  const classes = ['select-dropdown', isOpen ? 'select-dropdown--open' : '', error ? 'select-dropdown--invalid' : '', className].filter(Boolean).join(' ')

  return <div ref={containerRef} className={classes}>
    <span id={labelId} className="select-dropdown__label">{label} {required && <span className="select-dropdown__required" aria-hidden="true">*</span>}</span>
    <button type="button" className={`select-dropdown__trigger${isOpen ? ' select-dropdown__trigger--open' : ''}`} disabled={disabled} aria-labelledby={`${labelId} ${valueId}`} aria-haspopup="listbox" aria-expanded={isOpen} aria-controls={optionsId} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} onKeyDown={(event) => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); open() } }} onClick={() => { if (isOpen) setIsOpen(false); else open() }}>
      <span id={valueId} className="select-dropdown__value" title={selectedLabel}>{selectedLabel}</span>
      <img className="select-dropdown__chevron" src={chevronDownIcon} alt="" aria-hidden="true" />
    </button>
    {isOpen && <div id={optionsId} className="select-dropdown__options" role="listbox" aria-labelledby={labelId}>
      {options.map((option, index) => <button ref={(element) => { optionRefs.current[index] = element }} type="button" role="option" aria-selected={option.value === value} key={option.value} title={option.label} onKeyDown={(event) => handleOptionKeyDown(event, index)} onClick={() => selectOption(option.value)}>{option.label}</button>)}
    </div>}
    {(reserveErrorSpace || error) && <p id={errorId} className="select-dropdown__error" aria-live="polite">{error ? `Error: ${error}` : ''}</p>}
  </div>
}
