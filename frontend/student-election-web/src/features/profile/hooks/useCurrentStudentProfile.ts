import { useQuery } from '@tanstack/react-query'
import { studentKeys } from '@core/query/queryKeys'
import { studentService } from '@features/students/services/StudentService'

export function useCurrentStudentProfile() {
  return useQuery({
    queryKey: studentKeys.currentProfile(),
    queryFn: () => studentService.getCurrentStudent(),
  })
}
