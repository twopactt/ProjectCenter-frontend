import Header from '@/components/Header'
import Layout from '@/components/Layout'
import ProjectCard from './ProjectCard'
import { getProjects } from '@/services/projects'
import { useEffect, useState } from 'react'
import type { ProjectResponse, ProjectUI } from '@/shared/types/project'
import { useNavigate } from 'react-router-dom'

function ProjectsPage() {
	const [projects, setProjects] = useState<ProjectUI[]>([])
	const navigate = useNavigate()

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

			<section className='px-4 md:px-8 py-12 md:py-6 flex flex-col gap-6'>
				<h3 className='font-bold text-2xl'>Все проекты</h3>

				<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full'>
					{projects.map(p => (
						<ProjectCard
							key={p.id}
							id={p.id}
							title={p.title}
							studentName={p.studentName}
							studentGroup={p.studentGroup}
							teacherName={p.teacherName}
							dateDeadline={p.dateDeadline}
							onClick={() => navigate(`/projects/${p.id}`)}
						/>
					))}
				</div>
			</section>
		</Layout>
	)
}

export default ProjectsPage
