import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Layout from '@/components/Layout'
import NotificationCard from './NotificationCard'
import { getNotifications } from '@/services/notifications'
import type { NotificationResponse } from '@/shared/types/notification'

function NotificationsPage() {
	const [notifications, setNotifications] = useState<NotificationResponse[]>([])

	useEffect(() => {
		const load = async () => {
			const data: NotificationResponse[] = await getNotifications()

			const mapped: NotificationResponse[] = data.map(n => ({ ...n }))

			setNotifications(mapped)
		}

		load()
	}, [])

	return (
		<Layout>
			<Header />

			<section className='px-4 md:px-8 py-12 md:py-6 flex flex-col gap-6'>
				<h3 className='font-bold text-2xl'>Уведомления</h3>

				<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full'>
					{notifications.map(n => (
						<NotificationCard
							key={n.id}
							id={n.id}
							title={n.title}
							text={n.text}
							createdAt={n.createdAt}
							isRead={n.isRead}
							typeName={n.typeName}
						/>
					))}
				</div>
			</section>
		</Layout>
	)
}

export default NotificationsPage
