import {
	Card,
	CardBody,
	Stack,
	Text,
	Badge,
	Button,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@chakra-ui/react'
import type { NotificationResponse } from '@/shared/types/notification'
import { LuCheckCheck } from 'react-icons/lu'
import moment from 'moment/moment'
import 'moment/locale/ru'

moment.locale('ru')

interface NotificationCardProps {
	notification: NotificationResponse
	onNotificationAsRead: (id: number) => void
}

function NotificationCard({
	notification,
	onNotificationAsRead,
}: NotificationCardProps) {
	const isUnread = !notification.isRead

	return (
		<Card.Root
			className='transition-all'
			bg={isUnread ? 'blue.50' : ''}
			_dark={{ bg: isUnread ? 'blue.900/50' : '' }}
			_hover={{
				bg: isUnread ? 'blue.100' : 'gray.100',
				_dark: { bg: isUnread ? 'blue.900/90' : 'gray.800' },
			}}
			borderWidth='1px'
		>
			<CardHeader>
				<div className='flex justify-between items-start flex-wrap gap-2'>
					<div className='flex items-center gap-3'>
						<CardTitle>{notification.title}</CardTitle>
					</div>
					<div className='flex items-center gap-2'>
						<Text fontSize='sm' color='gray.500'>
							{moment(notification.createdAt).startOf('minute').fromNow()}
						</Text>
						{isUnread && (
							<Button
								size='xs'
								variant='ghost'
								colorPalette='blue'
								onClick={() => onNotificationAsRead(notification.id)}
							>
								Прочитать
								<LuCheckCheck />
							</Button>
						)}
					</div>
				</div>
			</CardHeader>
			<CardBody>
				<Stack gap={2}>
					<Text fontSize='md'>{notification.text}</Text>
				</Stack>
			</CardBody>
			<CardFooter>
				<Badge colorPalette='green' alignSelf='flex-start'>
					{notification.typeName}
				</Badge>
			</CardFooter>
		</Card.Root>
	)
}

export default NotificationCard
