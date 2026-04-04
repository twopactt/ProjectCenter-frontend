import {
	DataList,
	Stack,
	Text,
	Heading,
	Card,
	CardHeader,
	CardBody,
	Button,
	DownloadTrigger,
	FormatByte,
	RatingGroup,
} from '@chakra-ui/react'
import type { ProjectUI } from '@/shared/types/project'
import { LuDownload, LuPencil, LuTrash2 } from 'react-icons/lu'
import moment from 'moment/moment'
import 'moment/locale/ru'
import { useState } from 'react'
import EditProjectModal from './EditProjectModal'
import { fetchFile } from '@/services/files'
import { deleteProject } from '@/services/projects'

moment.locale('ru')

interface ProjectCardProps {
	project: ProjectUI
}

function ProjectCard({ project }: ProjectCardProps) {
	const [editOpen, setEditOpen] = useState(false)

	const handleDelete = async () => {
		if (!project.id) return

		const confirmed = window.confirm('Вы уверены, что хотите удалить проект?')
		if (!confirmed) return

		const success = await deleteProject(project.id)
		if (success) {
			alert('Проект удалён')
			window.location.reload()
		} else {
			alert('Не удалось удалить проект')
		}
	}

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
					{project.projectFile && (
						<DataList.Item>
							<DataList.ItemLabel>Файл проекта</DataList.ItemLabel>
							<DataList.ItemValue>
								<DownloadTrigger
									data={() => fetchFile(project.projectFile!.url)}
									fileName={project.projectFile!.fileName}
									mimeType='application/octet-stream'
									asChild
								>
									<Button variant='outline' size='sm'>
										<LuDownload /> {project.projectFile!.fileName} (
										<FormatByte
											value={project.projectFile!.fileSize}
											unitDisplay='narrow'
										/>
										)
									</Button>
								</DownloadTrigger>
							</DataList.ItemValue>
						</DataList.Item>
					)}
					{project.docFile && (
						<DataList.Item>
							<DataList.ItemLabel>Документация</DataList.ItemLabel>
							<DataList.ItemValue>
								<DownloadTrigger
									data={() => fetchFile(project.docFile!.url)}
									fileName={project.docFile!.fileName}
									mimeType='application/octet-stream'
									asChild
								>
									<Button variant='outline' size='sm'>
										<LuDownload /> {project.docFile!.fileName} (
										<FormatByte
											value={project.docFile!.fileSize}
											unitDisplay='narrow'
										/>
										)
									</Button>
								</DownloadTrigger>
							</DataList.ItemValue>
						</DataList.Item>
					)}
				</DataList.Root>
				<div className='self-end mt-6 gap-2 flex flex-row'>
					<Button onClick={handleDelete} variant='surface' colorPalette='red'>
						<LuTrash2 />
					</Button>
					<Button
						onClick={() => setEditOpen(true)}
						variant='surface'
						colorPalette='blue'
					>
						<LuPencil />
					</Button>
				</div>
				{editOpen && (
					<EditProjectModal
						isOpen={editOpen}
						onClose={() => setEditOpen(false)}
						projectId={project.id}
						isPublic={project.isPublic}
						onUpdated={() => window.location.reload()}
					/>
				)}
				<Stack mt={4}>
					<Heading size='xl' fontWeight='bold'>
						Оценка
					</Heading>
					{project.grade?.length ? (
						project.grade.map((c, i) => (
							<Stack key={i} borderWidth='1px' borderRadius='md' p={3}>
								<Text fontWeight='bold'>{c.teacherFullName}</Text>
								<Text>{c.comment}</Text>
								<RatingGroup.Root
									colorPalette='orange'
									readOnly
									count={5}
									value={c.value}
									size='sm'
								>
									<RatingGroup.HiddenInput />
									<RatingGroup.Control />
								</RatingGroup.Root>
								<Text fontSize='sm' color='gray.500'>
									{moment(c.createdAt).startOf('hour').fromNow()}
								</Text>
							</Stack>
						))
					) : (
						<Text>Оценки нет</Text>
					)}
				</Stack>
				<Stack mt={4}>
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
