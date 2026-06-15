import type { StudentResponse } from '@/shared/types/student'
import api from './axios'

export const getStudents = async (): Promise<StudentResponse[]> => {
  try {
    const response = await api.get<StudentResponse[]>('/users/students')
    return response.data ?? []
  } catch (e) {
    console.error(e)
    return []
  }
}