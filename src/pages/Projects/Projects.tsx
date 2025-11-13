import Project from '@/components/Project'
import { ColorModeButton } from '@/components/ui/color-mode'
import { getProjects } from '@/services/projects'
import { Button, Stack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

interface Project {
	id: number
	title: string
	studentName: string
	teacherName: string
	statusName: string
	typeName: string
	subjectName: string
	isPublic: boolean
	dateDeadline: Date
	createdDate: Date
	comments?: { userFullName: string; text: string; date: Date }[]
}

function Projects() {
	const [projects, setProjects] = useState<Project[]>([])

	useEffect(() => {
		const getData = async () => {
			const projects = await getProjects()
			setProjects(projects)
		}

		getData()
	}, [])

	return (
		<div>
			<Stack className='!flex-row px-8 py-4 right-auto justify-end bg-muted'>
				<Button
					type='button'
					className='button'
					onClick={() => (window.location.href = '/login')}
				>
					Выйти
				</Button>
				<ColorModeButton className='flex' />
			</Stack>
			<section className='px-8 py-4 flex flex-row justify-start items-start gap-12'>
				<div className='flex flex-col gap-3'>
					<h3 className='font-bold text-xl'>Все проекты</h3>
					<ul className='flex flex-row gap-5'>
						{projects.map(x => (
							<li key={x.id}>
								<Project {...x} />
							</li>
						))}
					</ul>
				</div>
			</section>
		</div>
	)
}

export default Projects
