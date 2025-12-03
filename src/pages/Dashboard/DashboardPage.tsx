import Header from '@/components/Header'
import Layout from '@/components/Layout'
import { getSubjects, getTypes } from '@/services/directory'
import { createProject, getProjects } from '@/services/projects'
import type { ProjectUI } from '@/shared/types/project'
import { useEffect, useState } from 'react'
import { createListCollection, Text } from '@chakra-ui/react'
import type { TypeResponse } from '@/shared/types/typeProject'
import type { SubjectResponse } from '@/shared/types/subject'
import CreateProjectModal from './CreateProjectModal'
import ProjectCard from './ProjectCard'
import moment from 'moment'
import 'moment/locale/ru'

moment.locale('ru')

function DashboardPage() {
	const [project, setProject] = useState<ProjectUI | null>(null)
	const [types, setTypes] = useState<TypeResponse[]>([])
	const [subjects, setSubjects] = useState<SubjectResponse[]>([])
	const [title, setTitle] = useState('')
	const [typeId, setTypeId] = useState<number | null>(null)
	const [subjectId, setSubjectId] = useState<number | null>(null)

	const [isModalOpen, setIsModalOpen] = useState(false)

	useEffect(() => {
		const load = async () => {
			const [typesData, subjectsData] = await Promise.all([
				getTypes(),
				getSubjects(),
			])

			setTypes(typesData)
			setSubjects(subjectsData)

			const projects = await getProjects()
			const currentUserName = localStorage.getItem('fullName')

			const myProject = projects.find(p => p.studentName === currentUserName)

			if (myProject) {
				setProject({
					id: myProject.id,
					title: myProject.title,
					typeId: myProject.typeId,
					subjectId: myProject.subjectId,
					isPublic: myProject.isPublic,

					typeName: myProject.typeName,
					subjectName: myProject.subjectName,
					studentName: myProject.studentName,
					teacherName: myProject.teacherName,
					statusName: myProject.statusName,

					dateDeadline: new Date(myProject.dateDeadline),
					createdDate: new Date(myProject.createdDate),

					comments: myProject.comments.map(c => ({
						...c,
						date: new Date(c.date),
					})),
				})
			}
		}

		load()
	}, [])

	const typeCollection = createListCollection<{ value: string; label: string }>(
		{
			items: types.map(t => ({ value: t.id.toString(), label: t.name })),
		}
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
				<h3 className='font-bold text-2xl'>Мой проект</h3>

				{project ? (
					<div className='w-full flex justify-center'>
						<ProjectCard project={project} />
					</div>
				) : (
					<div className='flex flex-col items-center gap-8'>
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
				)}
			</section>
		</Layout>
	)
}

export default DashboardPage
