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
import { LuDownload, LuPencil, LuMessageSquarePlus } from 'react-icons/lu'
import moment from 'moment/moment'
import 'moment/locale/ru'
import { fetchFile } from '@/services/files'
import { VisibilityProjectBadge } from '@/components/visibilityProjectBadge'
import { StatusProjectBadge } from '@/components/statusProjectBadge'
import { useEffect, useState } from 'react'
import type { TypeResponse } from '@/shared/types/typeProject'
import type { SubjectResponse } from '@/shared/types/subject'
import { getSubjects, getTypes } from '@/services/directory'
import EditStudentProjectModal from './EditStudentProjectModal'
import { getStudentProjectById } from '@/services/projects'
import { createComment } from '@/services/comments'
import { createGrade, updateGrade } from '@/services/grades'
import { CreateCommentModal } from './CreateCommentModal'
import { GradeModal } from './GradeModal'
import { showSuccess, showError } from '@/shared/utils/toast'

moment.locale('ru')

interface StudentProjectCardProps {
	project: ProjectUI
}

function StudentProjectCard({ project }: StudentProjectCardProps) {
	const [projectState, setProjectState] = useState(project)
	const [editOpen, setEditOpen] = useState(false)
	const [gradeModalOpen, setGradeModalOpen] = useState(false)
	const [isEditingGrade, setIsEditingGrade] = useState(false)
	const [commentModalOpen, setCommentModalOpen] = useState(false)
	const [types, setTypes] = useState<TypeResponse[]>([])
	const [subjects, setSubjects] = useState<SubjectResponse[]>([])
	const [existingProjectFile, setExistingProjectFile] = useState<File | null>(
		null,
	)
	const [existingDocFile, setExistingDocFile] = useState<File | null>(null)
	const resolvedTypeId = types.find(t => t.name === projectState.typeName)?.id
	const resolvedSubjectId = subjects.find(
		s => s.name === projectState.subjectName,
	)?.id

	useEffect(() => {
		const loadData = async () => {
			const [typesData, subjectsData] = await Promise.all([
				getTypes(),
				getSubjects(),
			])
			setTypes(typesData)
			setSubjects(subjectsData)
		}
		loadData()
	}, [])

	useEffect(() => {
		if (editOpen) {
			const loadFiles = async () => {
				if (project.projectFile?.url && project.projectFile?.fileName) {
					const file = await urlToFile(
						project.projectFile.url,
						project.projectFile.fileName,
					)
					setExistingProjectFile(file)
				}
				if (project.docFile?.url && project.docFile?.fileName) {
					const file = await urlToFile(
						project.docFile.url,
						project.docFile.fileName,
					)
					setExistingDocFile(file)
				}
			}
			loadFiles()
		}
	}, [editOpen])

	const urlToFile = async (
		url: string,
		fileName: string,
	): Promise<File | null> => {
		try {
			const response = await fetch(url)
			const blob = await response.blob()
			return new File([blob], fileName, { type: blob.type })
		} catch {
			return null
		}
	}

	const handleUpdated = (updatedProject: ProjectUI) => {
		setProjectState(updatedProject)
	}

	const handleCreateComment = async (text: string) => {
		const success = await createComment(project.id, text)
		if (success) {
			showSuccess('Комментарий добавлен')
			const updatedProject = await getStudentProjectById(project.id)
			if (updatedProject) {
				const updatedUI: ProjectUI = {
					...projectState,
					comments:
						updatedProject.comments?.map(c => ({
							userFullName: c.userFullName,
							text: c.text,
							date: new Date(c.date),
						})) ?? [],
				}
				setProjectState(updatedUI)
			}
		} else {
			showError('Не удалось добавить комментарий')
			throw new Error('Failed to add comment')
		}
	}

	const handleCreateGrade = async (value: number, comment: string) => {
		const success = await createGrade(project.id, value, comment)
		if (success) {
			const updatedProject = await getStudentProjectById(project.id)
			if (updatedProject) {
				const updatedUI: ProjectUI = {
					...projectState,
					grade: updatedProject.gradeValue
						? [
								{
									teacherFullName: updatedProject.gradedBy || '',
									value: updatedProject.gradeValue,
									comment: updatedProject.gradeComment || '',
									createdAt: new Date(updatedProject.gradeDate || Date.now()),
								},
							]
						: [],
				}
				setProjectState(updatedUI)
			}
		} else {
			showError('Не удалось добавить оценку')
			throw new Error('Failed to add grade')
		}
	}

	const handleUpdateGrade = async (value: number, comment: string) => {
		const success = await updateGrade(project.id, value, comment)
		if (success) {
			const updatedProject = await getStudentProjectById(project.id)
			if (updatedProject) {
				const updatedUI: ProjectUI = {
					...projectState,
					grade: updatedProject.gradeValue
						? [
								{
									teacherFullName: updatedProject.gradedBy || '',
									value: updatedProject.gradeValue,
									comment: updatedProject.gradeComment || '',
									createdAt: new Date(updatedProject.gradeDate || Date.now()),
								},
							]
						: [],
				}
				setProjectState(updatedUI)
			}
		} else {
			showError('Не удалось обновить оценку')
			throw new Error('Failed to update grade')
		}
	}

	const handleOpenGradeModal = () => {
		if (projectState.grade && projectState.grade.length > 0) {
			setIsEditingGrade(true)
		} else {
			setIsEditingGrade(false)
		}
		setGradeModalOpen(true)
	}

	return (
		<Card.Root className='w-full max-w-3xl'>
			<CardHeader>
				<Heading size='2xl'>{projectState.title}</Heading>
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
						<DataList.ItemValue>{projectState.typeName}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Предмет</DataList.ItemLabel>
						<DataList.ItemValue>{projectState.subjectName}</DataList.ItemValue>
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
							{moment(projectState.dateDeadline).format('DD.MM.YYYY')}
						</DataList.ItemValue>
					</DataList.Item>
					{project.projectFile && (
						<DataList.Item>
							<DataList.ItemLabel>Файл проекта</DataList.ItemLabel>
							<DataList.ItemValue w='100%'>
								<DownloadTrigger
									data={() => fetchFile(project.projectFile!.url)}
									fileName={project.projectFile!.fileName}
									mimeType='application/octet-stream'
									asChild
								>
									<Button
										variant='outline'
										size='sm'
										w='100%'
										h='auto'
										whiteSpace='normal'
										wordBreak='break-word'
										textAlign='left'
										display='inline-flex'
										alignItems='center'
										gap={1}
										px={3}
										py={2}
									>
										<LuDownload style={{ flexShrink: 0 }} />
										<span style={{ wordBreak: 'break-all' }}>
											{project.projectFile!.fileName} (
											<FormatByte
												value={project.projectFile!.fileSize}
												unitDisplay='narrow'
											/>
											)
										</span>
									</Button>
								</DownloadTrigger>
							</DataList.ItemValue>
						</DataList.Item>
					)}
					{project.docFile && (
						<DataList.Item>
							<DataList.ItemLabel>Документация</DataList.ItemLabel>
							<DataList.ItemValue w='100%'>
								<DownloadTrigger
									data={() => fetchFile(project.docFile!.url)}
									fileName={project.docFile!.fileName}
									mimeType='application/octet-stream'
									asChild
								>
									<Button
										variant='outline'
										size='sm'
										w='100%'
										h='auto'
										whiteSpace='normal'
										wordBreak='break-word'
										textAlign='left'
										display='inline-flex'
										alignItems='center'
										gap={1}
										px={3}
										py={2}
									>
										<LuDownload style={{ flexShrink: 0 }} />
										<span style={{ wordBreak: 'break-all' }}>
											{project.docFile!.fileName} (
											<FormatByte
												value={project.docFile!.fileSize}
												unitDisplay='narrow'
											/>
											)
										</span>
									</Button>
								</DownloadTrigger>
							</DataList.ItemValue>
						</DataList.Item>
					)}
				</DataList.Root>
				<div className='self-end mt-6 gap-2 flex flex-row'>
					<Button
						onClick={() => setEditOpen(true)}
						variant='surface'
						colorPalette='blue'
					>
						<LuPencil />
					</Button>
				</div>
				<EditStudentProjectModal
					key={project.id}
					isOpen={editOpen}
					onClose={() => setEditOpen(false)}
					projectId={project.id}
					initialData={{
						title: projectState.title,
						typeId: resolvedTypeId ?? 0,
						subjectId: resolvedSubjectId ?? 0,
						createdDate: moment(project.createdDate).format('YYYY-MM-DD'),
						dateDeadline: moment(project.dateDeadline).format('YYYY-MM-DD'),
					}}
					types={types}
					subjects={subjects}
					onUpdated={handleUpdated}
				/>
				<Stack mt={4}>
					<div className='flex justify-between items-center'>
						<Heading size='xl' fontWeight='bold'>
							Оценка
						</Heading>
						{!projectState.grade?.length && (
							<Button
								onClick={handleOpenGradeModal}
								variant='ghost'
								colorPalette='blue'
								size='sm'
							>
								<LuMessageSquarePlus />
							</Button>
						)}
					</div>
					{projectState.grade?.length ? (
						projectState.grade.map((c, i) => (
							<Stack key={i} borderWidth='1px' borderRadius='md' p={3}>
								<div className='flex justify-between items-center'>
									<Text fontWeight='bold'>{c.teacherFullName}</Text>
									<Button
										onClick={handleOpenGradeModal}
										variant='ghost'
										colorPalette='blue'
										size='sm'
									>
										<LuPencil />
									</Button>
								</div>
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
					<div className='flex justify-between items-center'>
						<Heading size='xl' fontWeight='bold'>
							Комментарии
						</Heading>
						<Button
							onClick={() => setCommentModalOpen(true)}
							variant='ghost'
							colorPalette='blue'
							size='sm'
						>
							<LuMessageSquarePlus />
						</Button>
					</div>
					{projectState.comments?.length ? (
						projectState.comments.map((c, i) => (
							<Stack key={i} borderWidth='1px' borderRadius='md' p={3} mt={2}>
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
				<CreateCommentModal
					isOpen={commentModalOpen}
					onClose={() => setCommentModalOpen(false)}
					onSubmit={handleCreateComment}
					projectId={project.id}
				/>
				<GradeModal
					isOpen={gradeModalOpen}
					onClose={() => setGradeModalOpen(false)}
					onSubmit={isEditingGrade ? handleUpdateGrade : handleCreateGrade}
					initialValue={projectState.grade?.[0]?.value || 0}
					initialComment={projectState.grade?.[0]?.comment || ''}
					isEditing={isEditingGrade}
				/>
			</CardBody>
		</Card.Root>
	)
}

export default StudentProjectCard
