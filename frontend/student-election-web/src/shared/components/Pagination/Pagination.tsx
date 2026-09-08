import { Button } from '@shared/components/Button/Button'
import { SelectDropdown } from '@shared/components/SelectDropdown/SelectDropdown'
import type { PaginationProps } from '@shared/types/pagination.types'
import './Pagination.scss'

const PAGE_SIZES = [10, 20, 50]

export function Pagination({ pageNumber, pageSize, totalCount, totalPages, isDisabled, ariaLabel = 'Pagination', onPageChange, onPageSizeChange }: PaginationProps) {
  return (
    <div className="pagination" aria-label={ariaLabel}>
      <p>{totalCount} {totalCount === 1 ? 'result' : 'results'}</p>
      <SelectDropdown className="pagination__page-size" label="Rows per page" value={String(pageSize)} disabled={isDisabled} options={PAGE_SIZES.map((size) => ({ value: String(size), label: String(size) }))} onChange={(value) => onPageSizeChange(Number(value))} />
      <div className="pagination__controls">
        <Button size="small" variant="secondary" disabled={isDisabled || pageNumber <= 1} onClick={() => onPageChange(pageNumber - 1)}>Previous</Button>
        <span>Page {pageNumber} of {Math.max(totalPages, 1)}</span>
        <Button size="small" variant="secondary" disabled={isDisabled || pageNumber >= totalPages} onClick={() => onPageChange(pageNumber + 1)}>Next</Button>
      </div>
    </div>
  )
}
