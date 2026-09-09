import { queryOptions, useQuery } from '@tanstack/react-query'
import { studentKeys } from '@core/query/queryKeys'
import { studentService } from '@features/students/services/StudentService'

export const currentStudentProfileQueryOptions = () => queryOptions({
  queryKey: studentKeys.currentProfile(),
  queryFn: () => studentService.getCurrentStudent(),
  staleTime: 1000 * 60,
})

export function useCurrentStudentProfile() {
  return useQuery(currentStudentProfileQueryOptions())
}
