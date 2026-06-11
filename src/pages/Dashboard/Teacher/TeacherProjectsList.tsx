import { getMyStudentsProjects } from '@/services/projects'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TeacherProjectCard from './TeacherProjectCard'
import type { TeacherProjectResponse } from '@/shared/types/project'

function TeacherProjectsList() {
	const [projects, setProjects] = useState<TeacherProjectResponse[]>([])
	const navigate = useNavigate()

	useEffect(() => {
		const load = async () => {
			const data = await getMyStudentsProjects()
			setProjects(data || [])
		}

		load()
	}, [])

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full'>
			{projects.map(p => (
				<TeacherProjectCard
					key={p.id}
					projectTitle={p.projectTitle}
					fullName={p.fullName}
					groupName={p.groupName}
					projectStatus={p.projectStatus}
					onClick={() => navigate(`/dashboard/student-project/${p.projectId}`)}
				/>
			))}

			{projects.length === 0 && (
				<div className='text-center text-gray-500 py-8'>
					Нет проектов для отображения
				</div>
			)}
		</div>
	)
}

export default TeacherProjectsList
