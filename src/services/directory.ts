import type { TypeResponse } from '@/shared/types/typeProject'
import type { SubjectResponse } from '@/shared/types/subject'
import type { GroupResponse } from '@/shared/types/group'
import type { StatusProjectResponse } from '@/shared/types/statusProject'
import api from './axios'

export const getTypes = async (): Promise<TypeResponse[]> => {
	try {
		const response = await api.get<TypeResponse[]>(`/directory/types`)
		return response.data ?? []
	} catch (e) {
		console.error(e)
		return []
	}
}

export const getSubjects = async (): Promise<SubjectResponse[]> => {
	try {
		const response = await api.get<SubjectResponse[]>(`/directory/subjects`)
		return response.data ?? []
	} catch (e) {
		console.error(e)
		return []
	}
}

export const getGroups = async (): Promise<GroupResponse[]> => {
	try {
		const response = await api.get<GroupResponse[]>(`/directory/groups`)
		return response.data ?? []
	} catch (e) {
		console.error(e)
		return []
	}
}

export const getStatuses = async (): Promise<StatusProjectResponse[]> => {
	try {
		const response =
			await api.get<StatusProjectResponse[]>(`/directory/statuses`)
		return response.data ?? []
	} catch (e) {
		console.error(e)
		return []
	}
}

export const createGroup = async (
	name: string,
): Promise<GroupResponse | null> => {
	try {
		const response = await api.post<GroupResponse>(`/directory/groups`, {
			name,
		})
		return response.data
	} catch (e) {
		console.error(e)
		return null
	}
}
