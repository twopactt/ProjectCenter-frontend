import Header from '@/components/Header'
import Layout from '@/components/Layout'
import { getSubjects, getTypes } from '@/services/directory'
import { createProject, getMyProject } from '@/services/projects'
import type { ProjectUI } from '@/shared/types/project'
import { useEffect, useState } from 'react'
import { createListCollection, Text } from '@chakra-ui/react'
import type { TypeResponse } from '@/shared/types/typeProject'
import type { SubjectResponse } from '@/shared/types/subject'
import CreateProjectModal from './CreateProjectModal'
import ProjectCard from './ProjectCard'
import TeacherProjectsList from './TeacherProjectsList'
import moment from 'moment'
import 'moment/locale/ru'
import config from '@/services/config'
import { getFileSize } from '@/shared/utils/fileSize'

moment.locale('ru')

function DashboardPage() {
	const [project, setProject] = useState<ProjectUI | null>(null)
	const [types, setTypes] = useState<TypeResponse[]>([])
	const [subjects, setSubjects] = useState<SubjectResponse[]>([])
	const [title, setTitle] = useState('')
	const [typeId, setTypeId] = useState<number | null>(null)
	const [subjectId, setSubjectId] = useState<number | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const role = localStorage.getItem('role')

	useEffect(() => {
		const load = async () => {
			const [myProjectData, typesData, subjectsData] = await Promise.all([
				getMyProject(),
				getTypes(),
				getSubjects(),
			])

			setTypes(typesData)
			setSubjects(subjectsData)

			if (myProjectData) {
				const projectFileSize = myProjectData.fileProject
					? await getFileSize(config.api.staticUrl + myProjectData.fileProject)
					: 0
				const docFileSize = myProjectData.fileDocumentation
					? await getFileSize(
							config.api.staticUrl + myProjectData.fileDocumentation,
						)
					: 0

				setProject({
					id: myProjectData.id,
					title: myProjectData.title,
					typeId: myProjectData.typeId,
					subjectId: myProjectData.subjectId,
					isPublic: myProjectData.isPublic,

					typeName: myProjectData.typeName,
					subjectName: myProjectData.subjectName,
					studentName: myProjectData.studentName,
					teacherName: myProjectData.teacherName,
					statusName: myProjectData.statusName,

					dateDeadline: new Date(myProjectData.dateDeadline),
					createdDate: new Date(myProjectData.createdDate),

					comments: myProjectData.comments.map(c => ({
						...c,
						date: new Date(c.date),
					})),
					grade: myProjectData.gradeValue
						? [
								{
									teacherFullName: myProjectData.gradedBy,
									value: myProjectData.gradeValue,
									comment: myProjectData.gradeComment,
									createdAt: new Date(myProjectData.gradeDate),
								},
							]
						: [],
					projectFile: myProjectData.fileProject
						? {
								url: config.api.staticUrl + myProjectData.fileProject,
								fileName: myProjectData.fileProject.split('/').pop() || 'file',
								fileSize: projectFileSize,
							}
						: null,

					docFile: myProjectData.fileDocumentation
						? {
								url: config.api.staticUrl + myProjectData.fileDocumentation,
								fileName:
									myProjectData.fileDocumentation.split('/').pop() || 'file',
								fileSize: docFileSize,
							}
						: null,
				})
			}
		}

		load()
	}, [])

	const typeCollection = createListCollection<{ value: string; label: string }>(
		{
			items: types.map(t => ({ value: t.id.toString(), label: t.name })),
		},
	)

	const subjectCollection = createListCollection<{
		value: string
		label: string
	}>({
		items: subjects.map(s => ({ value: s.id.toString(), label: s.name })),
	})

	const handleCreate = async () => {
		if (!title || !typeId || !subjectId) return

		const response = await createProject({
			title,
			typeId: typeId!,
			subjectId: subjectId!,
			isPublic: true,
		})

		if (!response) return

		setProject({
			id: response.id,
			title: response.title,
			typeId: response.typeId,
			subjectId: response.subjectId,
			isPublic: response.isPublic,

			typeName: response.typeName,
			subjectName: response.subjectName,
			studentName: response.studentName,
			teacherName: response.teacherName,
			statusName: response.statusName,

			dateDeadline: moment(response.deadline).toDate(),
			createdDate: moment(response.createdAt).toDate(),

			comments:
				response.comments?.map(c => ({
					...c,
					date: moment(c.date).toDate(),
				})) ?? [],
		})

		setIsModalOpen(false)
	}

	return (
		<Layout>
			<Header />
			<section className='px-8 py-6 flex flex-col gap-8'>
				<h3 className='font-bold text-2xl text'>
					{role === 'Student'
						? 'Мой проект'
						: role === 'Teacher'
							? 'Проекты моих студентов'
							: 'Управление проектами'}
				</h3>

				{role === 'Teacher' ? (
					<TeacherProjectsList />
				) : role === 'Student' ? (
					project ? (
						<div className='w-full flex justify-center'>
							<ProjectCard project={project} />
						</div>
					) : (
						<div className='flex flex-col items-center justify-center gap-8 min-h-[60vh]'>
							<Text fontSize='2xl' fontWeight='bold'>
								У вас пока нет проекта
							</Text>
							<CreateProjectModal
								isOpen={isModalOpen}
								onOpen={() => setIsModalOpen(true)}
								onClose={() => setIsModalOpen(false)}
								title={title}
								setTitle={setTitle}
								typeCollection={typeCollection}
								subjectCollection={subjectCollection}
								typeId={typeId}
								subjectId={subjectId}
								setTypeId={setTypeId}
								setSubjectId={setSubjectId}
								onCreate={handleCreate}
							/>
						</div>
					)
				) : (
					<div className='flex flex-col items-center justify-center gap-8 min-h-[60vh]'>
						<Text fontSize='2xl' fontWeight='bold'>
							Скоро
						</Text>
					</div>
				)}
			</section>
		</Layout>
	)
}

export default DashboardPage
