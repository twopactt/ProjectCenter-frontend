import {
	DataList,
	Stack,
	Text,
	Heading,
	Card,
	CardHeader,
	CardBody,
} from '@chakra-ui/react'
import type { ProjectUI } from '@/shared/types/project'
import { VisibilityProjectBadge } from '@/shared/utils/visibilityProjectBadge'
import { StatusProjectBadge } from '@/shared/utils/statusProjectBadge'
import moment from 'moment/moment'
import 'moment/locale/ru'

moment.locale('ru')

interface ProjectCardProps {
	project: ProjectUI
}

function ProjectCard({ project }: ProjectCardProps) {
	return (
		<Card.Root className='w-full max-w-3xl'>
			<CardHeader>
				<Heading size='2xl'>{project.title}</Heading>
			</CardHeader>

			<CardBody>
				<DataList.Root orientation='horizontal' gap={4} className='flex-wrap'>
					<DataList.Item>
						<DataList.ItemLabel>Студент</DataList.ItemLabel>
						<DataList.ItemValue>{project.studentName}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Преподаватель</DataList.ItemLabel>
						<DataList.ItemValue>{project.teacherName}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Статус</DataList.ItemLabel>
						<DataList.ItemValue>
							<StatusProjectBadge status={project.statusName} />
						</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Тип</DataList.ItemLabel>
						<DataList.ItemValue>{project.typeName}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Предмет</DataList.ItemLabel>
						<DataList.ItemValue>{project.subjectName}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Видимость</DataList.ItemLabel>
						<DataList.ItemValue>
							<VisibilityProjectBadge isPublic={project.isPublic} />
						</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Дата создания</DataList.ItemLabel>
						<DataList.ItemValue>
							{moment(project.createdDate).format('DD.MM.YYYY')}
						</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Дата сдачи</DataList.ItemLabel>
						<DataList.ItemValue>
							{moment(project.dateDeadline).format('DD.MM.YYYY')}
						</DataList.ItemValue>
					</DataList.Item>
				</DataList.Root>

				<Stack mt={8}>
					<Heading size='xl' fontWeight='bold'>
						Комментарии
					</Heading>
					{project.comments?.length ? (
						project.comments.map((c, i) => (
							<Stack key={i} borderWidth='1px' borderRadius='md' p={3}>
								<Text fontWeight='bold'>{c.userFullName}</Text>
								<Text>{c.text}</Text>
								<Text fontSize='sm' color='gray.500'>
									{moment(c.date).startOf('hour').fromNow()}
								</Text>
							</Stack>
						))
					) : (
						<Text>Комментариев нет</Text>
					)}
				</Stack>
			</CardBody>
		</Card.Root>
	)
}

export default ProjectCard
