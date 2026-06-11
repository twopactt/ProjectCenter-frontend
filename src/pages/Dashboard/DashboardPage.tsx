import Header from '@/components/Header'
import Layout from '@/components/Layout'
import { getRole } from '@/services/auth'
import { getSubjects, getTypes } from '@/services/directory'
import { createProject, getMyProject } from '@/services/projects'
import type { ProjectUI } from '@/shared/types/project'
import { useEffect, useState } from 'react'
import { createListCollection, Text } from '@chakra-ui/react'
import type { TypeResponse } from '@/shared/types/typeProject'
import type { SubjectResponse } from '@/shared/types/subject'
import { transformProjectResponse } from '@/shared/helpers/projectTransform'
import CreateProjectModal from './Student/CreateProjectModal'
import ProjectCard from './Student/ProjectCard'
import TeacherProjectsList from './Teacher/TeacherProjectsList'
import AdminDashboard from './Admin/AdminDashboard'
import config from '@/services/config'

function DashboardPage() {
	const [project, setProject] = useState<ProjectUI | null>(null)
	const [types, setTypes] = useState<TypeResponse[]>([])
	const [subjects, setSubjects] = useState<SubjectResponse[]>([])
	const [title, setTitle] = useState('')
	const [typeId, setTypeId] = useState<number | null>(null)
	const [subjectId, setSubjectId] = useState<number | null>(null)

	const role = getRole()

	const resetProjectForm = () => {
		setTitle('')
		setTypeId(null)
		setSubjectId(null)
	}

	useEffect(() => {
		if (role === 'Student')
		{
			const load = async () => {
				const [myProjectData, typesData, subjectsData] = await Promise.all([
					getMyProject(),
					getTypes(),
					getSubjects(),
				])

				setTypes(typesData)
				setSubjects(subjectsData)

				if (myProjectData) {
					const ui = await transformProjectResponse(
						myProjectData,
						config.api.staticUrl,
					)
					setProject(ui)
				}
			}

			load()
		}
	}, [role])

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

	const refreshProject = async () => {
		const myProjectData = await getMyProject()
		if (myProjectData) {
			const ui = await transformProjectResponse(
				myProjectData,
				config.api.staticUrl,
			)
			setProject(ui)
		}
	}

	const handleProjectUpdate = (updatedProject: ProjectUI) => {
		setProject(updatedProject)
	}

	const handleCreate = async () => {
		if (!title || !typeId || !subjectId) return

		const response = await createProject({
			title,
			typeId: typeId!,
			subjectId: subjectId!,
			isPublic: true,
		})

		if (!response) return

		await refreshProject()
		resetProjectForm()
	}

	return (
		<Layout>
			<Header />
			<section className='px-4 md:px-8 py-6 flex flex-col gap-8'>
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
							<ProjectCard
								project={project}
								onDeleted={() => {
									setProject(null)
									resetProjectForm()
								}}
								onUpdated={handleProjectUpdate}
								onRefresh={refreshProject}
							/>
						</div>
					) : (
						<div className='flex flex-col items-center justify-center gap-8 min-h-[60vh]'>
							<Text fontSize='2xl' fontWeight='bold'>
								У вас пока нет проекта
							</Text>
							<CreateProjectModal
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
					<AdminDashboard />
				)}
			</section>
		</Layout>
	)
}

export default DashboardPage
