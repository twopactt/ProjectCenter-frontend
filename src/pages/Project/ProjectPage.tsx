import { Button } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ProjectCard from './ProjectCard'
import Layout from '@/components/Layout'
import Header from '@/components/Header'
import { getProjects } from '@/services/projects'
import type { ProjectUI } from '@/shared/types/project'
import { LuArrowLeft } from 'react-icons/lu'
import moment from 'moment/moment'
import 'moment/locale/ru'

moment.locale('ru')

function ProjectPage() {
	const { id } = useParams()
	const [project, setProject] = useState<ProjectUI | null>(null)
	const [notFound, setNotFound] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		const load = async () => {
			const data = await getProjects()
			const item = data.find(x => x.id === Number(id))

			if (!item) {
				setNotFound(true)
				return
			}

			setProject({
				...item,
				dateDeadline: new Date(item.dateDeadline),
				createdDate: new Date(item.createdDate),
				comments:
					item.comments?.map(c => ({
						...c,
						date: new Date(c.date),
					})) ?? [],
				grade: item.gradeValue
					? [
							{
								teacherFullName: item.gradedBy ?? '',
								value: item.gradeValue,
								comment: item.gradeComment ?? '',
								createdAt: new Date(item.gradeDate ?? Date.now()),
							},
						]
					: [],
			})
		}

		load()
	}, [id])

	if (notFound) {
		return (
			<Layout>
				<Header />
				<section className='px-4 md:px-8 py-6 flex flex-col items-center gap-10'>
					<p className='text-lg'>Проект не найден или недоступен</p>
					<Button variant='outline' onClick={() => navigate('/projects')}>
						<LuArrowLeft />
						Назад к проектам
					</Button>
				</section>
			</Layout>
		)
	}

	if (!project) return null

	return (
		<Layout>
			<Header />

			<section className='px-4 md:px-8 py-6 flex flex-col md:flex-row items-start w-full gap-2 md:gap-4'>
				<Button
					variant='outline'
					onClick={() => navigate('/projects')}
					className='self-start md:sticky md:top-24 mb-4 md:mb-0 w-auto'
				>
					<LuArrowLeft />
					Назад
				</Button>

				<div className='flex-1 flex justify-center w-full'>
					<ProjectCard project={project} />
				</div>
			</section>
		</Layout>
	)
}

export default ProjectPage
