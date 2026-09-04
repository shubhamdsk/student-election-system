import { apiClient } from '@core/api/api-client'
import type { EmptyResponseData, PagedResult } from '@core/types/api'
import { buildQueryString } from '@core/utils/query-params'
import type {
  PendingStudent, PendingStudentsQuery, RegisterStudentRequest,
  RegisterStudentResponse, RejectStudentRequest, StudentDetails,
} from '../types/student.types'

const STUDENTS_ENDPOINT = '/students'
const resourcePath = (studentId: string) => `${STUDENTS_ENDPOINT}/${encodeURIComponent(studentId)}`

export class StudentService {
  async register(request: RegisterStudentRequest): Promise<RegisterStudentResponse> {
    return (await apiClient.post<RegisterStudentRequest, RegisterStudentResponse>(`${STUDENTS_ENDPOINT}/register`, request)).data
  }

  async getPending(query: PendingStudentsQuery = {}): Promise<PagedResult<PendingStudent>> {
    const queryString = buildQueryString(query)
    return (await apiClient.get<PagedResult<PendingStudent>>(`${STUDENTS_ENDPOINT}/pending${queryString}`)).data
  }

  async getById(studentId: string): Promise<StudentDetails> {
    return (await apiClient.get<StudentDetails>(resourcePath(studentId))).data
  }

  async approve(studentId: string): Promise<void> {
    await apiClient.put<undefined, EmptyResponseData>(`${resourcePath(studentId)}/approve`, undefined)
  }

  async reject(studentId: string, request: RejectStudentRequest): Promise<void> {
    await apiClient.put<RejectStudentRequest, EmptyResponseData>(`${resourcePath(studentId)}/reject`, request)
  }
}

export const studentService = new StudentService()
