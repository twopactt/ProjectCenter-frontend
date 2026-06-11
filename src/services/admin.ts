import type { AdminDashboardResponse } from '@/shared/types/admin'
import api from './axios'

export const getAdminDashboard = async (): Promise<AdminDashboardResponse | null> => {
	try {
		const response = await api.get<AdminDashboardResponse>(`/Admin/dashboard`)
		return response.data
	} catch (e) {
		console.error(e)
		return null
	}
}
