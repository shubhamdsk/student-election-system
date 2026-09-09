import type { StudentSearchProps } from '../../types/admin-student.types'
import { YEAR_OF_STUDY_OPTIONS } from '../../constants/student.constants'
import { SelectDropdown } from '@shared/components/SelectDropdown/SelectDropdown'
import { SearchInput } from '@shared/components/SearchInput/SearchInput'
import './StudentSearch.scss'

const YEAR_FILTER_OPTIONS = [
  { value: '', label: 'All years' },
  ...YEAR_OF_STUDY_OPTIONS.map((year) => ({ value: String(year), label: `Year ${year}` })),
]

export function StudentSearch({
  value, department, departments, yearOfStudy, onChange, onDepartmentChange, onYearOfStudyChange, onClear,
}: StudentSearchProps) {
  const hasFilters = Boolean(value.trim() || department.trim() || yearOfStudy)

  return (
    <div className="student-search">
      <SearchInput
        id="pending-student-search"
        className="student-search__field student-search__field--query"
        label="Search"
        value={value}
        onChange={onChange}
        placeholder="Search name, registration no. or email"
        minChars={3}
      />
      <SelectDropdown
        className="student-search__field"
        label="Department"
        value={department}
        options={[{ value: '', label: 'All departments' }, ...departments.map((name) => ({ value: name, label: name }))]}
        onChange={onDepartmentChange}
      />
      <SelectDropdown
        className="student-search__field student-search__field--year"
        label="Year"
        value={String(yearOfStudy)}
        options={YEAR_FILTER_OPTIONS}
        onChange={(selectedYear) => onYearOfStudyChange(selectedYear ? Number(selectedYear) : '')}
      />
      <button className="student-search__clear" type="button" onClick={onClear} disabled={!hasFilters}>Clear</button>
    </div>
  )
}
