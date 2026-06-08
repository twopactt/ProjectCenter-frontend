import { useEffect, useState } from 'react'
import { Button, Text } from '@chakra-ui/react'
import Header from '@/components/Header'
import Layout from '@/components/Layout'
import NotificationCard from './NotificationCard'
import {
	getNotifications,
	updateNotificationAllAsRead,
	updateNotificationAsRead,
} from '@/services/notifications'
import type { NotificationResponse } from '@/shared/types/notification'

function NotificationsPage() {
	const [notifications, setNotifications] = useState<NotificationResponse[]>([])
	const [loading, setLoading] = useState(true)
	const [refreshKey, setRefreshKey] = useState(0)

	const loadNotifications = async () => {
		setLoading(true)
		const data = await getNotifications()
		setNotifications(data)
		setLoading(false)
	}

	useEffect(() => {
		loadNotifications()
	}, [])

	const handleNotificationAsRead = async (id: number) => {
		const success = await updateNotificationAsRead(id)
		if (success) {
			await loadNotifications()
			setRefreshKey(prev => prev + 1)
		}
	}

	const handleNotificationAllAsRead = async () => {
		const success = await updateNotificationAllAsRead()
		if (success) {
			await loadNotifications()
			setRefreshKey(prev => prev + 1)
		}
	}

	const unreadCount = notifications.filter(n => !n.isRead).length
	const hasUnread = unreadCount > 0

	if (loading) {
		return (
			<Layout>
				<Header key={refreshKey} />
				<section className='px-4 md:px-8 py-12 md:py-6 flex flex-col gap-6'>
					<h3 className='font-bold text-2xl'>Уведомления</h3>
					<Text className='text-center text-gray-500 py-8'>Загрузка...</Text>
				</section>
			</Layout>
		)
	}

	return (
		<Layout>
			<Header />
			<section className='px-4 md:px-8 py-12 md:py-6 flex flex-col gap-6'>
				<div className='flex justify-between items-center flex-wrap gap-4'>
					<h3 className='font-bold text-2xl'>Уведомления</h3>
					{hasUnread && (
						<Button
							size='sm'
							variant='outline'
							onClick={handleNotificationAllAsRead}
						>
							Прочитать все ({unreadCount})
						</Button>
					)}
				</div>

				{notifications.length === 0 ? (
					<Text className='text-center text-gray-500 py-8'>
						У вас нет уведомлений
					</Text>
				) : (
					<div className='flex flex-col gap-6 w-full'>
						{notifications.map(notification => (
							<NotificationCard
								key={notification.id}
								notification={notification}
								onNotificationAsRead={handleNotificationAsRead}
							/>
						))}
					</div>
				)}
			</section>
		</Layout>
	)
}

export default NotificationsPage
