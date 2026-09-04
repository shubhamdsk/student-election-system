import { apiClient } from '@core/api/api-client'
import type { EmptyResponseData, PagedResult } from '@core/types/api'
import { buildQueryString } from '@core/utils/query-params'
import type {
  CurrentStudentProfile, PendingStudent, PendingStudentsQuery, RegisterStudentRequest,
  RegisterStudentResponse, RejectStudentRequest, StudentDetails,
} from '../types/student.types'

const STUDENTS_ENDPOINT = '/students'
const resourcePath = (studentId: string) => `${STUDENTS_ENDPOINT}/${encodeURIComponent(studentId)}`

export class StudentService {
  async getCurrentStudent(accessToken?: string): Promise<CurrentStudentProfile> {
    return (await apiClient.get<CurrentStudentProfile>(`${STUDENTS_ENDPOINT}/me`, { accessToken })).data
  }

  async registerStudent(request: RegisterStudentRequest): Promise<RegisterStudentResponse> {
    return (await apiClient.post<RegisterStudentRequest, RegisterStudentResponse>(`${STUDENTS_ENDPOINT}/register`, request)).data
  }

  async getPendingStudents(query: PendingStudentsQuery = {}): Promise<PagedResult<PendingStudent>> {
    const queryString = buildQueryString(query)
    return (await apiClient.get<PagedResult<PendingStudent>>(`${STUDENTS_ENDPOINT}/pending${queryString}`)).data
  }

  async getStudentById(studentId: string): Promise<StudentDetails> {
    return (await apiClient.get<StudentDetails>(resourcePath(studentId))).data
  }

  async approveStudent(studentId: string): Promise<void> {
    await apiClient.put<undefined, EmptyResponseData>(`${resourcePath(studentId)}/approve`, undefined)
  }

  async rejectStudent(studentId: string, request: RejectStudentRequest): Promise<void> {
    await apiClient.put<RejectStudentRequest, EmptyResponseData>(`${resourcePath(studentId)}/reject`, request)
  }
}

export const studentService = new StudentService()
