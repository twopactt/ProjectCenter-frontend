import { Card, CardHeader, CardBody, DataList } from '@chakra-ui/react'
import moment from 'moment/moment'
import 'moment/locale/ru'

moment.locale('ru')

interface ProjectCardProps {
	title: string
	studentName: string
	studentGroup: string
	teacherName: string
	dateDeadline: Date
	onClick: () => void
}

function ProjectCard({
	title,
	studentName,
	studentGroup,
	teacherName,
	dateDeadline,
	onClick,
}: ProjectCardProps) {
	return (
		<Card.Root
			className='cursor-pointer transition-all'
			_hover={{ bg: 'gray.100', _dark: { bg: 'gray.800' } }}
			onClick={onClick}
			borderWidth='1px'
		>
			<CardHeader>
				<Card.Title>{title}</Card.Title>
			</CardHeader>

			<CardBody className='flex flex-col gap-1'>
				<DataList.Root orientation='horizontal' className='flex-wrap'>
					<DataList.Item>
						<DataList.ItemLabel>Студент</DataList.ItemLabel>
						<DataList.ItemValue>{studentName}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Группа</DataList.ItemLabel>
						<DataList.ItemValue>{studentGroup}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Преподаватель</DataList.ItemLabel>
						<DataList.ItemValue>{teacherName}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Дата сдачи</DataList.ItemLabel>
						<DataList.ItemValue>
							{moment(dateDeadline).format('YYYY')}
						</DataList.ItemValue>
					</DataList.Item>
				</DataList.Root>
			</CardBody>
		</Card.Root>
	)
}

export default ProjectCard
