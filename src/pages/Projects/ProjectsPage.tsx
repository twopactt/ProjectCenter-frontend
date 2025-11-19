import Header from '@/components/Header'
import Layout from '@/components/Layout'
import Project from '@/components/Project'
import { getProjects } from '@/services/projects'
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

function ProjectsPage() {
	const [projects, setProjects] = useState<Project[]>([])

	useEffect(() => {
		const getData = async () => {
			const projects = await getProjects()
			setProjects(projects)
		}

		getData()
	}, [])

	return (
		<Layout>
			<Header />
			<section className='px-8 py-4 flex flex-col justify-start items-start gap-12'>
				<div className='flex flex-col gap-3'>
					<h3 className='font-bold text-xl'>Все проекты</h3>
					<ul className='flex flex-col gap-5'>
						{projects.map(x => (
							<li key={x.id}>
								<Project {...x} />
							</li>
						))}
					</ul>
				</div>
			</section>
		</Layout>
	)
}

export default ProjectsPage
