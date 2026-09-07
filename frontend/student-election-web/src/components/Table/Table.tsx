// src/components/Table/Table.tsx
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AgGridReact } from 'ag-grid-react'
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type ColDefField,
} from 'ag-grid-community'
import styles from './Table.module.scss'
import { Button } from '@shared/components/Button/Button'
import maximizeIcon from '@shared/assets/icons/maximize.svg'
import restoreIcon from '@shared/assets/icons/restore.svg'
import type { TableProps } from '@shared/types/table.types'

export type { Column, TableProps } from '@shared/types/table.types'

ModuleRegistry.registerModules([AllCommunityModule])

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No data available",
  loading = false,
  loadingContent,
  caption,
  className,
  canMaximize = true,
}: TableProps<T>) {
  const [maximizedContainer, setMaximizedContainer] = useState<HTMLElement | null>(null)
  const isMaximized = Boolean(maximizedContainer)

  useEffect(() => {
    if (!isMaximized) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMaximizedContainer(null)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMaximized])

  const toggleMaximize = () => {
    if (isMaximized) {
      setMaximizedContainer(null)
      return
    }
    setMaximizedContainer(document.querySelector<HTMLElement>('.app-shell__content'))
  }

  const columnDefs: ColDef<T>[] = columns.map((column) => ({
    colId: column.key,
    field: column.key as ColDefField<T>,
    headerName: column.header,
    width: column.width ? parseFloat(column.width) * 16 : undefined,
    minWidth: column.width ? parseFloat(column.width) * 16 : 120,
    maxWidth: column.maxWidth ? parseFloat(column.maxWidth) * 16 : undefined,
    pinned: column.sticky,
    sortable: column.sortable ?? true,
    filter: column.filterable ?? true,
    resizable: true,
    cellStyle: {
      textAlign: column.align ?? 'left',
      justifyContent: column.align === 'center' ? 'center' : column.align === 'right' ? 'flex-end' : 'flex-start',
    },
    cellRenderer: column.render
      ? (params: { data: T; node: { rowIndex: number | null } }) =>
          column.render?.(params.data, params.node.rowIndex ?? 0)
      : undefined,
  }))

  const tableClassName = [styles.tableWrapper, isMaximized ? styles.maximized : '', className].filter(Boolean).join(' ')

  if (loading || data.length === 0) {
    return (
      <div className={`${tableClassName} ${styles.state}`} role="status" aria-busy={loading}>
        {loading ? loadingContent || 'Loading...' : emptyMessage}
      </div>
    )
  }

  const tableContent = (
    <div className={tableClassName} role="region" aria-label={caption}>
      {canMaximize && <div className={styles.tableControls}>
        <Button
          className={styles.maximizeButton}
          variant="secondary"
          size="small"
          aria-label={isMaximized ? 'Restore table' : 'Maximize table'}
          aria-pressed={isMaximized}
          title={isMaximized ? 'Restore table' : 'Maximize table'}
          onClick={toggleMaximize}
        >
          <img src={isMaximized ? restoreIcon : maximizeIcon} alt="" aria-hidden="true" />
        </Button>
      </div>}
      <div className={styles.grid}>
        <AgGridReact<T>
          theme={themeQuartz}
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, filter: true, resizable: true, unSortIcon: true }}
          getRowId={(params) => String(keyExtractor(params.data))}
          suppressCellFocus
          animateRows
        />
      </div>
    </div>
  )

  return maximizedContainer ? createPortal(tableContent, maximizedContainer) : tableContent
}

export default Table;
