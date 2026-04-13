import type {
	ProjectRequest,
	ProjectResponse,
	TeacherProjectResponse,
} from '@/shared/types/project'
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
	id: number,
): Promise<ProjectResponse | null> => {
	try {
		const response = await api.get<ProjectResponse>(`/projects/${id}`)
		return response.data
	} catch (e) {
		console.error(e)
		return null
	}
}

export const getMyProject = async (): Promise<ProjectResponse | null> => {
	try {
		const response = await api.get<ProjectResponse>(`/projects/my`)
		return response.data
	} catch (e) {
		console.error(e)
		return null
	}
}

export const getMyStudentsProjects = async (): Promise<
	TeacherProjectResponse[] | null
> => {
	try {
		const response =
			await api.get<TeacherProjectResponse[]>(`/teacher/students`)
		return response.data ?? []
	} catch (e) {
		console.error(e)
		return null
	}
}

export const getStudentProjectById = async (
	id: number,
): Promise<ProjectResponse | null> => {
	try {
		const response = await api.get<ProjectResponse>(
			`/teacher/students/projects/${id}`,
		)
		return response.data
	} catch (e) {
		console.error(e)
		return null
	}
}

export const updateStudentProjectById = async (
	id: number,
	data: {
		title: string
		typeId: number
		subjectId: number
		dateDeadline: string
	},
): Promise<ProjectResponse | null> => {
	try {
		const response = await api.put<ProjectResponse>(
			`/teacher/students/projects/${id}`,
			data,
		)
		return response.data
	} catch (e) {
		console.error(e)
		return null
	}
}

export const createProject = async (
	projectData: ProjectRequest,
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
	projectData: ProjectRequest,
): Promise<ProjectResponse | null> => {
	try {
		const response = await api.put<ProjectResponse>(
			`/projects/${id}`,
			projectData,
		)
		return response.data
	} catch (e) {
		console.error(e)
		return null
	}
}

export const updateMyProject = async (
	id: number,
	projectData: ProjectRequest,
): Promise<ProjectResponse | null> => {
	try {
		const response = await api.put<ProjectResponse>(
			`/projects/my/${id}`,
			projectData,
		)
		return response.data
	} catch (e) {
		console.error(e)
		return null
	}
}

export const updateMyProjectFiles = async (
	id: number,
	data: FormData,
): Promise<ProjectResponse | null> => {
	try {
		const response = await api.put<ProjectResponse>(`/projects/my/${id}`, data)
		return response.data
	} catch (e) {
		console.error(e)
		return null
	}
}

export const deleteProject = async (id: number): Promise<boolean> => {
	try {
		await api.delete(`/projects/${id}`)
		return true
	} catch (e) {
		console.error(e)
		return false
	}
}
