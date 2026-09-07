import { Button } from '@shared/components/Button/Button'
import type { StudentPaginationProps } from '../../types/admin-student.types'
import './StudentPagination.scss'

const PAGE_SIZES = [10, 20, 50]

export function StudentPagination({ pageNumber, pageSize, totalCount, totalPages, isDisabled, onPageChange, onPageSizeChange }: StudentPaginationProps) {
  return (
    <div className="student-pagination" aria-label="Pending students pagination">
      <p>{totalCount} {totalCount === 1 ? 'result' : 'results'}</p>
      <label htmlFor="student-page-size">Rows per page
        <select id="student-page-size" value={pageSize} disabled={isDisabled} onChange={(event) => onPageSizeChange(Number(event.target.value))}>
          {PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
        </select>
      </label>
      <div className="student-pagination__controls">
        <Button variant="secondary" disabled={isDisabled || pageNumber <= 1} onClick={() => onPageChange(pageNumber - 1)}>Previous</Button>
        <span>Page {pageNumber} of {Math.max(totalPages, 1)}</span>
        <Button variant="secondary" disabled={isDisabled || pageNumber >= totalPages} onClick={() => onPageChange(pageNumber + 1)}>Next</Button>
      </div>
    </div>
  )
}
