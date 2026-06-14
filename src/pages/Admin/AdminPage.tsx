import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import {
	getAdminActiveTeachers,
	getAdminLastProjects,
	getAdminRecentActivity,
} from '@/services/admin'
import type {
	AdminActiveTeacher,
	AdminLastProject,
	AdminRecentActivity,
} from '@/shared/types/admin'
import LastProjectsCard from './AdminDashboard/LastProjectsCard'
import ActiveTeachersCard from './AdminDashboard/ActiveTeachersCard'
import RecentActivityCard from './AdminDashboard/RecentActivityCard'

function AdminPage() {
	const [projects, setProjects] = useState<AdminLastProject[]>([])
	const [teachers, setTeachers] = useState<AdminActiveTeacher[]>([])
	const [activities, setActivities] = useState<AdminRecentActivity[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const load = async () => {
			const [p, t, a] = await Promise.all([
				getAdminLastProjects(5),
				getAdminActiveTeachers(),
				getAdminRecentActivity(5),
			])
			setProjects(p)
			setTeachers(t)
			setActivities(a)
			setLoading(false)
		}
		load()
	}, [])

	if (loading) {
		return (
			<AdminLayout>
				<div className='text-center text-gray-500 py-16'>
					Загрузка данных...
				</div>
			</AdminLayout>
		)
	}

	return (
		<AdminLayout>
			<h3 className='font-bold text-2xl mb-6'>Панель управления</h3>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<LastProjectsCard projects={projects} />
				<ActiveTeachersCard teachers={teachers} />
			</div>

			<RecentActivityCard activities={activities} />
		</AdminLayout>
	)
}

export default AdminPage
