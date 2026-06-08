import { Card, CardHeader, CardBody, DataList } from '@chakra-ui/react'
import moment from 'moment/moment'
import 'moment/locale/ru'

moment.locale('ru')

interface NotificationCardProps {
	id: number
	title: string
	text: string
	createdAt: string
	isRead: boolean
	typeName: string
}

function NotificationCard({
	title,
	text,
	createdAt,
	isRead,
	typeName,
}: NotificationCardProps) {
	return (
		<Card.Root
			_hover={{ bg: 'gray.100', _dark: { bg: 'gray.800' } }}
			borderWidth='1px'
		>
			<CardHeader>
				<Card.Title>{title}</Card.Title>
			</CardHeader>

			<CardBody className='flex flex-col gap-1'>
				<DataList.Root className='flex-wrap' orientation='horizontal'>
					<DataList.Item>
						<DataList.ItemLabel>Текст</DataList.ItemLabel>
						<DataList.ItemValue>{text}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Тип</DataList.ItemLabel>
						<DataList.ItemValue>{typeName}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Когда</DataList.ItemLabel>
						<DataList.ItemValue>
							{moment(createdAt).startOf('minute').fromNow()}
						</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Прочитано</DataList.ItemLabel>
						<DataList.ItemValue>{isRead ? 'да' : 'нет'}</DataList.ItemValue>
					</DataList.Item>
				</DataList.Root>
			</CardBody>
		</Card.Root>
	)
}

export default NotificationCard
