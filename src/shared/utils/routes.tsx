import ProjectsPage from '@/pages/Projects/ProjectsPage'
import ProjectPage from '@/pages/Project/ProjectPage'
import DashboardPage from '@/pages/Dashboard/DashboardPage'
import ProfilePage from '@/pages/Profile/ProfilePage'
import NotificationsPage from '@/pages/Notifications/NotificationsPage'
import AdminPage from '@/pages/Admin/AdminPage'
import AdminProjectsPage from '@/pages/Admin/AdminProjects/AdminProjectsPage'
import AdminUsersPage from '@/pages/Admin/AdminUsers/AdminUsersPage'
import AdminGroupsPage from '@/pages/Admin/AdminGroups/AdminGroupsPage'
import StudentProjectPage from '@/pages/Dashboard/Teacher/StudentProject/StudentProjectPage'
import type { JSX } from 'react'

export interface AppRoute {
	path: string
	element: JSX.Element
}

export interface RoutesGroup {
	roles: string[]
	items: AppRoute[]
}

export const routes: RoutesGroup[] = [
	{
		roles: ['Student', 'Teacher', 'Admin'],
		items: [
			{ path: '/projects', element: <ProjectsPage /> },
			{ path: '/profile', element: <ProfilePage /> },
			{ path: '/notifications', element: <NotificationsPage /> },
			{ path: '/dashboard', element: <DashboardPage /> },
			{ path: '/projects/:id', element: <ProjectPage /> },
		],
	},
	{
		roles: ['Teacher'],
		items: [
			{
				path: '/dashboard/student-project/:id',
				element: <StudentProjectPage />,
			},
		],
	},
	{
		roles: ['Admin'],
		items: [
			{ path: '/admin', element: <AdminPage /> },
			{ path: '/admin/projects', element: <AdminProjectsPage /> },
			{ path: '/admin/users', element: <AdminUsersPage /> },
			{ path: '/admin/groups', element: <AdminGroupsPage /> },
		],
	},
]
