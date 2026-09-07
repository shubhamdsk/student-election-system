// src/components/Table/Table.tsx
import type { ReactNode } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type ColDefField,
} from 'ag-grid-community'
import styles from './Table.module.scss'

ModuleRegistry.registerModules([AllCommunityModule])

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, rowIndex: number) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sticky?: 'left' | 'right';
  sortable?: boolean;
  filterable?: boolean;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  emptyMessage?: string;
  loading?: boolean;
  loadingContent?: ReactNode;
  caption?: string;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No data available",
  loading = false,
  loadingContent,
  caption,
  className,
}: TableProps<T>) {
  const columnDefs: ColDef<T>[] = columns.map((column) => ({
    colId: column.key,
    field: column.key as ColDefField<T>,
    headerName: column.header,
    width: column.width ? parseFloat(column.width) * 16 : undefined,
    minWidth: column.width ? parseFloat(column.width) * 16 : 120,
    pinned: column.sticky,
    sortable: column.sortable ?? true,
    filter: column.filterable ?? true,
    resizable: true,
    cellStyle: { textAlign: column.align ?? 'left' },
    cellRenderer: column.render
      ? (params: { data: T; node: { rowIndex: number | null } }) =>
          column.render?.(params.data, params.node.rowIndex ?? 0)
      : undefined,
  }))

  const tableClassName = [styles.tableWrapper, className].filter(Boolean).join(' ')

  if (loading || data.length === 0) {
    return (
      <div className={`${tableClassName} ${styles.state}`} role="status" aria-busy={loading}>
        {loading ? loadingContent || 'Loading...' : emptyMessage}
      </div>
    )
  }

  return (
    <div className={tableClassName} role="region" aria-label={caption}>
      <AgGridReact<T>
        theme={themeQuartz}
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          unSortIcon: true,
        }}
        getRowId={(params) => String(keyExtractor(params.data))}
        suppressCellFocus
        animateRows
      />
    </div>
  );
}

export default Table;
