import Header from '@/components/Header'
import Layout from '@/components/Layout'
import ProjectCard from './ProjectCard'
import ProjectModal from './ProjectModal'

import { getProjects } from '@/services/projects'
import { useEffect, useState } from 'react'
import type { ProjectUI, ProjectResponse } from '@/shared/types/project'

function ProjectsPage() {
	const [projects, setProjects] = useState<ProjectUI[]>([])
	const [selectedProject, setSelectedProject] = useState<ProjectUI | null>(null)

	useEffect(() => {
		const load = async () => {
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

		load()
	}, [])

	return (
		<Layout>
			<Header />
			<section className='px-8 py-4 flex flex-col gap-6 w-full'>
				<h3 className='font-bold text-xl'>Все проекты</h3>

				<ul className='flex flex-col gap-5 w-full'>
					{projects.map(x => (
						<li key={x.id}>
							<ProjectCard
								title={x.title}
								studentName={x.studentName}
								statusName={x.statusName}
								onClick={() => setSelectedProject(x)}
							/>
						</li>
					))}
				</ul>

				<ProjectModal
					project={selectedProject}
					isOpen={!!selectedProject}
					onClose={() => setSelectedProject(null)}
				/>
			</section>
		</Layout>
	)
}

export default ProjectsPage
