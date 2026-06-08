import type { NotificationResponse, UnreadCountResponse } from '@/shared/types/notification'
import api from './axios'

export const getNotifications = async (): Promise<NotificationResponse[]> => {
	try {
		const response = await api.get<NotificationResponse[]>(`/notifications`)
		return response.data ?? []
	} catch (e) {
		console.error(e)
		return []
	}
}

export const getUnreadNotifications = async (): Promise<
	NotificationResponse[]
> => {
	try {
		const response = await api.get<NotificationResponse[]>(
			`/notifications/unread`,
		)
		return response.data ?? []
	} catch (e) {
		console.error(e)
		return []
	}
}

export const getUnreadCount = async (): Promise<number> => {
	try {
		const response = await api.get<UnreadCountResponse>(
			`/notifications/unread/count`,
		)
		return response.data?.unreadCount ?? 0
	} catch (e) {
		console.error(e)
		return 0
	}
}
