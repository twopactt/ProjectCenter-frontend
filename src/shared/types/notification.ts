export interface NotificationResponse {
	id: number
	title: string
	text: string
	createdAt: string
	isRead: boolean
	typeName: string
	typeId: number
}

export interface UnreadCountResponse {
	unreadCount: number
}
