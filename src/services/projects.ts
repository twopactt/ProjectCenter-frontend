import type { ProjectRequest, ProjectResponse } from '@/shared/types/project'
import api from './axios'

export const getProjects = async (): Promise<ProjectResponse[]> => {
	try {
		const response = await api.get<ProjectResponse[]>(`/projects`)
		return response.data ?? []
	} catch (e) {
		console.error(e)
		return []
	}
}

export const getProjectById = async (
	id: number
): Promise<ProjectResponse | null> => {
	try {
		const response = await api.get<ProjectResponse>(`/projects/${id}`)
		return response.data
	} catch (e) {
		console.error(e)
		return null
	}
}

export const createProject = async (
	projectData: ProjectRequest
): Promise<ProjectResponse | null> => {
	try {
		const response = await api.post<ProjectResponse>(`/projects`, projectData)
		return response.data
	} catch (e) {
		console.error(e)
		return null
	}
}

export const updateProjectById = async (
	id: number,
	projectData: ProjectRequest
): Promise<ProjectResponse | null> => {
	try {
		const response = await api.put<ProjectResponse>(
			`/projects/${id}`,
			projectData
		)
		return response.data
	} catch (e) {
		console.error(e)
		return null
	}
}

export const updateMyProject = async (
	id: number,
	projectData: ProjectRequest
): Promise<ProjectResponse | null> => {
	try {
		const response = await api.put<ProjectResponse>(
			`/projects/my/${id}`,
			projectData
		)
		return response.data
	} catch (e) {
		console.error(e)
		return null
	}
}
