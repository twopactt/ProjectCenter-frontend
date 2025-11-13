import { Card, Heading, Stack, Text } from '@chakra-ui/react'
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
				<Heading size='md'>Название проекта: {title}</Heading>
			</Card.Header>
			<Card.Body>
				<Text>Студент: {studentName}</Text>
				<Text>Преподаватель: {teacherName}</Text>
				<Text>Статус: {statusName}</Text>
				<Text>Тип: {typeName}</Text>
				<Text>Предмет: {subjectName}</Text>
				<Text>Статус видимости: {isPublic ? 'публичный' : 'приватный'}</Text>
				<Text>
					Дата создания: {moment(createdDate).format('DD.MM.YYYY hh:mm')}
				</Text>
				<Text>
					Дата сдачи: {moment(dateDeadline).format('DD.MM.YYYY hh:mm')}
				</Text>
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
