import { Button } from '@shared/components/Button/Button'
import type { PaginationProps } from '@shared/types/pagination.types'
import './Pagination.scss'

const PAGE_SIZES = [10, 20, 50]

export function Pagination({ pageNumber, pageSize, totalCount, totalPages, isDisabled, ariaLabel = 'Pagination', onPageChange, onPageSizeChange }: PaginationProps) {
  return <div className="pagination" aria-label={ariaLabel}>
    <p>{totalCount} {totalCount === 1 ? 'result' : 'results'}</p>
    <label htmlFor={`${ariaLabel.replaceAll(' ', '-').toLowerCase()}-size`}>Rows per page<select id={`${ariaLabel.replaceAll(' ', '-').toLowerCase()}-size`} value={pageSize} disabled={isDisabled} onChange={(event) => onPageSizeChange(Number(event.target.value))}>{PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}</select></label>
    <div className="pagination__controls"><Button variant="secondary" disabled={isDisabled || pageNumber <= 1} onClick={() => onPageChange(pageNumber - 1)}>Previous</Button><span>Page {pageNumber} of {Math.max(totalPages, 1)}</span><Button variant="secondary" disabled={isDisabled || pageNumber >= totalPages} onClick={() => onPageChange(pageNumber + 1)}>Next</Button></div>
  </div>
}
