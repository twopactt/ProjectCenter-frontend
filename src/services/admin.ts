import type {
	AdminActiveTeacher,
	AdminDashboardResponse,
	AdminLastProject,
	AdminRecentActivity,
} from '@/shared/types/admin'
import api from './axios'

export const getAdminDashboard = async (): Promise<AdminDashboardResponse | null> => {
	try {
		const response = await api.get<AdminDashboardResponse>(`/admin/dashboard`)
		return response.data
	} catch (e) {
		console.error(e)
		return null
	}
}

export const getAdminLastProjects = async (
	count = 5,
): Promise<AdminLastProject[]> => {
	const response = await api.get<AdminLastProject[]>(
		`/admin/last-projects?count=${count}`,
	)
	return response.data
}

export const getAdminActiveTeachers = async (): Promise<AdminActiveTeacher[]> => {
	const response = await api.get<AdminActiveTeacher[]>(`/admin/active-teachers`)
	return response.data
}

export const getAdminRecentActivity = async (
	count = 5,
): Promise<AdminRecentActivity[]> => {
	const response = await api.get<AdminRecentActivity[]>(
		`/admin/recent-activity?count=${count}`,
	)
	return response.data
}
