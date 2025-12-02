import { Card, DataList, Heading, Stack, Text } from '@chakra-ui/react'
import moment from 'moment/moment'
import 'moment/locale/ru'

moment.locale('ru')

interface ProjectProps {
	title: string
	studentName: string
	teacherName: string
	statusName: string
	typeName: string
	subjectName: string
	isPublic: boolean
	dateDeadline: Date
	createdDate: Date
	comments?: { userFullName: string; text: string; date: Date }[]
}

function Project({
	title,
	studentName,
	teacherName,
	statusName,
	typeName,
	subjectName,
	isPublic,
	dateDeadline,
	createdDate,
	comments,
}: ProjectProps) {
	return (
		<Card.Root variant='subtle'>
			<Card.Header>
				<Card.Title>{title}</Card.Title>
			</Card.Header>
			<Card.Body>
				<DataList.Root orientation='horizontal' gap={3}>
					<DataList.Item>
						<DataList.ItemLabel>Студент</DataList.ItemLabel>
						<DataList.ItemValue>{studentName}</DataList.ItemValue>
					</DataList.Item>

					<DataList.Item>
						<DataList.ItemLabel>Преподаватель</DataList.ItemLabel>
						<DataList.ItemValue>{teacherName}</DataList.ItemValue>
					</DataList.Item>

					<DataList.Item>
						<DataList.ItemLabel>Статус</DataList.ItemLabel>
						<DataList.ItemValue>{statusName}</DataList.ItemValue>
					</DataList.Item>

					<DataList.Item>
						<DataList.ItemLabel>Тип</DataList.ItemLabel>
						<DataList.ItemValue>{typeName}</DataList.ItemValue>
					</DataList.Item>

					<DataList.Item>
						<DataList.ItemLabel>Предмет</DataList.ItemLabel>
						<DataList.ItemValue>{subjectName}</DataList.ItemValue>
					</DataList.Item>

					<DataList.Item>
						<DataList.ItemLabel>Видимость</DataList.ItemLabel>
						<DataList.ItemValue>
							{isPublic ? 'публичный' : 'приватный'}
						</DataList.ItemValue>
					</DataList.Item>

					<DataList.Item>
						<DataList.ItemLabel>Дата создания</DataList.ItemLabel>
						<DataList.ItemValue>
							{moment(createdDate).format('DD.MM.YYYY')}
						</DataList.ItemValue>
					</DataList.Item>

					<DataList.Item>
						<DataList.ItemLabel>Дата сдачи</DataList.ItemLabel>
						<DataList.ItemValue>
							{moment(dateDeadline).format('DD.MM.YYYY')}
						</DataList.ItemValue>
					</DataList.Item>
				</DataList.Root>
			</Card.Body>
			<Card.Footer>
				<Stack>
					<Heading size='md'>Комментарии:</Heading>
					{comments && comments.length > 0 ? (
						comments.map((x, index) => (
							<Stack key={index} borderWidth={1} p={2} borderRadius='md'>
								<Text>{x.userFullName}</Text>
								<Text>{x.text}</Text>
								<Text>
									{/* {moment(x.date).format('DD.MM.YYYY hh:mm')} */}
									{moment(x.date).startOf('hour').fromNow()}
								</Text>
							</Stack>
						))
					) : (
						<Text>Комментариев нет</Text>
					)}
				</Stack>
			</Card.Footer>
		</Card.Root>
	)
}

export default Project
