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
	const navigate = useNavigate()

	useEffect(() => {
		const load = async () => {
			const data = await getProjects()
			const item = data.find(x => x.id === Number(id))

			if (!item) return

			setProject({
				...item,
				dateDeadline: new Date(item.dateDeadline),
				createdDate: new Date(item.createdDate),
				comments:
					item.comments?.map(c => ({
						...c,
						date: new Date(c.date),
					})) ?? [],
			})
		}

		load()
	}, [id])

	if (!project) return null

	return (
		<Layout>
			<Header />

			<section className='px-8 py-6 flex flex-row items-center w-full'>
				<Button
					variant='outline'
					onClick={() => navigate(-1)}
					className='self-start mb-4'
				>
					<LuArrowLeft />
					Назад
				</Button>

				<div className='flex-1 flex justify-center'>
					<ProjectCard project={project} />
				</div>
			</section>
		</Layout>
	)
}

export default ProjectPage
