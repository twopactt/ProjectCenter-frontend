import { Button } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Header from '@/components/Header'
import { getStudentProjectById } from '@/services/projects'
import type { ProjectUI } from '@/shared/types/project'
import { LuArrowLeft } from 'react-icons/lu'
import StudentProjectCard from './StudentProjectCard'
import config from '@/services/config'
import { transformProjectResponse } from '@/shared/helpers/projectTransform'

function StudentProjectPage() {
	const { id } = useParams()
	const [project, setProject] = useState<ProjectUI | null>(null)
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()

	useEffect(() => {
		const load = async () => {
			setLoading(true)
			const data = await getStudentProjectById(Number(id))

			if (data) {
				const ui = await transformProjectResponse(
					data,
					config.api.staticUrl,
				)
				setProject(ui)
			}
			setLoading(false)
		}

		if (id) load()
	}, [id])

	if (loading) {
		return (
			<Layout>
				<Header />
				<div className='flex justify-center items-center h-[70vh] text-xl opacity-60'>
					Загрузка проекта...
				</div>
			</Layout>
		)
	}

	if (!project) {
		return (
			<Layout>
				<Header />
				<div className='flex justify-center items-center h-[70vh] text-xl opacity-60'>
					Проект не найден
				</div>
			</Layout>
		)
	}

	return (
		<Layout>
			<Header />
			<section className='px-4 md:px-8 py-6 flex flex-col md:flex-row items-start w-full gap-2 md:gap-4'>
				<Button
					variant='outline'
					onClick={() => navigate(-1)}
					className='self-start mb-4 w-auto'
				>
					<LuArrowLeft />
					Назад
				</Button>

				<div className='w-full flex justify-center'>
					<StudentProjectCard project={project} />
				</div>
			</section>
		</Layout>
	)
}

export default StudentProjectPage
