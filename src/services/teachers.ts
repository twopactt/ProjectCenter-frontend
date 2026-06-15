import type { TeacherResponse } from '@/shared/types/teacher'
import api from './axios'

export const getTeachers = async (): Promise<TeacherResponse[]> => {
  try {
    const response = await api.get<TeacherResponse[]>('/teacher')
    return response.data ?? []
  } catch (e) {
    console.error(e)
    return []
  }
}