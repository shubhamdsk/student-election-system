import type { StudentSearchProps } from '../../types/admin-student.types'
import './StudentSearch.scss'

export function StudentSearch({ value, onChange }: StudentSearchProps) {
  return (
    <div className="student-search">
      <label htmlFor="pending-student-search">Search students</label>
      <input
        id="pending-student-search"
        type="search"
        value={value}
        placeholder="Search by name, registration number, or email"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
