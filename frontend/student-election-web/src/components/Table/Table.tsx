// src/components/Table/Table.tsx
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AgGridReact } from 'ag-grid-react'
import {
  AllCommunityModule,
  ModuleRegistry,
  colorSchemeDark,
  themeQuartz,
  type ColDef,
  type ColDefField,
  type GridApi,
} from 'ag-grid-community'
import styles from './Table.module.scss'
import { Button } from '@shared/components/Button/Button'
import maximizeIcon from '@shared/assets/icons/maximize.svg'
import restoreIcon from '@shared/assets/icons/restore.svg'
import type { TableProps } from '@shared/types/table.types'

export type { Column, TableProps } from '@shared/types/table.types'

ModuleRegistry.registerModules([AllCommunityModule])

function parseWidth(val?: string | number): number | undefined {
  if (val === undefined || val === null) return undefined
  if (typeof val === 'number') return val
  const str = String(val).trim()
  if (str.endsWith('rem')) return parseFloat(str) * 16
  if (str.endsWith('px')) return parseFloat(str)
  const parsed = parseFloat(str)
  return isNaN(parsed) ? undefined : parsed
}

const darkTheme = themeQuartz.withPart(colorSchemeDark).withParams({
  accentColor: '#6366f1',
  backgroundColor: 'rgba(15, 23, 42, 0.75)',
  headerBackgroundColor: 'rgba(30, 41, 59, 0.85)',
  headerTextColor: '#f8fafc',
  foregroundColor: '#e2e8f0',
  borderColor: 'rgba(255, 255, 255, 0.08)',
  rowHoverColor: 'rgba(99, 102, 241, 0.12)',
})

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available',
  loading = false,
  loadingContent,
  caption,
  className,
  canMaximize = true,
}: TableProps<T>) {
  const [isMaximized, setIsMaximized] = useState(false)
  const gridApiRef = useRef<GridApi<T> | null>(null)

  // Escape key to restore
  useEffect(() => {
    if (!isMaximized) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMaximized(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMaximized])

  useEffect(() => {
    const prev = document.body.style.overflow
    if (isMaximized) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = prev
    }
    return () => { document.body.style.overflow = prev }
  }, [isMaximized])

  // Re-fit columns after maximize/restore so AG Grid remeasures the new container
  useEffect(() => {
    const api = gridApiRef.current
    if (!api) return
    // setTimeout gives the portal DOM commit + CSS paint time to settle
    // before AG Grid measures the new container width
    const id = setTimeout(() => { api.sizeColumnsToFit() }, 50)
    return () => clearTimeout(id)
  }, [isMaximized])

  const columnDefs: ColDef<T>[] = columns.map((column) => {
    const widthVal = parseWidth(column.width)
    const minWidthVal = parseWidth(column.minWidth) ?? widthVal ?? 120
    const maxWidthVal = parseWidth(column.maxWidth)

    return {
      colId: column.key,
      field: column.key as ColDefField<T>,
      headerName: column.header,
      width: widthVal,
      minWidth: minWidthVal,
      maxWidth: maxWidthVal,
      pinned: column.sticky,
      sortable: column.sortable ?? true,
      filter: column.filterable ?? true,
      resizable: true,
      cellStyle: {
        textAlign: column.align ?? 'left',
        justifyContent:
          column.align === 'center' ? 'center' : column.align === 'right' ? 'flex-end' : 'flex-start',
      },
      cellRenderer: column.render
        ? (params: { data: T; node: { rowIndex: number | null } }) =>
          params.data ? column.render?.(params.data, params.node?.rowIndex ?? 0) : null
        : undefined,
    }
  })

  const safeData = Array.isArray(data) ? data : []
  const tableClassName = [styles.tableWrapper, isMaximized ? styles.maximized : '', className]
    .filter(Boolean)
    .join(' ')

  if (loading || safeData.length === 0) {
    return (
      <div className={`${tableClassName} ${styles.state}`} role="status" aria-busy={loading}>
        {loading ? loadingContent || 'Loading...' : emptyMessage}
      </div>
    )
  }

  const card = (
    <div className={tableClassName} role="region" aria-label={caption}>
      {/* Maximize button — only visible in normal mode, inside the controls bar */}
      {canMaximize && !isMaximized && (
        <div className={styles.tableControls}>
          <Button
            className={styles.maximizeButton}
            variant="secondary"
            size="small"
            aria-label="Maximize table"
            title="Maximize table"
            onClick={() => setIsMaximized(true)}
          >
            <img src={maximizeIcon} alt="" aria-hidden="true" />
          </Button>
        </div>
      )}
      <div className={styles.grid}>
        <AgGridReact<T>
          theme={darkTheme}
          rowData={safeData}
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, filter: true, resizable: true, unSortIcon: true }}
          getRowId={(params) => String(keyExtractor(params.data))}
          onGridReady={(params) => { gridApiRef.current = params.api }}
          onFirstDataRendered={(params) => { params.api.sizeColumnsToFit() }}
          suppressCellFocus
          animateRows
        />
      </div>
    </div>
  )

  // Restore button is portalled directly into document.body as its own fixed element
  // (z-index 1001, above the card at z-index 1000) so it can never be buried under
  // AG Grid's internal stacking contexts
  const restorePortal = canMaximize && isMaximized
    ? createPortal(
      <div className={styles.restoreButtonPortal}>
        <Button
          className={styles.maximizeButton}
          variant="secondary"
          size="small"
          aria-label="Restore table"
          title="Restore table (Esc)"
          onClick={() => setIsMaximized(false)}
        >
          <img src={restoreIcon} alt="" aria-hidden="true" />
        </Button>
      </div>,
      document.body
    )
    : null

  return (
    <>
      {isMaximized ? createPortal(card, document.body) : card}
      {restorePortal}
    </>
  )
}

export default Table
