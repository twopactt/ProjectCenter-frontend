import type { ProjectUI } from '@/shared/types/project'
import {
	Dialog,
	DialogBackdrop,
	DialogContent,
	DialogHeader,
	DialogBody,
	DialogFooter,
	DialogTitle,
	DialogCloseTrigger,
	DataList,
	Stack,
	Text,
	Heading,
} from '@chakra-ui/react'
import moment from 'moment/moment'
import 'moment/locale/ru'

moment.locale('ru')

interface ProjectModalProps {
	project: ProjectUI | null
	isOpen: boolean
	onClose: () => void
}

export default function ProjectModal({
	project,
	isOpen,
	onClose,
}: ProjectModalProps) {
	if (!project) return null

	return (
		<Dialog.Root
			placement='center'
			open={isOpen}
			onOpenChange={e => {
				if (!e.open) onClose()
			}}
		>
			<DialogBackdrop />

			<Dialog.Positioner>
				<DialogContent maxW='700px'>
					<DialogCloseTrigger />

					<DialogHeader>
						<DialogTitle>{project.title}</DialogTitle>
					</DialogHeader>

					<DialogBody>
						<DataList.Root orientation='vertical' gap={4} mt={3}>
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
								<DataList.ItemValue>{project.statusName}</DataList.ItemValue>
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
									{project.isPublic ? 'публичный' : 'приватный'}
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

						<Stack mt={6}>
							<Heading size='md'>Комментарии:</Heading>

							{project.comments?.length > 0 ? (
								project.comments.map((c, i) => (
									<Stack key={i} borderWidth='1px' borderRadius='md' p={2}>
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
					</DialogBody>

					<DialogFooter />
				</DialogContent>
			</Dialog.Positioner>
		</Dialog.Root>
	)
}
