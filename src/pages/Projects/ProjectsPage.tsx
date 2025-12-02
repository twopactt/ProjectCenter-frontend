import Header from '@/components/Header'
import Layout from '@/components/Layout'
import Project from '@/components/Project'
import { getProjects } from '@/services/projects'
import type { ProjectResponse, ProjectUI } from '@/shared/types/project'
import { useEffect, useState } from 'react'

function ProjectsPage() {
	const [projects, setProjects] = useState<ProjectUI[]>([])

	useEffect(() => {
		const getData = async () => {
			const data: ProjectResponse[] = await getProjects()

			const mapped: ProjectUI[] = data.map(p => ({
				...p,
				dateDeadline: new Date(p.dateDeadline),
				createdDate: new Date(p.createdDate),
				comments:
					p.comments?.map(c => ({
						...c,
						date: new Date(c.date),
					})) ?? [],
			}))

			setProjects(mapped)
		}

		getData()
	}, [])

	return (
		<Layout>
			<Header />
			<section className='px-8 py-4 flex flex-col justify-start items-start gap-12'>
				<div className='flex flex-col gap-3 w-full'>
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
